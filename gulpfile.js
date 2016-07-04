const babel = require("gulp-babel");
const eslint = require("gulp-eslint");
const gulp = require("gulp");
const isparta = require("isparta");
const istanbul = require("gulp-istanbul");
const merge = require("merge2");
const mocha = require("gulp-mocha");
const runSequence = require("run-sequence");
const sourcemaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");
const tslint = require("gulp-tslint");

gulp.task("babel", () => {
    return gulp.src("src/**/*.js")
        .pipe(babel({
            presets: ["es2015"]
        }))
        .pipe(gulp.dest("lib"));
});

gulp.task("eslint", () => {
    return gulp.src(["*.js", "test/**/*.js"])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task("pre-test", function () {
    return gulp.src(["lib/**/*.js"])
        .pipe(istanbul({
            instrumenter: isparta.Instrumenter,
            includeUntested: true
        }))
        .pipe(istanbul.hookRequire());
});

gulp.task("test", ["pre-test"], function () {
    return gulp.src(["test/unit/**/*.js"])
        .pipe(mocha())
        .pipe(istanbul.writeReports());
});

gulp.task("tslint", () => {
    return gulp
        .src(["src/**/*.ts", "!src/**/*.d.ts"])
        .pipe(tslint())
        .pipe(tslint.report("verbose"));
});

gulp.task("tsc", () => {
    const project = ts.createProject("tsconfig.json");
    const output = project
        .src()
        .pipe(sourcemaps.init())
        .pipe(ts(project));

    return merge([
        output.dts.pipe(gulp.dest("lib")),
        output.js
            .pipe(sourcemaps.write())
            .pipe(gulp.dest("src"))
    ]);
});

gulp.task("watch", ["default"], () => {
    gulp.watch(["src/**/*.ts", "test/**/*.js"], ["default"]);
});

gulp.task("default", ["tsc", "tslint", "eslint"], callback => {
    runSequence(["babel", "test"], callback);
});