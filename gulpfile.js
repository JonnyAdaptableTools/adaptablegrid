var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var clean_css = require('gulp-clean-css');
var remove_css_comments = require('gulp-strip-css-comments');

var dest = './build/';
var jsincludes = ['lib/jquery.min.js', 'lib/jquery*.js', 'lib/*.min.js', 'lib/*.js'];
var cssincludes = ['lib/*.css', 'harness/*.css'];
var basename = 'adaptablegrid.bundle';
var js_bundle = basename + '.js';
var js_min = basename + '.min.js';
var css_bundle = basename + '.css';
var css_min = basename + '.min.css';

//////////
gulp.task('build_js', function () {
  gulp.src(jsincludes)
      .pipe(concat(js_bundle))
      .pipe(gulp.dest(dest))
      .pipe(rename(js_min))
      .pipe(uglify())
      .pipe(gulp.dest(dest));
});

gulp.task('build_css', function () {
  gulp.src(cssincludes)
      .pipe(concat(css_bundle))
      .pipe(gulp.dest(dest))
      .pipe(rename(css_min))
      .pipe(remove_css_comments({preserve: false}))
      .pipe(clean_css({compatibility: 'ie8'}))
      .pipe(gulp.dest(dest));
});

gulp.task('build_assets', function () {
  gulp.src('harness/calendar.png')
      .pipe(gulp.dest(dest));
  gulp.src('AdaptableGrid.d.ts')
      .pipe(rename('adaptablegrid.d.ts'))
      .pipe(gulp.dest(dest));
});

gulp.task('build', ['build_js', 'build_css', 'build_assets']);
gulp.task('default', ['build']);