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