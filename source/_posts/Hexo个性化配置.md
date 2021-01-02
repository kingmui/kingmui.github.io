---
title: Hexo个性化配置
date: 2016-11-24 19:17:46
tags:
  - Hexo
comments: true
---

### SEO 优化

#### 给你的 hexo 站点添加 sitemap 网站地图

1. 安装 hexo 的 sitemap 网站地图生成插件

```bash
npm install hexo-generator-sitemap --save
npm install hexo-generator-baidu-sitemap --save
```

2. 在你的 hexo 站点的 `_config.yml` 文件中添加以下代码

```bash
# hexo sitemap网站地图
sitemap:
  path: sitemap.xml
baidusitemap:
  path: baidusitemap.xml
```

3. 配置成功后，hexo 编译时会在 hexo 站点根目录生成 `sitemap.xml` 和 `baidusitemap.xml`。
   其中 `sitemap.xml` 适合提交给谷歌搜素引擎，`baidusitemap.xml` 适合提交百度搜索引擎。

4. 给你的 hexo 网站添加蜘蛛协议 `robots.txt`。把 `robots.txt` 放在你的 hexo 站点的 `source` 文件下即可。代码如下：

<!-- more -->

```bash
# hexo robots.txt
User-agent: *
Allow: /
Allow: /archives/

Disallow: /vendors/
Disallow: /js/
Disallow: /css/
Disallow: /fonts/
Disallow: /vendors/
Disallow: /fancybox/

Sitemap: http://www.kingmui.cn/sitemap.xml
Sitemap: http://www.kingmui.cn/baidusitemap.xml
```

