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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './Header.react';
import Footer from './Footer.react';
import ShortUrlForm from './ShortUrlForm.react';
import ManageBlock from './Manage.react';
import FavoritesBlock from './Favorites.react';
import TopBlock from './Top.react';

import FavoritesAPI from '../../src/lib/favoritesAPI';
import ShortUrlAPI from '../../src/lib/shortUrlAPI';

const pushState = (obj, url) => {
		window.history.pushState(obj, '', url);
	},

	onPopState = (handler) => {
		if (window)
			window.onpopstate = handler;
	};

class App extends Component {
	static defaultProps = {
		loginId: 'Guest',
		shortUrls: [],
		host: 'http://localhost:3000/',
		dateFormat: 'DD-MMM-YYYY hh:mm:ss A Z'
	};

	static propTypes = {
		loginId: PropTypes.string,
		entryPage: PropTypes.string.isRequired,
		shortUrls: PropTypes.array,
		host: PropTypes.string,
		dateFormat: PropTypes.string,
		peekIntoUserId: PropTypes.string
	};

	constructor(props) {
		super(props);
		
		this.state = {
			currentPageUrl: props.entryPage,
			shortUrls: props.shortUrls || []
		};
	}
	
	componentDidMount() {
		onPopState((event) => {
			this.setState({ currentPageUrl: event.state ? event.state.currentPageUrl : this.props.entryPage });
			console.log(event.state);
		});
	}
	
	componentWillUnMount() {
		onPopState(null);
	}

	/********************************************************************/
	/* General ShortURL functions */
	/********************************************************************/
	getApiUrl = (url) => {
		if (url.indexOf('/top') === 0) {
			return '/api/top';
		} else if (url.indexOf('/favorites') === 0) {
			return `/api/favorites/${this.props.loginId}`;
		} else {
			return `/api${url}`;
		}
	};

	setCurrentPage = (url) => {
		if (typeof window !== 'undefined') {
			pushState(
				{ currentPageUrl: url || window.location.href },
				`${window.location.protocol}//${window.location.host}${url}`
			);
			url = url || window.location.href;
		}
		
		url = url || this.props.entryPage;

		if (url !== '/') {
			ShortUrlAPI.fetchShortUrls(this.getApiUrl(url), (err, urls) => {
				if (err) {
					console.log(err);
				} else {
					this.setState({ currentPageUrl: url, shortUrls: urls });
					if (typeof window !== 'undefined') { window.scrollTo(0,0); }
					return false;
				}
			});
		} else {
			this.setState({ currentPageUrl: url, shortUrls: [] });
			if (typeof window !== 'undefined') { window.scrollTo(0,0); }
			return false;
		}
	};
	/********************************************************************/
	/********************************************************************/

	/********************************************************************/
	/* General Favorites functions */
	/********************************************************************/
	// get a list of favorites the current user has saved as they relate to the list of short urls
	fetchFavorites = (callback) => {
		FavoritesAPI.fetchFavorites(this.props.loginId, (err, list) => {
			if (err) {
				console.log(err);
			} else {
				callback(list);
				this.setState({
					favoriteUrls: list
				});
			}
		});
	}; // fetchFavorites

	removeFavorite = (favorite) => {
		if (confirm('Do you want to remove the link from your favorites?')) {
			const prevState = this.state.shortUrls;
			
			let nextState = [...prevState],
				favoriteIndex = prevState.findIndex((fav) => String(fav._id) === String(favorite._id));

			// optimistic delete
			nextState.splice(favoriteIndex, 1);
			this.setState({ shortUrls: nextState });

			FavoritesAPI.removeFavorite(favorite, (err, res) => {
				if (err) {
					console.error(err);
					this.setState({ favoriteUrls: prevState }); // rollback to previous state
				} 
			});
		}
	}; // removeFavorite

	// private function to assist with display
	toggleHeartClass = (elem) => {
		if (elem.classList.contains('fa-heart-o')) {
			elem.classList.replace('fa-heart-o', 'fa-heart');
		} else{
			elem.classList.replace('fa-heart', 'fa-heart-o');
		}
	}; // toggleHeartClass

	// toggle the current link as a favorite for the current user or not
	addRemoveFavoriteEventHandler = (elem) => {
		const prevState = this.state.favoriteUrls || [];
		
		let	nextState = [...prevState],
			id = elem.parentNode.dataset.id;

		const favoriteUrlsIndex = nextState.findIndex((shorty) => String(shorty._id) === String(id)),
			exists = favoriteUrlsIndex > -1;
		
		// optimistic delete
		if (exists) {
			nextState.splice(favoriteUrlsIndex, 1);
			this.setState({ favoriteUrls: nextState });
		}
		
		this.toggleHeartClass(elem);
		
		FavoritesAPI.addRemoveFavoriteEventHandler(exists, this.props.loginId, id, (err, res) => {
			if (err) {
				console.error(err);
				this.toggleHeartClass(elem);
				this.setState({ favoriteUrls: prevState }); // rollback to previous state
			} else {
				if (!exists) {
					nextState.push(res.data.data);
					this.setState({ favoriteUrls: nextState });
				}
			}
		});
	}; // addRemoveFavoriteEventHandler
	/********************************************************************/
	/********************************************************************/

