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
	mongoose = require('mongoose');

module.exports = function () {
	var User = mongoose.model('User');

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function( id, done) {
		User.findOne({
			_id: id
		}, '-password -salt', function(err, user) {
			done(err, user);
		});
	});

	require('./strategies/local.js')();
	//require('./strategies/windowsauth.js')();
	//require('./strategies/ntlm.js')();
};
