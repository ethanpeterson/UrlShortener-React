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
