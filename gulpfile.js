var gulp = require('gulp'),
    //将scss文件转为css文件
    sass = require('gulp-sass'),
    //添加css前缀以支持不同浏览器
    autoprefixer = require('gulp-autoprefixer'),
    //压缩css文件
    minifycss = require('gulp-minify-css'),
    //检查js文件语法错误
    jshint = require('gulp-jshint'),
    //压缩js文件
    uglify = require('gulp-uglify'),
    //压缩图片文件
    imagemin = require('gulp-imagemin'),
    //对文件重命名
    rename = require('gulp-rename'),
    //删除多余的文件夹
    clean = require('gulp-clean'),
    //合并文件(js或css均可)
    concat = require('gulp-concat'),
    //gulp任务完成后给出通知
    notify = require('gulp-notify'),
    //图片缓存，只有图片替换了才压缩
    cache = require('gulp-cache'),
    //通过在谷歌浏览器上安装livereload插件后实现自动刷新，不需按F5
    livereload = require('gulp-livereload'),
    //在本地启动一个Web Server
    connect = require('gulp-connect');;

gulp.task('default', ['clean', 'scripts', 'libs', 'sass', 'Imagemin', 'watch']);

//1 检查src/js目录下的js文件语法错误；2 合并该目录下的js文件并命名为main.js，存放在build/js下；3 对main.js重命名并压缩存在build/js下；4 所有这些任务完成后给出通知'Scripts task complete'
gulp.task('scripts', function() {
    return gulp.src([ 'src/js/*.js'])
        .pipe(concat('main.js'))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        // .pipe(concat('main.js'))
        // .pipe(gulp.dest('build/js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('build/js'))
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});
//对照上面的不难理解
gulp.task('libs', function() {
    return gulp.src(['src/lib/*.js'])
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('build/lib'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('build/lib'))
        .pipe(notify({
            message: 'Libs task complete'
        }));
});
//对照上面的不难理解
gulp.task('sass', function() {
    gulp.src(['src/scss/reset.scss','src/scss/*.scss'])
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(concat('main.css'))
        // .pipe(minifycss())
        .pipe(gulp.dest('build/css'));
});

//创建一个本地服务器
// gulp.task('webserver', function() {
//     connect.server();
// });

//压缩图片
gulp.task('Imagemin', function() {
    gulp.src('src/imgs/*.{png,jpg,gif,ico}')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('build/imgs'));
});

//如果js或css文件夹不存在则创建，存在则删除
gulp.task('clean', function() {
    return gulp.src(['build/css'], {
            read: false
        })
        .pipe(clean());
});
 //src/js下的所有js文件只要改动了就执行scripts任务
gulp.task('watch', function() {
    gulp.watch('src/js/*.js', ['scripts']);
    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('src/imgs/*.{png,jpg,gif,ico}', ['imagemin']);
});
