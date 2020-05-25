const {watch, series, src, dest, parallel} = require('gulp');
  imagemin = require('gulp-imagemin');
  browserSync = require('browser-sync').create();
  pug = require('gulp-pug');
  sass = require('gulp-sass');
  csso = require('gulp-csso');
  plumber = require('gulp-plumber');

function css() {
  return src('src/styles/index.scss')
    .pipe(plumber())
    .pipe(sass({}))
    .pipe(csso())
    .pipe(dest('dist'))
    .pipe(browserSync.reload({
      stream:true
    }));
}

function view() {
  return src('src/pages/*.pug')
    .pipe(plumber())
    .pipe(pug({
      pretty:true
    }))
    .pipe(dest('dist'))
    .pipe(browserSync.reload({
      stream: true
    }));
}

function serve() {
  browserSync.init({
    server: {
      baseDir: "dist"
    }
  });
}

function img() {
  return src('src/assets/img/*')
    .pipe(imagemin())
    .pipe(dest('dist/images'));
}

function fonts() {
  return src('src/assets/fonts/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe(dest('./dist/fonts/'));
}

function watching() {
  watch('src/**/*.pug', series(view));
  watch('src/**/*.scss', series(css));
}

exports.start = series(
  parallel(view, fonts, img, css),
  parallel(watching, serve)
);

exports.prod = series(img, view, fonts, css);