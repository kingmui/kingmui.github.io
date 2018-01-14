---
title: 使用 Git Hook 自动部署 Hexo 到个人 VPS
date: 2018-03-24 15:27:03
tags:
  - Git
  - Hexo
---

### CentOS 升级 Git 到最新版本

CentOS 上的 Git 最新版本只有1.8.3，因此我们需要自己重新安装一遍 。

#### 卸载旧版本 Git

```bash
# 安装 Development tools
$ yum -y groupinstall Development tools

# GCC 用于编译安装包
$ yum install gcc perl-ExtUtils-MakeMaker

# *卸载 CentOS 自带的老版本 Git
$ yum -y remove git

# 安装前环境配置
$ yum install -y curl-devel expat-devel gettext-devel openssl-devel zlib-devel asciidoc xmlto perl-devel perl-CPAN autoconf*

# 系统检测(CentOS 7.4 64位)
$ cat /etc/centos-release
CentOS Linux release 7.4.1708 (Core)
$ uname -a
Linux rmhost 3.10.0-693.2.2.el7.x86_64 #1 SMP Tue Sep 12 22:26:13 UTC 2017 x86_64 x86_64 x86_64 GNU/Linux
```

<!-- more -->

#### 下载 Git

```bash
# 选择安装目录
$ cd /usr/src
# *下载最新版 git
$ wget https://github.com/git/git/archive/v2.16.3.tar.gz
# *解压
$ tar zxvf v2.16.3.tar.gz
```

#### 编译安装

```bash
$ cd git-2.16.3
$ make configure
$ ./configure --prefix=/usr/local/git --with-iconv=/usr/local/libiconv
$ make all doc
$ make install install-doc install-html
```

#### 修改环境变量

```bash
$ vim /etc/profile
# *在最后一行添加
export PATH=/usr/local/git/bin:$PATH
# *保存后使其立即生效
$ source /etc/profile
```

#### 检测

```bash
$ git --version
```

### 配置服务器远程 Git

大家都知道 Git 是分布式的版本控制系统，远程仓库跟本地仓库是没什么不同的。

#### 创建用户

{% note danger %}
虽说现在的仓库只有我们自己在使用，新建一个 `git` 用户显得不是很有必要，但是为了安全起见，还是建议使用单独的 `git` 用户来专门运行 `git` 服务
{% endnote %}

创建一个 `git` 用户，用来运行 `git` 服务：

```bash
$ adduser git
$ chmod 740 /etc/sudoers
$ vim /etc/sudoers
# *找到以下内容
## Allow root to run any commands anywhere
root    ALL=(ALL)     ALL
# *在下面添加一行
git ALL=(ALL) ALL
# *保存退出后改回权限
$ chmod 400 /etc/sudoers
# *设置Git用户密码
# 需要root权限
$ sudo passwd git
```

#### 创建证书登录

把自己电脑的[公钥](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/)，也就是 `~/.ssh/id_rsa.pub` 文件里的内容添加到服务器的 `/home/git/.ssh/authorized_keys` 文件中，添加公钥之后可以防止每次 push 都需要输入密码。

```bash
# *切换至 git 用户，创建 ~/.ssh 文件夹和 ~/.ssh/authorized_keys 文件，并赋予相应的权限
$ su git
$ mkdir ~/.ssh
$ vim ~/.ssh/authorized_keys
# 然后在电脑中执行 cat ~/.ssh/id_rsa.pub | pbcopy ,将公钥复制粘贴到 authorized_keys
$ chmod 600 ~/.ssh/authorzied_keys
$ chmod 700 ~/.ssh
# 然后就可以执行ssh 命令测试是否可以免密登录
$ ssh -v git@SERVER
```

#### 初始化 Git 仓库

我是将其放在 `/var/repo/blog.git` 目录下的：

```bash
$ sudo mkdir /var/repo
$ cd /var/repo
$ sudo git init --bare blog.git
# 使用 --bare 参数，Git 就会创建一个裸仓库，裸仓库没有工作区，我们不会在裸仓库上进行操作，它只为共享而存在。
```

#### 配置 git hooks

关于 hooks 的详细内容可以[参考这里](https://git-scm.com/book/zh/v2/%E8%87%AA%E5%AE%9A%E4%B9%89-Git-Git-%E9%92%A9%E5%AD%90)。

我们这里要使用的是 `post-receive` 的 hook，这个 hook 会在整个 git 操作过程完结以后被运行。

在 `blog.git/hooks` 目录下新建一个 `post-receive` 文件：

```bash
$ cd /var/repo/blog.git/hooks
$ vim post-receive
```

在 `post-receive` 文件中写入如下内容：

```bash
#!/bin/sh
git --work-tree=/var/www/kingmui --git-dir=/var/repo/blog.git checkout -f
```

注意，`/var/www/kingmui` 要换成你自己的部署目录。上面那句 git 命令可以在我们每次 push 完之后，把部署目录更新到博客的最新生成状态。这样便可以完成达到自动部署的目的了。

不要忘记设置这个文件的可执行权限：

```bash
chmod +x post-receive
```

#### 变更拥有者

改变 `blog.git` 目录的拥有者为 `git` 用户：

```bash
$ sudo chown -R git:git blog.git
```

#### 禁用权限

出于安全考虑，我们要让 `git` 用户不能通过 shell 登录。可以编辑 `/etc/passwd` 来实现，在 `/etc/passwd` 中找到类似下面的一行：

```bash
git:x:1002:1002:,,,:/home/git:/bin/bash
```

将其改为：

```bash
git:x:1002:1002:,,,:/home/git:/usr/bin/git-shell
```

这样 `git` 用户可以通过 ssh 正常使用 git，但是无法登录 sehll。

至此，服务器端的配置就完成了。

### 本地配置

修改 hexo 目录下的 `_config.yml` 文件，找到 [deploy] 条目，并修改为：

```bash
deploy:
  type: git
  repo: git@www.kingmui.cn:/var/repo/blog.git
  branch: master
```

要注意切换成你自己的服务器地址，以及服务器端 git 仓库的目录。至此，我们的 hexo 自动部署已经全部配置好了。

### 使用

往后，要发布新博客只需按照如下步骤：

```bash
$ hexo new "new-post"
# bla..bla..bla..
$ hexo clean && hexo generate --deploy
```
