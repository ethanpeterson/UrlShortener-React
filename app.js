//import 'babel-polyfill';
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './src/components/App.react';

if (document.getElementById('root'))  {
	ReactDOM.hydrate(
		<App loginId={window.APP_PROPS.loginId} entryPage={window.APP_PROPS.entryPage} shortUrls={window.APP_PROPS.shortUrls} host={window.APP_PROPS.host} dateFormat={window.APP_PROPS.dateFormat} />,
		document.getElementById('root')
	);
}

$().ready(function () {

});
