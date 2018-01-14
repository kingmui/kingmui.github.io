---
title: filepond API 翻译
date: 2018-05-29 13:30:45
tags:
  - javascript
  - FilePond
  - HTML5
comments: true
copyright: true
---

{% note info %}
FilePond 文档翻译之API
{% endnote %}

### Style

#### 字体和颜色

FilePond对其布局非常敏感，但字体，颜色，边框半径和填充可以毫无问题地进行微调。
FilePond的默认字体被设置为系统字体。这使得它尽可能轻便并且对用户来说更熟悉。

```css
.filepond--root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
        Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
        'Segoe UI Symbol';
}
```

要覆盖FilePond样式，最好通过预先加入 `.filepond--root` 根选择器来使样式更加具体。 FilePond选择器尽可能保持非特定性，以使覆盖更容易。

<!-- more -->

{% note danger %}
覆盖过多的样式可能会使升级到新版本变得困难并可能影响可访问性。
{% endnote %}

以下总结了一些常见样式覆盖的集合：

```css
/* use a hand cursor intead of arrow for the action buttons */
.filepond--file-action-button {
    cursor: pointer;
}

/* the text color of the drop label*/
.filepond--drop-label {
    color: #555;
}

/* underline color for "Browse" button */
.filepond--label-action {
    text-decoration-color: #aaa;
}

/* the background color of the filepond drop area */
.filepond--panel-root {
    background-color: #eee;
}

/* the border radius of the drop area */
.filepond--panel-root {
    border-radius: 0.5em;
}

/* the border radius of the file item */
.filepond--item-panel {
    border-radius: 0.5em;
}

/* the background color of the file and file panel (used when dropping an image) */
.filepond--item-panel {
    background-color: #555;
}

/* the background color of the drop circle */
.filepond--drip-blob {
    background-color: #999;
}

/* the background color of the black action buttons */
.filepond--file-action-button {
    background-color: rgba(0, 0, 0, 0.5);
}

/* the icon color of the black action buttons */
.filepond--file-action-button {
    color: white;
}

/* the color of the focus ring */
.filepond--file-action-button:after {
    border-color: #fff;
}

/* the text color of the file status and info labels */
.filepond--file {
    color: white;
}

/* error state color */
[data-filepond-item-state*='error'] .filepond--item-panel,
[data-filepond-item-state*='invalid'] .filepond--item-panel {
    background-color: red;
}

[data-filepond-item-state='processing-complete'] .filepond--item-panel {
    background-color: green;
}

/* bordered drop area */
.filepond--panel-root {
    background-color: transparent;
    border: 2px solid #2c3340;
}
```

#### 限制FilePond的高度

要限制FilePond的高度，您可以向 `.filepond--root` 元素添加 `height` 或 `max-height` 样式。

```css
.filepond--root {
    max-height: 10em;
}
```

The  style will cause FilePond to grow in  till the max height has been reached. The height style will fix FilePond to the given height, a scrollbar will automatically be created.

`max-height` 样式将导致FilePond高度增长，直到达到最大高度。`height` 样式将FilePond修复到给定的高度，将自动创建滚动条。

#### 改变图标

FilePond使用的图标嵌入在核心的JS文件中。您可以通过覆盖匹配的FilePond实例属性来提供自己的图标（采用SVG格式）。
在FilePond中使用自己的图标的一些规则：
1. 确保图标是正方形的，并将 `width` 和 `height` 属性设置为 `"26"`
2. 为开放的 `<svg>` 元素添加 `aria-hidden = "true"` 属性，以获得更好的屏幕阅读器兼容性
3. 将 `viewBox` 属性设置为 `0 0 26 26`
4. 设置自己的颜色或使用 `currentColor` 值从按钮 `color` 样式继承颜色

一个 `<svg>` 图标模板

```html
<svg aria-hidden="true" width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
<!-- graphics here -->
</svg>
```

