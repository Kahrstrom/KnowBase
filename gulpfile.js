var gulp = require('gulp');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');

gulp.task('less', function () {
  return gulp.src('app/static/less/*.less')
    .pipe(less())
	.pipe(minifyCSS())
	.pipe(gulp.dest('app/static/css/'));
});

gulp.task('default', ['less']);