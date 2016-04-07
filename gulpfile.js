var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var gulpNgConfig = require('gulp-ng-config');
var jshint = require('gulp-jshint');
var runSequence = require('run-sequence');
var notify = require("gulp-notify");
var plumber = require('gulp-plumber');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var exec = require('child_process').exec;

var DEVELOPMENT_FILES = ['views/**/*.js', 'services/**/*.js'];
var SASS_FILES = ['./scss/**/*.scss', 'views/**/*.scss'];
var HTML_FILES = ['views/**/*.html'];

// var paths = {
//   sass: ['./scss/**/*.scss']
// };

gulp.task('ios', function (cb) {
  exec('ionic run ios --target="iPhone-6"', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
})

gulp.task('copy', function() {
    gulp.src(['views/**/*.html'])
      .pipe(rename({dirname: ''}))
      .pipe(gulp.dest('www/templates/'))
});

gulp.task('config-files', function () {
  gulp.src('configFile.json')
  .pipe(gulpNgConfig('AskUs.env'))
  .pipe(gulp.dest('./views'))
});

gulp.task('default', ['sass']);

gulp.task('concat', function() {
  return gulp.src(DEVELOPMENT_FILES)
    .pipe(plumber({errorHandler: errorAlertConcat}))
    .pipe(concat('app.concat.js'))
    .pipe(gulp.dest('www/js'));
});

gulp.task('compress', function() {
  return gulp.src('www/js/app.concat.js')
    .pipe(plumber({errorHandler: errorAlertUgly}))
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('www/js'));
});

gulp.task('lint', function() {
  return gulp.src(DEVELOPMENT_FILES)
    //.pipe(plumber())
    .pipe(plumber({errorHandler: errorAlertLint}))
    .pipe(jshint())
    // .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('sass', function(done) {
  gulp.src(SASS_FILES)
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('build', function(cb) {
  runSequence('lint', 'copy', 'concat', 'compress', 'sass', cb);
});

gulp.task('build:js', function(cb) {
  runSequence('lint', 'copy', 'concat', 'compress', cb);
});

gulp.task('watch', function() {
  gulp.watch([DEVELOPMENT_FILES,HTML_FILES], ['build']);
  gulp.watch(SASS_FILES, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

// Error notification functions
function errorAlertLint(error){
  notify.onError({title: "Lint Error", message: "Check your terminal", sound: "Sosumi"})(error); //Error Notification
  console.log(error.toString());//Prints Error to Console
  this.emit("end"); //End function
};

function errorAlertSass(error){
  notify.onError({title: "Sass Error", message: "Check your terminal", sound: "Sosumi"})(error); //Error Notification
  console.log(error.toString());//Prints Error to Console
  this.emit("end"); //End function
};

function errorAlertConcat(error){
  notify.onError({title: "Concat Error", message: "Check your terminal", sound: "Sosumi"})(error); //Error Notification
  console.log(error.toString());//Prints Error to Console
  this.emit("end"); //End function
};

function errorAlertUgly(error){
  notify.onError({title: "Uglify Error", message: "Check your terminal", sound: "Sosumi"})(error); //Error Notification
  console.log(error.toString());//Prints Error to Console
  this.emit("end"); //End function
};
