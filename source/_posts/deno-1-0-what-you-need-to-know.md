---
title: Deno 1.0：你需要了解的
date: 2020-05-24 14:03:24
tags:
  - deno
  - JavaScript
  - TypeScript
comments: true
---

{% img https://cdn.kingmui.cn/deno1-0.jpg %}

{% note info %}
Deno 是使用 V8 引擎并用 Rust 语言编写的 JavaScript 和 TypeScript 的简单，现代且安全的运行时。它汇集了许多最佳的开源技术，并在一个小的可执行文件中提供了全面的解决方案。它还解决了 Ryan 在[我对Node.js感到遗憾的十件事](https://www.youtube.com/watch?v=M3BM9TB-8yA)演讲中谈到的设计缺陷。
{% endnote %}

### 前言

不知道大家还记不记得两年前在 Github 发生的「学不动」事件。那次事件的起因便是著名的 Node 之父 [Ryan Dahl](https://github.com/ry) 宣布新开一个叫 Deno 的项目，于是就有国人以一种类似于贴吧灌水的形式在 Deno 的 [issiue](https://github.com/ry/deno/issues/25) 区里用中文大量发“学不动啦”，“求别更新”等帖子，顿时引起一片[争论](https://www.zhihu.com/question/279356207)。如今两年时间过去了，ry 也带着他的 Deno 1.0 正式与我们会面。不论我们学的动还是学不动，技术就在那里，不以人的意志为转移。在这篇文章中，我们将会涵盖所有令人激动的 Deno 特性。

<!-- more -->

### 与 Node.js 的区别

与用 C++ 编写的 Node.js 不同，Deno 用 Rust 语言编写。那么为什么不像 Node.js 一样用 C++ 而是选择用 Rust 呢？主要是因为 Rust 提供了很多现成的模块，对于 Deno 来说，可以节约很多开发时间。也许是看到了 Rust 提供了很多现成模块，Deno 也决定在自己的项目中添加许多现成模块。它的异步操作使用 Rust 的 [Tokio](https://tokio.rs/) 库来实现 Event Loop，并且像 Node.js 一样，使用 V8 引擎执行 JavaScript。

开箱即用地支持 TypeScript，可以直接运行 ts 代码，虽然最终还是要先编译成 js 代码来运行，但这都是内部完成的。这也就意味着你不需要每次编写完 ts 代码后还要去手动编译了，而且也省去了搭建 ts-node 之类的工作。它的内部会根据文件后缀名判断，如果是 `.ts` 后缀名，就先调用 TS 编译器，将其编译成 JavaScript；如果是 `.js` 后缀名，则直接传入 V8 引擎运行。

Deno 相对于 Node.js 一大亮点是没有 `node_modules`，没有 `package.json`，通过 `import URL` 的形式进行第三方模块的引用。

|                    | Node                                     | Deno                |
| ------------------ | ---------------------------------------- | ------------------- |
| 开发语言           | C++                                      | Rust                |
| API 引用方式       | 模块导入                                 | 全局对象            |
| 模块系统           | CommonJS & 新版 node 实验性 ES Module    | ES Module           |
| 安全               | 无安全限制                               | 默认安全            |
| TypeScript         | 第三方，如通过 ts-node 支持              | 原生支持            |
| 包管理             | npm + node_modules                       | 原生支持            |
| 异步操作           | 回调                                     | Promise             |
| 包分发             | 中心化 npmjs.com                         | 去中心化 import url |
| 入口               | package.json 配置                        | import url 直接引入 |
| 打包、测试、格式化 | 第三方如 eslint、gulp、webpack、babel 等 | 原生支持            |

### 起步

鉴于国内的网络原因，[justjavac](https://github.com/justjavac) 大佬搞了[国内镜像](https://github.com/denocn/deno_install)加速。要更新到最新版本，请使用 `deno upgrade`。

Mac/Linux

```shell
curl -fsSL https://x.deno.js.cn/install.sh | sh
```

Windows

```shell
iwr https://x.deno.js.cn/install.ps1 -useb -outf install.ps1; .\install.ps1
# iwr https://x.deno.js.cn/install.ps1 -useb | iex
```

要获得有关任何 Deno 子命令的帮助，请使用以下任一命令。

- `deno [subcommand] -h`
- `deno [subcommand] --help`

### 安全

Deno 具有安全控制，默认是安全的。除非明确启用，否则没有文件，网络或环境的访问权限。相比之下，Node.js 拥有对文件系统和网络的完全访问权限。

在没有权限的情况下运行程序：

```shell
deno run file-needing-to-run-a-subprocess.ts
```

如果代码需要权限设置，执行后，会发现一串报错：

```shell
error: Uncaught PermissionDenied: access to run a subprocess, run again with the --allow-run flag
```

Deno 使用命令行选项来显式指定程序允许访问的系统权限。最常用的包括：

- 环境变量读取权限
- 网络访问权限
- 文件系统读/写访问权限
- 运行子进程权限

要查看完整的权限列表，请输入 `deno run -h` 查看。

最佳做法是将权限白名单用于读，写和网络。这使你可以更详细地了解允许 Deno 使用的内容。例如，要允许 Deno 在 `/etc` 目录中有读取文件的权限，请使用：

```shell
deno --allow-read=/etc
```

**使用权限的快捷方式**

你可能很快就厌倦了每次运行应用程序时都要显式启用权限的情况。要解决此问题，你可以采用以下任意一种方法。

#### 允许所有权限

你可以使用 `--allow-all` 或 `-A` 启用所有权限。不过**不建议这样做**，因为它移除了 Deno 为我们带来的安全性优势。

#### 制作bash脚本

使用运行程序所需的最小权限创建一个 bash 脚本。

```bash
#!/bin/bash

// 允许允许子进程和文件系统的写入权限
deno run --allow-run --allow-write mod.ts
```

#### 使用任务运行器

你可以使用 GNU 工具 make 通过一组带有权限的 Deno 命令来创建一个文件。你还可以使用特定于 Deno 的版本 [Drake](https://deno.land/x/drake/)。

#### 安装可执行的 Deno 程序

使用 `deno install` [安装一个 Deno 程序](https://deno.land/manual/tools/script_installer#script-installer)，该程序具有执行所需的所有权限。安装后，你可以从 `$PATH` 中的任何位置访问该程序。

### 标准库

Deno [标准库](https://deno.land/std/)是由 Deno 官方维护并保证可与 Deno 一起使用的常用模块集合。它涵盖了用户最常用于常见任务的代码，并且宽松地基于 Go 编程语言提供的标准库。

JavaScript 一直因缺乏标准库而备受困扰。用户被迫一次又一次地重新造轮子，开发人员必须经常在 NPM 上搜索第三方模块，以解决平台本应提供的常见问题。

对于像 React 之类的解决复杂问题的库作为第三方包而存在是一件好事，但是对于 [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) 生成等简单的事情，最好使用官方的标准库。这些小型库可作为大型库的构建模块，从而加快开发速度。有多少一度流行的库最终却被遗弃，用户最终只能选择要么自己维护，要么重新选择一个库？实际上，[没有积极维护](https://blog.tidelift.com/up-to-20-percent-of-your-application-dependencies-may-be-unmaintained)的常用依赖多达 20％ 之多。

**Deno 官方维护模块及其对应的 NPM 模块**

| Deno 模块                                            | 描述                                                         | NPM 模块              |
| ---------------------------------------------------- | ------------------------------------------------------------ | ---------------------------- |
| [colors](https://deno.land/std/fmt/colors.ts)        | 为终端添加颜色                                               | **chalk, kleur, and colors** |
| [datetime](https://deno.land/std/datetime/README.md) | 帮助使用 JavaScript Date 对象                                |                              |
| [encoding](https://deno.land/std/encoding/README.md) | 增加了对外部数据结构（如base32，binary，csv，toml和yaml）的支持 |                              |
| [flags](https://deno.land/std/flags/README.md)       | 帮助使用命令行参数                                           | **minimist**                 |
| [fs](https://deno.land/std/fs/README.md)             | 帮助操纵文件系统                                             |                              |
| [http](https://deno.land/std/http/README.md)         | 允许通过 HTTP 提供本地服务                                   | **http-server**              |
| [log](https://deno.land/std/log/README.md)           | 用于创建日志                                                 | **winston**                  |
| [testing](https://deno.land/std/testing/README.md)   | 用于单元测试                                                 | **chai**                     |
| [uuid](https://deno.land/std/uuid/README.md)         | 生成 UUID                                                    | **uuid**                     |
| [ws](https://deno.land/std/ws/README.md)             | 帮助创建 WebSocket 客户端/服务端                             | **ws**                       |

### Deno 内置 tsc 引擎

TypeScript 是 JavaScript 的超集，添加了显式类型。任何有效的 JavaScript 也是有效的 TypeScript，因此将你的代码转换为 TypeScript 是轻而易举的。只需将扩展名更改为 `.ts` 并开始添加类型即可。

要在 Deno 中使用 TypeScript，无需执行任何操作。如果没有 Deno，则必须将 TypeScript 编译为 JavaScript 才能运行。Deno 在内部为你完成了此操作，从而使 TypeScript 更加易于采用。

**使用自定义的 `tsconfig.json`**

对于熟悉 TypeScript 的人来说，你将习惯使用 `tsconfig.json` 文件来提供编译器选项。使用 Deno 时这是可选的，因为它已经具有自己的默认配置。如果你使用自己的 `tsconfig.json` 且与 Deno 冲突，则会收到警报。

此特性需要 `-c` 选项和 `tsconfig.json`。

```shell
deno run -c tsconfig.json [file-to-run.ts]
```

Deno 默认使用严格模式。除非有一些不道德的人将其改写，否则 Deno 将合理地尽可能多的在用户编写一些过于草率的代码时给出警告。

### Deno 尽可能使用 Web 标准

建立 Web 标准需要很长的时间，一旦设定为固定标准，就不会改变它。虽然框架来来去去，但标准终将保留。花费在学习标准化 API 上的时间永远不会浪费，因为没有人敢于破坏标准。它可能已经使用了数十年，甚至可能是你职业生涯的其余部分。新技术来了又走了，但是有很多思想是共通的。你要设置正确的优先级，把 80% 的时间投资到基础知识学习上，把剩下的 20% 留给框架，类库和工具。

`fetch` web API 提供了用于获取资源的接口。浏览器中有一个 JavaScript `fetch()` 方法。如果你想在 Node.js 中使用此标准，则需要依赖第三方库 [Node Fetch](https://github.com/node-fetch/node-fetch) 实现。但在 Deno 中，它是内置的，并且就像浏览器一样工作，开箱即用。

Deno 1.0 提供以下与 Web 兼容的 API。

- addEventListener
- btoa
- atob
- clearInterval
- clearTimeout
- dispatchEvent
- fetch
- queueMicrotask
- removeEventListener
- setInterval
- setTimeout
- AbortSignal
- Blob
- File
- FormData
- Headers
- ReadableStream
- Request
- Response
- URL
- URLSearchParams
- console
- isConsoleInstance
- location
- onload
- onunload
- self
- window
- AbortController
- CustomEvent
- DOMException
- ErrorEvent
- Event
- EventTarget
- MessageEvent
- TextDecoder
- TextEncoder
- Worker
- ImportMeta
- Location

这些都可以在程序的顶级范围内使用。这意味着如果你避免在 `Deno()` 名称空间上使用任何方法，则你的代码应与 Deno 和浏览器兼容。尽管并非所有 Deno API 都 100％ 符合其等效的 Web 规范，但这对于前端开发人员而言仍然是不错的福音。

### ECMAScript 模块标准

Deno 与 Node.js 的一项重大变化是 Deno 使用了官方的 ECMAScript 模块标准，而不是传统的 CommonJS。Node.js 直到 2019 年底才启用版本 13.2.0 的 ECMAScript 模块，但即便如此，支持度还是不够，并且仍然包含有争议的 `.mjs` 文件扩展名。

Deno 使用 URL 或文件路径引用该模块，并包含必需的文件扩展名。例如：

```JavaScript
import * as log from "https://deno.land/std/log/mod.ts";
import { outputToConsole } from "./view.ts";
```

**使用文件扩展名的问题**

Deno 期望模块具有文件扩展名，但 TypeScript 则相反。

{% img http://cdn.kingmui.cn/ts-extension-problem.png %}

在任何地方使用文件扩展名都应该是合法的，并且这似乎应该是达成共识的。但不幸的是，实际上事情要复杂得多。现在，我们可以使用 [Visual Studio Code Extension](https://github.com/denoland/vscode_deno) 解决仅 Deno 项目的问题。

### 异步操作

Node.js 用回调的方式处理异步操作，Deno 则选择用 Promise。

```javascript
// node 方式
const fs = require("fs");
fs.readFile("./data.txt", (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

Deno 支持 `top-level-await`，所以以上读取文件的代码可以为：

```typescript
// deno 方式
const data = await Deno.readFile("./data.txt");
console.log(data);
```

Node.js 如果想要实现 Promise 化，则需要借助第三方模块 promisify，通过包裹一层函数来实现。例如：

```javascript
// node API promisify
const { promisify } = require("es6-promisify");
const fs = require("fs");

// 没有 top-level-await，只能包一层
async function main() {
  const readFile = promisify(fs.readFile);
  const data = await readFile("./data.txt");
  console.log(data);
}

main();
```

### 包管理

人们对 Deno 中的包管理方式进行了彻底的重新思考。它是分散的，而不是依赖中心化仓库。任何人都可以托管一个程序包，就像任何人都可以托管网络上任何类型的文件一样。

使用像 npm 这样的中心化存储库有优缺点，而 Deno 的这一方面肯定是最具争议的。

**Deno 的包管理工作原理**

如此简化，可能会令你震惊。

```JavaScript
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
```

让我们与 Node.js 对比下变更：

- 没有了 NPM 这种中心化的包管理器。我们可以直接从网络导入 ECMAScript 模块
- 不再有“神奇的” Node.js 模块解析。现在，语法是明确的，这使事情更容易理解
- 不再有 `node_modules` 目录。而是将依赖项下载并隐藏在你的硬盘驱动器中。如果需要刷新缓存并再次下载，只需在命令中添加 `--reload`

Deno 没有 Node.js 中的 `node_modules` 目录做为包存放的地方，但也需要一个地方存在安装的模块。如果要与项目代码一起下载依赖项而不是使用全局缓存，请使用 `$DENO_DIR` 环境变量。`DENO_DIR` 默认为 `$HOME/.deno`，就是 Deno 存放生成的代码和缓存的源码的路径。

```bash
# mac / linux
echo 'export DENO_DIR=$HOME/.deno' >> ~/.bash_profile
source ~/.bash_profile # 如果是 zsh 则：source ~/.zshrc
```

### 查找兼容的第三方库

有一个与 Deno 兼容的第三方模块的[用户区](https://deno.land/x/)。尽管没有官方支持与 Node.js 的向后兼容性，但是仍然有许多库和应用程序可以与 Deno 一起正常工作。有些是开箱即用，而另一些则需要一些努力才能正常工作。

| 库类型                              | 兼容性                                                       |
| ----------------------------------- | ------------------------------------------------------------ |
| 在浏览器中运行 使用ESM语法          | 确认与 [Pika 软件包目录](https://www.pika.dev/search)兼容，并使用 NPM 或 [Pika CDN](https://www.pika.dev/cdn) |
| 在浏览器中运行，使用CommonJS语法    | 使用 [jspm.io](https://jspm.io/) 将模块包装为 ESM 语法或 [Pika CDN](https://www.pika.dev/cdn) |
| 不在浏览器中运行，不使用Node.js API | 使用 [jspm.io](https://jspm.io/) 将模块包装为 ESM 语法或 [Pika CDN](https://www.pika.dev/cdn) |
| 使用 Node.js API                    | 这可能行不通，但请尝试使用 [NodeJS 标准库的官方兼容层](https://deno.land/std/node/) |

### 安装第三方模块

Deno 仍然很新，周围的生态系统仍在形成。建议将 [Pika](https://www.pika.dev/cdn) 作为在标准库和用户库以外寻找兼容模块的第一站。NPM 上可用的任何软件包也应位于 Pika CDN 上，并已自动转换为可与 `import` 一起使用。

Pika 背后的开发人员已与 Deno 合作，通过被称为 [X-TypeScript-Types](https://dev.to/pika/introducing-pika-cdn-deno-p8b) 的 ECMAScript 模块提供 TypeScript 类型。你可以通过简单地使用其 CDN 平台来利用此优势。


### 告别 `package.json`

NPM 生态下包信息存放在 `package.json`，包含但不限于下面的内容：

- 项目元信息
- 项目依赖和版本号
- 依赖还进行分类，比如 `dependencies`、`devDependencies` 甚至 `peerDependencies`
- 标记入口，`main` 和 `module`，还有 TS 用的 `types` 与 `typings`，脚手架的 `bin` 等等
- npm scripts

```json
{
  "name": "Project Name", // metadata
  "version": "1.0.0", // metadata
  "description": "My application", // metadata
  "type": "module", // module functionality
  "main": "src/mod.ts", // module functionality
  "scripts": {
    "build": "npm run _copy-build-files && rollup -c",
    "build-watch": "npm run _copy-build-files && rollup -cw"
  }, // scripting functionality
  "license": "gpl-3.0", // metadata
  "devDependencies": {
    "@rollup/plugin-TypeScript": "^3.1.1",
    "rollup": "^1.32.1",
    "TypeScript": "^3.8.3"
  }, // versioning and categorizing functionality
  "dependencies": {
    "tplant": "^2.3.3"
  } // versioning and categorizing functionality
}
```

所有这些实践随着时间的流逝而融合在一起，现在代表着 JavaScript 生态系统的标准工作方式。很容易忘记这不是官方标准；这些功能成为必需品时，才想到它。现在，JavaScript 已经赶上了，是时候进行重新思考了。

Deno 仍无法取代 `package.json` 的所有功能，但目前有一些解决方案。

**使用 `deps.ts` 和 URL 进行版本控制**

软件包版本控制有一个 Deno 约定，即使用名为 `deps.ts` 的特殊文件。在内部，依赖项被重新导出。这允许应用程序中的不同模块都引用相同的源。而不是告诉 npm 要下载哪个模块版本，而是在 `deps.ts` 中的 URL 中引用该模块。

```JavaScript
// deps.ts

export { assert } from "https://deno.land/std@v0.39.0/testing/asserts.ts";
export { green, bold } from "https://deno.land/std@v0.39.0/fmt/colors.ts";
```

如果要更新任何模块，可以在 `deps.ts` 中更改 URL。例如，将 `@v0.39.0` 替换为 `@v0.41.0`，新版本将在所有地方使用。如果改为直接将 https://deno.land/std@v0.39.0/fmt/colors.ts 导入每个模块，则你将不费吹灰之力遍历整个应用程序并更改每个引用。

假设你之前下载的模块以后不会被篡改可能会带来安全风险。这就是为什么还可以选择创建[锁定](https://deno.land/std/manual.md#lock-file)文件的原因。这将确保新下载的模块与你最初下载的模块相同。

### 使用 JSDoc 生成文档

JSDoc 于 1999 年发布。现在，它是 JavaScript 和 TypeScript 最常用的文档生成器。虽然不是正式的 Web 标准，但它是 `package.json` 中所有元数据的完美替代。

```JavaScript
/**
 * @file Manages the configuration settings for the widget
 * @author Lucio Fulci
 * @copyright 2020 Intervision
 * @license gpl-3.0
 * @version 1.0
 *
```

Deno 开箱即用地支持 JSDoc 并将其用于其内置的文档系统。虽然 `deno doc` 命令当前不使用上面的元数据，但它会读取函数的描述及其参数的描述。

```JavaScript
/**
 * Returns a value of (true?) if the rule is to be included
 *
 * @param key Current key name of rule being checked
 * @param val Current value of rule being checked
 **/
```

你可以使用 `deno doc <filename>` 来查看程序的文档。

```shell
deno doc mod.ts

function rulesToRemove(key: string, val: any[]): boolean
  Returns a value of if the rule is to be included
```

在线托管程序时，请使用[在线文档查看器](https://doc.deno.land/)更详细地查看它。

### 内置工具链

{% img http://cdn.kingmui.cn/deno-tool-scream.png %}

这是对前端开发人员影响最大的领域。当前的 JavaScript 工具状态非常混乱。当你添加 TypeScript 工具时，复杂性甚至更进一步增加。

JavaScript 的好处之一是它不需要编译，因此可以立即运行在浏览器中。这使得入门门槛很低，你只需要一个记事本和一个浏览器就可以开始写代码。

不幸的是，这种简单性和可访问性已被过度的工具链所破坏。显然将 JavaScript 开发变成了一场噩梦。

工具的混乱已经发展到这样的程度：许多开发人员迫切希望回到实际编写代码的过程中，而不是去研究配置文件并为应该采用的多个竞争标准而苦恼。解决这一问题的一个新兴项目是 Facebook 的 [rome](https://github.com/romejs/rome)。这还处于起步阶段。尽管它可能被证明是有益的，但 Deno 有潜力成为更实质性的解决方案。

Deno 本身就是一个完整的生态系统，具有运行时和其自己的模块/包管理系统。这为内置所有其自己的工具提供了更大的空间。让我们研究一下 1.0 中可用的工具，以及如何使用它来减少对第三方库的依赖并简化开发。

目前尚无法在 Deno 中替换整个前端构建管道，但是我们相信这不会等太久的。

### 测试

测试运行器使用 `Deno.test()` 函数内置在 Deno 的核心中。[断言库](https://deno.land/std/testing/)也在标准库中提供。所有你想要的，例如 `assertEquals()` 和 `assertStrictEq()`，以及一些不太常见的断言，例如 `assertThrowsAsync()` 都包含在其中。

目前，尚无测试覆盖功能。并且需要使用第三方工具，如 [Denon](https://deno.land/x/denon/) 来设置观察模式。

要查看所有测试运行程序选项，请使用 `deno test --help`。尽管它们非常有限，但是你可能会从 Mocha 之类的程序中了解许多功能。例如，`--failfast` 将在遇到第一个错误时停止，`--filter` 可用于过滤要运行的测试。

**使用测试运行器**

最基本的语法是 `deno test`。这将运行工作目录中以 `_test` 或 `.test` 结尾的所有文件，扩展名为 `.js`，`.ts`，`.jsx` 或 `.tsx`（例如：`example_test.ts`）

```JavaScript
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test({
  name: "testing example",
  fn(): void {
    assertEquals("world", "world");
    assertEquals({ hello: "world" }, { hello: "world" });
  },
});
```

如果你的代码使用 DOM，则需要使用 `lib: ["dom", "esnext"]` 提供自己的 `tsconfig.json`。我们将在下面详细介绍。

### 格式化

格式化功能由 [dprint](https://github.com/dprint/dprint) 提供，它是 Prettier 的快速替代品，它克隆了所有已建立的 Prettier 2.0 规则。

要格式化一个或多个文件，请使用 `deno fmt <files>` 或 [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=axetroy.vscode-deno) 插件。

### 打包编译

Deno 可以使用 `deno bundle` 从命令行创建一个简单的打包文件，但是它也公开了一个[内部编译器 API](https://deno.land/std/manual.md#compiler-api)，因此用户可以构建自己的输出。该 API 目前被标记为不稳定，因此你需要使用 `--unstable` 标识。

尽管 Deno 具有一些与 Web 兼容的 API，但它们并不完整。如果要编译任何引用 DOM 的前端 TypeScript，则需要在打包编译时告知 Deno 这些类型。你可以使用编译器 API 选项 `lib`。

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1 id="greeter">Replace me</h1>
  </body>
</html>
```

```TypeScript
// test-dom.ts
let greeter: HTMLElement | null = document.getElementById("greeter")!; // Please forgive the Non-Null Assertion Operator

greeter.innerText = "Hello world!";
compile.ts
const [errors, emitted] = await Deno.compile("test-dom.ts", undefined, {
  lib: ["dom", "esnext"], // include "deno.ns" for deno namespace
  outDir: "dist",
});

if (errors) {
  console.log("There was an error:");
  console.error(errors);
} else {
  console.log(emitted); // normally we would write the file
}
```

下面是终端中的输出结果。

```bash
{
 dist/test-dom.js.map: "{"version":3,"file":"test-dom.js","sourceRoot":"","sources":["file:///home/david/Downloads/deno-arti...",
 dist/test-dom.js: ""use strict";nlet greeter = document.getElementById("greeter");ngreeter.innerText = "Hello world!";n..."
}
```

在上面的示例中，我们编译了引用 DOM 的 `test-dom.ts` 文件。在 `Deno.compile()` 中使用 `lib` 选项会覆盖 Deno 使用的所有 `lib` 默认选项，因此你需要重新添加 `esnext` 和 `deno.ns` 才能使用 Deno 命名空间。

这一切仍然是试验性的，我们希望 `bundle` 命令能够发展，以处理诸如 `tree shaking` 之类的事情，并更像 `Rollup.js`。

### 调试

Deno 内置调试功能，但就目前而言，Visual Studio Code 扩展仍不支持它。要调试，请手动使用以下命令。

- `deno run -A --inspect-brk fileToDebug.ts` 对模块使用最低权限
- 在 Chrome 或 Chromium 中打开 `chrome://inspect`。你会看到如下内容

{% img http://cdn.kingmui.cn/deno-inspect-with-chrome.png %}

- 单击 `inspect` 以连接并开始调试你的代码

### 安装 VSCode 插件

由于 `import url` 的形式和 Deno 全局对象并未被 VSCode 支持，所以需要借助插件 [Deno](https://marketplace.visualstudio.com/items?itemName=axetroy.vscode-deno) 进行支持。

{% note warning %} 注意：需要到 settings 中将 `deno.enabled` 设置为 `true` {% endnote %}

```json
// .vscode/settings.json
{
  "deno.enable": true,
}
```

### 总结

事实证明，前端生态圈的新技术涌现是好事。从积极的一面来看，我们将有更多更高质量的库的选择权利。但消极的一面是，不断涌现的新框架和库也增加了前端的学习成本。

Deno 成功地解决了 JavaScript 开发中的许多痛点。例如：

- 通过使用 Web 标准，Deno 的 API 将面向未来。这使开发人员有信心，他们不会浪费时间在学习即将过时的东西
- 原生支持 TypeScript，提供的编译期类型检查可以将大幅减少软件 bug
- 内置工具意味着无需浪费时间寻找开箱即用的产品
- 分散式软件包管理使用户从 npm 中解放出来，与使用过时的 CommonJS 规范相比，ECMAScript 模块规范带来了新鲜的空气

尽管 Deno 在短时间内还不能完全替代 Node.js，但它已经成为日常使用的绝佳编程环境。
