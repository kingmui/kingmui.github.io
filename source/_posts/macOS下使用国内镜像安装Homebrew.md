---
title: macOS下使用国内镜像安装Homebrew
date: 2019-11-23 22:58:57
tags:
  - macOS
  - Homebrew
comments: true
---

{% img http://cdn.kingmui.cn/macos-install-homebrew.png %}

Homebrew 是一款自由及开放源代码的软件包管理系统，用以简化 macOS 系统上的软件安装过程。它拥有安装、卸载、更新、查看、搜索等很多实用的功能，通过简单的一条指令，就可以实现包管理，十分方便快捷。

### 获取最新安装脚本到本地编辑

```shell
cd ~

curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install >> brew_install
```

<!-- more -->

**编辑 brew_install 文件**

```shell
#!/usr/bin/ruby
# This script installs to /usr/local only. To install elsewhere (which is
# unsupported) you can untar https://github.com/Homebrew/brew/tarball/master
# anywhere you like.
HOMEBREW_PREFIX = "/usr/local".freeze
HOMEBREW_REPOSITORY = "/usr/local/Homebrew".freeze
HOMEBREW_CACHE = "#{ENV["HOME"]}/Library/Caches/Homebrew".freeze
# 注释掉下面这行
# BREW_REPO = "https://github.com/Homebrew/brew".freeze
# 替换USTC镜像
BREW_REPO = "https://mirrors.ustc.edu.cn/brew.git".freeze
# 或替换为阿里镜像
# BREW_REPO = "https://mirrors.aliyun.com/homebrew/brew.git".freeze
```

### 执行修改后的脚本安装

1. `/usr/bin/ruby ~/brew_install`
2. 当出现 `Cloning into '/usr/local/Homebrew/Library/Taps/homebrew/homebrew-core'...` 就不用等了... 等不到的...
3. `Command + C` 停止
4. `cd "$(brew --repo)/Library/Taps/"`
5. `mkdir homebrew`
6. `cd homebrew`
7. `git clone https://mirrors.ustc.edu.cn/homebrew-core.git`
8. 继续执行 `/usr/bin/ruby ~/brew_install`
9. 看到 `Installation successful!` 就安装成功了

### 修改 Homebrew 源为国内镜像

#### 替换 Homebrew 默认源

替换USTC镜像：

```shell
cd "$(brew --repo)"
git remote set-url origin https://mirrors.ustc.edu.cn/brew.git
```

重置为官方地址：

```shell
cd "$(brew --repo)"
git remote set-url origin https://github.com/Homebrew/brew.git
```

#### Homebrew 核心软件仓库

替换 USTC 镜像：

```shell
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-core.git
# 阿里镜像
# https://mirrors.aliyun.com/homebrew/homebrew-core.git
```

重置为官方地址：

```shell
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://github.com/Homebrew/homebrew-core
```

#### Homebrew 预编译二进制软件包

请在运行 brew 前设置环境变量 `HOMEBREW_BOTTLE_DOMAIN`，值为 `https://mirrors.ustc.edu.cn/homebrew-bottles`。

对于 bash 用户：

```shell
echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.ustc.edu.cn/homebrew-bottles' >> ~/.bash_profile
source ~/.bash_profile
# 阿里镜像
# https://mirrors.aliyun.com/homebrew/homebrew-bottles
```

对于 zsh 用户：

```shell
echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.ustc.edu.cn/homebrew-bottles' >> ~/.zshrc
source ~/.zshrc
```

#### Homebrew cask 软件仓库，提供 macOS 应用和大型二进制文件

替换为 USTC 镜像：

```shell
cd "$(brew --repo)"/Library/Taps/homebrew/homebrew-cask
git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-cask.git
```

重置为官方地址：

```shell
cd "$(brew --repo)"/Library/Taps/homebrew/homebrew-cask
git remote set-url origin https://github.com/Homebrew/homebrew-cask
```

#### 应用生效

```shell
brew update
```

### Homebrew 基本用法

| 操作                   | 命令              |
| ---------------------- | ----------------- |
| 更新 Homebrew          | `brew update`       |
| 更新所有安装过的软件包 | `brew upgrade`      |
| 更新指定的软件包       | `brew upgrade wget` |
| 查找软件包             | `brew search wget`  |
| 安装软件包             | `brew install wget` |
| 卸载软件包             | `brew remove wget`  |
| 列出已安装的软件包     | `brew list`         |
| 查看软件包信息         | `brew info wget`    |
| 列出软件包的依赖关系   | `brew deps wget`    |
| 列出可以更新的软件包   | `brew outdated`     |

### 卸载 Homebrew

```shell
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall)"
```

### 相关链接

- [Homebrew 源使用帮助](https://mirrors.ustc.edu.cn/help/brew.git.html)
- [阿里云官方镜像站](https://developer.aliyun.com/mirror/)
- [中国科学技术大学开源软件镜像](http://mirrors.ustc.edu.cn/)
- [清华大学开源软件镜像站](https://mirrors.tuna.tsinghua.edu.cn/)
