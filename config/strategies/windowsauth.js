var passport = require('passport'),
	WindowsStrategy = require('passport-windowsauth'),
	User = require('mongoose').model('User');

module.exports = function () {
	passport.use(new WindowsStrategy({ldap: {
		url:			'ldap://corp.company.com:389/DC=corp,DC=company,DC=com',
		base:			'DC=corp,DC=company,DC=com',
		bindDN:			'CN=DMS Service,OU=Service Accounts,OU=North America,OU=NA,DC=corp,DC=company,DC=com',
		bindCredentials:'password'
	}, integrated: false},
	function(profile, done) {
		console.log('Windows');
		console.log(profile);
		User.findOrCreate({
			username: profile.id
		}, function(err, user) {
			if (err) {
				return done(err);
			}

			if (!user) {
				return done(null, false, {
					message: 'Unknown user'
				});
			}

			if (!user.authenticate(password)) {
				return done(null, false, {
					message: 'Invalid password'
				});
			}

			return done(null, user);
		});
	}));
};
