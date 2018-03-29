

//jest.autoMockOff();

import React from 'react';
//import ReactDOM from 'react-dom';
import TestUtils from 'react-dom/test-utils';
//import ShallowRenderer from 'react-test-renderer/shallow';
//import TestRenderer from 'react-test-renderer';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

const TopBlock = require('../src/components/Top.react').default;

describe('Top.React', () => {
	let favoriteUrls = [],
		props = {
			loginId: 'username',
			host: 'http://localhost:3000/',
			dateFormat: 'DD-MMM-YYYY hh:mm:ss A Z',
			shortUrls: 	[{
				_id: '52c6f6b61df6c82ccc5a1719',
				Url: 'https://www.somewebsite.com',
				LoginId: 'username',
				ShortenedUrl: 'VF2FFA',
				TimesUsed: 5,
				PageTitle: 'Page Title',
				Created: '2014-01-03T17:43:18.974Z',
				id: '52c6f6b61df6c82ccc5a1719'
			}],
			fetchFavorites: (callback) => {
				favoriteUrls.push({
					_id: '52c6f6b61df6c82ccc5a1719',
					Url: 'https://www.somewebsite.com',
					LoginId: 'username',
					ShortenedUrl: 'VF2FFA',
					TimesUsed: 5,
					PageTitle: 'Page Title',
					Created: '2014-01-03T17:43:18.974Z',
					id: '52c6f6b61df6c82ccc5a1719'
				});
				favoriteUrls.push({ 
					_id : '56cb6f9d3df61d40215408e3', 
					Url : 'http://stackoverflow.com/questions/32830190/angularjs-toggle-div-visibility', 
					LoginId : 'username', 
					ShortenedUrl : 'BMLP24', 
					TimesUsed : 1, 
					Created : '2016-02-22T20:29:17.242+0000', 
					PageTitle : '??????????', 
					ExpireDate : 1614025757242.0
				});
				callback(favoriteUrls);
			},
			addRemoveFavorite: (elem) => {
				console.log(elem);
				let id = elem.parentNode.dataset.id;
			}
		},
		topBlock = TestUtils.renderIntoDocument(
			<TopBlock loginId={props.loginId} shortUrls={props.shortUrls} onToggleFavorite={props.addRemoveFavorite}
				host={props.host} dateFormat={props.dateFormat} loadfavoritUrls={props.fetchFavorites} />
		);
	
	//const shallowRenderer = new ShallowRenderer();
	
	//shallowRenderer.render(<TopBlock favorite={props.favorite} onRemove={props.onRemove}
	//	host={props.host} dateFormat={props.dateFormat} />);
	
	//const component = shallowRenderer.getRenderOutput();
	
	//	const testRenderer = TestRenderer.create(<TopBlock favorite={props.favorite} onRemove={props.onRemove}
	//		host={props.host} dateFormat={props.dateFormat} />),
	//		component = testRenderer.toJSON(),
	//		testInstance = testRenderer.root;
	
//	const component = shallow(<TopBlock loginId={props.loginId} shortUrls={props.shortUrls} onRemoveFavorite={props.onRemove}
//		host={props.host} dateFormat={props.dateFormat} onToggleFavorite={props.addRemoveFavorite} loadfavoritUrls={props.fetchFavorites} />);
	
	it('should get a list of favorites', () => {
		//topBlock.fetchFavorites();
		//console.log(favoriteUrls);
		expect(favoriteUrls.length).toEqual(2);
	});
	
	it('should', () => {
		topBlock.addRemoveFavoriteEventHandler();
	});
	
	//console.log(component.render());
	
//	it('knows that 2 and 2 make 4', () => { 
//		expect(2 + 2).toBe(4); 
//	});
});