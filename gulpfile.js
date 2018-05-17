var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    order = require('gulp-order')

var filelist = [
    'main.js',
    'utils.js',
    'loader.js',
    'loader/ajax.js',
    'loader/file.js',
    'decode.js',
    'interface/base.js',
    'interface/control.js',
    'interface/event.js',
]

gulp.task('dev',['clear'],function () {
    gulp.start('buildjs')
    gulp.watch('./src/**/*', ['buildjs'])
})

gulp.task('build',['clear'],function () {
    gulp.start(['buildjs','buildminjs'])
})

gulp.task('clear',function () {
    return del('./dist/**/*')
})

gulp.task('buildjs',function () {
    return gulp.src('./src/**/*.js')
        .pipe(order(filelist))
        .pipe(concat('audio.js'))
        .pipe(gulp.dest('./dist'))
})

gulp.task('buildminjs',function () {
    return gulp.src('./src/**/*.js')
        .pipe(order(filelist))
        .pipe(concat('audio.js'))
        .pipe(uglify({
            mangle: true,//类型：Boolean 默认：true 是否修改变量名
            compress: true,//类型：Boolean 默认：true 是否完全压缩
        }))
        .pipe(rename('audio.min.js'))
        .pipe(gulp.dest('./dist'))
})