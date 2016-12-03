/**
 * SwiftOtter_Base is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * SwiftOtter_Base is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with SwiftOtter_Base. If not, see <http://www.gnu.org/licenses/>.
 *
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