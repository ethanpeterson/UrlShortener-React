import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class Header extends Component {
	static propTypes = {
		ntlm: PropTypes.string,
		onNavClick: PropTypes.func.isRequired,
		currentPage: PropTypes.string
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
	
	render () {
		let profilePicUrl;
		
		if (this.props.ntlm) {
			let picUrl = `${this.props.ntlm}_LThumb.jpg`;
			
			profilePicUrl = (
				<img src={picUrl} width='86' height='144' className='profile-image' alt={this.props.ntlm} title={this.props.ntlm} />
			);	
		}
		
		return (
			<header>
				<nav>
					<div className='navbar navbar-expand-lg navbar-default' role='navigation'>
						
						<button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbar-collapse-1' aria-controls='navbar-collapse-1' aria-expanded='false' aria-label='Toggle navigation'>
							<span className='navbar-toggler-icon'></span>
						</button>
						<a className='navbar-brand' href='/'>
							<img src='/images/Logo_White.png' height='25' width='150' alt='Url Shortener' />
						</a>
						
						<div className='collapse navbar-collapse' id='navbar-collapse-1'>
							<ul className='navbar-nav mr-auto'>
								<li className='nav-item'>
									<a href='/' onClick={this.handleClick}><span className='fa fa-home' aria-hidden='true'></span> Home</a>
								</li>
								<li className='nav-item'>
									<a href='/manage' onClick={this.handleClick}><span className='fa fa-link' aria-hidden='true'></span> My URLs</a>
								</li>
								<li className='nav-item'>
									<a href='/favorites' onClick={this.handleClick}><span className='fa fa-heart' aria-hidden='true'></span> Favorites</a>
								</li>
								<li className='nav-item'>
									<a href='/top' onClick={this.handleClick}><span className='fa fa-fire' aria-hidden='true'></span> Top URLs</a>
								</li>
							</ul>
							<ul className='nav navbar-nav navbar-right'>
								<li className='nav-item'>
									<div className='dropdown'>
										<a href='#' className='dropdown-toggle' id='dropdownMenuLink' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
											<span className='fa fa-user'></span>&nbsp;
											<span id='username'>{this.props.ntlm}</span>
											<span className='caret'></span>
										</a>
										<div className='dropdown-menu dropdown-menu-right' role='menu' aria-labelledby='dropdownMenuLink'>
											<div className='dropdown-item text-center profile-image'>
												<div className='profile-image-item'>
													{ profilePicUrl }
												</div>
												<a href='#' className='logout-link'>Sign Out - {this.props.ntlm}</a>
											</div>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</nav>
			</header>
		);
	} // render
} // Header

export default Header;