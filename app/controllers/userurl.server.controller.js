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

var ShortUrl = require('mongoose').model('ShortUrl');

///
/// Get a ShortUrl object by a specific Code
/// 
/// @@ return - json object
///
exports.findByUser = function (req, res, next) {  // i.e. /api/userurls/peterse

	var loginid = req.params.loginid;

	if (!loginid)
		loginid = res.locals.ntlm.UserName; //'peterse';

	ShortUrl.find({ LoginId : loginid }, function (err, shorturls) {
		if (err) return next(err);

		res.json(shorturls);
	});
};

///
/// Remove a ShortUrl object
/// @id - the unique object id of the shorturl to remove
///
/// @@ return - json object
/// 
exports.remove = function (req, res, next) {  // i.e. /api/shorturl/

	var id = req.body.id,
		loginid = req.body.loginid,
		query = { _id : id, LoginId : loginid };

	// add the document to the database
	ShortUrl.remove(query, function (err, output) {
		if (err) return next(err);

		console.log('ShortUrl has been removed... ');

		res.json(output);
	});
};
