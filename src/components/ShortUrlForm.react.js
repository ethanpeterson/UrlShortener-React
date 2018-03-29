import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NewShortUrl from './NewShortUrl.react';

/// main form for creating new short urls
class ShortUrlForm extends Component {
	static defaultProps = {
		customUrlLinkVisible: false,
		newUrlDetails: [],
		errorFound: false
	};

	static propTypes = {
		loginId: PropTypes.string,
		host: PropTypes.string.isRequired,
		dateFormat: PropTypes.string.isRequired,
		customUrlLinkVisible: PropTypes.bool,
		newUrlDetails: PropTypes.array,
		itemCallbacks: PropTypes.object.isRequired,
		errorFound: PropTypes.bool,
		onNavClick: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
	}

	// save the short url to the list of short urls for the current user
	saveShortUrl = (e) => {
		e.preventDefault();
		this.props.itemCallbacks.onSave({
			url: this.url.value,
			loginid: this.props.loginId,
			shortenedUrl: this.shortenedUrl.value
		});
	}; // saveShortUrl

	render() {
		let displayCustomShortUrl = {
				display: this.props.customUrlLinkVisible ? 'block' : 'none'
			},

			errorMessageStyle = {
				display: this.props.errorFound ? 'block' : 'none'
			};

		return (
			<div id="new_shortener_form">
				<form method="post" onSubmit={this.saveShortUrl}>
					<div className="row">
						<div className="col-sm-10 col-sm-offset-1">
							<h1 className="title">CustomURL <small>a URL shortener</small></h1>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-10 col-sm-offset-1">
							<div className="input-group">
								<input type="text" ref={(url) => this.url = url} id="url" name="url" className="form-control" placeholder="shorten a link by pasting it here" />
								<span className="input-group-btn">
									<button className="btn btn-primary" type="submit" id="create_short_url_button" title="Create a Short URL"><i className="fa fa-save"></i>&nbsp; create</button>
									<button className="btn btn-secondary" type="button" id="short_url_link" title="Create a Customized Short URL" onClick={this.props.itemCallbacks.onToggleCustomFormBlock}><i className="fa fa-pencil"></i>&nbsp; custom</button>
								</span>
							</div>
							<span className="help-block" style={errorMessageStyle}>A valid URL is required</span>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-3 col-sm-offset-7">
						</div>
					</div>
					<div className="row" id="custom_url_fields" style={displayCustomShortUrl}>
						<div className="col-sm-10 col-sm-offset-1">
							<input type="text" ref={(shortenedUrl) => this.shortenedUrl = shortenedUrl} id="shortenedUrl" className="form-control" placeholder="Enter a custom short Url here" />
							<span className="for_ie8_or_less_only">Enter a custom short Url here <i className="fa fa-arrow-up"></i></span>
						</div>
					</div>
				</form>
				{this.props.newUrlDetails.map((shortUrl) => {
					return <NewShortUrl shortUrl={shortUrl} key={shortUrl.id} onNavClick={this.props.onNavClick} host={this.props.host} dateFormat={this.props.dateFormat} />;
				})}
			</div>
		);
	} // render
} // ShortUrlForm

export default ShortUrlForm;
