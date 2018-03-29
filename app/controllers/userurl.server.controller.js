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
