var gulp = require('gulp'),
    //��scss�ļ�תΪcss�ļ�
    sass = require('gulp-sass'),
    //���cssǰ׺��֧�ֲ�ͬ�����
    autoprefixer = require('gulp-autoprefixer'),
    //ѹ��css�ļ�
    minifycss = require('gulp-minify-css'),
    //���js�ļ��﷨����
    jshint = require('gulp-jshint'),
    //ѹ��js�ļ�
    uglify = require('gulp-uglify'),
    //ѹ��ͼƬ�ļ�
    imagemin = require('gulp-imagemin'),
    //���ļ�������
    rename = require('gulp-rename'),
    //ɾ��������ļ���
    clean = require('gulp-clean'),
    //�ϲ��ļ�(js��css����)
    concat = require('gulp-concat'),
    //gulp������ɺ����֪ͨ
    notify = require('gulp-notify'),
    //ͼƬ���棬ֻ��ͼƬ�滻�˲�ѹ��
    cache = require('gulp-cache'),
    //ͨ���ڹȸ�������ϰ�װlivereload�����ʵ���Զ�ˢ�£����谴F5
    livereload = require('gulp-livereload'),
    //�ڱ�������һ��Web Server
    connect = require('gulp-connect');;

gulp.task('default', ['clean', 'scripts', 'libs', 'sass', 'Imagemin', 'watch']);

//1 ���src/jsĿ¼�µ�js�ļ��﷨����2 �ϲ���Ŀ¼�µ�js�ļ�������Ϊmain.js�������build/js�£�3 ��main.js��������ѹ������build/js�£�4 ������Щ������ɺ����֪ͨ'Scripts task complete'
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
//��������Ĳ������
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
//��������Ĳ������
gulp.task('sass', function() {
    gulp.src(['src/scss/reset.scss','src/scss/*.scss'])
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(concat('main.css'))
        // .pipe(minifycss())
        .pipe(gulp.dest('build/css'));
});

//����һ�����ط�����
// gulp.task('webserver', function() {
//     connect.server();
// });

//ѹ��ͼƬ
gulp.task('Imagemin', function() {
    gulp.src('src/imgs/*.{png,jpg,gif,ico}')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('build/imgs'));
});

//���js��css�ļ��в������򴴽���������ɾ��
gulp.task('clean', function() {
    return gulp.src(['build/css'], {
            read: false
        })
        .pipe(clean());
});
 //src/js�µ�����js�ļ�ֻҪ�Ķ��˾�ִ��scripts����
gulp.task('watch', function() {
    gulp.watch('src/js/*.js', ['scripts']);
    gulp.watch('src/scss/*.scss', ['sass']);
    gulp.watch('src/imgs/*.{png,jpg,gif,ico}', ['imagemin']);
});
