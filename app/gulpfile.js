var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('copy', function() {
    gulp.src([
        'node_modules/es6-shim/es6-shim.min.js',
        'node_modules/reflect-metadata/Reflect.js',
        'node_modules/zone.js/dist/zone.js'
    ])
    .pipe(gulp.dest('dist/lib'));
});

gulp.task('build', ['copy'], function() {
    browserify('src/bootstrap.js', { debug: true })
        .transform("babelify")
        .bundle()
        .on('error', function (error) { console.error(error.toString()); })
        .pipe(source('app.js'))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build']);
