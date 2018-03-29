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
