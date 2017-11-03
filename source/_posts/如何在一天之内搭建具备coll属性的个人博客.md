---
title: 如何在一天之内搭建具备coll属性的个人博客
date: 2017-5-18 14:24:26
updated: 2017-8-19 20:12:54
reward: true
toc: true
tags:
  - Hexo
  - cool things
  - Tips
---

{% blockquote %}
对程序员而言，最好的简历就是个人博客和 GitHub
{% endblockquote %}

### 零、安装

{% codeblock %}
$ git clone https://github.com/litten/hexo-theme-yilia.git themes/yilia
{% endcodeblock %}

Hexo 目录结构<!-- more -->
{% img http://oytx6hj82.bkt.clouddn.com/site-tree.png 400 Hexo 目录结构 %}
- `_config.yml`是整体的配置文件，很多基础配置、插件配置等都需要在里面进行。要注意的是，该文件格式要求极为严格，缺少一个空格都会导致运行错误。小提示：不要用 Tab 缩进，用两个空格符。
- `public`这个文件夹是最终会发布到网站上的真实内容。怎么理解呢？我们可以把 public 文件夹当作是真正的被用户看到的，而其他的 source、themes 等都是为 public 服务的。Hexo 里有一个很重要的指令 hexo generate，这个指令就是利用所有代码里的配置信息、source 里写的文章、themes 里的样式，共同生成最终的静态 html 文件，存入 public 文件夹内。在我们执行了发布指令 hexo deploy 后，就会把 public 的内容部署到 GitHub Pages 上。当用户在访问我们的博客时，他们会看到 public 里生成的 html 文件。这个概念非常重要，即代码和真实静态页面是独立的。
更多信息请查看：[如何在一天之内搭建以你自己名字为域名且具备 cool 属性的个人博客](http://www.jianshu.com/p/99665608d295)

### 一、配置博客根目录

更改博客根目录（注：非主题根目录）下面的 `_config.yml` 里面的 `theme: landscape` 为`theme: yilia`
我的配置如下：
```basic _config.yml
# Hexo Configuration
## Docs: https://hexo.io/docs/configuration.html
## Source: https://github.com/hexojs/hexo/
# Site
title: King Mui 的博客
subtitle: 用艺术的眼光发现技术的美
description: 原来我和我的影子都在偷偷的哭泣
author: King Mui
language: zh-Hans
# timezone:
email: muikinghk@yahoo.com.hk
keywords: "前端开发,front-end,js,jquery,javascript,bootstrap,html5, 程序猿, 编程, 代码, 个人博客,Developer,Programmer,Coder,html,css,css3"
# URL
## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
url: https://github.com/kingmui.github.io
root: /
permalink: :year/:month/:day/:title/
tag_dir: tags
archive_dir: archives
category_dir: categories
code_dir: downloads/code
permalink_defaults:
# Directory
source_dir: source
public_dir: public
i18n_dir: :lang
# skip_render:
# Writing
new_post_name: :title.md # File name of new posts
default_layout: post
titlecase: false # Transform title into titlecase
external_link: true # Open external links in new tab
filename_case: 0
render_drafts: false
post_asset_folder: true
relative_link: false
future: true
highlight:
  enable: true
  line_number: true
  auto_detect: false
  tab_replace: ''
# Category & Tag
default_category: uncategorized
category_map:
tag_map:
# Archives
## 2: Enable pagination
## 1: Disable pagination
## 0: Fully Disable
archive: 1
category: 1
tag: 1
# Server
## Hexo uses Connect as a server
## You can customize the logger format as defined in
## http://www.senchalabs.org/connect/logger.html
port: 4000
server_ip: localhost
logger: false
logger_format: dev
# Date / Time format
## Hexo uses Moment.js to parse and display date
## You can customize the date format as defined in
## http://momentjs.com/docs/#/displaying/format/
date_format: YYYY-MM-DD
time_format: HH:mm:ss
# Pagination
## Set per_page to 0 to disable pagination
per_page: 5
pagination_dir: page
# Disqus
disqus_shortname:
# Extensions
## Plugins: https://github.com/hexojs/hexo/wiki/Plugins
## Themes: https://github.com/hexojs/hexo/wiki/Themes
# plugins:
#  - hexo-generator-feed
#  - hexo-generator-baidu-sitemap
#  - hexo-generator-sitemap
theme: yilia
exclude_generator:
# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type: git
  repo: git@github.com:kingmui/kingmui.github.io.git
  branch: master
  # message: Update
# deploy:
#   type: rsync
#   host: 120.24.181.238
#   user: root
#   root: /usr/local/nginx/litten.me/
#   port: 22
# hexo sitemap 网站地图
sitemap:
    path: sitemap.xml
baidusitemap:
    path: baidusitemap.xm
feed:
    type: atom
    path: atom.xml
    limit: 100
jsonContent:
    meta: false
    pages: false
    posts:
      title: true
      date: true
      path: true
      text: false
      raw: false
      content: false
      slug: false
      updated: false
      comments: false
      link: false
      permalink: false
      excerpt: false
      categories: false
      tags: true
# Home page setting
# path: Root path for your blogs index page. (default ='')
# per_page: Posts displayed per page. (0 = disable pagination)
# order_by: Posts order. (Order by date descending by default)
# index_generator:
#   path: ''
#   per_page: 10
#   order_by: -date
```

### 二、配置主题根目录

{% blockquote %}
主题的配置文件在 `themes/yilia/_config.yml`文件里面
{% endblockquote %}
- 头像
{% codeblock %}
// 可以给 GitHub 头像的链接地址
avatar: "https://avatars2.githubusercontent.com/u/24365000?s=460&v=4"
{% endcodeblock %}
- 站点图标
{% codeblock %}
// 将 favicon 放在 Hexo 博客根目录 source 文件夹下
favicon: /favicon.png
{% endcodeblock %}
- 打赏
{% codeblock %}
// 打赏功能默认开启，可以设置 reward_type 的值改变初始状态，可接受的值为 0（关闭打赏）、1（文章对应的 MD 文件里有 reward:true 属性时，才有打赏）、2（所有文章均有打赏）
reward_type: 2
{% endcodeblock %}
我的配置如下：
```basic _config.yml
# Header
menu:
  主页: /
  简历: /resume
  # 随笔: /tags/ 随笔 /
  # 所有文章: /archives
# SubNav
subnav:
  github: "https://github.com/kingmui"
  # weibo: "#"
  # rss: "#"
  # zhihu: "#"
  #qq: "#"
  #weixin: "#"
  #jianshu: "#"
  #douban: "#"
  #segmentfault: "#"
  #bilibili: "#"
  #acfun: "#"
  mail: "mailto:muikinghk@yahoo.com.hk"
  facebook: "https://www.facebook.com/KINGMUIHK"
  #google: "#"
  twitter: "https://twitter.com/MUIKINGHK"
  #linkedin: "#"
rss: /atom.xml
# 是否需要修改 root 路径
# 如果您的网站存放在子目录中，例如 http://yoursite.com/blog，
# 请将您的 url 设为 http://yoursite.com/blog 并把 root 设为 /blog/。
root: 
# Content
# 文章太长，截断按钮文字，在 MD 文件中使用 <!-- more --> 标签来隐藏其下面的内容
excerpt_link: more
# 文章卡片右下角常驻链接，不需要请设置为 false
show_all_link: '查看全文'
# 数学公式
mathjax: false
# 是否在新窗口打开链接
open_in_new: false
# 是否开启动画效果
animate: true
# 打赏
# 打赏 type 设定：0- 关闭打赏； 1- 文章对应的 md 文件里有 reward:true 属性，才有打赏； 2- 所有文章均有打赏
reward_type: 1
# 打赏 wording
reward_wording: '谢谢你请我吃糖果'
# 支付宝二维码图片地址，跟你设置头像的方式一样。比如：/assets/img/alipay.jpg
alipay: 
# 微信二维码图片地址
weixin: 
# 目录
# 目录设定：0- 不显示目录； 1- 文章对应的 md 文件里有 toc:true 属性，才有目录； 2- 所有文章均显示目录
toc: 1
# 根据自己的习惯来设置，如果你的目录标题习惯有标号，置为 true 即可隐藏 hexo 重复的序号；否则置为 false
toc_hide_index: true
# 目录为空时的提示
toc_empty_wording: '目录，不存在的…'
# 是否有快速回到顶部的按钮
top: true
# Miscellaneous
baidu_analytics: ''
google_analytics:''
favicon: /favicon.png
# 你的头像 url
avatar: "https://avatars2.githubusercontent.com/u/24365000?s=460&v=4"
# 是否开启分享
share_jia: true
# 评论：1、多说；2、网易云跟帖；3、畅言；4、Disqus；5、Gitment
# 不需要使用某项，直接设置值为 false，或注释掉
# 具体请参考 wiki：https://github.com/litten/hexo-theme-yilia/wiki/
#1、多说
duoshuo: false
#2、网易云跟帖
wangyiyun: false
#3、畅言
changyan_appid: false
changyan_conf: false
#4、Disqus 在 hexo 根目录的 config 里也有 disqus_shortname 字段，优先使用 yilia 的
disqus: false
#5、Gitment
gitment_owner: false      #你的 GitHub ID
gitment_repo: ''# 存储评论的 repo
gitment_oauth:
  client_id:''           #client ID
  client_secret: ''#client secret
# 样式定制 - 一般不需要修改，除非有很强的定制欲望…
style:
  # 头像上面的背景颜色
  header:'#4d4d4d'
  # 右滑板块背景
  slider:'linear-gradient(200deg,#a0cfe4,#e8c37e)'
# slider 的设置
slider:
  # 是否默认展开 tags 板块
  showTags: false
# 智能菜单
# 如不需要，将该对应项置为 false
# 比如
#smart_menu:
#  friends: false
smart_menu:
  innerArchive:' 所有文章 '
  # friends:' 友链 '
  friends: false
  aboutme:' 关于我 '
friends:
  友情链接 1: http://localhost:4000/
aboutme: 一枚前端开发技术狗 <br><br> 正在寻找工作中...<br> 如有工作机会，请联络我 <br> 谢谢老板 <br><br> 邮箱：muikinghk@yahoo.com.hk
```

### 三、使用 yilia 主题遇到的一些问题的解决方案

- 点击所有文章提示模块缺失
  - 确保 node 版本大于 6.2
  - 在博客根目录（注：非主题根目录）执行如下命令：`npm i hexo-generator-json-content --save`
  - 在博客根目录 `_config.yml` 里添加配置（保持格式，不要改动任何空格缩进），执行 `hexo clean && hexo g` 之后执行 `hexo g` 重新生成博客
{% codeblock %}
jsonContent:
    meta: false
    pages: false
    posts:
        title: true
        date: true
        path: true
        text: false
        raw: false
        content: false
        slug: false
        updated: false
        comments: false
        link: false
        permalink: false
        excerpt: false
        categories: false
        tags: true
{% endcodeblock %}
- 发布的文章在主页会全部显示出来，这样会非常不协调
  - 可以使用 `<!-- more -->` 标签来隐藏其下面的内容。
- 网站出现中文乱码
  - 出现该问题是因为使用了记事本编辑并保存了 `_config.yml` 文件，记事本默认使用 `ANSI` 编码格式对文件进行保存，而网站的编码格式为 `UTF-8`，解决办法是使用记事本打开`_config.yml` 文件并另存为，此时选择编码格式为`UTF-8`。

### 四、中英文自动添加空格

不少有追求的开发者在写博客时追求格式优雅，比如中英文间隔。为了达到这个目的，很多时候就不得不在写文时反复调整英文单词与中文的空格。
这里介绍一个小巧的插件：[Auto-Spacing](https://github.com/hexojs/hexo-filter-auto-spacing)，它会在 markdown 文章转化成 html 时，自动为中英文添加空格。
安装方法：
在项目根目录下，执行
{% codeblock %}
npm install hexo-filter-auto-spacing --save
{% endcodeblock %}
执行完后可以在根目录的 package.json 里找到一行
{% codeblock %}
denpendency`:`"hexo-filter-auto-spacing": "^0.2.1"
{% endcodeblock %}
**提醒**
使用这个工具要留意一点：如果你在文章里使用了中英文混合的 url，该插件也会将中英文分隔开，此时路径将无效，因此，这里推荐所有图片等资源的 url 都使用英文。