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
