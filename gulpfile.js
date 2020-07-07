const gulp = require("gulp");
const browsersync = require("browser-sync").create();
const sass = require("gulp-sass");
const del = require("del");
const merge = require("merge-stream");
const htmlmin = require("gulp-htmlmin");
const minify = require("gulp-minify");
const image = require("gulp-image");

// BrowserSync
const browserSync = (done) => {
  browsersync.init({
    server: {
      baseDir: "./dist/",
    },
    port: 3013,
  });
  done();
};

// BrowserSync reload
const browserSyncReload = (done) => {
  browsersync.reload();
  done();
};

// Clean vendor
const clean = () => {
  return del(["./vendor/"]);
};

// Bring third party dependencies from node_modules into vendor directory
const modules = () => {
  // Bootstrap
  const bootstrap = gulp
    .src("./node_modules/bootstrap/dist/**/*")
    .pipe(gulp.dest("./dist/vendor/bootstrap"));

  // jQuery
  const jquery = gulp
    .src([
      "./node_modules/jquery/dist/*",
      "!./node_modules/jquery/dist/core.js",
    ])
    .pipe(gulp.dest("./dist/vendor/jquery"));

  // jQuery Easing
  const jqueryEasing = gulp
    .src("./node_modules/jquery.easing/*.js")
    .pipe(gulp.dest("./dist/vendor/jquery-easing"));
  return merge(bootstrap, jquery, jqueryEasing);
};

// Custom Styles
const style = () => {
  const scss = gulp
    .src("./src/styles/*.scss")
    .pipe(
      sass({ outputStyle: "compressed" }).on(
        "error",
        sass.logError
      )
    )
    .pipe(gulp.dest("./dist/assets/css/"));
  return merge(scss);
};

// Custom Scripts
const scripts = () => {
  //
  const js = gulp
    .src("./src/js/*.js")
    .pipe(
      minify({
        ext: {
          src: ".js",
          min: ".min.js",
        },
      })
    )
    .pipe(gulp.dest("./dist/assets/js/"));
  return merge(js);
};

// Optimize images
const img = () => {
  const pics = gulp
    .src("./src/images/*")
    .pipe(image())
    .pipe(gulp.dest("./dist/assets/img"));
  return merge(pics);
};

// Minify html
const html = () => {
  const page = gulp
    .src(`./src/**/*.html`)
    .pipe(
      htmlmin({ collapseWhitespace: true, minifyCSS: true, minifyJS: true })
    )
    .pipe(gulp.dest("./dist/"));
  return merge(page);
};

// Watch files
function watchFiles() {
  gulp.watch("./src/**/*.scss", gulp.series(style, browserSyncReload));
  gulp.watch("./src/**/*.html", gulp.series(html, browserSyncReload));
  gulp.watch("./src/**/*.js", gulp.series(scripts, browserSyncReload));
  gulp.watch("./src/img/**/*", gulp.series(img, browserSyncReload));
}

// Define complex tasks
const vendor = gulp.series(clean, modules);
const custom = gulp.series(style, scripts, img, html);
const build = gulp.series(vendor, custom);
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));

// Export tasks
exports.clean = clean;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = build;
