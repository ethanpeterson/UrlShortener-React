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
import FavoriteBlock from './FavoriteBlock.react';

class FavoritesBlock extends Component {
	static defaultProps = {
		shortUrls: []
	};

	static propTypes = {
		loginId: PropTypes.string.isRequired,
		host: PropTypes.string.isRequired,
		dateFormat: PropTypes.string.isRequired,
		shortUrls: PropTypes.arrayOf(PropTypes.object).isRequired,
		onRemoveFavorite: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
	}

	// removes the current favorite object from the list of the current user's favorites
	handleRemoveFavorite = (favorite) => {
		this.props.onRemoveFavorite(favorite);
	}; // handleRemoveFavorite

	render() {
		return (
			<div>
				<h2>
					{this.props.loginId}&apos;s Short URLs
					<span className="small">{this.props.shortUrls.length}</span>
				</h2>
				<div className="row">
					<div className="col-md-6"><h3>Short Url</h3></div>
					<div className="col-xs-4 col-sm-1"><h3>Used</h3></div>
					<div className="col-xs-6 col-sm-4"><h3>Created</h3></div>
					<div className="col-xs-2 col-sm-1"><h3></h3></div>
				</div>
				<div className="url-list">
					<div className="url-list-item"></div>
					{this.props.shortUrls.map((favorite) => 
						<FavoriteBlock favorite={favorite} key={favorite._id} onRemove={this.handleRemoveFavorite} host={this.props.host} dateFormat={this.props.dateFormat} />
					)}
				</div>
			</div>
		);
	} // render
} // FavoritesBlock

export default FavoritesBlock;