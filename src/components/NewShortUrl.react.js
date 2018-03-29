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
import Moment from 'moment';

/// displays the newly created short url; only called from ShortUrlForm Component
class NewShortUrl extends Component {
	static defaultProps = {
		shortUrl: {
			ShortenedUrl: '',
			LoginId: '',
			Created: Date.now
		}
	};

	static propTypes = {
		shortUrl: PropTypes.object,
		onNavClick: PropTypes.func.isRequired,
		host: PropTypes.string.isRequired,
		dateFormat: PropTypes.string.isRequired
	};

	constructor(props) {
		super(props);
	}

	handleClick = (e) => {
		if (e) {
			e.preventDefault();

			let url = e.target.getAttribute('href');
			
			this.props.onNavClick(url);
		}
		return false;
	}; // handleClick

	// build the fully qualified URL
	hostDomain = (code) => {
		return this.props.host + code;
	}; // hostDomain

	render() {
		return (
			<div id="created_shortener_form">
				<div className="row">
					<div className="col-sm-6 col-sm-offset-3">
						<span className="shortened-title">Copy and paste this URL into your browser or email</span>
					</div>
				</div>
				<div className="row">
					<div className="col-sm-6 col-sm-offset-3">
						<a href={this.hostDomain(this.props.shortUrl.ShortenedUrl)} className="shortened-url lead">{this.hostDomain(this.props.shortUrl.ShortenedUrl)}</a>
					</div>
				</div>

				<div className="row">
					<div className="col-sm-6 col-sm-offset-3">
						<a href="/manage" onClick={this.handleClick} className="glyphicon glyphicon-link">Manage</a>
					</div>
				</div>

				<div className="row">
					<div className="col-sm-6 col-sm-offset-3 small-details">
						Created by <a href={`/manage/${this.props.shortUrl.LoginId}`} onClick={this.handleClick}>{this.props.shortUrl.LoginId}</a> on <time className="datetime">{Moment(this.props.shortUrl.Created).format(this.props.dateFormat)}</time>
					</div>
				</div>
			</div>
		);
	} // render
} // NewShortUrl

export default NewShortUrl;