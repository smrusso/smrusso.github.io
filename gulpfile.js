var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var rename = require('gulp-rename');
var esbuild = require('gulp-esbuild');

// Compile SCSS to CSS
gulp.task('sass', function () {
    return gulp.src('./sass/styles.scss')
        .pipe(sass({ includePaths: ['node_modules'], style: 'compressed' }).on('error', sass.logError))
        .pipe(rename({ basename: 'styles.min' }))
        .pipe(gulp.dest('./dist'));
});

// Bundle and minify JS (Bootstrap + your code)
gulp.task('bundle-js', function () {
    return gulp.src('./js/scripts.js')
        .pipe(esbuild({
            bundle: true,
            minify: true,
            sourcemap: true,
            outfile: 'scripts.min.js',
            target: 'es2017',
        }))
        .pipe(gulp.dest('./dist'));
});

// Optional: copy decrypt worker
gulp.task('copy-decrypt-worker', function () {
    return gulp.src('./js/decrypt.js')
        .pipe(gulp.dest('./js'));
});

// Default task
gulp.task('default', gulp.series('sass', 'bundle-js', 'copy-decrypt-worker'));
