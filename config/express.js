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

require('babel-register'); // required here for parsing JSX or ES6 files on server side

var config = require('./config'),
	express = require('express'),
	exphbs = require('express-handlebars'),
	path = require('path'),
	//favicon = require('serve-favicon'),
	logger = require('morgan'),
	//cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	passport = require('passport'), //hash the password
	flash = require('connect-flash'),   // allows for passing session flashdata messages
	session = require('express-session'),
	//debug = require('debug')('URLShortener-React'),
	ntlm = require('express-ntlm'),
	compression = require('compression');


module.exports = function () {
	// Create an express instance and set a port variable
	let app = express(),
		hbs = exphbs.create({
			defaultLayout: 'main',
			layoutsDir: './views/layouts',
			partialsDir: './views/partials'
		});

	if (process.env.NODE_ENV === 'development') {
		app.use(logger('dev'));
	} else {
		app.use(compression());
	}
	
	global.host = config.host;

	app.use(ntlm({
		debug: function () {
			var args = Array.prototype.slice.apply(arguments);
			console.log.apply(null, args);
		},
		domain: 'CORP',
		domaincontroller: 'ldap://corp.inbaxalta.com/DC=corp,DC=inbaxalta,DC=com'
	}));
	
	app.set('views', './views');

	// Set handlebars as the templating engine
	app.engine('handlebars', hbs.engine);
	app.set('view engine', 'handlebars');

	// required for passport
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret
	})); // session secret

	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions

	// uncomment after placing your favicon in /public
	//app.use(favicon(appDir + '/public/favicon.ico'));
	app.use(bodyParser.json()); // required for Axios requests
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(methodOverride());
	//app.use(cookieParser());
	app.use(require('stylus').middleware(path.join(global.appDir, 'public')));

	// Block the header from containing information
	// about the server
	app.disable('x-powered-by');

	require('../app/routes/users.server.routes.js')(app);
	require('../app/routes/favorites.server.routes.js')(app);
	require('../api/index.server.routes.js')(app);
	require('../app/routes/index.server.routes.js')(app);


	app.use(express.static(path.join(global.appDir, 'public')));

	// error handlers
	// catch 404 and forward to error handler
	app.use(function (req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	// development error handler
	// will print stacktrace
	if (app.get('env') === 'development') {
		app.use(function (err, req, res) {
			res.status(err.status || 500);
			res.render('error', {
				message: err.message,
				error: err
			});
		});
	}
	
	if (app.get('env') !== 'production') {
		app.all('*', function(request, response) { 
			response.end(JSON.stringify(request.ntlm)); 
		});
	}

	// production error handler
	// no stacktraces leaked to user
	app.use(function (err, req, res) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: {}
		});
	});

	return app;
};
