var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-clean-css');

gulp.task('js', function(){
  return gulp.src(['user/themes/quark/js/videoPlayer/base.js', 'user/themes/quark/js/videoPlayer/videos.js', 'user/themes/quark/js/videoPlayer/main.js'])
      .pipe(concat('videosPlayer.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('user/themes/quark/js/')) && gulp.src(['user/themes/quark/js/videoPlayer/base.js', 'user/themes/quark/js/videoPlayer/video.js', 'user/themes/quark/js/videoPlayer/main.js'])
      .pipe(concat('videoPlayer.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('user/themes/quark/js/')) && gulp.src(['user/themes/quark/js/videoPlayer/base.js', 'user/themes/quark/js/videoPlayer/subtitles.js', 'user/themes/quark/js/videoPlayer/main.js'])
      .pipe(concat('subtitlesPlayer.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('user/themes/quark/js/'));
});

gulp.task('css', function(){
  return gulp.src('user/themes/quark/css/videoPlayer/*.css')
    .pipe(concat('videos.min.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('user/themes/quark/css/'))
});

gulp.task('watch', function(){
  gulp.watch('user/themes/quark/css/videoPlayer/*.css', gulp.series('css'));
  gulp.watch('user/themes/quark/js/videoPlayer/*.js', gulp.series('js'));
});

gulp.task('default', gulp.series('css', 'js', 'watch'));