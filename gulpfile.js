const gulp = require("gulp");
const browserSync = require("browser-sync");
var nodemon = require("gulp-nodemon");

gulp.task("nodemon", cb => {
  let started = false;

  return nodemon({
    script: "app.js"
  }).on("start", () => {
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task(
  "browser-sync",
  gulp.series("nodemon", () => {
    browserSync.init(null, {
      proxy: "http://localhost:3002",
      files: ["public/**/*.*"],

      port: 9000
    });

    gulp.watch("public/**/*.{css,html,js}").on('change', browserSync.reload);
  })
);

gulp.task("serve", gulp.series("browser-sync", () => {}));