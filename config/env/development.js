var port = 27017;

module.exports = {
	port: port,
	db: 'mongodb://web:password@mongodbserver.corp.company.com:27017/Urls',
	sessionSecret: 'developmentSessionSecret',
	host: 'http://localhost:3000/',
	domaincontroller: 'ldap://corp.company.com/DC=corp,DC=company,DC=com',
	domain: 'CORP',
	dateFormat: 'DD-MMM-YYYY hh:mm:ss A Z'
};
