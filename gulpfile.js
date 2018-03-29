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
 