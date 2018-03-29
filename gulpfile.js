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

var gulp = require('gulp')
    gutil = require('gulp-util')
	uglify = require('gulp-uglify'),
	watch = require('gulp-watch'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify')
	del = require('del');

var assets = {
	site : [
		'build/assets/js/**/*.js'
	],
	vendor : [
		'build/bower_components/jquery/dist/jquery.js',
		'build/bower_components/bootstrap/dist/js/bootstrap.js'
	],
	sass : [
		'build/assets/css/**/*.scss'
	]
};

 // sass task
gulp.task('sass', function () {
	gulp.src(assets.sass)
	.pipe(sass({ 
		noCache: true,
		style: "expanded",
		lineNumbers: true,
		loadPath: './assets/styles/*'
	}))
	.pipe(gulp.dest('./assets/styles'))
	.pipe(notify({
		message: "You just got super Sassy!"
	}));
}); 

// uglify task
 gulp.task('js', function() {
	 // main app js file 
	 gulp.src(assets.site)
	 .pipe(uglify())
	 .pipe(concat('site.min.js'))
	 .pipe(gulp.dest('public/lib/js/'));
	 
	 // create 1 vendor.js file from all vendor plugin code 
	 gulp.src(assets.vendor)
	 .pipe(uglify())
	 .pipe(concat("vendor.js"))
	 .pipe(gulp.dest('public/lib/js/'))
	 .pipe( notify({
		 message: "Javascript is now ugly!"})
	 );
 }); 
 
gulp.task('clean', function(cb) {
	del(['public/lib/js/*.*'], cb);
});
 
 gulp.task('watch', function() {
	 // watch scss files
	 gulp.watch('./assets/styles/**/*.scss', function() {
		 gulp.run('sass');
	 });

	 gulp.watch('./assets/js/**/*.js', function() {
		 gulp.run('js');
	 });
 }); 
 
 gulp.task('default', ['sass', 'js', 'watch']);
 