/*************************************************************************
Author: Ethan Peteson
Created: 30-Aug-2017

License: Apache 2.0 Licensed
Updated: 28-Dec-2017

Copyright 2017-2018
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*************************************************************************/

var url = require('url'),
	ntlm = require('./ntlm'),
	http = require('http'),
	querystring = require('querystring'),
	FormData = require('form-data');

function ntlmRequest(options, callback) {
	let agent = new http.Agent,
		serverurl = url.parse(options.host),
		httpOptions = {
			host: serverurl.hostname,
			port: serverurl.port || 3000,
			path: options.path,
			method: options.method,
			headers: { Accept : options.accept },
			maxRedirects: options.redirects > -1 ? 0 : 10,
			agent: agent
		};
	
	agent.maxSockets = 1; // ntlm authentication doesn't work without this!
	
	const ntdomain = options.domain,
		username = options.username,
		password = options.password,
		endPoint = serverurl.protocol + '//' + httpOptions.host + ':' + httpOptions.port + httpOptions.path;

	if (options.method === 'POST' || options.method === 'PUT') {
		options.contentType = options.contentType || 'application/x-www-form-urlencoded';
		
		if (options.contentType === 'application/x-www-form-urlencoded') {
			if (options.formContent instanceof FormData) {
				let rawFormData = options.formContent['_streams'],
					firstLine = rawFormData[0],
					boundary = firstLine.split('\n'),
					key = '',
					formData = {};
				
				boundary = boundary.length > 0 ? boundary[0].trim() : '';

				for (let line of rawFormData) {
					if (typeof line === 'string') {
					
						// we found the form field key, now get the form value
						if (key) {
							formData[key] = encodeURIComponent(line);
							
							// reset the key so we know we're done getting the value for it
							key = null;
						}
						
						// get the form field name here
						if (line.indexOf(boundary.trim()) > -1) {
							let matched = line.match('name="([^"]*)"[\n|\r]+([^\n\r].*)?$', 'ims');
							
							// we're expecting a match at the second array index with the name of the form field
							if (matched.length >= 2) {
								key = matched[1];
							}
						}
					}
				}
				
				options.formContent = querystring.stringify(formData);
			} else if (typeof options.formContent === 'object') { // we're assuming this to be a JSON object
				//console.log(typeof options.formContent);
				options.formContent = querystring.stringify(options.formContent);
			} else {
				// assume the content is a properly formatted url encoded string
			}
		}
	}
	
	let sendAuthenticatedRequest = (data) => {
		// build the type 3 token
		let type3Message = ntlm.type3Message(endPoint, username, password, ntdomain, data),
			body = '';

		// add the authorization token to the request
		httpOptions.headers.Authorization = 'NTLM ' + type3Message;

		// send the request with the authorization token
		let req = http.request(httpOptions, (res) => {
			res.setEncoding('utf8'); // we're only working with strings, so this is safe to set

			res.on('data', (chunk) => {
				body += chunk;
				
				// check for Flood Attack OR Faulty Client, Kill Request
				if (body.length > 1e7) { // 1e7 === 1 * Math.pow(10, 7) === 1 * 10000000 ~~~ 10MB
					body = '';
					res.writeHead(413, {'Content-Type': 'text/plain'}).end();
					req.connection.destroy();
				}
			});

			res.on('end', () => { 
				if (res.headers['content-type'] && res.headers['content-type'].indexOf('application/json') > -1) {
					res.body = JSON.parse(body);
				} else {
					res.body = body;
				}
				callback(res);
			});
		});
		
		// send the form data along
		if (options.method === 'POST' || options.method === 'PUT') {
			req.setHeader('Content-Type', options.contentType || 'application/x-www-form-urlencoded');
			req.setHeader('Content-Length', Buffer.byteLength(options.formContent));
			req.write(options.formContent);
		}
		
		req.on('error', (err) => {
			console.log('Error: ' + err.message);
		});
		
		req.end();
	};

	let sendNegotiationToken = (data) => { // send type 1 message
		let type1Message = ntlm.type1Message(endPoint, ntdomain);

		httpOptions.headers.Authorization = 'NTLM ' + type1Message;

		let req = http.request(httpOptions, (res) => {
			res.setEncoding('utf8'); // we're only working with strings, so this is safe to set

			res.on('data', (chunk) => {
				// this should be null as we're expecting a 401 here
			});

			res.on('end', () => { 
				// now lets build our type 3 response and send an authenticated response with the given type 2 token
				sendAuthenticatedRequest(res); 
			});
		});
		
		// initial negotiation the form content should be empty
		if (options.method === 'POST' || options.method === 'PUT') {
			req.write('');
		}
		
		req.on('error', (err) => {
			console.error('Error: ' + err.message);
		});
		
		req.end();
	};

	let req = http.request(httpOptions, (res) => {
		res.setEncoding('utf8'); // we're only working with strings, so this is safe to set

		res.on('data', (chunk) => {
			// this should be null as we're expecting a 401 here
		});

		res.on('end', () => { 
			// if we receive a 401 then assume we need to begin the authentication process
			if (res.statusCode === 401) {
				// begin the authentication negotiation process
				sendNegotiationToken(res);
			} else {
				callback(res);
			}
		});
	});
	
	// form data
	if (options.method === 'POST' || options.method === 'PUT') {
		req.write(options.formContent); // don't expect this to be sent here if NTLM is present
	}

	req.on('error', (err) => {
		console.log('Error: ' + err.message);
	});

	req.end();
}

export default ntlmRequest;