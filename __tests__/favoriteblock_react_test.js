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
//import ShallowRenderer from 'react-test-renderer/shallow';
//import TestRenderer from 'react-test-renderer';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
//import Mongoose from 'mongoose';

//let Schema = Mongoose.Schema;

const FavoriteBlock = require('../src/components/FavoriteBlock.react').default;

describe('FavoriteBlock.React', () => {
	let removeFavoriteOutput = '',
		props = {
			favorite: 	{
				_id: '52c6f6b61df6c82ccc5a1719',
				Url: 'https://www.somewebsite.com',
				LoginId: 'username',
				ShortenedUrl: 'VF2FFA',
				TimesUsed: 5,
				PageTitle: 'Page Title',
				Created: '2014-01-03T17:43:18.974Z',
				id: '52c6f6b61df6c82ccc5a1719'
				//				shortUrlId: Schema.Types.ObjectId('52c6f6b61df6c82ccc5a1719'),
				//				LoginId: 'username',
				//				Created: new Date('2014-01-17T22:57:07.555Z')
			},
			onRemove: (favorite) => {
				removeFavoriteOutput = favorite;
			},
			host: 'http://localhost:3000/',
			dateFormat: 'DD-MMM-YYYY hh:mm:ss A Z'
		},
		favoriteBlock = TestUtils.renderIntoDocument(
			<FavoriteBlock favorite={props.favorite} onRemove={props.onRemove}
				host={props.host} dateFormat={props.dateFormat} />
		);
	
	//const shallowRenderer = new ShallowRenderer();
	
	//shallowRenderer.render(<FavoriteBlock favorite={props.favorite} onRemove={props.onRemove}
	//	host={props.host} dateFormat={props.dateFormat} />);
	
	//const component = shallowRenderer.getRenderOutput();
	
	//	const testRenderer = TestRenderer.create(<FavoriteBlock favorite={props.favorite} onRemove={props.onRemove}
	//		host={props.host} dateFormat={props.dateFormat} />),
	//		component = testRenderer.toJSON(),
	//		testInstance = testRenderer.root;
	
	const component = shallow(<FavoriteBlock favorite={props.favorite} onRemove={props.onRemove}
		host={props.host} dateFormat={props.dateFormat} />);
	
	it('should test the hostDomain is built properly', () => {
		let displayUrl = favoriteBlock.hostDomain(props.favorite.ShortenedUrl);
		
		expect(displayUrl).toEqual(props.host + props.favorite.ShortenedUrl);
	});
	
	it('should test remove favorite', () => {
		console.log(removeFavoriteOutput);
		favoriteBlock.removeFavoriteHandler();
		console.log(removeFavoriteOutput);
		console.log(props.favorite);
		expect(removeFavoriteOutput).toEqual(props.favorite);
	});
	
	//console.log(component.render());
	
//	it('knows that 2 and 2 make 4', () => { 
//		expect(2 + 2).toBe(4); 
//	});
});