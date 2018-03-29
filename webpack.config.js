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

var webpack = require('webpack'),
	ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: { bundle: [ './app.js', './build/assets/css/app.scss' ] },
	output: {
		path: __dirname + '/public/lib/js',
		filename: '[name].js'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			}
			,{
				test: /\.scss$/,
				//include: /build[\\\/]assets[\\\/]css/,
				exclude: /node_modules/,
				//loader: ExtractTextPlugin.extract('css!sass')
				loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: [ 'css-loader', 'sass-loader' ] })
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('../css/[name].css', {
			allChunks: true
		})
		//new webpack.optimize.DedupePlugin()
		//new webpack.optimize.UglifyJsPlugin()
	]
};
