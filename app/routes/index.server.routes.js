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

module.exports = function(app) {
	var index = require('../controllers/index.server.controller'),
		shortUrl = require('../controllers/shortUrl.server.controller');

	/// 
	/// '/' - Get the home page
	/// '/manage/:userId?' - Display a page of short url details for the user
	/// '/favorites' - Gets all the favorited ShortUrl objects for the current user
	/// '/top' - Gets the most used short url objects
	///
	app.route(['/', '/manage/:userId?', '/favorites', '/top'])
		.get(index.render);

	///
	/// translates the short code into url and redirects client
	/// i.e. /4S82N0
	/// 
	app.route('/:code')
		.get(shortUrl.findShortUrl);

	///
	/// Create a new ShortUrl object
	///
	app.route('/')
		.post(shortUrl.create);

	///
	/// Remove a ShortUrl object
	///
	app.route('/')
		.delete(shortUrl.remove);

	///
	/// Gets a message page notifying the end user of their misfortune
	///
	app.route('/Oops/:code')
		.get(shortUrl.invalidCode);

};
