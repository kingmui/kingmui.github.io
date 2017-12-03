---
title: 将Hexo源码备份到GitHub分支上
date: 2017-5-20 16:36:25
tags:
  - Hexo
  - Tips
---

把Hexo的源码备份到Github分支里面，思路就是上传到分支里存储，修改本地的时候先上传存储，再发布。更换电脑的时候再将源文件下载下来。
{% codeblock %}
$ git add .
$ git commit -m "backup"
$ git push origin master:Hexo
{% endcodeblock %}
现在你会发现github仓库已经有了一个新分支Hexo，我们的备份工作完成。
以后，本地写好博文之后，可以先执行
{% codeblock %}
$ git add .
$ git commit -m "backup"
$ git push origin master:Hexo
{% endcodeblock %}
进行备份，然后<!-- more -->
{% codeblock %}
$ hexo d -g
{% endcodeblock %}
进行更新静态文件。这里推荐先进行备份，因为万一更新网站之后不小心丢失了源文件，就又得重新再来了。