### FilePond 对象

FilePond对象是在项目中导入FilePond后可用的对象。它暴露了FilePond公共API，我们将主要用它来添加创建，查找或销毁页面上的FilePond实例。

#### 方法

| 方法           | 参数                    | 描述                                                         |
| -------------- | ----------------------- | ------------------------------------------------------------ |
| create         | `[element [, options]]` | 创建一个新的FilePond实例，两个参数都是可选的。               |
| destroy        | `element`               | 销毁附加到提供的元素的FilePond实例                           |
| find           | `element`               | 返回附加到提供的元素的FilePond实例                           |
| parse          | `context`               | 使用 `.filepond` 类解析DOM树的给定部分，并将它们转换为`FilePond`元素 |
| registerPlugin | `plugin`                | 注册一个FilePond插件以备后用                                 |
| setOptions     | `options`               | 为所有FilePond实例设置页面级别的默认选项                     |
| getOptions     |                         | 返回当前的默认选项                                           |
| supported      |                         | 根据浏览器是否支持FilePond返回 `true` 或 `false`             |

#### 属性

| 属性        | 描述                                                         |
| ----------- | ------------------------------------------------------------ |
| FileStatus  | 文件状态枚举与 `File.getStatus` 方法一起使用以确定当前文件状态 |
| OptionTypes | 返回可用选项的类型                                           |

#### 事件

Filepond对象在准备就绪时触发`FilePond:loaded` 事件。当我们在 `<script>` 标签上使用 `defer` 或 `async` 属性直接在页面上引入filepond时，这非常有用。在这些情况下，脚本将被异步加载，因此可能无法在文档准备就绪时使用。

事件的 `detail` 属性将包含FilePond API。

```javascript
document.addEventListener('FilePond:loaded', e => {
    console.log('FilePond ready for use', e.detail);
});
```

#### 创建FilePond实例

##### 增强HTML元素

`create` 方法可用于将元素转换为FilePond元素。传递一个元素引用作为第一个参数并presto !

我们仍然可以通过使用 `data` 属性将选项传递给我们的实例。

FilePond会自动克隆属性值并将它们映射到它的属性。这对于渐进增强现有的 `<input type="file">` 元素非常有用。

在如下的示例中，属性 `name` , `data-max-files` 和 `required` 将自动传递到创建的FilePond实例，并从 `string` 转换为正确的属性单位类型。

```html
<input type="file" name="filepond" data-max-files="10" required>

<script>
    const inputElement = document.querySelector('input[type="file"]');
    // 在 input 元素的位置创建一个 FilePond 实例
    const pond = FilePond.create( inputElement );

    // 属性已经被设置到 pond 的选项中
    console.log(pond.name);  // 'filepond'
    console.log(pond.maxFiles); // 10
    console.log(pond.required); // true
</script>
```

属性到选项的映射是通过删除 `data-` 部分，删除 `-` 并在 `-` 之后大写每个字符来完成的。此过程将 `data-max-files` 转换为 `maxFiles`。

也可以将其他 `option` 对象传递给 `create` 方法。

```html
<input type="file" name="filepond" required multiple>

<script>
    const inputElement = document.querySelector('input[type="file"]');

    // 在 input 元素的位置创建一个 FilePond 实例
    const pond = FilePond.create( inputElement, {
        maxFiles: 10,
        allowBrowse: false
    });
    console.log(pond.name);  // 'filepond'
    console.log(pond.maxFiles); // 10
    console.log(pond.required); // true
    console.log(pond.allowMultiple); // true
</script>
```

##### 使用 `option` 对象

我们也可以凭空创建一个FilePond实例，然后将其添加到页面中。

```javascript
const pond = FilePond.create({
    name: 'filepond',
    maxFiles: 10,
    allowBrowse: false
});

pond.appendTo(document.body);
```

##### 设置初始文件

