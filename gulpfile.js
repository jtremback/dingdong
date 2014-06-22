'use strict';

var gulp = require('gulp');
var gulpJade = require('gulp-jade');
var gulpNotify = require('gulp-notify');
var gulpInclude = require('gulp-file-include');
var gulpAutoprefixer = require('gulp-autoprefixer');
var gulpMinifyCss = require('gulp-minify-css');
var gulpUglify = require('gulp-uglify');
var gulpLess = require('gulp-less');


gulp.task('styles', function () {
  return gulp.src(['src/styles/style.less'])
    .pipe(gulpLess({ paths: ['src/styles'] }))
    .pipe(gulpAutoprefixer('last 2 versions'))
    .pipe(gulpMinifyCss())
    .pipe(gulp.dest('styles'))
    .pipe(gulpNotify({ message: 'styles task complete' }));
});

gulp.task('scripts', function () {
  return gulp.src(['src/scripts/**/**'])
    .pipe(gulpInclude('// = '))
    // .pipe(gulpUglify())
    .pipe(gulp.dest('scripts'))
    .pipe(gulpNotify({ message: 'scripts task complete' }));
});

gulp.task('html', function () {
  return gulp.src(['src/index.jade'])
    .pipe(gulpJade())
    .pipe(gulp.dest(''))
    .pipe(gulpNotify({ message: 'html task complete' }));
});

// WATCH
gulp.task('watch', function () {
  gulp.watch('src/scripts/**/**', ['scripts']);
  gulp.watch('src/styles/**', ['styles']);
  gulp.watch('src/*.jade', ['html']);
});

// BUILD
gulp.task('build', [
  'scripts',
  'styles',
  'html'
]);