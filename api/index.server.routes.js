var shortUrl = require('../app/controllers/shortUrl.server.controller');

module.exports = function (app) {
	///
	/// Gets a ShortUrl object and redirects to the underlying URL
	///
	app.route('/api/shorturl/:code')
		.get(shortUrl.findShortUrl);

	///
	/// Create a new ShortUrl object
	///
	app.route('/api/shorturl')
		.post(shortUrl.create);

	///
	/// Remove OR Update a ShortUrl object
	///
	app.route('/api/shorturl/:id')
		.put(shortUrl.update)
		.delete(shortUrl.remove);

	///
	/// Display a page of short url details for the user
	///
	app.route('/api/manage/:loginid?')
		.get(shortUrl.Manage);
	
	///
	/// Get a list of ShortUrl objects created by the given user
	///
	app.route('/api/userurls/:loginid')
		.get(shortUrl.findByUser);

	///
	/// Gets all the favorited ShortUrl objects for the given user
	///
	app.route('/api/favorites/:loginid?')
		.get(shortUrl.getFavoritesByUser);

	///
	/// Create a new favoriteUrl object
	///
	app.route('/api/favorites')
		.post(shortUrl.createFavorite);

	///
	/// Removes a favorite based on the object id
	///
	app.route('/api/favorites/:loginid/:id')
		.delete(shortUrl.removeFavorite);

	///
	/// Gets the top x number of short urls used
	///
	app.route('/api/top/:x?')
		.get(shortUrl.getTopUrls);

	///
	/// Get a ShortUrl object by a specific Code, i.e. /api/4S82N0
	///
	app.route('/api/:code')
		.get(shortUrl.findShortUrl);
	
	app.param('code', shortUrl.getShortUrlByCode);
	app.param('id', shortUrl.getShortUrlById);
};
