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

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ShortUrl = mongoose.model('ShortUrl'),
	
	FavoriteUrlSchema = new Schema({
		shortUrlId: { type: Schema.Types.ObjectId },
		LoginId: { type: String },
		Created: { type: Date, default: Date.now }
	});

FavoriteUrlSchema.methods.findSingleMatch = function (query, cb) {
	return this.model('favoriteUrl').findOne(query, cb);
};

///
/// Gets a list FavoriteUrl objects from the database
/// @loginid - login name of favorite owner (required)
/// @callback - function to run after receiving a response from the database (required)
///
/// @@ return - callback function with favorites collection
FavoriteUrlSchema.statics.getFavs = function(loginid, callback) {
	this.find({ LoginId : loginid }, function (err, favoriteurls) {
		if (err) return callback(err, null);

		if (favoriteurls) {
			var favs = favoriteurls.map(function (a) { return a._doc.shortUrlId; }),
				query = { _id: { $in : favs } };

			ShortUrl.find(query, function (err, favorites) {
				if (err) return callback(err, null);

				return callback(err, favorites);
			});
		} else {
			return callback(new Error('No Favorites found.'), null);
		}
	})
		.catch(err => {
			console.error(err);
			return callback(err, null);
		});
};

mongoose.model('favoriteUrl', FavoriteUrlSchema, 'favoriteUrls');
//module.exports = mongoose.model('favoriteUrl', FavoriteUrlSchema, 'favoriteUrls');
