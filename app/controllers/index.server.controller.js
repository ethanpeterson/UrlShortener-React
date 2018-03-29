//require('babel-polyfill');

import mongoose from 'mongoose';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Url from 'url';
import App from '../../src/components/App.react';

var ShortUrl = mongoose.model('ShortUrl'),
	FavoriteUrl = mongoose.model('favoriteUrl'),

	Config = require('../../config/config');

// A utility function to safely escape JSON for embedding in a <script> tag
function safeStringify(obj) {
	return JSON.stringify(obj)
		.replace(/<\/(script)/ig, '<\\/$1')
		.replace(/<!--/g, '<\\!--')
		.replace(/\u2028/g, '\\u2028') // Only necessary if interpreting as JS, which we do
		.replace(/\u2029/g, '\\u2029') // Ditto
	;
} // safeStringify

/**
 * Display the html home page
 *
 * @param {} req  
 * @param {} res 
 *
 * @returns {html} html page
 */
exports.render = function (req, res) { // i.e. GET /
	let url_parts = Url.parse(req.url),
		loggedInUser = res.locals.ntlm.UserName, //req.user ? req.user.fullName : ''
		peekIntoUserId = req.params.userId,
		shortUrls = [],
		limit = 20,
		props = {
			loginId: loggedInUser,
			entryPage: url_parts.pathname,
			host: global.host,
			peekIntoUserId: peekIntoUserId,
			dateFormat: Config.dateFormat
		},
		renderPage = (pageMarkup, props) => {
			res.render('index', {
				title: 'Internal URL Shortener',
				props: 'var APP_PROPS = ' + safeStringify(props) + ';',
				markup: pageMarkup,
				userFullName: props.loginId
			});
		};
	
	if (url_parts.pathname.indexOf('/manage') === 0) {
		ShortUrl.find({ LoginId : peekIntoUserId || loggedInUser })
			.exec(function (err, shorturls) {
				if (err) throw err;

				shortUrls = [shorturls.length];

				FavoriteUrl.getFavs(peekIntoUserId || loggedInUser, 
					function(err, favorites) {
						if (err) throw err;

						for (var j = 0; j < shorturls.length; j++) {
							shortUrls[j] = shorturls[j];
							for (var i = 0; i < favorites.length; i++) {
								if (favorites[i].id === shortUrls[j].id) {
									shortUrls[j] = JSON.parse(JSON.stringify(shorturls[j])); // simple copy of the object, so we can add the following property 'myFavorite'
									shortUrls[j].myFavorite = true;
									break;
								}
							}
						}

						props.shortUrls = shortUrls;

						let pageMarkup = ReactDOM.renderToString(<App loginId={props.loginId} entryPage={props.entryPage} shortUrls={props.shortUrls} host={props.host} peekIntoUserId={props.peekIntoUserId} dateFormat={props.dateFormat} />);

						renderPage(pageMarkup, props);
					});
			});
	} else if (url_parts.pathname.indexOf('/favorite') === 0) {
		FavoriteUrl.getFavs(peekIntoUserId || loggedInUser, function(err, favorites) {
			if (err) throw err;
			
			props.shortUrls = favorites;
			
			let pageMarkup = ReactDOM.renderToString(<App loginId={props.loginId} entryPage={props.entryPage} shortUrls={props.shortUrls} host={props.host} peekIntoUserId={props.peekIntoUserId} dateFormat={props.dateFormat} />);
			
			renderPage(pageMarkup, props);
		});
	} else if (url_parts.pathname.indexOf('/top') === 0) {
		ShortUrl.find({ TimesUsed : { $gt: 0 } })
			.limit(limit)
			.sort({ TimesUsed : -1 })
			.exec((err, shortUrls) => {
				if (err) throw err;
			
				props.shortUrls = shortUrls;
			
				let pageMarkup = ReactDOM.renderToString(<App loginId={props.loginId} entryPage={props.entryPage} shortUrls={props.shortUrls} host={props.host} peekIntoUserId={props.peekIntoUserId} dateFormat={props.dateFormat} />);
				
				renderPage(pageMarkup, props);
			});
	} else {
		let pageMarkup = ReactDOM.renderToString(<App loginId={props.loginId} entryPage={props.entryPage} shortUrls={[]}  host={props.host} peekIntoUserId={props.peekIntoUserId} dateFormat={props.dateFormat} />);

		renderPage(pageMarkup, props);
	}
};

/**
 * Get a ShortUrl object by a specific Code // i.e. GET /api/4S82N0
 *
 * @param {} req  
 * @param {} res 
 * @param {} next 
 *
 * @returns {html} html page
 */
//exports.findShortUrl = function (req, res) { 
//	let acceptJson = req.get('accept') && req.get('accept').indexOf('application/json') === 0;
//	
//	// @code - short code (required)
//	ShortUrl.findOne({ ShortenedUrl : req.params.code }, 
//		(err, shorturl) => {
//			if (err) {
//				console.error(err);
//				if (acceptJson) {
//					return res.status(400).json({ status: 400, message: err.message });
//				} else {
//					return res.status(400).render('oops', { error: err });
//				}
//			}
//
//			if (shorturl) {
//				res.status(200).json({ status: 200, message: 'OK', data: shorturl });
//			} else {
//				res.status(404).json({ status: 404, message: 'Not found' }); // empty object because we didn't find anything
//			}
//		})
//		.catch(err => {
//			console.error(err);
//		});
//};
