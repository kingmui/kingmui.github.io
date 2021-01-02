let gulp = require('gulp'),
    // imageminPngquant = require('imagemin-pngquant'),
    $ = require('gulp-load-plugins')();

// 压缩 html
gulp.task('html', function () {
    return gulp.src('./public/**/*.html')
        .pipe($.htmlclean())
        .pipe($.htmlmin({
            collapseWhitespace: true, // 折叠有助于文档树中文本节点的空白区域
            minifyCSS: true,
            minifyJS: true,
            minifyURLs: true, // 使用 relatedurl 压缩各种属性中的 URL
            keepClosingSlash: true, // 单标签保留尾部斜杠
            removeAttributeQuotes: true, // 尽可能删除属性周围的引号
            removeEmptyAttributes: true, // 删除所有空格作属性值
            removeComments: true, // 清除HTML注释
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true
        }))
        .pipe(gulp.dest('./public'));
});

// 压缩图片
// gulp.task('image', () => {
//     return gulp.src('./public/images/*')
//         .pipe($.cache($.imagemin({
//             interlaced: true,
//             progressive: true,
//             optimizationLevel: 5,
//             svgoPlugins: [{ removeViewBox: true }],
//             // 使用pngquant深度压缩png图片的imagemin插件
//             use: [imageminPngquant()]
//         })))
//         .pipe(gulp.dest('./public/images/'))
// });

// 清除缓存
// gulp.task('clearCache', () =>
//     $.cache.clearAll()
// );

// 压缩 css
// gulp.task('css', function() {
//     return gulp.src('./public/**/*.css')
//         .pipe($.cleanCss({compatibility: 'ie8', debug: true}, (details) => {
//             console.log(`${details.name}: ${details.stats.originalSize}`);
//             console.log(`${details.name}: ${details.stats.minifiedSize}`);
//           }))
//         .pipe(gulp.dest('./public'));
// });

// 压缩 js
// gulp.task('js', function() {
//     return gulp.src('./public/**/*.js')
//         .pipe($.uglify())
//         .pipe(gulp.dest('./public'));
// });

// 执行 gulp 命令时执行的任务
gulp.task('default', [
    'html',
]);
