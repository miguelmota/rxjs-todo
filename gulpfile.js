'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const browserSync = require('browser-sync').create();

/**
 * @desc Compile browser script files.
 */
gulp.task('compile-scripts', function() {
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
 * @desc Watch and compile files.
 */
gulp.task('watch', function() {
  gulp.watch('client/scripts/**/*', ['compile-scripts']);
});

/**
 * @desc Default task.
 */
gulp.task('default', ['watch']);
