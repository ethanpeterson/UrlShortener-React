import Axios from 'axios';

let favoritesAPI = {
	// get a list of favorites the current user has saved as they relate to the list of short urls
	fetchFavorites (loginId, callback) {
		Axios.get(`/api/favorites/${loginId}`)
			.then((response) => {
				let favoriteUrlList = response.data.data;
				callback(null, favoriteUrlList);
			})
			.catch((error) => {
				console.error(error);
			});
	}, // fetchFavorites

	removeFavorite (favorite, callback) {
		this.addRemoveFavoriteEventHandler(true, favorite.LoginId, favorite._id, callback);
	}, // removeFavorite

	// toggle the current link as a favorite for the current user or not
	addRemoveFavoriteEventHandler (exists, loginId, id, callback) {
		// if the index is greater than -1 we found a favorite, so assume we want to remove it here
		if (exists) {
			Axios.delete(`/api/favorites/${loginId}/${id}`)
				.then(res => {
					callback(null, res);
				})
				.catch((error) => {
					callback(error);
				});
		} else {
			Axios.post('/api/favorites', { id: id, loginid: loginId })
				.then(res => {
					callback(null, res);
				})
				.catch((error) => {
					callback(error);
				});
		}
	} // addRemoveFavoriteEventHandler
};

export default favoritesAPI;