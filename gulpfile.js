var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var mainBowerFiles = require('gulp-main-bower-files');
var gulpFilter = require('gulp-filter');
var connect = require('gulp-connect');
var inject = require('gulp-inject');
var sass = require('gulp-sass');

var paths = {
    scripts: ['source/js/*.js'],
    styles: ['source/css/*.css'],
    sass: ['source/css/**/*.scss'],
    images: 'source/img/**/*',
    //dest: 'build',
    //source: 'source'
};

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use any package available on npm
gulp.task('clean', function() {
    // You can use multiple globbing patterns as you would with `gulp.src`
    return del(['build']);
});

gulp.task('scripts', function() {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down

    var filterJS = gulpFilter('**/*.js', { restore: true });
    return gulp.src('./bower.json')
        .pipe(mainBowerFiles())
        .pipe(filterJS)
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        //.pipe(filterJS.restore)
        .pipe(gulp.dest('build/js'));
});

gulp.task('styles', function() {
    var filterCSS = gulpFilter('**/*.css', { restore: true });
    return gulp.src('./bower_components/**/*.css')
        //.pipe(filterCSS)
        .pipe(concat('vendor.css'))
        //.pipe(filterCSS.restore)
        .pipe(gulp.dest('build/css'));
});


gulp.task('sass', function () {
    return gulp.src(paths.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('build/css'));
});

// Copy all static images
gulp.task('images', function() {
    return gulp.src(paths.images)
    // Pass in options to the task
        //.pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest('build/img'));
});

gulp.task('build', function() {
    return gulp.start(['scripts','styles','sass','copy','images']);
});

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.styles, ['styles']);
    gulp.watch(paths.sass, ['sass']);
    gulp.watch('./source/index.html', ['copy']);
    gulp.watch(paths.images, ['images']);
});

gulp.task('copy', function() {
   return gulp.src('./source/index.html')
       .pipe(gulp.dest('./build'))
});

gulp.task('connect', function() {
    connect.server({
        root: 'build',
        livereload: true
    });
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['build', 'watch', 'connect']);