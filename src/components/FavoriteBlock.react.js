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

class FavoriteBlock extends Component {
	static defaultProps = {};

	static propTypes = {
		favorite: PropTypes.object.isRequired,
		onRemove: PropTypes.func.isRequired,
		host: PropTypes.string.isRequired,
		dateFormat: PropTypes.string.isRequired
	};

	constructor(props) {
		super(props);
	}

	// removes the current favorite object from the list of the current user's favorites
	removeFavoriteHandler = (e) => {
		if (e) e.preventDefault();
		this.props.onRemove(this.props.favorite);
	}; // removeFavoriteHandler

	// build the fully qualified URL
	hostDomain = (code) => {
		return this.props.host + code;
	}; // hostDomain

	render() {
		let expireDate = this.props.favorite.ExpireDate ? Moment(this.props.favorite.ExpireDate).format(this.props.dateFormat) : '-',
			title = this.props.favorite.PageTitle ? this.props.favorite.PageTitle : this.props.favorite.Url;

		return (
			<div className="url-list-item">
				<div className="row">
					<div className="col-md-6">
						<nobr>
							<a href="#" onClick={this.removeFavoriteHandler}>
								<i className="fa fa-heart"></i>
							</a>
							<a className="lead shortUrlFor" href={this.hostDomain(this.props.favorite.ShortenedUrl)} title="" data-toggle="tooltip">{this.hostDomain(this.props.favorite.ShortenedUrl)}</a>
						</nobr>
					</div>
					<div className="col-xs-4 col-sm-1" title={`this link has been used ${this.props.favorite.TimesUsed} times`}>{this.props.favorite.TimesUsed} x</div>
					<div className="col-xs-6 col-sm-4"><span className="datetime" title="Short URL create date">{Moment(this.props.favorite.Created).format(this.props.dateFormat)}</span><br /><span className="hidden-xs hidden-sm smaller-details" title="the date this url expires">(expires: <span className="datetime">{expireDate}</span>)</span></div>
					<div className="col-xs-2 col-sm-1">
						<a href="#" className="remove-url" title="delete this link" onClick={this.removeFavoriteHandler}><i className="fa fa-times"></i></a>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12">
						<div className="small lightGray url-title" title={`The title or name of the original URL that the short URL points to ${this.props.favorite.Url}`} id={this.props.favorite._id}><span>{title}</span><span className="hidden-xs hidden-sm"> - {this.props.favorite.Url}</span></div>
					</div>
				</div>
			</div>
		);
	} // render
} // FavoriteBlock

export default FavoriteBlock;