您可以使用 `files` 属性与一组初始文件填充FilePond。该属性适用于恢复先前的临时上传或已经上传的文件。虽然 `files` 属性也可以填充新文件，但建议使用 `addFile` 和 `addFiles` 方法添加新文件。

`files` 属性需要一个文件引用数组，它接受与 `addFile` 方法相同的格式。

- 本地和远程URL
- DataURLs
- Blobs 或文件对象

它通过选择添加服务器文件来扩展此选择。

添加一个临时服务器文件。 `limbo` 类型将指示加载请求到 `restore` 端点。

```javascript
const pond = FilePond.create({
    files: [
        {
            // 服务器文件引用
            source: '12345',

            // 将类型设置为 limbo 告诉 FilePond 这是一个临时文件
            options: {
                type: 'limbo'
            }
        }
    ]
});
```

添加已经上传的服务器文件。`local` 类型将指示加载请求到 `load` 端点。

```javascript
const pond = FilePond.create({
    files: [
        {
            source: '12345',

            // 将类型设置为 local 告诉 FilePond 这是一个已上传的文件
            options: {
                type: 'local'
            }
        }
    ]
});
```

配合渐进增强策略FilePond坚持，也可以使用HTML为FilePond提供一个初始文件。

下面的例子起初可能看起来很精细。但是，如果JavaScript无法加载，无论出于何种原因，用户仍然可以删除文件（通过取消选中它们）并添加新文件。发布后生成的表单对象将包含更新任何服务器状态所需的所有信息。

```html
<fieldset>
    <legend>Files</legend>

    <!-- 已上传的文件列表 -->
    <ul>
        <li>
            <label>
                <input value="foo.jpg" data-type="local" checked type="checkbox">
                foo.jpeg
            </label>
        </li>
        <li>
            <label>
                <input value="bar.png" data-type="local" checked type="checkbox">
                bar.png
            </label>
        </li>
    </ul>

    <!-- our filepond input -->
    <input type="file" name="filepond" required multiple>

</fieldset>

<script>
    const fieldsetElement = document.querySelector('fieldset');

    const pond = FilePond.create( fieldsetElement );

    // 文件已被收集
    console.log(pond.files); // [{ source: 'foo.jpeg' }, { source: 'bar.png' }]
</script>
```

#### 销毁FilePond实例

销毁FilePond实例会将HTML重置为其原始状态。

```html
<intput type="file" name="filepond" required multiple>

<script>
    const inputElement = document.querySelector('input[type="file"]');

    FilePond.create( inputElement );

    // 通过元素引用销毁FilePond实例
    FilePond.destroy( inputElement );
</script>
```

#### 自动加载FilePond实例

`parse` 方法让我们自动加载页面上的FilePond元素。

这将在 `<body>` 元素的子树中查找具有 `.filepond` 类的元素。

```html
<input type="file" class="filepond"/>

<script>
    FilePond.parse(document.body);
</script>
```

#### 设置Options

我们可以使用 `setOptions` 方法为页面上的所有FilePond实例设置默认选项。

```javascript
FilePond.setOptions({
    allowDrop: false,
    allowReplace: false,
    instantUpload: false,
    server: {
        url: 'http://192.168.33.10',
        process: './process.php',
        revert: './revert.php',
        restore: './restore.php?id=',
        fetch: './fetch.php?data='
    }
});
```

#### 注册插件

我们可以使用 `registerPlugin` 方法将页面上的插件注册到FilePond。

```javascript
FilePond.registerPlugin(FilePondPluginImagePreview);
```

我们可以将多个插件引用传递给 `registerPlugin` 方法。

```javascript
FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginFileValidateSize
);
```

当插件准备就绪时，将在文档上触发 `FilePond:pluginloaded` 事件。事件 `detail` 属性将包含插件。

```
document.addEventListener('FilePond:pluginloaded', e => {
    console.log('FilePond plugin is ready for use', e.detail);
});
```

