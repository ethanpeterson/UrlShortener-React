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