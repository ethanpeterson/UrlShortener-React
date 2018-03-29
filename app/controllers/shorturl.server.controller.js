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

import mongoose from 'mongoose';

var ShortUrl = mongoose.model('ShortUrl'),
	FavoriteUrl = mongoose.model('favoriteUrl');

///
/// Get a ShortUrl object by a specific Code
///
/// ## Url Parameters##
/// @code - short code for url to return (required)
///
/// @@ return - http redirect to url
///
exports.findShortUrl = function (req, res) {  // i.e. GET /api/shorturl/4S82N0
	let acceptJson = req.get('accept') && req.get('accept').indexOf('application/json') === 0,
		shorturl = req.shortUrl;
	
	if (shorturl) {
		var x = shorturl.TimesUsed + 1;
		shorturl.TimesUsed = x;
		shorturl.save();

		if (acceptJson) {
			return res.status(200).json({ status: 200, message: 'OK', data: shorturl });
		} else {
			return res.status(200).redirect(shorturl.Url);
		}
	} else {
		if (acceptJson) {
			return res.status(404).json({ status: 404, message : 'Oops! We couldn\'t find the link for the URL code provided' });
		} else {
			return res.status(400).render('oops', {  });
		}
	}
}; // findShortUrl

///
/// Create a new ShortUrl object
///
/// ## Form Body Parameters##
/// @url - url being shortened (required)
/// @loginid - network login id of person making request (required)
/// @shortenedUrl - custom short url string
///
/// @@ return - json object
///
exports.create = function (req, res, next) {  // i.e. POST /api/shorturl/
	let acceptJson = req.get('accept') && req.get('accept').indexOf('application/json') === 0,
		cheerio = require('cheerio'),
		//ttl = 10,
		//attempt = 0,
		url = decodeURIComponent(req.body.url),
		loginId = req.body.loginid || res.locals.ntlm.UserName,
		customUrl = req.body.shortenedUrl, // custom Url
		now = new Date(),
		expires = new Date().setFullYear(now.getFullYear() + 5);

	// check if a valid URL was provided
	if (!url || url === 'undefined') {
		if (acceptJson) {
			return res.status(400).send({ status: 400, message: 'A valid URL is required, please try again.' });
		} else {
			return res.status(400).send(new Error('A valid URL is required, please try again.'));
		}
	}
	
	// scrape the page title from the given url
	function GrabPageTitle (url, callback) {
		let http;
		
		if (url.indexOf('https') === 0) {
			http = require('https');
		} else {
			http = require('http');
		}

		// make request to url to get page details
		http.get(url, (res) => {
			//console.log('statusCode:', res.statusCode);
			//console.log('headers:', res.headers);
			let body = '';

			// Continuously update stream with data
			res.on('data', (d) => {
				body += d;
			});

			res.on('end', () => {
				// Data reception is done, do whatever with it!
				let $ = cheerio.load(body),
					title = $('title').text();
				console.log(title);
				callback(null, title);
			});
		}).on('error', (e) => {
			console.error(e);
			callback(e, null);
		});
	}

	GrabPageTitle(url, (err, title) => {
		if (err) {
			console.error(err);
			if (acceptJson) {
				return res.status(500).send({ status: 500, message: err });
			} else {
				return res.status(500).send(err);
			}
		}

		ShortUrl.findUniqueShortCode(customUrl, (err, shortUrlCode) => {
			if (err) {
				console.error(err);
				if (acceptJson) {
					return res.status(400).send({ status: 400, message: 'Failed to create a short url, please try again.' });
				} else {
					return res.status(400).send(new Error('Failed to create a short url, please try again.'));
				}
			} else {
				// add the document to the database
				let shortUrl = new ShortUrl({
					Url : url,
					LoginId : loginId,
					ShortenedUrl : shortUrlCode,
					TimesUsed : 0,
					Created : now,
					PageTitle : title,
					ExpireDate : expires,
					createdBy: req.user
				});
				//console.log(shortUrl);
				shortUrl.save(shortUrl, (err, output) => {
					if (err) {
						console.error(err);
						return next(err);
					}

					//console.log('Short Url has been created... ' + output.ShortenedUrl);

					if (acceptJson) {
						return res.status(201).json({ status: 201, message: 'Created', data: output });
					} else {
						return res.status(201).send(output); // need to format this for HTML
					}
				});
			}
		});
	});
}; // create

