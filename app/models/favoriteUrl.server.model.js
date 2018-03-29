
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
