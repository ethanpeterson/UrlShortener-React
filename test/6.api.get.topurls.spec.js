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

describe('/Get /api/top/:x', () => {
	let options = {
		host: config.host,
		formContent: '', // only used in POST requests
		accept: 'application/json',
		domain: config.domain,
		username: 'username',
		password: 'password'
	};
	
	it ('should get a list of top shortUrls', (done) => {
		options.path = '/api/top';
		options.method = 'GET';
		options.redirects = 0;

		ntlmRequest(options, (res) => {
			//console.log(res);
			expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
			expect(res.statusCode).to.equal(200);
			expect(res.body.data).to.be.an('array').to.have.lengthOf(13);
			
			done();
		});
	});
	
	it ('should get a list of 10 top shortUrls', (done) => {
		options.path = '/api/top/10';
		options.method = 'GET';
		options.redirects = 0;

		ntlmRequest(options, (res) => {
			//console.log(res.body);
			expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
			expect(res.statusCode).to.equal(200);
			expect(res.body.data).to.be.an('array').to.have.lengthOf(10);
			
			done();
		});
	});
	
	it ('should get the default list of top shortUrls with an invalid limit', (done) => {
		options.path = '/api/top/0';
		options.method = 'GET';
		options.redirects = 0;

		ntlmRequest(options, (res) => {
			//console.log(res.body);
			expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
			expect(res.statusCode).to.equal(200);
			expect(res.body.data).to.be.an('array').to.have.lengthOf(13);
			
			done();
		});
	});
	
	it ('should get the default list of shortUrls with an invalid limit', (done) => {
		options.path = '/api/top/XYZ';
		options.method = 'GET';
		options.redirects = 0;

		ntlmRequest(options, (res) => {
			//console.log(res.body);
			expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
			expect(res.statusCode).to.equal(200);
			expect(res.body.data).to.be.an('array').to.have.lengthOf(13);
			
			done();
		});
	});
	
});