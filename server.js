process.env.NODE_ENV = process.env.NODE_ENV || 'development';

global.appDir = __dirname;

var debug = require('debug')('URLShortener-React'),
	mongoose = require('./config/mongoose'),
	express = require('./config/express'),
	passport = require('./config/passport'),
	db = mongoose(),
	app = express(),
	passport = passport();

app.listen(process.env.PORT || 3000);

module.exports = app;
