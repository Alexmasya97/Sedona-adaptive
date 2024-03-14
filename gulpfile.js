import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import { deleteAsync, deleteSync } from 'del';
import gulp from 'gulp';
import browserSync from 'browser-sync';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';

const sync = browserSync.create();

const paths = {
  styles: {
    src: 'src/sass/style.scss',
    dest: 'build/styles/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'build/scripts/'
  },
  html: {
    src: 'src/*.html',
    dest: 'build/'
  },
  images: {
    src: 'src/image/**/*.{png,jpg,jpeg}',
    dest: 'build/image/'
  },
  svg: {
    src: 'src/image/**/*.svg',
    dest: 'build/image/icon'
  },
  fonts: {
    src: 'src/fonts/**/*.ttf',
    dest: 'build/fonts/'
  }

};

const sass = gulpSass(dartSass);

export const clean = () => deleteAsync(['build']);

export const styles = () => {
  return gulp
    .src(paths.styles.src)
    .pipe(sass())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(sync.stream());
};

export const html = () => {
  return gulp
    .src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
    .pipe(sync.stream());
};

export const svg = () => {
  return gulp
    .src(paths.svg.src)
    .pipe(gulp.dest(paths.svg.dest));
};

export const convertToWebp = () => {
  return gulp
    .src(paths.images.src)
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest(paths.images.dest));
};

export const fonts = () => {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('build/fonts'));
};

export const minifyStyles = () => {
  return gulp
    .src(paths.styles.dest + 'style.css')
    .pipe(gulpSass({ outputStyle: 'compressed' }).on('error', gulpSass.logError))
    .pipe(gulp.dest(paths.styles.dest));
};

gulp.task('minifyStyles', minifyStyles);

gulp.task('fonts', fonts);

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

const reload = (done) => {
  sync.reload();
  done();
};

export const scripts = () => {
  return gulp
    .src(paths.scripts.src)
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(sync.stream());
};

const watcher = () => {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch('src/sass/**/*.scss', styles);
  gulp.watch(paths.html.src, gulp.series(html, reload));
};

gulp.task(
  'build',
  gulp.series(clean, gulp.parallel(styles, html, svg, convertToWebp, fonts), gulp.parallel(server, watcher))
);

gulp.task('default', gulp.series(clean, gulp.parallel(svg, convertToWebp)));


