/**
 * @author Jesse Maxwell
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
        .pipe(gulp.dest('./assets/css/dev'))
        .pipe(livereload({quiet: true}))
        .pipe(cssnano())
        .pipe(gulp.dest('./assets/css/prod'));
});

gulp.task('js', function() {
    return gulp.src(['./js/**/*.js', '!./js/build/**/*.js'])
        .pipe(babel({
            presets: ['latest']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./js/build'));
});

gulp.task("watch", function(){
    livereload.listen();
    gulp.watch('./assets/scss/**/*.scss', ['scss']);
    gulp.watch('./js/modules/*.js', ['js']);
});