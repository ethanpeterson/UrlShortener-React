import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';

/// display the formatted short url
class ShortUrlItemBlock extends Component {
	static defaultProps = {
		displayMode: 'manage'
	};

	static propTypes = {
		item: PropTypes.object.isRequired,
		addRemoveFavorite: PropTypes.func,
		onRemoveShortUrl: PropTypes.func,
		onToggleEdit: PropTypes.func,
		onChangeField: PropTypes.func,
		displayMode: PropTypes.oneOf(['view', 'edit']),
		screen: PropTypes.string,
		host: PropTypes.string.isRequired,
		dateFormat: PropTypes.string.isRequired
	};

	constructor(props) {
		super(props);
	}

	// handles the removal of the short url code from the current user's list
	removeShortUrl = (e) => {
		if (e) e.preventDefault();
		this.props.onRemoveShortUrl(this.props.item);
	}; // removeShortUrl

	toggleEdit = () => {
		console.log(this.props.displayMode);
		this.props.onToggleEdit(this.props.displayMode === 'view' ? this.props.item._id : null,
			this.props.displayMode === 'edit' ? this.props.item : null);
	}; // toggleEdit
	
	handleChange = (e) => {
		this.props.onChangeField('PageTitle', e.target.value);
	}; // handleChange

	// build the fully qualified URL
	hostDomain = (code) => {
		return this.props.host + code;
	}; // hostDomain

	render() {
		if (this.props.screen === 'top') {
			return (
				<div className="url-list-item">
					<div className="row cushion">
						<div className="col-md-6">
							<nobr>
								<a href="#" data-id={this.props.item._id} onClick={this.props.addRemoveFavorite}>
									<i className="fa fa-heart-o"></i>
								</a>
								<a href={this.hostDomain(this.props.item.ShortenedUrl)} title={`${this.props.item.PageTitle} ${this.props.item.Url}`} data-toggle="tooltip" className="lead shortUrlFor">{this.hostDomain(this.props.item.ShortenedUrl)}</a>
							</nobr>
						</div>
						<div className="col-xs-2 col-sm-1" title={`this link has been used ${this.props.item.TimesUsed} times`}>{this.props.item.TimesUsed} x</div>
					</div>
					<div className="row">
						<div className="col-md-12">
							<div className="small lightGray" id={this.props.item._id}>
								<span>{this.props.item.PageTitle}</span>
								<span className="hidden-xs hidden-sm"> - {this.props.item.Url}</span>
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			let expireDate = this.props.item.ExpireDate ? Moment(this.props.item.ExpireDate).format(this.props.dateFormat) : '-',
				urlPageTitle = <span onClick={this.toggleEdit}>{this.props.item.PageTitle}</span>;

			if (this.props.displayMode === 'edit') {
				urlPageTitle = <form className='form-inline'>
					<div className='form-group'>
						<input type='text' name='PageTitle' className='form-control mx-sm-3' onBlur={this.toggleEdit} value={this.props.item.PageTitle} onChange={this.handleChange} />
					</div>
				</form>;
			}

			return (
				<div className="url-list-item" data-isowner="isOwner(shortUrl._id)">
					<div className="row">
						<div className="col-md-6">
							<nobr>
								<a href="#" data-id={this.props.item._id} onClick={this.props.addRemoveFavorite}>
									<i className="fa fa-heart-o"></i>
								</a>
								<a className="lead shortUrlFor" href={this.hostDomain(this.props.item.ShortenedUrl)} title="BuildLinkTitle(shortUrl)" data-toggle="tooltip">{this.hostDomain(this.props.item.ShortenedUrl)}</a>
							</nobr>
						</div>
						<div className="col-xs-4 col-sm-1" title={`this link has been used ${this.props.item.TimesUsed} times`}>{this.props.item.TimesUsed} x</div>
						<div className="col-xs-6 col-sm-4"><span className="datetime" title="Short URL create date">{Moment(this.props.item.Created).format(this.props.dateFormat)}</span><br /><span className="hidden-xs hidden-sm smaller-details" title="the date this url expires">(expires: <span className="datetime">{expireDate}</span>)</span></div>
						<div className="col-xs-2 col-sm-1">
							<a href="#" onClick={this.removeShortUrl} className="remove-url" title="delete this link"><i className="fa fa-times"></i></a>
						</div>
					</div>
					<div className="row">
						<div className="col-md-12">
							<div className="small lightGray url-title" title={`The title or name of the original URL that the short URL points to ${this.props.item.Url}`} id={this.props.item._id}>
								{ urlPageTitle }
								<span className="hidden-xs hidden-sm"> - {this.props.item.Url}</span>
							</div>
						</div>
					</div>
				</div>
			);
		}
	} // render
} // ShortUrlItemBlock

export default ShortUrlItemBlock;