/// 
/// Update a shortUrl object's Page Title
///
/// ## Form body paramters ##
/// @PageTitle - string
/// 
/// @@ return - json object
///
exports.update = function (req, res) {
	let acceptJson = req.get('accept') && req.get('accept').indexOf('application/json') === 0,
		//id = req.params.code,
		shorturl = req.shortUrl,
		title = req.body.PageTitle;

	//ShortUrl.findByIdAndUpdate(id,
	//	{ PageTitle: title }, 
	//	{ new: true })
	//	.exec((err, shortUrl) => {
	if (shorturl) {
		shorturl.PageTitle = title;
		shorturl.save((err, shorturl) => {
			if (err) {
				console.error(err);
				if (acceptJson) {
					return res.status(400).json({ status: 400, message: err.message });
				} else {
					return res.status(400).render('oops', { error: err });
				}
			}

			if (acceptJson) {
				return res.status(200).json({ status: 200, message: 'OK', data: shorturl });
			} else {
				return res.status(200).json(shorturl);
			}
		});
	} else {
		if (acceptJson) {
			return res.status(400).json({ status: 400, message : 'Oops! We couldn\'t find the short code requested.' });
		} else {
			return res.status(400).render('oops', {  });
		}
	}
	//});
}; // update

/**
 * Gets a list of short codes management for the current user
 *
 * @param {} req  
 * @param {} res 
 *
 * @returns {json} collection of short urls
 */
exports.Manage = function(req, res) { // i.e. GET /manage
	let shortUrls,
		//favoriteUrls = [],
		loginid = req.params.loginid,
		loggedInUser = res.locals.ntlm.UserName,
		acceptJson = req.get('accept') && req.get('accept').indexOf('application/json') === 0;

	if (!loginid)
		loginid = loggedInUser;

	ShortUrl.find({ LoginId : loginid }, function (err, shorturls) {
		if (err) {
			console.error(err);
			if (acceptJson) {
				return res.status(400).json({ status: 400, message: err.message });
			} else {
				return res.status(400).render('oops', { error: err });
			}
		}

		if (shorturls) {
			shortUrls = [...shorturls];

			FavoriteUrl.getFavs(loggedInUser, function(err, favorites) {
				if (err) {
					console.error(err);
					if (acceptJson) {
						return res.status(400).json({ status: 400, message: err.message });
					} else {
						return res.status(400).render('oops', { error: err });
					}
				}

				//for (var j = 0; j < shorturls.length; j++) {
				//shortUrls[j] = shorturls[j];
				for (var j = 0; j < shortUrls.length; j++) {
					for (var i = 0; i < favorites.length; i++) {
						if (favorites[i]._id === shortUrls[j]._id) {
							//shortUrls[j] = JSON.parse(JSON.stringify(shorturls[j])); // simple copy of the object, so we can add the following property 'myFavorite'
							shortUrls[j].myFavorite = true;
							break;
						}
					}
				}

				if (acceptJson) {
					res.status(200).json({ status: 200, message: 'OK', data: shortUrls });
				} else {
					res.status(200).render('manage', {
						data: shortUrls
					});
				}
			});
		} else {
			if (acceptJson) {
				return res.status(400).json({ status: 400, message: 'Unknown or invalid request' });
			} else {
				return res.status(400).render('oops', { error: 'Unknown or invalid request' });
			}
		}
	});
};

