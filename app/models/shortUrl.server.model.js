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

	ShortUrlSchema = new Schema({
		Url: {
			type: String
		},
		LoginId: {
			type: String,
			indx: true
		},
		ShortenedUrl: {
			type: String,
			index: true
		},
		TimesUsed: { type: Number },
		Created: {
			type: Date,
			default: Date.now
		},
		PageTitle: { type: String },
		ExpireDate: { type: Date },
		createdBy: {
			type: Schema.ObjectId,
			ref: 'User'
		}
	});

ShortUrlSchema.statics.findUniqueShortCode = function(urlCode, callback) {
	var _this = this;
    
	let ttl = 10,
		attempt = 0;

	function ShortUrlExists(anonPacket, cb) {
		console.log('Check if this short url already exists or not (attempt ' + (attempt + 1) + ')... ' + anonPacket.shortUrl);

		if (attempt < ttl) {
			_this.findOne({ ShortenedUrl : anonPacket.shortUrl }, function (err, shorturl) {
				if (err) {
					console.log(err);
					return cb(err, null);
				}

				attempt++;

				if (shorturl) {
					console.log(shorturl);
					console.log('Existing Short Url already exists, let\'s try again');

					return GenerateShortUrl(anonPacket.givenShortUrl, anonPacket.size, cb);
				}

				console.log('A unique short Url code has been generated... ' + anonPacket.shortUrl);

				return cb(err, anonPacket.shortUrl);
			});
		} else {
			return cb(new Error('Short URL generation failed, please try again.'), null);
		}
	}
    
	function GenerateShortUrl(givenShortUrl, size, cb) {
		//console.log(givenShortUrl);
		if (givenShortUrl) {
			let text = givenShortUrl;

			return cb(null, text);
		} else {
			let text = '',
				possible = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

			console.log('Generating new short Url');

			for (var i = 0; i < size; i++)
				text += possible.charAt(Math.floor(Math.random() * possible.length));

			// check if the newly generated random url exists or not
			return ShortUrlExists({
				shortUrl : text,
				givenShortUrl : givenShortUrl,
				size: size
			}, cb);
		}
	}

	return GenerateShortUrl(urlCode, 6, function (err, shortUrlCode) {
		callback(err, shortUrlCode);
	});
};

ShortUrlSchema.set('toJSON', {
	getters: true,
	virtuals: true
});

mongoose.model('ShortUrl', ShortUrlSchema, 'shortUrls');