{% note warning %}
在创建我们的第一个FilePond实例之前，需要先注册插件。
{% endnote %}

### FilePond 实例

FilePond实例是使用 `FilePond.create` 方法时返回的对象。它是一个链接到DOM元素的对象。 FilePond实例可用于添加文件，删除文件和自定义单个FilePond的功能。

#### 属性

FilePond核心模块暴露以下属性。

| 属性          | 默认值       | 描述                                                         |
| ------------- | ------------ | ------------------------------------------------------------ |
| element       | `null`       | FilePond实例的根元素，这是唯一没有被设置的属性               |
| name          | `'filepond'` | 要使用的输入字段名称                                         |
| className     | `null`       | 额外的CSS类添加到根元素                                      |
| required      | `false`      | 将必需的属性设置为输出字段                                   |
| captureMethod | `null`       | 将给定值设置为捕获属性                                       |
| allowDrop     | `true`       | 启用或禁用拖放操作                                           |
| allowBrowse   | `true`       | 启用或禁用文件浏览器                                         |
| allowPaste    | `true`       | 启用或禁用粘贴文件。所有浏览器都不支持粘贴文件。             |
| allowMultiple | `false`      | 启用或禁用添加多个文件                                       |
| allowReplace  | `true`       | 允许拖放替换文件，只在 `allowMultiple` 为 `false` 时才起作用 |
| allowRevert   | `true`       | 允许用户撤销文件上传                                         |
| maxFiles      | `null`       | pond  可以处理的最大文件数量                                 |

##### 拖拽相关

| 属性           | 默认值                                      | 描述                                                   |
| -------------- | ------------------------------------------- | ------------------------------------------------------ |
| dropOnPage     | `false`                                     | FilePond将捕获在网页上放置的所有文件                   |
| dropOnElement  | `true`                                      | 需要将文件拖放到FilePond元素自身才能捕获该文件         |
| dropValidation | `false`                                     | 启用时，文件在被拖放之前进行验证。文件无效时不添加     |
| ignoredFiles   | `['.ds_store', 'thumbs.db', 'desktop.ini']` | 处理拖放的目录时忽略文件名。所有浏览器都不支持拖放目录 |

##### 服务器配置

