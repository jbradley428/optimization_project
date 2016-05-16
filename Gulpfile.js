//----------------------------------Variables-----------------------------------

var gulp = require('gulp');
var sass = require('gulp-sass');
var notify = require("gulp-notify");
var install = require("gulp-install");
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var nunjucksRender = require('gulp-nunjucks-render');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
/* Globbing
- '*.scss' - * pattern is a wildcard that matches any pattern in the current directory
- '** /*.scss' - more extreme version of the * pattern that matches any file ending with .scss in the root folder and any child directories.
- ! - indicates that Gulp should exclude the pattern from its matches, which is useful if you had to exclude a file from a matched pattern.
- *.+(scss|sass) - the plus + and parentheses () allows Gulp to match multiple patterns, with different patterns separated by the pipe | character. In this case, Gulp will match any file ending with .scss or .sass in the root folder.
*/
//------------------------------------------------------------------------------

var config = {
    sassPath: './src/scss',
    npmPath: './node_modules'
}

gulp.task('npm', function () {
  return gulp.src(['./package.json'])
    .pipe(install());
});
//-------------------------------------Fonts------------------------------------
gulp.task('icons', function() {
  return gulp.src([
          config.npmPath + '/font-awesome/fonts/**.*',
          config.npmPath + '/bootstrap-sass/assets/fonts/**/**.*',
      ])
      .pipe(gulp.dest('./public/fonts'));
});

//-----------------------------------Sass > CSS---------------------------------

gulp.task('css', function() {
    return gulp.src(config.sassPath + '/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: [
                config.sassPath,
                config.npmPath + '/bootstrap-sass/assets/stylesheets',
                config.npmPath + '/font-awesome/scss'
            ]
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/css'))
        .pipe(reload({stream: true}));
});

//--------------------------------------JS -------------------------------------

gulp.task('vendor.js', function () {
  return gulp.src([
            config.npmPath + '/bootstrap-sass/assets/javascripts/bootstrap.min.js'
        ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./public/js'));
});

//----------------------------Templates > Public--------------------------------

gulp.task('templates', function () {
    nunjucksRender.nunjucks.configure(['./src/templates/']);
    return gulp.src('./src/templates/*.html')
        .pipe(nunjucksRender())
        .pipe(gulp.dest('./public'))
        .pipe(reload({stream: true}));
});

//----------------------------Gulp Watch & Serve--------------------------------

gulp.task('serve', ['npm', 'icons', 'css', 'vendor.js', 'templates'], function() {
    browserSync.init({ server: "./public" });
    gulp.watch("./src/templates/**/*.html", ['templates']);
    gulp.watch("./src/scss/**/*.scss", ['css']);
    gulp.watch("./public/*.html").on('change', reload);
});

gulp.task('default', ['serve']);
