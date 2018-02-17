/**
 * Copyright: 2016 (c) SwiftOtter Studios
 *
 * @author Jesse Maxwell
 * @copyright Swift Otter Studios, 11/26/16
 */

var gulp            = require('gulp'),
    sass            = require('gulp-sass'),
    livereload      = require('gulp-livereload'),
    cssnano         = require('gulp-cssnano'),
    babel           = require('gulp-babel'),
    uglify          = require('gulp-uglify'),
    gutil           = require('gulp-util');

gulp.task('default', ['scss', 'js', 'watch']);

gulp.task('scss', function() {
    return gulp.src('./assets/scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'nested',
            precision: 4,
            sourceComments: true,
        }).on('error', sass.logError))
        .pipe(gulp.dest('./assets/css'))
        .pipe(livereload({quiet: true}))
});

gulp.task('js', function() {
    return gulp.src(['./js/**/*.js', '!./js/build/**/*.js'])
        .pipe(babel({
          presets: ['latest'],
          babelrc: false
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./js/build'));
});

gulp.task("watch", function(){
    livereload.listen();
    gulp.watch('./assets/scss/**/*.scss', ['scss']);
    gulp.watch('./js/modules/*.js', ['js']);
});


// BUILD

gulp.task('build', ['build-scss', 'build-js', 'build-modules', 'build-entry', 'build-html']);

gulp.task('build-scss', function() {
  return gulp.src('./assets/scss/**/*.scss')
    .pipe(sass({
      outputStyle: 'nested',
      precision: 4,
      sourceComments: true,
    }).on('error', sass.logError))
    .pipe(cssnano())
    .pipe(gulp.dest('../dist/score/assets/css'));
});

gulp.task('build-js', function() {
  return gulp.src(['./js/lib/*.js'])
    .pipe(gulp.dest('../dist/score/js/lib'));
});

gulp.task('build-entry', function() {
  return gulp.src(['./js/*.js'])
    .pipe(babel({
      presets: ['latest'],
      babelrc: false
    }))
    .pipe(uglify())
    .pipe(gulp.dest('../dist/score/js'));
});

gulp.task('build-modules', function() {
  return gulp.src(['./js/modules/*.js'])
    .pipe(babel({
      presets: ['latest'],
      babelrc: false
    }))
    .pipe(uglify())
    .pipe(gulp.dest('../dist/score/js/modules'));
});

gulp.task('build-html', function() {
  return gulp.src(['*.html', '*.ico', 'manifest.json'])
    .pipe(gulp.dest('../dist/score'))
});
