/*****************************************************************************
 *
 * Streaming Gulp Build File
 *
 * @author Kerri Shotts kerrishotts@gmail.com
 * @version 0.0.1
 *
 * Copyright (C) 2014 photoKandy Studios LLC and Kerri Shotts. These
 * portions are MIT licensed, and are freely available for use and
 * distribution.
 *
 *****************************************************************************/
"use strict";
/* globals require, __dirname */

var gulp = require("gulp");
var browserify = require("browserify");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var tap = require("gulp-tap");
var rename = require("gulp-rename");
var docco = require("gulp-docco");
var bump = require("gulp-bump");
var replace = require("gulp-replace");
var uglify = require("gulp-uglify");
var beautify = require("gulp-beautify");
var gzip = require("gulp-gzip");
var concat = require("gulp-concat");
var pkg = require("./package.json");

var http = require("http");
var st = require("st");

function incVersion(importance) {
    return gulp.src(["./package.json"])
        .pipe(bump({
            type: importance
        }))
        .pipe(gulp.dest("./"));
}
gulp.task("patch", function() {
    return incVersion("patch");
});
gulp.task("feature", function() {
    return incVersion("minor");
});
gulp.task("release", function() {
    return incVersion("major");
});

//
// copy assets from resources to lib
gulp.task("copy-assets-to-lib", function() {
    gulp.src(["resources/ai-export/images/*.png"])
        .pipe(gulp.dest("lib/yasmf-assets"));
});

//
// copy assets from lib to dist
gulp.task("preflight", ["copy-assets-to-lib"], function() {
    gulp.src(["lib/yasmf-assets/**/*.*"])
        .pipe(gulp.dest("dist/yasmf-assets"));
});

function browserifyScripts(debug) {
    if (debug === undefined) {
        debug = false;
    }
    return gulp.src(["./lib/yasmf.js"])
        .pipe(plumber())
        .pipe(tap(function(file) {
            file.contents = browserify([file.path], {
                    fullpaths: true,
                    standalone: "_y",
                    debug: debug
                })
                .bundle();
        }))
        //.pipe( beautify( {indentSize: 2} ) )
        .pipe(rename("yasmf" + (debug ? "-maps" : "") + ".js")) // ends up under dist/yasmf.js
        .pipe(gulp.dest("dist"));
}

//
// generate yasmf.js
gulp.task("generate", ["preflight"], function() {
    return browserifyScripts();
});

//
// generate yasmf-maps.js
gulp.task("generate-maps", ["preflight", "generate"], function() {
    return browserifyScripts(true);
});
/*
gulp.task( "generate-amd", ["generate-maps"], function () {
  return gulp.src( ["./_amd/start.js", "./dist/yasmf-browserify.js", "./_amd/end.js"] )
    .pipe( concat( "yasmf.js" ) )
    .pipe( gulp.dest( "dist" ) );
} );
*/

//
// generate yasmf-min.js
gulp.task("generate-min", ["generate-maps"], function() {
    return gulp.src(["./dist/yasmf.js"])
        .pipe(uglify())
        .pipe(rename(function(path) {
            path.basename += "-min";
        }))
        .pipe(gulp.dest("dist"));
});

//
// generate documentation using docco
gulp.task("doc", function() {
    return gulp.src("./lib/**/*.js")
        .pipe(docco())
        .pipe(gulp.dest("doc"));
});

//
// Convert sass styles (src) to css styles (www)
gulp.task("styles", function() {
    return gulp.src(["lib/yasmf.scss"])
        .pipe(sass())
        .pipe(gulp.dest("dist"));
});

//
// gzip
gulp.task("gzip", ["generate-min", "styles"], function() {
    return gulp.src(["dist/yasmf-min.js", "dist/yasmf.css"])
        .pipe(gzip())
        .pipe(gulp.dest("dist"));
});

//
// Define build
gulp.task("build", ["patch", "gzip", "doc"], function() {});

gulp.task("serve", ["gzip"], function(done) {
    return http.createServer(
        st({
            path: ".",
            index: 'index.html',
            cache: false
        })
    ).listen(8080, done);
});
//
// Run when gulp is run with no parameters -- builds the project
gulp.task("default", ["generate", "styles", "doc"], function() {});
