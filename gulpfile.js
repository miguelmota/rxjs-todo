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
    entries: './src/public/scripts/index.jsx',
    extensions: ['.jsx'],
    debug: true
  })
  .transform('babelify')
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('./src/public/dist'));
});

/**
 * @desc Start browser sync.
 */
gulp.task('browser', function() {
  browserSync.init({
    server: {
      baseDir: './src/public'
    }
  });
});

/**
 * @desc Compile SASS.
 */
gulp.task('sass', function() {
  return gulp.src('./src/public/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src/public/dist'));
});

/**
 * @desc Move files for build.
 */
gulp.task('move', function() {
  gulp.src([
    './src/public/assets/themes/default/assets/fonts/*'
  ], { base: './src/public/assets/themes/default/assets/fonts/' })
  .pipe(gulp.dest('./src/public/dist/themes/default/assets/fonts/'));
});

/**
 * @desc Watch and compile files.
 */
gulp.task('watch', function() {
  gulp.watch('./src/public/scripts/**/*', ['scripts']);
  gulp.watch('./src/public/styles/**/*.scss', ['sass']);
});

gulp.task('build', ['scripts', 'sass', 'move']);

/**
 * @desc Default task.
 */
gulp.task('default', ['watch']);
