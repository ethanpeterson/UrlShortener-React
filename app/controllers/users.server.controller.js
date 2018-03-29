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

var User = require('mongoose').model('User'),
	Passport = require('passport'),

	getErrorMessage = function(err) {
		var message = '', errName;
	
		if (err.code) {
			switch (err.code) {
			case 11000:
			case 11001:
				message = 'Username already exists';
				break;
			default:
				message = 'Something went wrong';
			}
		} else {
			for (errName in err.errors) {
				if (err.errors[errName].message) message = err.errors[errName].message;
			}
		}
	
		return message;
	};

///
/// Display the logon page
///
/// @@ return - http redirect to url
///
exports.renderSignin = function (req, res) {
	if (!req.user) {
		res.render('signin', {
			title: 'Sign-in Form',
			messages: req.flash('error') || req.flash('info')
		});
	} else {
		return res.redirect('/');
	}
};

///
/// Display the sign up page
///
/// @@ return - http redirect to url
///
exports.renderSignup = function (req, res) {
	if (!req.user) {
		res.render('signup', {
			title: 'Sign-up Form',
			messages: req.flash('error')
		});
	} else {
		return res.redirect('/');
	}
};

///
/// handle the sign up functionality
///
/// @@ return - http redirect to url
///
exports.signup = function (req, res, next) {
	if (!req.user) {
		let user = new User(req.body),
			message = null;
		
		user.provider = 'local';
		
		user.save(function(err) {
			if (err) {
				message = getErrorMessage(err);
				
				req.flash('error', message);
				return res.redirect('/signup');
			}
			
			req.login(user, function(err) {
				if (err) return next(err);
			});
		});
	} else {
		return res.redirect('/');
	}
};

///
/// Log the current user out of a session
///
/// @@ return - http redirect to url
///
exports.signout = function (req, res) {
	req.logout();
	res.redirect('/');
};

///
/// checks if the current user is authorized or not
///
/// @@ return - 401 error message
///
exports.requiresLogin = function (req, res, next) {
	if (!req.isAuthenticated) {
		req.session.returnTo = req.path; 
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}
	
	next();
};
