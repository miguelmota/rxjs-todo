'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const concat = require('gulp-concat');

/**
 * @desc Compile browser script files.
 */
gulp.task('scripts', function() {
  return browserify({
    entries: './app/public/scripts/index.jsx',
    extensions: ['.jsx'],
    debug: true
  })
  .transform('babelify')
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('./app/public/dist'));
});

/**
 * @desc Start browser sync.
 */
gulp.task('browser', function() {
  browserSync.init({
    server: {
      baseDir: './app/public'
    }
  });
});

/**
 * @desc Compile SASS.
 */
gulp.task('sass', function() {
  return gulp.src('./app/public/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/public/dist'));
});

/**
 * @desc Move files for build.
 */
gulp.task('move', function() {
  gulp.src([
    './app/public/assets/themes/default/assets/fonts/*'
  ], { base: './app/public/assets/themes/default/assets/fonts/' })
  .pipe(gulp.dest('./app/public/dist/themes/default/assets/fonts/'));
});

/**
 * @desc Watch and compile files.
 */
gulp.task('watch', function() {
  gulp.watch('./app/public/scripts/**/*', ['scripts']);
  gulp.watch('./app/public/styles/**/*.scss', ['sass']);
});

/**
 * @desc Build task.
 */
gulp.task('build', ['scripts', 'sass', 'move']);

/**
 * @desc Default task.
 */
gulp.task('default', ['watch']);
