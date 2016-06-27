var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var minify = require('gulp-minify-css');
var plumber = require('gulp-plumber');
var del = require('del');
var refresh = require('gulp-livereload');
var livereloadport = 35729, serverport = 8999;
var connect = require('gulp-connect');

refresh({ start: true });

function onError(err) {
    console.log(err);
}

gulp.task('sass', ['clean'], function(){
    return gulp.src('app/styles/sass/main.scss')
        .pipe(sass())
        .pipe(prefix('last 2 versions'))
        .pipe(minify())
        .pipe(gulp.dest('app/styles/'))
        .pipe(refresh())
        .pipe(plumber({
            errorHandler: onError
        }))
});

gulp.task('watch', ['sass'], function(event) {
  gulp.watch('app/styles/sass/**/*.scss', ['sass']);
});

gulp.task('clean', function() {
  del('app/styles/*.css');
});

gulp.task('serve', function() {
  connect.server({
      livereload: true,
      root: ['app/']
  });
});

gulp.task('default', ['watch', 'serve']);
