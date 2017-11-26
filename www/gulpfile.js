let gulp = require("gulp");
let ts = require("gulp-typescript");
let babel = require("gulp-babel");
let plumber = require("gulp-plumber");


let tsConfig = {
    "target": "es5",
    "module": "es2015",
    allowJs: true,
    allowSyntheticDefaultImports: true
}
let browserify = require("browserify");
let source = require('vinyl-source-stream');


gulp.task("one", () => {
    return gulp.src("./src/index.ts")
        .pipe(plumber())
        .pipe(ts(tsConfig))
        .pipe(babel({
            presets: ["es2015"]
        }))
        .pipe(gulp.dest("dist/"));
});

gulp.task("browserify", () => {
    return browserify({
        entries: "dist/index.js"
    }).bundle()
        .pipe(source("index.js"))
        .pipe(gulp.dest("dist/"));
})

gulp.task("default", ["one", "browserify"]);

gulp.watch('./src/**/*.ts', ["default"], function (event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});