	/********************************************************************/
	/* General ShortURL manipulation functions */
	/********************************************************************/
	// save the short url to the list of short urls for the current user
	deleteShortUrl = (shortUrl) => {
		if (confirm('Click OK to delete this shortcut')) {
			// set up 'optimistic delete'
			const prevState = this.state.shortUrls;
			
			let nextState = [...prevState],
				shortUrlIndex = prevState.findIndex((shorty) => String(shorty._id) === String(shortUrl._id));
			
			nextState.splice(shortUrlIndex, 1);

			this.setState({ shortUrls: nextState });

			ShortUrlAPI.deleteShortUrl(shortUrl._id, (err, res) => {
				if (err) {
					this.setState({ shortUrls: prevState }); // rollback to previous state
				}
			});
		}
	}; // deleteShortUrl

	// shows/hides input field for short url page title
	toggleEditShortUrl = (shortUrl, save) => {
		this.setState({ editUrl: shortUrl });
		
		if (save) {
			ShortUrlAPI.saveShortUrl(save, (err, data) => {
				if (err) {
					
				}
			});
		}
	}; // toggleEdit

	// manages the state of the field (key)
	handleFieldChange = (key, value) => {
		if (this.state.editUrl) {
			let urlIndex = this.state.shortUrls.findIndex((shortUrl) => {
					return String(shortUrl._id) === String(this.state.editUrl);
				}),
				currentState = this.state.shortUrls,
				nextState = [...currentState],
				shortUrl = nextState[urlIndex],
				updatedShortUrl = {...shortUrl};
			
			try {
				updatedShortUrl[key] = value;
				
				nextState[urlIndex] = updatedShortUrl;

				this.setState({ shortUrls: nextState });
			} catch (err) {
				console.error(err);
				this.setState({ editUrl: currentState });
			}
		}
	}; // handleFieldChange
	/********************************************************************/
	/********************************************************************/

	/********************************************************************/
	/* home page */
	/********************************************************************/
	// shows/hides the custom url form block
	toggleCustomUrlFormBlock = () => {
		this.setState({
			customUrlLinkVisible: !this.state.customUrlLinkVisible
		});
	}; // toggleCustomUrlFormBlock

	// save the short url to the list of short urls for the current user
	saveShortUrl = (jsonData) => {
		let url = document.getElementById('url');
		
		// a 'url' is required, validate one is there
		if (url.value.length < 1) {
			this.setState({ errorFound: true });
			url.parentNode.classList.add('has-error');
			url.parentNode.classList.add('has-feedback');
			return false;
		} else {
			if (this.state.errorFound) {
				this.setState({ errorFound: false });
				url.parentNode.classList.remove('has-error');
				url.parentNode.classList.remove('has-feedback');
			}
		}

		ShortUrlAPI.createShortUrl(jsonData, (err, item) => {
			if (!err) {
				this.setState({ newUrlDetails: [ item ] });
			}
		});
	}; // saveShortUrl
	/********************************************************************/
	/********************************************************************/

	// sets the current page content based on incoming page url
	currentContent = () => {
		if (this.state.currentPageUrl.indexOf('/manage') === 0) {
			return (
				<ManageBlock loginId={this.props.loginId} 
					host={this.props.host}
					dateFormat={this.props.dateFormat}
					shortUrls={this.state.shortUrls} 
					editUrl={this.state.editUrl}
					onToggleFavorite={this.addRemoveFavoriteEventHandler} 
					loadfavoritUrls={this.fetchFavorites}
					onRemoveShortUrl={this.deleteShortUrl}
					onToggleEdit={this.toggleEditShortUrl}
					onChangeField={this.handleFieldChange} />
			);
		}else if (this.state.currentPageUrl.indexOf('/favorites') === 0) {
			return (
				<FavoritesBlock loginId={this.props.loginId} 
					host={this.props.host}
					dateFormat={this.props.dateFormat}
					shortUrls={this.state.shortUrls} 
					onRemoveFavorite={this.removeFavorite} />
			);
		}  else if (this.state.currentPageUrl.indexOf('/top') === 0) {
			return (
				<TopBlock loginId={this.props.loginId} 
					host={this.props.host}
					dateFormat={this.props.dateFormat}
					shortUrls={this.state.shortUrls}
					onToggleFavorite={this.addRemoveFavoriteEventHandler} 
					loadfavoritUrls={this.fetchFavorites} />
			);
		} else {
			return (
				<ShortUrlForm loginId={this.props.loginId} 
					host={this.props.host}
					dateFormat={this.props.dateFormat}
					customUrlLinkVisible={this.state.customUrlLinkVisible}
					newUrlDetails={this.state.newUrlDetails}
					itemCallbacks={{
						onSave: this.saveShortUrl.bind(this),
						onToggleCustomFormBlock: this.toggleCustomUrlFormBlock
					}}
					errorFound={ this.state.errorFound }
					onNavClick={ this.setCurrentPage.bind(this) } />
			);
		}
	}; // currentContent

	render() {
		return (
			<section id='parent-wrapper'>
				<div id='wrap'>
					<Header ntlm={this.props.loginId} onNavClick={this.setCurrentPage} />

					<div className='container' id='main-body'>
						{ this.currentContent() }
					</div>
					<div id='take_a_tour_content'><a href='#' id='take_a_tour_link'><i className='fa fa-plane'></i>take a tour</a></div>
					
				</div>

				<div id='footer'>
					<footer>
						<Footer onNavClick={this.setCurrentPage} />
					</footer>
				</div>
			</section>
		);
	}
}

export default App;