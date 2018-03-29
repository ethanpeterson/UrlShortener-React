

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