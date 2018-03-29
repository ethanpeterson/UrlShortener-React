import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ShortUrlItemBlock from './ShortUrlItemBlock.react';

/// display the list of current user owned short urls
class TopBlock extends Component {
	static defaultProps = {
		shortUrls: []
	};

	static propTypes = {
		loginId: PropTypes.string.isRequired,
		host: PropTypes.string.isRequired,
		dateFormat: PropTypes.string.isRequired,
		shortUrls: PropTypes.array.isRequired,
		onToggleFavorite: PropTypes.func.isRequired,
		loadfavoritUrls: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.fetchFavorites();
	}

	// get a list of favorites the current user has saved as they relate to the list of short urls
	fetchFavorites = () => {
		let links = document.querySelectorAll('a[data-id]');

		this.props.loadfavoritUrls((favorites) => {
			let favs = [];
			
			for (let node of links) {
				for (let x = 0; x < favorites.length; x++) {
					if (String(favorites[x]._id) === String(node.dataset.id)) {
						favs.push(node);
						break;
					}
				}
			}
			
			favs.map(fav => {
				fav.firstChild.classList.remove('fa-heart-o');
				fav.firstChild.classList.add('fa-heart');
			});
		});
	}; // fetchFavorites

	// toggle the current link as a favorite for the current user or not
	addRemoveFavoriteEventHandler = (e) => {
		e.preventDefault();
		
		let icon = e.target;
			
		this.props.onToggleFavorite(icon);
	}; // addRemoveFavoriteEventHandler

	render() {
		return (
			<div>
				<div className="row">
					<div className="col-md-6"><h3>Short Url</h3></div>
					<div className="col-xs-2 col-sm-1"><h3>Used</h3></div>
				</div>

				<div className="url-list">
					<div className="url-list-item"></div>
					{this.props.shortUrls.map((shortUrl) => 
						<ShortUrlItemBlock
							item={shortUrl}
							host={this.props.host}
							dateFormat={this.props.dateFormat}
							key={shortUrl._id}
							addRemoveFavorite={this.addRemoveFavoriteEventHandler}
							displayMode='view'
							screen='top' />
					)}
				</div>
			</div>
		);
	} // render
} // TopBlock

export default TopBlock;
