/**
 * Created by Administrator on 2016/12/6.
 */
var gulp = require('gulp'),
    less = require('gulp-less'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber');

// 定义自动刷新任务
gulp.task('browserSync', function () {
    var files = [
        '**/*.html',
        '**/*.css',
        '**/*.js'
    ];
    browserSync.init(files, {
        server: {
            baseDir: "./"
        }
    });
});

// sass文件编译
gulp.task('sass', function () {
    return gulp.src('sass/**/*.scss')
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))//出错后不结束进程，打印出错的代码
        .pipe(sass())
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});


// 监听less文件的改变，然后自动调用‘less’模块编译
gulp.task('watch', ['sass', 'browserSync'], function () {
    gulp.watch('sass/**/*.scss', ['sass']);
});

//执行哪些任务
gulp.task('default', ['sass', 'browserSync', 'watch']);

// // less文件编译
// gulp.task('less', function() {
//     return gulp.src('less/**/*.less')
//         .pipe(less())
//         .pipe(gulp.dest('css'))
//         .pipe(browserSync.reload({
//             stream:true
//         }))
// });
// // 监听less文件的改变，然后自动调用‘less’模块编译
// gulp.task('watch', ['less','browserSync'],function(){
//     gulp.watch('less/**/*.less',['less']);
// });