///
/// Remove a ShortUrl object
///
/// ## Url Parameters##
/// @id - the unique object id of the shorturl to remove
///
/// @@ return - json object
///
exports.remove = function (req, res) {  // i.e. /api/shorturl/
	let acceptJson = req.get('accept') && req.get('accept').indexOf('application/json') === 0,
		id = req.params.id,
		loginid = res.locals.ntlm.UserName,
		query = { _id : id, LoginId : loginid };

	// add the document to the database
	ShortUrl.remove(query, (err, output) => {
		if (err) {
			console.error(err);
			return res.status(400).json({ status: 400, message: err.message });
		}

		//console.log('ShortUrl has been removed... ');

		if (acceptJson) {
			return res.status(200).json({ status: 200, message: 'OK', data: output });
		} else {
			return res.json(output);
		}
	});
}; // remove

///
/// Renders the Oops page when a bad short code is given
///
/// @@ return - html page
///
exports.invalidCode = function (req, res) {
	res.render('oops', {});
}; // invalidCode

///
/// Get a list of ShortUrl objects created by the given user
///
/// ## Url Parameters##
/// @loginid - login name of short url owner (required)
///
/// @@ return - json object
///
exports.findByUser = function (req, res) {  // i.e. GET /api/shorturl/peterse
	let acceptJson = req.get('accept') && req.get('accept').indexOf('application/json') === 0,
		loginid = req.params.loginid;

	if (!loginid)
		loginid = res.locals.ntlm.UserName; //'peterse';

	ShortUrl.find({ LoginId : loginid }, function (err, shorturls) {
		if (err) {
			console.error(err);
			if (acceptJson) {
				return res.status(400).json({ status: 400, message: err.message });
			} else {
				return res.status(400).render('oops', { error: err });
			}
		}

		if (shorturls) {
			FavoriteUrl.getFavs(loginid, function(err, favorites) {
				if (err) {
					console.error(err);
					if (acceptJson) {
						return res.status(400).json({ status: 400, message: err.message });
					} else {
						return res.status(400).render('oops', { error: err });
					}
				}

				for (var i = 0; i < shorturls.length; i++) {
					favorites.filter(function (favorite) {
						if (String(shorturls[i]._id) === String(favorite.shortUrlId)) {
							shorturls[i].myFavorite = true;
						}
					});
				}

				if (acceptJson) {
					return res.status(200).json({ status: 200, message: 'OK', data: shorturls });
				} else {
					return res.status(200).send(shorturls);
				}
			});
		} else {
			if (acceptJson) {
				return res.status(400).json({ status: 400, message: 'Unknown or invalid request' });
			} else {
				return res.status(400).render('oops', { error: 'Unknown or invalid request' });
			}
		}
	});
};

///
/// Fetches a list of FavoriteUrl objects for the logged in user
///
/// ## Url Parameters##
/// @loginid - login name of favorite owner (required)
/// 
/// @@ return - json object
///
exports.getFavoritesByUser = function (req, res) { // i.e. GET /api/favorites/peterse
	let acceptJson = req.get('accept') && req.get('accept').indexOf('application/json') === 0,
		loginid = req.params.loginid || res.locals.ntlm.UserName;

	FavoriteUrl.getFavs(loginid, function(err, favorites) {
		if (err) {
			console.error(err);
			if (acceptJson) {
				return res.status(400).json({ status: 400, message: err.message });
			} else {
				return res.status(400).render('oops', { error: err });
			}
		}
		
		if (favorites) {
			if (acceptJson) {
				return res.status(200).json({ status: 200, message: 'OK', data: favorites });
			} else {
				return res.status(200).send(favorites);
			}
		} else {
			if (acceptJson) {
				return res.status(400).json({ status: 400, message: 'Unknown or invalid request' });
			} else {
				return res.status(400).render('oops', { error: 'Unknown or invalid request' });
			}
		}
	});

};

