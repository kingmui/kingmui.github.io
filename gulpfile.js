const gulp = require("gulp");
const $ = require("gulp-load-plugins")();

// 压缩 html
gulp.task("html", gulp.series(() => {
  return gulp
    .src("./public/**/*.html")
    .pipe($.htmlclean())
    .pipe(
      $.htmlmin({
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
        useShortDoctype: true,
      })
    )
    .pipe(gulp.dest("./public"));
}));

gulp.task("default", gulp.series("html"));
