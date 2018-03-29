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
	ntlmRequest = require('../src/lib/ntlmRequest').default
	;

chai.use(chaiHttp);

describe('/Get /api/favorites/:loginid', () => {
	let options = {
		host: config.host,
		formContent: '', // only used in POST requests
		accept: 'application/json',
		domain: config.domain,
		username: 'username',
		password: 'password'
	};
	
	it ('should get a list of favorite shortUrl details for the currently authenticated user', (done) => {
		options.path = '/api/favorites';
		options.method = 'GET';
		options.redirects = 0;

		ntlmRequest(options, (res) => {
			//console.log(res);
			expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
			expect(res.statusCode).to.equal(200);
			expect(res.body.data.length).to.equal(10);
			
			done();
		});
	});
	
	it (`should get a list of favorite shortUrl details for the given user id, '${options.username}'`, (done) => {
		options.path = `/api/favorites/${options.username}`;
		options.method = 'GET';
		options.redirects = 0;

		ntlmRequest(options, (res) => {
			//console.log(res.body);
			expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
			expect(res.statusCode).to.equal(200);
			expect(res.body.data.length).to.equal(10);
			
			done();
		});
	});
	
	it ('should get an empty list of favorite shortUrls for an invalid user id, \'noonebythisname\'', (done) => {
		options.path = '/api/favorites/noonebythisname';
		options.method = 'GET';
		options.redirects = 0;

		ntlmRequest(options, (res) => {
			//console.log(res.body);
			expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
			expect(res.statusCode).to.equal(200);
			expect(res.body.data).to.be.an('array').that.is.empty;
			
			done();
		});
	});
	
});