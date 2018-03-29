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