///
/// Fetches a list of all FavoriteUrl objects
///
/// @@ return - json object
///
exports.getAllFavorites = function (req, res) { // i.e. GET /api/favorites/
	let acceptJson = req.get('accept') && req.get('accept').indexOf('application/json') === 0;
	
	FavoriteUrl.find({}, function (err, favoriteurls) {
		if (err) {
			console.error(err);
			if (acceptJson) {
				return res.status(400).json({ status: 400, message: err.message });
			} else {
				return res.status(400).render('oops', { error: err });
			}
		}

		if (favoriteurls) {
			var favs = favoriteurls.map(function (a) { return a._doc.shortUrlId; }),
				query = { _id: { $in : favs } };

			ShortUrl.find(query, function (err, favorites) {
				if (err) {
					console.error(err);
					if (acceptJson) {
						return res.status(400).json({ status: 400, message: err.message });
					} else {
						return res.status(400).render('oops', { error: err });
					}
				}

				if (acceptJson) {
					return res.status(200).json({ status: 200, message: 'OK', data: favorites });
				} else {
					return res.status(200).send(favorites);
				}
			});
		} else {
			if (acceptJson) {
				return res.status(400).json({ status: 400, message: 'Unknown or invalid request' });
			} else {
				return res.status(400).render('oops', { error: 'Unknown or invalid request' });
			}
		}
	});
};

///
/// Create a new FavoriteUrl object
///
/// ## Form body Parameters##
/// @id - id of the short url to create a favorite for (required)
/// @loginid - login name of favorite owner (required)
///
/// @@ return - json object
///
exports.createFavorite = function (req, res) { // i.e. POST /api/favorites/
	let acceptJson = req.get('accept') && req.get('accept').indexOf('application/json') === 0,
		
		// get the parameters as part of the request
		shortUrlId = req.body.id,
		loginId = req.body.loginid || res.locals.ntlm.UserName;

	// Get the matching ShortUrl object for the given Id
	function GetShortUrl(shortId, callback) {
		ShortUrl.findOne({ _id : mongoose.Types.ObjectId(shortId) }, (err, shorturl) => {
			if (err) {
				console.error(err);
				if (acceptJson) {
					return res.status(400).json({ status: 400, message: err.message });
				} else {
					return res.status(400).render('oops', { error: err });
				}
			}

			if (acceptJson) {
				return callback(err, shorturl);
			} else {
				return callback(err, shorturl);
			}
		});
	}

	// Check if a Favorite already exists for the Id and user login
	function FavoriteExists(shorturlId, loginId, callback) {
		let query = { shortUrlId : shortUrlId, LoginId : loginId };
		
		FavoriteUrl.findOne(query, (err, favoriteurls) => {
			if (err) {
				console.error(err);
				if (acceptJson) {
					return res.status(400).json({ status: 400, message: err.message });
				} else {
					return res.status(400).render('oops', { error: err });
				}
			}

			if (favoriteurls)
				console.log('Existing favorite: "' + favoriteurls._id + '"');

			return callback(err, favoriteurls);
		});
	}

	if (shortUrlId && mongoose.Types.ObjectId.isValid(shortUrlId)) {
		shortUrlId = mongoose.Types.ObjectId(shortUrlId);
		
		FavoriteExists(shortUrlId, loginId, (err, favorites) => {
			if (err) {
				console.error(err);
				if (acceptJson) {
					return res.status(400).json({ status: 400, message: err.message });
				} else {
					return res.status(400).render('oops', { error: err });
				}
			}

			if (favorites) {
				console.log('Favorite already exists, send back the original...');

				// get the Favorites associated ShortUrl object and return only the first one
				GetShortUrl(favorites.shortUrlId, (err, shorturl) => {
					if (err) {
						console.error(err);
						if (acceptJson) {
							return res.status(400).json({ status: 400, message: err.message });
						} else {
							return res.status(400).render('oops', { error: err });
						}
					}

					if (acceptJson) {
						return res.status(201).json({ status: 201, message: 'OK', data: shorturl });
					} else {
						return res.status(200).send(shorturl);
					}
				});
			} else {
				let created = new Date(),
					newFavorite = new FavoriteUrl;

				newFavorite.shortUrlId = shortUrlId;
				newFavorite.LoginId = loginId;
				newFavorite.Created = created;

				// add the document to the database
				newFavorite.save((err, output) => {
					if (err) {
						console.error(err);
						if (acceptJson) {
							return res.status(400).json({ status: 400, message: err.message });
						} else {
							return res.status(400).render('oops', { error: err });
						}
					}

					GetShortUrl(output.shortUrlId, (err, shorturl) => {
						if (err) {
							console.error(err);
							if (acceptJson) {
								return res.status(400).json({ status: 400, message: err.message });
							} else {
								return res.status(400).render('oops', { error: err });
							}
						}

						if (acceptJson) {
							return res.status(201).json({ status: 201, message: 'OK', data: shorturl });
						} else {
							return res.status(200).send(shorturl);
						}
					});
				});
			}
		});
	} else {
		if (acceptJson) {
			return res.status(400).json({ status: 400, message: 'Unknown or invalid request' });
		} else {
			return res.status(400).render('oops', { error: 'Unknown or invalid request' });
		}
	}
};

