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

describe('/Get /api/userurls/:loginid', () => {
	let options = {
		host: config.host,
		formContent: '', // only used in POST requests
		accept: 'application/json',
		domain: config.domain,
		username: 'username',
		password: 'password'
	};
	
	it ('should fail to get a list of short code details when loginid is missing', (done) => {
		options.path = '/api/userurls';
		options.method = 'GET';
		options.redirects = 0;

		ntlmRequest(options, (res) => {
			//console.log(res);
			expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
			expect(res.statusCode).to.equal(404);
			
			done();
		});
	});
	
	it (`should get a list of short code details for the given user id, '${options.username}'`, (done) => {
		options.path = `/api/userurls/${options.username}`;
		options.method = 'GET';
		options.redirects = 0;

		ntlmRequest(options, (res) => {
			//console.log(res.body);
			expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
			expect(res.statusCode).to.equal(200);
			expect(res.body.data.length).to.equal(27);
			
			done();
		});
	});
	
	it ('should get an empty list of Urls for an invalid user id, \'noonebythisname\'', (done) => {
		options.path = '/api/userurls/noonebythisname';
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