| 属性          | 默认值 | 描述                                |
| ------------- | ------ | ----------------------------------- |
| server        | `null` | [Server API configuration](#Server) |
| instantUpload | `true` | 立即上传新文件到服务器              |
| files         | `[]`   | 应该立即被加载的文件位置列表        |

##### 标签

| 属性                           | 默认值                                                       | 描述                                                         |
| ------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| labelDecimalSeparator          | `auto`                                                       | 用于呈现数字的十进制分隔符                                   |
| labelThousandsSeparator        | `auto`                                                       | 用于呈现数字的千位分隔符                                     |
| labelIdle                      | `'Drag & Drop your files or <span class="filepond--label-action"> Browse </span>'` | 默认的标签表示这是一个放置区域，FilePond会自动将浏览文件事件绑定到拥有 `.filepond - label-action` 类的元素 |
| labelFileWaitingForSize        | `'Waiting for size'`                                         | 等待文件大小信息时使用的标签                                 |
| labelFileSizeNotAvailable      | `'Size not available'`                                       | 未收到文件大小信息时使用的标签                               |
| labelFileLoading               | `'Loading'`                                                  | 加载文件时使用的标签                                         |
| labelFileLoadError             | `'Error during load'`                                        | 文件加载失败时使用的标签                                     |
| labelFileProcessing            | `'Uploading'`                                                | 上传文件时使用的标签                                         |
| labelFileProcessingComplete    | `'Upload complete'`                                          | 文件上传完成后使用的标签                                     |
| labelFileProcessingAborted     | `'Upload cancelled'`                                         | 上传被取消时使用的标签                                       |
| labelFileProcessingError       | `'Error during upload'`                                      | 文件上传过程中出现问题时使用的标签                           |
| labelTapToCancel               | `'tap to cancel'`                                            | 用于向用户指示可以取消操作的标签                             |
| labelTapToRetry                | `'tap to retry'`                                             | 用于向用户指示可以重试的标签                                 |
| labelTapToUndo                 | `'tap to undo'`                                              | 用于向用户指示可以撤消操作的标签                             |
| labelButtonRemoveItem          | `'Remove'`                                                   | 用于删除按钮的标签                                           |
| labelButtonAbortItemLoad       | `'Abort'`                                                    | 用于中止加载按钮的标签                                       |
| labelButtonRetryItemLoad       | `'Retry'`                                                    | 用于重试加载按钮的标签                                       |
| labelButtonAbortItemProcessing | `'Cancel'`                                                   | 用于中止上传按钮的标签                                       |
| labelButtonUndoItemProcessing  | `'Undo'`                                                     | 用于撤消上传按钮的标签                                       |
| labelButtonRetryItemProcessing | `'Retry'`                                                    | 用于重试上传按钮的标签                                       |
| labelButtonProcessItem         | `'Upload'`                                                   | 用于上传按钮的标签                                           |

##### SVG 图标

| 属性        | 默认值          | 描述               |
| ----------- | --------------- | ------------------ |
| iconRemove  | `'<svg></svg>'` | 用于删除操作的图标 |
| iconProcess | `'<svg></svg>'` | 用于流程操作的图标 |
| iconRetry   | `'<svg></svg>'` | 用于重试操作的图标 |
| iconUndo    | `'<svg></svg>'` | 用于撤消操作的图标 |

##### 回调函数

| 属性                  | 函数                      | 描述                                                         |
| --------------------- | ------------------------- | ------------------------------------------------------------ |
| oninit                | `()`                      | FilePond实例已经被创建并准备就绪                             |
| onwarning             | `(error[, file, status])` | FilePond实例抛出警告。例如，当达到最大数量的文件时。如果错误与文件对象相关，则可选择接收文件 |
| onerror               | `(error[, file, status])` | FilePond实例抛出一个错误。如果错误与文件对象相关，则可选择接收文件 |
| onaddfilestart        | `(file)`                  | 开始文件加载                                                 |
| onaddfileprogress     | `(file, progress)`        | 加载文件已取得进展                                           |
| onaddfile             | `(error, file)`           | 如果没有错误，则文件已成功加载                               |
| onprocessfilestart    | `(file)`                  | 开始处理文件                                                 |
| onprocessfileprogress | `(file, progress)`        | 处理文件取得进展                                             |
| onprocessfileabort    | `(file)`                  | 中止处理文件                                                 |
| onprocessfileundo     | `(file)`                  | 处理文件已被撤消                                             |
| onprocessfile         | `(error, file)`           | 如果没有错误，则文件处理已完成                               |
| onremovefile          | `(file)`                  | 文件已被删除                                                 |

#### 事件

Filepond暴露以下事件，它们与回调函数相同。事件 `detail` 属性将包含相关的事件信息。我们可以通过在根节点注册监听事件来监听它们。

```javascript
const pond = document.querySelector('.filepond--root');
pond.addEventListener('FilePond:addfile', e => {
    console.log('File added', e.detail);
});
```

| 选项                         | 描述                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| FilePond:init                | FilePond实例已经被创建并准备就绪                             |
| FilePond:warning             | FilePond实例抛出警告。例如，当达到最大数量的文件时。如果错误与文件对象相关，则可选择接收文件 |
| FilePond:error               | FilePond实例抛出一个错误。如果错误与文件对象相关，则可选择接收文件 |
| FilePond:addfilestart        | 开始文件加载                                                 |
| FilePond:addfileprogress     | 加载文件已取得进展                                           |
| FilePond:addfile             | 文件已被加载，如果详细信息对象包含错误属性，则出错           |
| FilePond:processfilestart    | 开始处理文件                                                 |
| FilePond:processfileprogress | 处理文件取得进展                                             |
| FilePond:processfileabort    | 中止处理文件                                                 |
| FilePond:processfileundo     | 处理文件已被撤消                                             |
| FilePond:processfile         | 处理完文件后，如果详细信息对象包含错误属性，则出错           |
| FilePond:removefile          | 文件已被删除                                                 |

#### 方法

| 方法         | 参数                 | 描述                         |
| ------------ | -------------------- | ---------------------------- |
| setOptions   | `object`             | 一次覆盖多个选项             |
| addFile      | `source [, options]` | 添加一个文件                 |
| addFiles     | `source [, options]` | 添加多个文件                 |
| removeFile   | `query`              | 删除与给定查询匹配的文件     |
| removeFiles  |                      | 删除所有文件                 |
| processFile  | `query`              | 开始处理与给定查询匹配的文件 |
| processFiles |                      | 开始处理所有文件             |
| getFile      | `query`              | 返回与给定的查询匹配的文件   |
| getFiles     |                      | 返回所有文件                 |
| browse       |                      | 打开浏览文件对话框           |
| destroy      |                      | 销毁这个FilePond实例         |

##### DOM操作

| 方法           | 参数      | 描述                                        |
| -------------- | --------- | ------------------------------------------- |
| insertAfter    | `element` | 在给定的元素之后插入FilePond实例            |
| insertBefore   | `element` | 在给定的元素之前插入FilePond实例            |
| appendTo       | `element` | 将FilePond追加到给定的元素                  |
| isAttachedTo   | `element` | 如果当前实例附加到给定的元素，则返回 `true` |
| replaceElement | `element` | 用FilePond替换给定的元素                    |
| restoreElement | `element` | /                                           |

事件方法

Filepond提供 `on`，`onOnce` 和 ` off` 方法作为监听事件的替代方法。我们可以监听相同的事件，但可以在不添加 `'FilePond:'` 前缀的情况下执行此操作。处理函数收到的参数与回调方法中定义的参数相同。

```javascript
// 使用 'addfile' 替代 'FilePond:addfile'
const pond = FilePond.create();
pond.on('addfile', (error, file) => {
    if (error) {
        console.log('Oh no');
        return;
    }
    console.log('File added', file);
});
```

| 方法   | 参数          | 描述                                 |
| ------ | ------------- | ------------------------------------ |
| on     | `event`, `fn` | 通过事件名监听事件                   |
| onOnce | `event`, `fn` | 该方法只会被调用一次，然后自动被删除 |
| off    | `event`, `fn` | /                                    |

##### 设置选项

要覆盖FilePond实例上的已设置的选项，我们可以使用 `setOptions` 方法或直接调整属性。

```javascript
const pond = FilePond.create();
pond.setOptions({
    maxFiles: 10,
    required: true
});
```

调整个别属性：

```javascript
const pond = FilePond.create();
pond.maxFiles = 10;
pond.required = true;
```

##### 添加文件

要添加文件，我们可以使用 `addFile` 和 `addFiles` 端点。

这两种方法都接受以下文件引用：

- 本地和远程URL
- DataURLs
- Blobs 或文件对象

```javascript
// 添加一个文件
pond.addFile('./my-file.jpg');

// 添加多个文件
pond.addFiles('./my-file.jpg', './my-documents.zip');

// 它也接受数组
pond.addFiles(['./my-file.jpg', './my-documents.zip']);
```

最后一个参数可以设置为一个选项对象，该选项对象可用于确定文件或文件应添加到的项目列表中的索引。

```javascript
// 使用选项对象添加单个文件
pond.addFile('./my-file.jpg', { index: 0 });

// 用选项对象添加多个文件
pond.addFiles('./my-file.jpg', './my-documents.zip', { index: 0 });

// 将文件作为具有选项对象的数组提供
pond.addFiles(['./my-file.jpg', './my-documents.zip'], { index: 0 });
```

如前所述，`addFile` 方法也接受Blobs，文件对象和DataURLs。

```javascript
// 添加一个基本的DataURLs
pond.addFile('data:,Hello%2C%20World!');

// 添加一个Blob或文件
const data = { hello: 'world' };
const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
});
pond.addFile(blob);
```

{% note danger %}
由于Blob和DataURL不提供任何文件名信息，因此FilePond会将文件名设置为当前日期。
{% endnote %}

`addFile` 方法返回一个promise。加载远程文件时这很有用。

```javascript
pond
    .addFile('./my-file.jpg')
    .then(file => {
        // 文件已被添加
    })
    .catch(error => {
        // 出错
    });
```

##### 处理文件

我们可以使用 `processFile` 方法触发手动处理文件。文件可以通过 `id`，`index` 或 `file` 删除。参数不是必需的。

```javascript
// 处理第一个文件
pond.processFile().then(file => {
    // 文件已被处理
});

// 处理索引值为1的文件
pond.processFile(1).then(file => {
    // 文件已被处理
});

// 用给定的ID处理文件
pond.processFile('imzsdvxar').then(file => {
    // 文件已被处理
});
```

处理多个文件可以通过将多个项目传递给 `processFiles` 方法来完成。

```javascript
pond.processFiles('imzsdvxar', 'afaoiwles').then(files => {
    // 文件已被处理
});
```

处理所有文件

```javascript
pond.processFiles().then(files => {
    // 文件已被处理
});
```

##### 删除文件

文件可以通过 `id`，`index` 或 `file` 删除。参数不是必需的。

如果我们不向 `removeFile` 方法提供参数，FilePond将删除文件列表中的第一个文件。

```javascript
// 删除第一个文件
pond.removeFile();

// 删除索引值为1的文件
pond.removeFile(1);

// 用给定的ID删除文件
pond.removeFile('imzsdvxar');
```

也可以通过引用删除文件，将FilePond文件传递给 `remove` 方法以将其从列表中删除。

```javascript
pond.addFile('./my-file.jpg').then(file => {
    pond.removeFile(file);
});
```

{% note danger %}
FilePond文件与JavaScript文件或Blob不同。 FilePond文件是一个JavaScript文件对象的包装器。将JavaScript文件或Blob传递给 `removeFile` 方法将不起作用。
{% endnote %}

### 文件

`addFile`，`getFile` 和 `processFile` 方法将返回 `File` 对象。我们可以按如下方式在我们的逻辑中使用这些对象。

#### 属性

| 属性名                   | 描述                                                         |
| ------------------------ | ------------------------------------------------------------ |
| id                       | 返回文件的ID                                                 |
| serverId                 | 返回文件的服务器标识                                         |
| status                   | 返回文件的当前状态，使用 `FilePond.FileStatus` 枚举来确定状态 |
| file                     | 返回 `File` 对象                                             |
| fileExtension            | 返回文件扩展名                                               |
| fileSize                 | 返回文件的大小                                               |
| filename                 | 返回文件的全名                                               |
| filenameWithoutExtension | 返回没有扩展名的文件的名称                                   |

#### 方法

| 方法            | 描述                                                         |
| --------------- | ------------------------------------------------------------ |
| abortLoad       | 中止加载此文件                                               |
| abortProcessing | 中止处理这个文件                                             |
| getMetadata     | 检索保存文件的元数据，传递一个键以检索元数据的特定部分（例如 `'crop'` 或 `'resize'`）。如果没有传递键值，则返回整个元数据对象 |
| setMetadata     | 向文件添加额外的元数据。要求一个 `key` 和 `value`            |

### [Server](https://pqina.nl/filepond/docs/patterns/api/server/)