5. 主动推送 Hexo 博客新链接至百度搜索引擎
   为了解决百度爬虫被禁止访问的问题，提升网站收录质量和速度。推荐安装 [hexo-baidu-url-submit](https://github.com/huiwang/hexo-baidu-url-submit)

```bash
# baidu_url_submit 配置
baidu_url_submit:
  count: 1000 ## 提交最新的一个链接
  host: alili.tech ## 在百度站长平台中注册的域名
  token: xxxxx ## 请注意这是您的秘钥， 所以请不要把博客源代码发布在公众仓库里!
  path: baidu_urls.txt ## 文本文档的地址， 新链接会保存在此文本文档里
  xz_appid: 'xxxxxx' ## 你的熊掌号 appid
  xz_token: 'xxxxxx' ## 你的熊掌号 token
  xz_count: 10 ## 从所有的提交的数据当中选取最新的10条,该数量跟你的熊掌号而定
# deploy 配置
deploy:
- type: baidu_url_submitter # 百度
- type: baidu_xz_url_submitter # 百度熊掌号
```

#### 给非友情链接的出站链接添加 “nofollow” 标签

经过 chinaz 站长工具友情链接检测，发现有不必要的 PR 值输出，对于非友情链接的 PR 值输出，我们可以加上 nofollow 便签避免不必要的 PR 输出。这里推荐使用 [hexo-autonofollow](https://github.com/liuzc/hexo-autonofollow)，它会自动将 nofollow 属性添加到 hexo 博客文章中的所有外部链接。 配置如下：

```bash
nofollow:
  enable: true
  exclude:
    - kingmui.cn
```

### 域名解析

由于 Github Pages 是有限制的，它不允许任意域名都跳转过来，而是只限制一个域名，而且这个域名必须声明在 CNAME 文件中。所以，我们需要添加一个 CNAME 文件到项目的 master 中才行。我们使用 [hexo-generator-cname](https://github.com/leecrossley/hexo-generator-cname) 来自动在 public 里生成一个 CNAME 文件！

```bash
# 注意：只需安装即可，不要在 _config.yml 启用
npm install hexo-generator-cname --save
```

### RSS 订阅

目前很多人喜欢用 RSS 阅读器来实时更新某些作者的文章。这里我们利用插件 [hexo-generator-feed](https://github.com/hexojs/hexo-generator-feed) 来实现这个功能。

1. 安装

```bash
npm install hexo-generator-feed –save
```

2. 修改 `_config.yml`，具体设置可以参考官方链接里的指示

```bash
feed:
  type: atom
  path: atom.xml
  limit: 20
  hub:
  content:
  content_limit: 140
  content_limit_delim: ' '
  order_by: -date
```

3. 在 themes/next/\_config.yml 里的 menu 添加 `rss: /atom.xml`
4. 在 themes/next/languages/zh-CN.yml 里的 `menu` 添加中文翻译 `rss: RSS`

### 个人简历页面

对于一个优秀的博主而言，每天会有很多开发者进入到他的博客。
而无论出于职业生涯还是个人影响力的角度考虑，在博客里放置个人简历是一个很好的展示自己的机会。
下面我们来利用 hexo 的 page 功能来创建一个新页面，然后用 markdown 来填充这个简历页面。

1. 利用 `hexo new page "resume"`，可以看到 `source` 文件夹下出现了 `resume` 目录，里面有一个 `index.md` 文件；
2. 在 `themes/next/_config.yml` 里的 `menu:` 下添加 `resume: /resume`，它会在首页创建一个新的 menu: resume 入口；
3. 在 `index.md` 文件里填写自己的简历即可。

### 修改文章内链接的样式

修改路径：`themes/next/sources/css/_common/components/post/post.styl`

```sass
.exturl {
  color: #0593d3;
  border-bottom: none;
  border-bottom: 1px solid #0593d3;
  &:hover {
    color: #fc6423;
    border-bottom: none;
    border-bottom: 1px solid #fc6423;
  }
  .fa {
    font-size: $font-size-small;
    margin-left: 4px;
  }
}
```

### 文末感谢大家的阅读

1. 添加如下配置到 `themes/next/_config.yml`

```yml
# 文章末尾添加 "本文结束" 标记
post_end_tag:
  enabled: true
```

2. 在 `themes/next/layout/_partials/post` 下新建文件 `post-end-tag.swig`，并且添加如下内容：

```html
<div style="text-align:center; color: #ccc; font-size:14px; padding: 10px 0">-------------本文结束 <i class="fa fa-paw"></i> 感谢您的阅读-------------</div>
```

3. 添加到 `themes/next/lauyout/_macro/post.swig` 文件中

```html
<!-- 在 END POST BODY 下面添加如下代码 -->
{%- if theme.post_end_tag.enabled and not is_index %}
  {{ partial('_partials/post/post-end-tag.swig') }}
{% endif %}
```

### 文章底部添加版权信息

1. 在 `themes/next/layout/_macro` 目录下新建文件 `my-copyright.swig`，内容如下：

```html
{% if page.copyright %}
<div class="my_post_copyright">
  <script src="//cdn.bootcss.com/clipboard.js/1.5.10/clipboard.min.js"></script>
  <script src="/lib/jquery/index.js?v=2.1.3"></script>
  <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
  <p><span>本文标题:</span><a href="{{ url_for(page.path) }}">{{ page.title }}</a></p>
  <p><span>文章作者:</span><a href="/" title="访问 {{ theme.author }} 的个人博客">{{ theme.author }}</a></p>
  <p><span>发布时间:</span>{{ page.date.format("YYYY年MM月DD日 - HH:MM") }}</p>
  <p><span>最后更新:</span>{{ page.updated.format("YYYY年MM月DD日 - HH:MM") }}</p>
  <p><span>原始链接:</span><a href="{{ url_for(page.path) }}" title="{{ page.title }}">{{ page.permalink }}</a>
    <span class="copy-path"  title="点击复制文章链接"><i class="fa fa-clipboard" data-clipboard-text="{{ page.permalink }}"  aria-label="复制成功！"></i></span>
  </p>
  <p><span>许可协议:</span><i class="fa fa-creative-commons"></i> <a rel="license" href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" title="Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)">署名-非商业性使用-禁止演绎 4.0 国际</a> 转载请保留原文链接及作者。</p>
</div>
<script>
  var clipboard = new Clipboard('.fa-clipboard');
  $('.fa-clipboard').click(function(){
  clipboard.on('success', function(){
    swal({
      title: "",
      text: '复制成功',
      icon: "success",
      showConfirmButton: true
      });
    });
  });
</script>
{% endif %}
```

2. 在 `themes/next/source/css/_common/components/post/` 新建文件 `my-post-copyright.styl`

```sass
.my_post_copyright {
  width: 85%;
  max-width: 45em;
  margin: 2.8em auto 0;
  padding: 0.5em 1.0em;
  border: 1px solid #d3d3d3;
  font-size: 0.93rem;
  line-height: 1.6em;
  word-break: break-all;
  background: rgba(255,255,255,0.4);
}
.my_post_copyright p{margin:0;}
.my_post_copyright span {
  display: inline-block;
  width: 5.2em;
  color: #b5b5b5;
  font-weight: bold;
}
.my_post_copyright .raw {
  margin-left: 1em;
  width: 5em;
}
.my_post_copyright a {
  color: #808080;
  border-bottom:0;
}
.my_post_copyright a:hover {
  color: #a3d2a3;
  text-decoration: underline;
}
.my_post_copyright:hover .fa-clipboard {
  color: #000;
}
.my_post_copyright .post-url:hover {
  font-weight: normal;
}
.my_post_copyright .copy-path {
  margin-left: 1em;
  width: 1em;
  +mobile(){display:none;}
}
.my_post_copyright .copy-path:hover {
  color: #808080;
  cursor: pointer;
}
```

3. 修改 `next/layout/_macro/post.swig` 文件，添加如下代码：

```html
{% if not is_index %}
<div>{% include 'my-copyright.swig' %}</div>
{% endif %}
```

4. 修改 `next/sources/css/_common/components/post/post.styl` 文件，添加如下代码：

```css
@import 'my-post-copyright';
```

5. 若文章需要版权声明可添加 `copyright: true`。

### Algolia 搜索服务

1. 前往 [Algolia 注册页面](https://www.algolia.com/)，注册一个新账户。 可以使用 GitHub 或者 Google 账户直接登录，注册后的 14 天内拥有所有功能（包括收费类别的）。之后若未续费会自动降级为免费账户，免费账户 总共有 10,000 条记录，每月有 100,000 的可以操作数。注册完成后，创建一个新的 Index，这个 Index 将在后面使用。

2. Index 创建完成后，此时这个 Index 里未包含任何数据。 接下来需要安装 Hexo Algolia 扩展， 这个扩展的功能是搜集站点的内容并通过 API 发送给 Algolia。前往站点根目录，执行命令安装：

```bash
npm install --save hexo-algolia
```

3. 在 Algolia 服务站点上找到需要使用的一些配置的值，包括 ApplicationID、Search-Only API Key、 Admin API Key。注意，Admin API Key 需要保密保存。点击 ALL API KEYS 找到新建 INDEX 对应的 key， 编辑权限，在弹出框中找到 ACL 选择勾选 Add records, Delete records, List indices, Delete index 权限，点击 update 更新。

编辑 `站点配置文件`，新增以下配置：

```bash
# 替换除了 chunkSize 以外的其他字段为在 Algolia 获取到的值。
algolia:
  applicationID: 'applicationID'
  indexName: 'indexName'
  chunkSize: 5000
```

4. 当配置完成，在站点根目录下执行

```bash
export(windows 为 set) HEXO_ALGOLIA_INDEXING_KEY=Search-Only API key
hexo clean
hexo algolia
```

来更新 Index。请注意观察命令的输出。

5. 更改主题配置文件，找到 Algolia Search 配置部分：

```bash
# Algolia Search
algolia_search:
  enable: true
  hits:
    per_page: 10
  labels:
    input_placeholder: Search for Posts
    hits_empty: "We didn't find any results for the search: ${query}"
    hits_stats: "${hits} results found in ${time} ms"
```

### DaoVoice 实现在线联系

1. [注册登录](http://dashboard.daovoice.io/get-started?invite_code=256cc8bd)填写邀请码（256cc8bd）。
   完成注册后，修改 `themes/next/layout/_partials/head.swig` 添加下面的代码:

```html
{% if theme.daovoice %}
<script>
  (function(i, s, o, g, r, a, m) {
    i['DaoVoiceObject'] = r;
    (i[r] =
      i[r] ||
      function() {
        (i[r].q = i[r].q || []).push(arguments);
      }),
      (i[r].l = 1 * new Date());
    (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
    a.async = 1;
    a.src = g;
    a.charset = 'utf-8';
    m.parentNode.insertBefore(a, m);
  })(window, document, 'script', ('https:' == document.location.protocol ? 'https:' : 'http:') + '//widget.daovoice.io/widget/{{theme.daovoice_app_id}}.js', 'daovoice');
  daovoice('init', {
    app_id: '{{theme.daovoice_app_id}}'
  });
  daovoice('update');
</script>
{% endif %}
```

2. 修改主题的配置文件

```bash
# Online contact
daovoice: true
daovoice_app_id: 我们注册获取的id
```

### 添加腾讯空间 404 公益页面

新建 `404.html` 页面，将下面代码拷进去保存，放到主题的 `source` 目录下即可：

```html
<!DOCTYPE html>
<html>
  <head>
    <title>404公益页面-宝贝回家志愿者协会-King Mui</title>
    <meta http-equiv="content-type" content="text/html;charset=utf-8;" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="robots" content="all" />
    <meta name="robots" content="index,follow" />
    <link rel="apple-touch-icon" sizes="180x180" href="https://cdn.kingmui.cn/avatar.jpg?v=6.5.0" />
    <link rel="icon" type="image/png" sizes="32x32" href="https://cdn.kingmui.cn/avatar.jpg?v=6.5.0" />
    <link rel="icon" type="image/png" sizes="16x16" href="https://cdn.kingmui.cn/avatar.jpg?v=6.5.0" />
    <link rel="stylesheet" type="text/css" href="https://qzone.qq.com/gy/404/style/404style.css" />
    <style>
      .mod_404 .desc .desc_link {
        text-decoration: none !important;
        color: #4599ff;
      }
      .mod_404 .desc .desc_link:hover {
        color: #2e8cff;
      }
    </style>
  </head>
  <body>
    <script type="text/plain" src="https://www.qq.com/404/search_children.js" charset="utf-8" homePageUrl="/" homePageName="回到我的主页"></script>
    <script src="https://qzone.qq.com/gy/404/data.js" charset="utf-8"></script>
    <script src="https://qzone.qq.com/gy/404/page.js" charset="utf-8"></script>
  </body>
</html>
```

### 利用 Gulp 压缩代码

```javascript
let gulp = require('gulp'),
  imageminPngquant = require('imagemin-pngquant'),
  $ = require('gulp-load-plugins')();

// 压缩 html
gulp.task('html', function() {
  return gulp
    .src('./public/**/*.html')
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
        useShortDoctype: true
      })
    )
    .pipe(gulp.dest('./public'));
});

// 压缩图片
gulp.task('image', () => {
  return gulp
    .src('./public/images/*')
    .pipe(
      $.cache(
        $.imagemin({
          interlaced: true,
          progressive: true,
          optimizationLevel: 5,
          svgoPlugins: [{ removeViewBox: true }],
          // 使用pngquant深度压缩png图片的imagemin插件
          use: [imageminPngquant()]
        })
      )
    )
    .pipe(gulp.dest('./public/images/'));
});

// 清除缓存
gulp.task('clearCache', () => $.cache.clearAll());

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
gulp.task('default', ['html']);
```
