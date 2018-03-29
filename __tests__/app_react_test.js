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


//jest.autoMockOff();

import React from 'react';
//import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';

const AppReact = require('../src/components/App.react').default;

describe('App.React', () => {
	let props = {
			loginId: 'username',
			host: 'http://localhost:3000/',
			dateFormat: 'DD-MMM-YYYY hh:mm:ss A Z',
			shortUrls: 	[{
				_id: '52c6f6b61df6c82ccc5a1719',
				Url: 'https://www.somewebsite.com/',
				LoginId: 'username',
				ShortenedUrl: 'VF2FFA',
				TimesUsed: 5,
				PageTitle: 'Page Title',
				Created: '2014-01-03T17:43:18.974Z',
				id: '52c6f6b61df6c82ccc5a1719'
			}],
			entryPage: '/manage'
		},
		appBlock = TestUtils.renderIntoDocument(
			<AppReact loginId={props.loginId} shortUrls={props.shortUrls}
				host={props.host} dateFormat={props.dateFormat} entryPage={props.entryPage} />
		);
//	let favorites = TestUtils.renderIntoDocument(
//		<FavoritesBlock loginId='peterse' 
//					shortUrls={this.state.shortUrls} 
//					onRemoveFavorite={this.removeFavorite} />
//	);
	
	it('should match the return API url', () => {
		//expect(appBlock.getApiUrl('/manage')).toEqual('/api/manage');
	});
});