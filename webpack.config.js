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
