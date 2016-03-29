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
    entries: 'client/scripts/index.jsx',
    extensions: ['.jsx'],
    debug: true
  })
  .transform('babelify')
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('client/dist'));
});

/**
 * @desc Start browser sync.
 */
gulp.task('browser', function() {
  browserSync.init({
    server: {
      baseDir: './client'
    }
  });
});

/**
 * @desc Compile SASS.
 */
gulp.task('sass', function() {
  return gulp.src('./client/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./client/dist'));
});

/**
 * @desc Move files for build.
 */
gulp.task('move', function() {
  gulp.src([
    './client/assets/themes/default/assets/fonts/*'
  ], { base: './client/assets/themes/default/assets/fonts/' })
  .pipe(gulp.dest('./client/dist/themes/default/assets/fonts/'));
});

/**
 * @desc Watch and compile files.
 */
gulp.task('watch', function() {
  gulp.watch('client/scripts/**/*', ['scripts']);
  gulp.watch('./client/styles/**/*.scss', ['sass']);
});

gulp.task('build', ['scripts', 'sass', 'move']);

/**
 * @desc Default task.
 */
gulp.task('default', ['watch']);
