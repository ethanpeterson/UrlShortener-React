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

describe('/api/favorites POST DELETE', () => {
	let options = {
			host: config.host,
			accept: 'application/json',
			domain: config.domain,
			username: 'username',
			password: 'password'
		},
		shortUrlId = null;
	
	describe('/api/favorites POST', () => {
		it ('should fail to create a favorite with missing form data', (done) => {
			options.path = '/api/favorites';
			options.method = 'POST';
			options.formContent = { loginId: 'username' }; // missing Id form value
			options.redirects = 0;

			ntlmRequest(options, (res) => {
				//console.log(res.body);
				expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
				expect(res.statusCode).to.equal(400);
				expect(res.body.message).to.equal('Unknown or invalid request');

				done();
			});
		});
		
		it ('should fail to create a favorite with an invalid mongodb ObjectId', (done) => {
			options.path = '/api/favorites';
			options.method = 'POST';
			options.formContent = { loginId: 'username', id: 'XYZ123' }; // invalid ObjectId
			options.redirects = 0;

			ntlmRequest(options, (res) => {
				//console.log(res.body);
				expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
				expect(res.statusCode).to.equal(400);
				expect(res.body.message).to.equal('Unknown or invalid request');

				done();
			});
		});

		it ('should successfully Create a new favorite', (done) => {
			let shortId = '586d136187822f693c46706c';
			
			options.path = '/api/favorites';
			options.method = 'POST';
			//options.formContent = `id=586d136187822f693c46706c&loginId=${options.username}`; 
			//options.formContent = { id: '586d136187822f693c46706c', loginid: options.username }, // only used in POST requests
			let formData = new FormData();
			formData.append('id', shortId);
			formData.append('loginid', options.username);
			options.formContent = formData;
			options.redirects = 0;

			ntlmRequest(options, (res) => {
				//console.log(res.body);
				expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
				expect(res.statusCode).to.equal(201);
				expect(res.body.data.shortUrlId).to.equal(shortId);

				shortUrlId = res.body.data.shortUrlId;

				done();
			});
		});
	});
	
	describe('/api/favorites DELETE', () => {
		it ('should fail to delete an existing favorite because user is not the owner', (done) => {
			options.path = `/api/favorites/${options.username}/584974fb96897f18603098cc`;
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
	
	describe('/api/favorites DELETE', () => {
		it ('should successfully delete an existing favorite', (done) => {
			options.path = `/api/favorites/${options.username}/${shortUrlId}`;
			options.method = 'DELETE';
			options.redirects = 0;
			//console.log('PATH= ' + options.path);
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