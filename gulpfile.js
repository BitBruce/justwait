/*!
 * gulp
 * $ npm install gulp-util gulp-sass gulp-autoprefixer gulp-cssnano gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-cache browser-sync del --save-dev
 * Inspired by https://markgoodyear.com/2014/01/getting-started-with-gulp/
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
    gutil = require('gulp-util'), // Use for logging
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

  // Watch src files
  gulp.watch('src/scss/*.scss', ['styles']);
  gulp.watch("src/css/*.css", ['styles']);
  gulp.watch('src/js/*.js', ['scripts']);
  gulp.watch('src/img/*', ['images']);
  gulp.watch('src/html/*', ['html']);

  // Create BrowserSync server
  browserSync.init({
      server: {
        baseDir: "./app",
        index: "html/index.html"
      },
      port: 6112 //War3
  });

  // Watch any files in app/, reload on change
  gulp.watch("app/*").on('change', browserSync.reload);
});

// Clean
gulp.task('clean', function() {
  return del(['app']);
});

// Html
gulp.task('html', function() {
  return gulp.src("src/html/*.html")
      .pipe(gulp.dest('app/html'))
      .pipe(browserSync.stream());
});

// Fonts
gulp.task('fonts', function() {
  return gulp.src("src/fonts/*")
      .pipe(gulp.dest('app/fonts'))
      .pipe(browserSync.stream());
});

// Styles
gulp.task('styles', function() {
  // Vendor css
  var stream = gulp.src("src/css/*.css")
      .pipe(rename({ suffix: '.min' }))
      .pipe(cssnano())
      .pipe(gulp.dest('app/css'));

  stream.on('end', function() {
    // My scss
    return gulp.src("src/scss/*.scss")
        .pipe(sass())
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('app/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream());
  });

  return;
});

// Scripts
gulp.task('scripts', function() {
  // Vendor js
  var stream = gulp.src("src/js/vendor/*")
      .pipe(gulp.dest('app/js'));

  stream.on('end', function() {
    // My js
    return gulp.src('src/js/*.js')
      .pipe(concat('main.js'))
      .pipe(gulp.dest('app/js'))
      .pipe(rename({ suffix: '.min' }))
      .pipe(uglify())
      .pipe(gulp.dest('app/js'))
      .pipe(browserSync.stream());
  });

  return;
});

// Images
gulp.task('images', function() {
  return gulp.src('src/img/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('app/img'))
    .pipe(browserSync.stream());
});

/*
// Vendor css (called just before Styles)
gulp.task('vendorcss', function() {
  return gulp.src("src/css/*.css")
      .pipe(rename({ suffix: '.min' }))
      .pipe(cssnano())
      .pipe(gulp.dest('app/css'));
});

// Vendor js (called just before Scripts)
gulp.task('vendorjs', function() {
  return gulp.src("src/js/vendor/*")
      .pipe(gulp.dest('app/js'));
});
*/
