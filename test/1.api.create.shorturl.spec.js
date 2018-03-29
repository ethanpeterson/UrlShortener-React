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

/* eslint-env mocha */

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
var config = require('../config/config'),
	chai = require('chai'),
	chaiHttp = require('chai-http'),
	server = require('../server'),
	//should = chai.should()
	expect = chai.expect,
	ntlmRequest = require('../src/lib/ntlmRequest').default,
	FormData = require('form-data')
	;

chai.use(chaiHttp);

describe('/api/shorturl Create, Update and Delete', () => {
	let options = {
			host: config.host,
			accept: 'application/json',
			domain: config.domain,
			username: 'username',
			password: 'password'
		},
		shortCodeId = null;
	
	describe('/api/shorturl POST', () => {
		it ('should fail to create a Short Code with missing form data', (done) => {
			options.path = '/api/shorturl';
			options.method = 'POST';
			options.formContent = { loginId: 'username' }; // only used in POST requests
			options.redirects = 0;

			ntlmRequest(options, (res) => {
				//console.log(res.body);
				expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
				expect(res.statusCode).to.equal(400);
				expect(res.body.message).to.equal('A valid URL is required, please try again.');

				done();
			});
		});

		it ('should successfully Create a new short code', (done) => {
			options.path = '/api/shorturl';
			options.method = 'POST';
			//options.formContent = 'url=https%3A%2F%2Fgetbootstrap.com%2Fdocs%2F4.0%2Fcomponents%2Fforms%2F&loginId=username'; 
			options.formContent = { url: 'https://getbootstrap.com/docs/4.0/components/forms/', loginid: 'username' }, // only used in POST requests - must use bodyParser.urlencoded for this
			
			// only use this when NOT using bodyParser
			//let formData = new FormData();
			//formData.append('url', 'https://getbootstrap.com/docs/4.0/components/forms/');
			//formData.append('loginid', 'username');
			//options.formContent = formData;
			
			options.redirects = 0;

			ntlmRequest(options, (res) => {
				//console.log(res.body);
				expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
				expect(res.statusCode).to.equal(201);
				expect(res.body.data.Url).to.equal('https://getbootstrap.com/docs/4.0/components/forms/');

				shortCodeId = res.body.data._id;

				done();
			});
		});
	});
	
	describe('/api/shorturl PUT', () => {
		it ('should fail to Update the existing short code with invalid short code ID', (done) => {
			options.path = '/api/shorturl/00000000000000000000000000000';
			options.method = 'PUT';
			options.formContent = { PageTitle: 'TESTING' };
			options.redirects = 0;

			ntlmRequest(options, (res) => {
				//console.log(res.body);
				expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
				expect(res.statusCode).to.equal(400);
				expect(res.body.message).to.equal('Oops! We couldn\'t find the short code requested.');

				done();
			});
		});
		
		it ('should successfully Update the existing short code', (done) => {
			let newTitle = 'MY NEW PAGE';
			//console.log(shortCodeId);
			options.path = `/api/shorturl/${shortCodeId}`;
			options.method = 'PUT';
			options.formContent = { PageTitle: newTitle };
			options.redirects = 0;

			ntlmRequest(options, (res) => {
				//console.log(res.body);
				expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
				expect(res.statusCode).to.equal(200);
				expect(res.body.message).to.equal('OK');
				expect(res.body.data.PageTitle).to.equal(newTitle);

				done();
			});
		});
	});
	
	describe('/api/shorturl DELETE', () => {
		it ('should successfully delete an existing short code', (done) => {
			options.path = `/api/shorturl/${shortCodeId}`;
			options.method = 'DELETE';
			options.redirects = 0;

			ntlmRequest(options, (res) => {
				//console.log(res.body);
				expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
				expect(res.statusCode).to.equal(200);
				expect(res.body.message).to.equal('OK');

				done();
			});
		});
	});
});