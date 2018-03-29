import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Footer extends Component {
	static propTypes = {
		onNavClick: PropTypes.func.isRequired
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
	};
	
	render () {
		return (
			<div className='navbar navbar-expand-lg navbar-footer' role='navigation' id='footer'>
				<button type='button' className='navbar-toggler' data-toggle='collapse' data-target='#navbar-collapse-2'>
					<span className='navbar-toggler-icon'></span>
				</button>
				<div className='collapse navbar-collapse' id='navbar-collapse-2'>
					<ul className='nav navbar-nav mr-auto'>
						<li className='nav-item'><a href='/' onClick={this.handleClick}><span className='fa fa-home'></span> Home</a></li>
						<li className='nav-item'><a href='/manage' onClick={this.handleClick}><span className='fa fa-link'></span> My Links</a></li>
						<li className='nav-item'><a href='/favorites' onClick={this.handleClick}><span className='fa fa-heart'></span> Favorites</a></li>
						<li className='nav-item'><a href='/top' onClick={this.handleClick}><span className='fa fa-fire'></span> Top URLs</a></li>
						<li className='nav-item'><a href='/help' onClick={this.handleClick}><span className='fa fa-book'></span> Help</a></li>
					</ul>

					<ul className='nav navbar-nav navbar-right'>
						<li><a href='/'>footer link</a></li>
					</ul>
				</div>
			</div>
		);
	} // render
} // Footer

export default Footer;