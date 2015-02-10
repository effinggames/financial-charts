var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    clean = require('gulp-clean'),
    browserSync = require('browser-sync'),
    reloadMe = require('browser-sync').reload,
    imageMin = require('gulp-imagemin'),
    webpack = require('gulp-webpack'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    stylus = require('gulp-stylus'),
    cssMin = require('gulp-minify-css'),
    nib = require('nib'),
    es = require('event-stream'),
    merge = require('event-stream').concat;

var publicDir = './public',
    publicImgDir = './public/img';

var webpackAppJS = function(minifyMe) {
    return gulp.src('./app/scripts/main.js')
        .pipe(webpack({}))
        .pipe(concat('app.js'))
        .pipe(gulpif(minifyMe, uglify()))
        .pipe(gulp.dest(publicDir));
};
var concatCSS = function(minifyMe) {
    return gulp.src('./app/styles/**/*.styl')
        .pipe(stylus({use: [nib()]}))
        .pipe(concat('app.css'))
        .pipe(gulpif(minifyMe, cssMin()))
        .pipe(gulp.dest(publicDir))
        .pipe(reloadMe({stream:true}));
};
var copyStuff = function() {
    return gulp.src('./app/img/**/*', { base: './app' })
        .pipe(filterEmptyDirs())
        .pipe(gulp.dest(publicDir));
};

//removes empty dirs from stream
var filterEmptyDirs = function() {
    return es.map(function (file, cb) {
        if (file.stat.isFile()) {
            return cb(null, file);
        } else {
            return cb();
        }
    });
};

var minifyImages = function() {
    return gulp.src(publicImgDir+'/**/*')
        .pipe(imageMin())
        .pipe(gulp.dest(publicImgDir));
};

//opens up browserSync url
var syncMe = function() {
    browserSync({
        proxy: 'localhost:8000',
        open: false
    });
};

//cleans build folder
gulp.task('clean', function() {
    return gulp.src(publicDir, { read: false })
        .pipe(clean());
});

//build + watching, for development
gulp.task('default', ['clean'], function() {

    gulp.watch(['./app/scripts/**/*.js'], function() {
        console.log('File change - webpackAppJS()');
        webpackAppJS()
            .pipe(reloadMe({stream:true}));
    });
    gulp.watch('./app/styles/**/*.styl', function() {
        console.log('File change - concatCSS()');
        concatCSS();
    });
    gulp.watch(['./app/img/**/*'], function() {
        console.log('File change - copyStuff()');
        copyStuff()
            .pipe(reloadMe({stream:true}));
    });

    return merge(copyStuff(), concatCSS(), webpackAppJS())
        .on('end', function() {
            syncMe();
        });
});

gulp.task('watch', ['default'], function() {

    gulp.watch(['./app/scripts/**/*.js'], function() {
        console.log('File change - webpackAppJS()');
        webpackAppJS()
            .pipe(reloadMe({stream:true}));
    });
    gulp.watch('./app/styles/**/*.styl', function() {
        console.log('File change - concatCSS()');
        concatCSS();
    });
    gulp.watch(['./app/img/**/*'], function() {
        console.log('File change - copyStuff()');
        copyStuff()
            .pipe(reloadMe({stream:true}));
    });
});

//production build task
gulp.task('build', ['clean'], function() {
    return merge(copyStuff(), webpackAppJS(true), concatCSS(true))
        .on('end', function() {
            minifyImages();
        });
});
