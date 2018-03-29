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

describe('/Get /api/shorturl/:code', () => {
	let options = {
		host: config.host,
		formContent: '', // only used in POST requests
		accept: 'application/json',
		domain: config.domain,
		username: 'username',
		password: 'password'
	};
	
	it ('should get details for one short code', (done) => {
		options.path = '/api/shorturl/MD0I12';
		options.method = 'GET';
		options.redirects = 0;

		ntlmRequest(options, (res) => {
			//console.log(res.body);
			expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
			expect(res.statusCode).to.equal(200);
			expect(res.body.data.Url).to.equal('https://www.somewebsite.com');
			done();
		});
	});
	
	it ('should fail to get details for an unknown short code', (done) => {
		options.path = '/api/shorturl/XYZ123';
		options.method = 'GET';
		options.redirects = 0;

		ntlmRequest(options, (res) => {
			//console.log(res.body);
			expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
			expect(res.statusCode).to.equal(404);
			expect(res.body.message).to.equal('Oops! We couldn\'t find the link for the URL code provided');
			done();
		});
	});
	
});


describe('/Get /api/:code', () => {
	let options = {
		host: config.host,
		formContent: '', // only used in POST requests
		accept: 'application/json',
		domain: config.domain,
		username: 'username',
		password: 'password'
	};
	
	it ('should get details for one short code', (done) => {
		options.path = '/api/MD0I12';
		options.method = 'GET';
		options.redirects = 0;

		ntlmRequest(options, (res) => {
			//console.log(res.body);
			expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
			expect(res.statusCode).to.equal(200);
			expect(res.body.data.Url).to.equal('https://somewebsite.com');
			done();
		});
	});
	
	it ('should fail to get details for an unknown short code', (done) => {
		options.path = '/api/XYZ123';
		options.method = 'GET';
		options.redirects = 0;

		ntlmRequest(options, (res) => {
			//console.log(res.body);
			expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
			expect(res.statusCode).to.equal(404);
			expect(res.body.message).to.equal('Oops! We couldn\'t find the link for the URL code provided');
			done();
		});
	});
	
});