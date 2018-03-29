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
