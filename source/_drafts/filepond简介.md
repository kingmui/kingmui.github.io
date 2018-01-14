---
title: filepond简介
date: 2018-05-29 10:22:15
tags:
  - javascript
  - FilePond
  - HTML5
comments: true
copyright: true
---

{% note info %}
Upload anything, from anywhere.
{% endnote %}

### 关于 [filepond](https://pqina.nl/filepond/)

filepond是一个灵活有趣的JavaScript文件上传库，压缩后仅21KB。可以上传任何内容，不仅优化了图像以获得更快的上传速度，还提供一个出色的，简洁流畅的用户体验。

#### 框架适配

由于filepond的核心库是用vanilla JavaScript编写的，因此它可以在任何地方使用。您可以在下方的列表中找到合适的适配器，使您可以更轻松地将FilePond用于您最喜爱的框架。
  - [React](https://github.com/pqina/react-filepond)
  - [Vue](https://github.com/pqina/vue-filepond)
  - [Angular](https://github.com/pqina/ngx-filepond)
  - [Angular 1](https://github.com/johnnyasantoss/angularjs-filepond)
  - [jQuery](https://github.com/pqina/jquery-filepond)

<!-- more -->

#### 核心特性

1. 多种输入格式
  - 接受目录，文件，blobs，本地URL，远程URL和 dataURIs。
2. 多个文件源
  - 支持从文件系统中拖拽或选择文件，使用API​​来添加文件或复制粘贴文件。
3. 异步或同步上传
  - 使用XMLHttpRequest将文件上传到服务器，或使用File Encode插件将文件转为base64后以表单文件的形式提交。
4. 图片优化
  - 在客户端自动调整大小和裁剪图像以节省服务器带宽，并显着提高上传速度。
5. 无障碍
  - 使用VoiceOver和JAWS等AT软件进行测试。 FilePond的用户界面可通过键盘进行导航。
6. 响应式
  - 自动缩放到可用空间。在移动设备和桌面设备上都可使用。

#### 其他特性 
- 可自定义标签和图标
- 支持多文件模式
- 拖拽替换当前文件
- 限制文件大小
- 限制文件类型
- 显示图片预览
- 将图像裁剪为固定比例
- 调整图像大小以适应边框
- 强制调整图像的大小
- 压缩JPEG图像
- 将图像转换为JPEG或PNG
- 可获取图像的[EXIF信息](https://baike.baidu.com/item/EXIF%E4%BF%A1%E6%81%AF)
- 以base64编码文件

### 安装

FilePond作为包装在UMD中的模块，可以使用Node包管理器，CDN或通过手动引入文件将其添加到项目中。

#### 使用NPM

如果您熟悉Node，则可以在终端中运行以下命令来安装FilePond。

```bash
npm i filepond --save
```

接着就可以在我们的项目中引入使用。

```javascript
import * as FilePond from 'filepond';
```

FilePond也需要一些样式。当使用像Webpack这样的模块捆绑器时，我们可以像这样添加这些样式。

```javascript
import 'filepond/dist/filepond.min.css';
```

如果没有使用模块捆绑器，则可以简单地将样式表添加到文档的`<head>`中。

#### 从CDN获取

我们可以链接到CDN上的文件。

```html
<link href="https://unpkg.com/filepond/dist/filepond.css" rel="stylesheet">
<script src="https://unpkg.com/filepond/dist/filepond.js"></script>
```

#### 手动引入本地文件

我们也可以下载FilePond到本地并手动引入。

### 开始使用

在执行下面的步骤之前，请确保您已按照安装说明安装好FilePond。

#### 增强文件域

使用 `create` 方法来渐进增强原始的文件域到FilePond元素。目标（在此是文件域）将会被自动替换为FilePond元素。

```html
<input type="file">
<script>
	const inputElement = document.querySelector('input[type="file"]');
	const pond = FilePond.create( inputElement );
</script>
```

原始的元素现在已经被 `<div class ="filepond--root"> ... </ div>` 所取代，并显示在FilePond放置的区域。

#### 连接服务器

我们将使用 `setOptions` 方法来重写页面上所有FilePond实例的默认服务器选项。在下面的例子中，我们将遵循[PHP样板](https://github.com/pqina/filepond-boilerplate-php)的设置。

```javascript
FilePond.setOptions({
    server: 'api/'
});
```

如果我们的服务器文件位于其他位置，则可以通过将其设置为服务器属性使FilePond指向正确的位置。

```javascript
FilePond.setOptions({
    server: 'http://192.168.33.10'
});
```

现在，在FilePond上拖放一个文件，它应该自动将其上传到服务器。如果没有，我们可能需要进一步配置我们的服务器。
我们现在可以通过将选项传递给 `create` 方法来自定义FilePond以满足我们的需求。

### 浏览器支持

#### 渐进增强

FilePond遵循渐进增强策略，这意味着浏览器越新颖，FilePond功能就越受支持。
为了保持文件大小的最小化，这并不支持旧的浏览器。我们可以通过调用 `FilePond.supported()` 方法来确定是否支持当前浏览器。
通过使用 `<input type ="file">` 作为我们的基本元素，当FilePond不可用时，可以回退到默认的文件域。

#### 支持的浏览器

FilePond已在下列浏览器和设备上测试成功。
- Firefox
- Chrome
- Safari
- Edge
- IE 11
- Safari iOS<sup>9+</sup>
- Chrome Android
- Firefox Android

为了支持IE11，我们需要安装[filepond-polyfill](https://github.com/pqina/filepond-polyfill)。
