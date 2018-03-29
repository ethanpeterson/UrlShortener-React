import Axios from 'axios';

let shortUrlAPI = {
	fetchShortUrls (url, callback) {
		Axios.get(url)
			.then((response) => {
				let data = response.data.data;
				callback(null, data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, // fetchShortUrls
	
	createShortUrl (data, callback) {
		Axios.post('/', data)
			.then(res => {
				const shortUrl = res.data.data;
				callback(null, shortUrl);
			})
			.catch((error) => {
				console.error(error);
				callback(error);
			});	
	}, // createShortUrl
	
	saveShortUrl (item, callback) {
		Axios.put(`/api/shorturl/${item._id}`, item)
			.then(res => {
				const shortUrl = res.data.data;
				callback(null, shortUrl);
			})
			.catch((error) => {
				console.error(error);
				callback(error);
			});
	}, // saveShortUrl
	
	deleteShortUrl (id, callback) {
		Axios.delete(`/api/shorturl/${id}`)
			.then(res => {
				// do nothing
				callback(null, res);
			})
			.catch((error) => {
				console.error(error);
				callback(error);
			});
	} // deleteShortUrl
};

export default shortUrlAPI;