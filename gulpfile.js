/*!
 * gulp
 * $ npm install gulp-sass gulp-autoprefixer gulp-cssnano gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-cache browser-sync del --save-dev
 * https://markgoodyear.com/2014/01/getting-started-with-gulp/
 */

/*
 * Qx's gulpfile
 *
 * gulp: build, serve
 * gulp build: build-prod or build-dev
 * gulp build-prod: clean, html styles scripts images
 * gulp build-dev: html scripts images
 * gulp serve: watch and Browsersync
 */

// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    del = require('del')
    browserSync = require('browser-sync').create();

// gulp -> build, serve
// gulp build ->
// -> gulp build-prod
// -> gulp build-dev
// gulp serve -> watch BrowserSync

// Default task
gulp.task('default', ['build'], function() {
  gulp.start('serve');
});

// Build
gulp.task('build', ['build-prod']);

// Build production
gulp.task('build-prod', ['clean'], function() {
  gulp.start('html', 'styles', 'scripts', 'images', 'fonts');
});

// Build test
gulp.task('build-dev', function() {
  gulp.start('html', 'styles', 'scripts', 'images', 'fonts');
});

// Serve
gulp.task('serve', function() {

  // Watch src files in src/
  gulp.watch('src/scss/*.scss', ['styles']);
  gulp.watch('src/js/*.js', ['scripts']);
  gulp.watch('src/img/*', ['images']);

  // Create BrowserSync server
  browserSync.init({
      server: "./app"
  });

  // Watch any files in app/, reload on change
  gulp.watch("app/css/*.css", ['styles']);
  gulp.watch("app/*.html").on('change', browserSync.reload);
});

// Clean
gulp.task('clean', function() {
  return del(['app/css', 'app/js', 'app/img', 'app/fonts', 'app/*.html']);
});

// Html
gulp.task('html', function() {
  return gulp.src("src/*.html")
      .pipe(gulp.dest('app'));
});

// Fonts
gulp.task('fonts', function() {
  return gulp.src("src/fonts/*")
      .pipe(gulp.dest('app/fonts'));
});

// Styles
gulp.task('styles', ['css'], function() {
  return gulp.src("src/scss/*.scss")
      .pipe(sass())
      .pipe(autoprefixer('last 2 version'))
      .pipe(gulp.dest('app/css'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(cssnano())
      .pipe(gulp.dest('app/css'))
      .pipe(browserSync.stream());
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('src/js/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('app/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.stream());
});

// Images
gulp.task('images', function() {
  return gulp.src('src/img/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('app/img'))
    .pipe(browserSync.stream());
});

// Vendor css
gulp.task('css', function() {
  return gulp.src("src/css/*.css")
      .pipe(gulp.dest('app/css'));
});