///
/// Remove a FavoriteUrl object (request must come from the owner)
///
/// ## Url Parameters##
/// @id - id of short url to remove (required)
/// @loginid - login name of favorite owner being removed (required)
///
/// @@ return - json object
///
exports.removeFavorite = function (req, res) {  // i.e. DELETE /api/favorites/peterse/45wl4kj635745k3454
	let acceptJson = req.get('accept') && req.get('accept').indexOf('application/json') === 0,
		shortUrlId = req.params.id,
		loginId = req.params.loginid, // || res.locals.ntlm.UserName,
		query = { shortUrlId : shortUrlId, LoginId : loginId };

	// check whether the current user is the same as the 'loginId'
	if (res.locals.ntlm.UserName === loginId) {
		FavoriteUrl.remove(query, function (err) {
			if (err) {
				console.error(err);
				if (acceptJson) {
					return res.status(400).json({ status: 400, message: err.message });
				} else {
					return res.status(400).render('oops', { error: err });
				}
			}

			FavoriteUrl.getFavs(loginId, function(err, favorites) {
				if (err) {
					console.error(err);
					if (acceptJson) {
						return res.status(400).json({ status: 400, message: err.message });
					} else {
						return res.status(400).render('oops', { error: err });
					}
				}

				if (acceptJson) {
					return res.status(200).json({ status: 200, message: 'OK', data: favorites });
				} else {
					return res.status(200).send(favorites);
				}
			});
		});
	} else {
		let message = `Attempt to remove favorite when current user (${res.locals.ntlm.UserName}) is not the owner (${loginId})`;
		
		console.log(message);
		
		if (acceptJson) {
			return res.status(400).json({ status: 400, message: message });
		} else {
			return res.status(400).render('oops', { error: message });
		}
	}
};

///
/// Get the top 20 used Urls
///
/// @@ return - json object
///
exports.getTopUrls = function (req, res, next) {
	let acceptJson = req.get('accept') && req.get('accept').indexOf('application/json') === 0,
		limit = 20;

	if (req.params.x)
		limit = req.params.x;

	ShortUrl.find({ TimesUsed : { $gt: 0 }})
		.limit(limit)
		.sort({ TimesUsed : -1 })
		.exec((err, shorturls) => {
			if (err) {
				console.error(err);
				return next(err);
			}
			
			if (acceptJson) {
				return res.status(200).json({ status: 200, message: 'OK', data: shorturls });
			} else {
				return res.status(200).send(shorturls);
			}
		});
};

exports.getShortUrlByCode = function (req, res, next, code) {
	try {
		ShortUrl.findOne({ ShortenedUrl : code }, 
			(err, shorturl) => {
				if (err) {
					next(); // ignore the error for now
				} else {
					req.shortUrl = shorturl;
					next();
				}
			})
			.catch(err => {
				console.error(err);
				next();
			});
	} catch (err) {
		console.error(err);
		next();
	}
};

exports.getShortUrlById = function (req, res, next, id) {
	try {
		if (mongoose.Types.ObjectId.isValid(id)) {
			ShortUrl.findById(id, 
				(err, shorturl) => {
					if (err) {
						next(); //ignore the error for now
					} else {
						req.shortUrl = shorturl;
						next();
					}
				})
				.catch(err => {
					console.error(err);
					next();
				});
		} else {
			next();
		}
	} catch (err) {
		console.error(err);
		next();
	}
};