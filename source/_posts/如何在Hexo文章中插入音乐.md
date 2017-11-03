---
title: 如何在Hexo文章中插入音乐
date: 2017-5-22 15:32:37
reward: true
tags:
  - Hexo
  - cool things
  - Tips
---

[博客原文](http://www.jianshu.com/p/6e41e3191963)
hexo添加音乐目前接触到的有两种方案：
  1. 在官方网站获取外链，比如网易云音乐等
  2. 自己生成外链，插入文章
对于方案一，在使用过程中，遇到的问题就是 很多音乐由于版权原因无法生成外链！！！ 这个很尴尬，而且这个影响网站的SEO，逼格也不够高。
无奈之下选择方案二，本教程集中阐述方案二！！
经过使用总结，其实方案二还是很不错的！甚至胜过方案一！！
<!-- more -->
下面我就隆重介绍一款html5音乐播放器：[Aplayer](https://github.com/DIYgod/APlayer)。把Aplayer加入hexo需要用到[hexo-tag-aplayer](https://github.com/MoePlayer/hexo-tag-aplayer)插件。
切换到hexo目录，运行：
{% codeblock %}
npm install --save hexo-tag-aplayer
{% endcodeblock %}
安装完成后，在需要添加音乐的地方加上：
```basic
{% aplayer "歌曲名称" "作者" "音乐_url" "封面图片_url" "autoplay" %}
```
`hexo d --g`之后就会出现你想要的音乐啦！
如果你想加入歌单，把上面的代码换成下面代码就行，参数的用法可以参照插件的使用说明。
```basic
{% aplayerlist %}{"narrow": false,"autoplay": true,"showlrc": 3,"mode": "random","music": [{"title": "平凡之路","author": "朴树","url": "http://og9ocpmwk.bkt.clouddn.com/%E5%B9%B3%E5%87%A1%E4%B9%8B%E8%B7%AF.mp3","pic": "https://ogd99kckh.qnssl.com/1.jpg","lrc": "http://og9ocpmwk.bkt.clouddn.com/%E5%B9%B3%E5%87%A1%E4%B9%8B%E8%B7%AF.txt"},{"title": "野子","author": "苏运莹","url": "http://og9ocpmwk.bkt.clouddn.com/01%20%E9%87%8E%E5%AD%90.m4a","pic": "http://og9ocpmwk.bkt.clouddn.com/%E9%87%8E%E5%AD%90.jpg","lrc":"https://ogd99kckh.qnssl.com/%E9%87%8E%E5%AD%90.txt"}]}{% endaplayerlist %}
```
当然，Aplayer的作者还有一款html5的视频播放器，叫[Dplayer](https://github.com/DIYgod/DPlayer)，对应有一款hexo的插件，叫[hexo-tag-dplayer](https://github.com/NextMoe/hexo-tag-dplayer)，有需求的可以去看看，用法都差不多。