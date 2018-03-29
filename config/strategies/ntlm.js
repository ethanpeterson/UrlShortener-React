var passport = require('passport'),
	NtlmStrategy = require('passport-ntlm').Strategy,
	User = require('mongoose').model('User');

module.exports = function () {
	passport.use(new NtlmStrategy({domainDNS:'corp.company.com'},
		function(username, done) {
			console.log('NTLM');
			console.log(username);
			User.findOrCreate({
				username: username
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
