// Load plugins
var gulp = require('gulp');
var gulpif = require('gulp-if');
var plumber = require('gulp-plumber');
var coffee = require('gulp-coffee');
var include = require('gulp-include');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleancss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var bump = require('gulp-bump');

//var php = require('gulp-connect-php');
//var browserSync = require('browser-sync');
//var reload = browserSync.reload;

//var requireDir = require('require-dir');
//var tasks = requireDir('gulp-tasks');

// Source paths
var js = {
      src: ['theme/src/js/*.coffee', 'theme/src/js/*.js'],
      dest: 'theme/assets/js',
      watch: ['theme/src/js/**/*.coffee','theme/src/js/**/*.js']
    },
    css = {
        src: 'theme/src/css/*.scss',
        dest: 'theme/assets',
        watch: 'theme/src/css/**/*.scss'
    };

// Compile and minify Sass 
gulp.task('styles', function () {
  gulp.src(css.src)
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe(gulp.dest(css.dest))
    //.pipe(reload({stream: true})) //.pipe(browserSync.stream())
    // min
    .pipe(rename({ suffix: '.min' }))
    .pipe(cleancss())
    .pipe(gulp.dest(css.dest))    
});

// Scripts
gulp.task('scripts', function () {
  gulp.src(js.src)
    .pipe(plumber())
    .pipe(include({
      includePaths: [
        __dirname + '/node_modules',
        __dirname + '/bower_components',
        __dirname + '/src/js'
      ]
    }))
    .pipe(gulpif("*.coffee", coffee()))
    .pipe(gulp.dest(js.dest))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(js.dest))
    //.pipe(reload({stream: true}));
});

// php server
//gulp.task('php', function() {
    //php.server({ base: 'dist', port: 8010, keepalive: true, stdio: 'ignore'});
//});

// Watch: js complete ?
gulp.task('js-watch', ['scripts'], function (done) {
    browserSync.reload();
    done();
});

// Watch
gulp.task('w', ['styles', 'scripts'], function() {
  
  //browserSync.init({
    //proxy: '127.0.0.1:8010',
    //port: 8000,
    //open: true
  //});

  //gulp.watch([
    //'dist/site/**/*.php',
    ////'src/images/**/*',
    ////'src/fonts/**/*',
  //]).on('change', reload);

  gulp.watch(css.watch, ['styles']);
  gulp.watch(js.watch, ['scripts']);
});

// Version 'Bump'
gulp.task('bump', function(){
  gulp.src('./package.json')
  .pipe(bump({type:'minor'}))
  .pipe(gulp.dest('./'));
});

// Build
gulp.task('build', ['styles', 'scripts', 'bump']);