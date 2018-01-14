---
title: CommonJS 模块和 ES6 模块的区别
date: 2020-08-04 23:00:03
tags:
  - JavaScript
  - ES6
  - CommonJS
comments: true
---

历史上，JS 一直没有模块（module）体系，无法将一个大程序拆分成互相依赖的小文件，再用简单的方法拼装起来。其他语言都有这项功能，比如 Ruby 的 `require`、Python 的 `import`，甚至就连 CSS 都有 `@import`，但是 JS 任何这方面的支持都没有，这对开发大型复杂的项目形成了巨大障碍。

在 ES6 出来之前，社区制定了一些模块加载方案，最主要的有 **CommonJS** 和 **AMD** 两种。前者用于服务器，后者用于浏览器。ES6 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。

ES6 模块的设计思想是尽量的**静态化**，使得{% label info@编译时就能确定模块的依赖关系 %}，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在**运行时**确定这些东西。比如，CommonJS 模块就是对象，输入时必须查找对象属性。

<!-- more -->

```javascript
// CommonJS 模块
const { stat, exists, readfile } = require('fs');

// 等同于
const _fs = require('fs');
const stat = _fs.stat;
const exists = _fs.exists;
const readfile = _fs.readfile;
```

上述代码的实质是整体加载 fs 模块（即加载 fs 的所有方法），生成一个对象（_fs），然后再从这个对象上读取3个方法。这种加载称为**运行时加载**，因为只有运行时才能得到这个对象，导致完全**没办法在编译时做静态优化**。

ES6 模块不是对象，而是通过 `export` 命令显式指定输出的代码，再通过 `import` 命令输入。

```javascript
import { stat, exists, readfile } from 'fs';
```

上述代码的实质是从 fs 模块加载3个方法，其他方法不加载。这种加载称为**编译时加载**或者静态加载，即 {% label info@ES6 可以在编译时就完成模块加载 %}，效率比 CommonJS 模块的加载方式高。当然，这也导致了无法引用 ES6 模块本身，因为它不是对象。

由于 ES6 模块是编译时加载，**使得静态分析成为可能**。有了它，就能进一步拓宽 JS 的语法，比如引入宏（macro）和类型检查（type system）这些只能靠静态分析实现的功能。

```javascript
// 不会报错，因为 import 的执行早于 foo 的调用
// 这种行为的本质是，import 命令是编译阶段执行的，在代码运行之前
foo();

// import 命令具有提升效果，会提升到整个模块的头部，首先执行
import { foo } from 'my_module';
```

```javascript
// import 语句会执行所加载的模块，以下代码仅仅执行 lodash 模块，但是不输入任何值
import 'lodash';
// 如果多次重复执行同一句 import 语句，那么只会执行一次
import 'lodash';

// import 语句是 Singleton 模式
import { func1 } from 'module';
import { func2 } from 'module';
// 等价于
import { func1, func2 } from 'module';
```

`import` 和 `export` 命令**只能在模块的顶层**，不能在代码块之中（如在 if 代码块之间或在函数之中）。这样的设计，固然有利于编译器提高效率，但也导致无法在运行时加载模块。在语法上，条件加载就不可能实现。如果 `import` 命令要取代 Node 的 `require` 方法，这就现成了一道障碍。因为 `require` 是运行时加载模块，`import` 命令无法取代 `require` 的动态加载功能。

ES2020 提案引入 `import()` 函数，支持动态加载模块。`import` 命令能接受什么参数，`import()` 函数就能接受什么参数。两者区别主要是**后者为动态加载**。`import()` 返回一个 Promise 对象。

```javascript
const main = document.querySelector('main');
// import() 函数可以用在任何地方，不仅仅是模块，非模块的脚本也可以使用
// 它是运行时执行，也就是说，什么时候运行到这一句，就会加载指定的模块
// import() 函数与所加载的模块没有静态连接关系，这点也与 import 语句不相同
// import() 函数类似于 Node 的 require 方法，区别主要是前者是异步加载，后者是同步加载
import(`./section-modules/${someVariable}.js`)
    .then(module => {
        module.loadPageInfo(main);
    })
    .catch(err => {
        main.textContent = err.message;
    });

// 适用场景
// 1. 按需加载
button.addEventListener('click', e => {
    import('./dialogBox.js')
    .then(dialogBox => {
        dialogBox.open();
    })
    .catch(e => console.log)
});

// 2. 条件加载
if (condition) {
    import('moduleA').then(...);
}

// 3. 动态的模块路径
// import() 允许模块路径动态生成
import(getPath())
.then(...);
```

除了静态加载带来的各种好处，ES6 模块还有以下好处：

1. 不再需要 UMD 模块格式，将来服务器和浏览器都会支持 ES6 模块格式
2. 将来浏览器的新 API 就能用模块格式提供，不再需要做成全局变量或者 `navigator` 对象的属性
3. 不再需要对象作为命名空间（比如 `Math` 对象），未来这些功能都可以通过模块提供

#### 浏览器加载

HTML 网页中，浏览器通过 `<script>` 标签加载 JS 脚本。

```html
<!-- 网页内嵌的脚本 -->
<script type="application/javascript">
// module code
</script>

<!-- 外部脚本 -->
<script type="application/javascript" src="path/to/myModule.js"></script>
```

上述代码中，由于浏览器脚本的默认语言是 JS，因此 `type="application/javascript"` 可以省略。

默认情况下，浏览器是**同步加载** JS 脚本，即渲染引擎遇到 `<script>` 标签就会停下来，等到执行完脚本，再继续向下渲染。如果是外部脚本，还必须加入**脚本下载的时间**。如果脚本体积很大，下载和执行的时间就会很长，因而造成浏览器阻塞，用户会感觉到浏览器“卡死”，没有任何响应。这显然是很不好的用户体验，所以浏览器允许脚本异步加载，下面就是两种**异步加载**的语法。

```html
<!-- script 标签打开 defer、async 属性，脚本就会异步加载 -->
<!-- 渲染引擎遇到这一行命令，就会开始下载异步脚本，但不会等它下载和执行，而是直接执行后面的命令 -->
<script src="path/to/myModule.js" defer></script>
<script src="path/to/myModule.js" async></script>
```

defer 与 async 的区别：

1. defer 要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行。多个 defer 会按它们在页面出现的顺序加载。是{% label info@渲染完再执行 %}。
2. async 一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。多个 async 脚本不能保证加载顺序。是{% label info@下载完就执行 %}。

#### 加载规则

浏览器加载 ES6 模块，也可以使用 `<script>` 标签，但是要加入 `type="module"` 属性。浏览器对于带有 `type="module"` 的 `<script>`，都是**异步加载**，不会阻塞浏览器，等同于打开了 `<script>` 标签的 defer 属性。有多个 `type="module"` 的标签，它们会按照在页面出现的顺序依次执行，如果显式指定了 async 则不会按顺序执行。

ES6 模块 也**允许内嵌在网页中**，语法行为与加载外部脚本完全一致。

```html
<script type="module">
    import $ from 'jquery';
    $('#message').text('Hello World');
</script>
```

对于外部的模块脚本，有几点注意事项：

1. 代码是在**模块作用域**之中运行，而不是在全局作用域运行。模块内部的顶层变量，外部不可见
2. 模块脚本**自动采用严格模块**，不管有没有声明 `use strict`
3. 模块之中，可以使用 `import` 命令加载其他模块（.js 后缀不可省略，需要提供绝对 URL 或相对 URL），也可以使用 `export` 命令输出对外接口
4. 模块之中，顶层的 `this` 关键字返回 `undefined`，而不是指向 `window`。利用这个语法点，可以侦测当前代码是否运行在 ES6 模块之中
5. 同一个模块如果加载多次，将只执行一次

#### NodeJS 加载

NodeJS 对 ES6 模块的处理比较麻烦，因为它有自己的 CommonJS 模块格式，与 ES6 模块格式是不兼容的。目前的解决方案是，将两者分开，从 V13.2 版本开始，NodeJS 已经默认打开了 ES6 模块支持。

NodeJS 要求 ES6 模块采用 `.mjs` 后缀文件名。也就是说，只要脚本文件里面使用 `import` 或 `export` 命令，那么就必须采用 `.mjs` 后缀名。NodeJS 遇到 `.mjs` 文件，就认为它是 ES6 模块，默认启用严格模式。如果不希望将后缀名改成 `.mjs`，可以在项目的 `package.json` 文件中，指定 `type` 字段为 `module`。一旦设置了以后，该目录里面的 JS 脚本，就被解释成 ES6 模块。如果这时还要使用 CommonJS 模块，那么需要将 CommonJS 脚本的后缀名都改成 `.cjs`。如果没有 `type` 字段，或者 `type` 字段为 `commonjs`，则 `.js` 脚本会被解释成 CommonJS 模块。

总结：`.mjs` 文件总是以 ES6 模块加载，`.cjs` 文件总是以 CommonJS 模块加载，`.js` 文件的加载取决于 `package.json` 里面 `type` 字段的设置。

#### main 字段

`package.json` 文件有两个字段可以**指定指定模块的入口文件**：`main` 和 `exports`。

```json
{
    "type": "module",
    "main": "./src/index.js"
}
```

`exports` 字段的优先级高于 `main` 字段，它有多种用法。

1）子目录别名

`package.json` 文件的 `exports` 字段可以指定脚本或子目录的别名。

```json
{
    "exports": {
        "./submodeule": "./src/submodule.js"
    }
}
```

上面的代码指定 `./src/submodule.js` 别名为 `submodeule`，然后就可以从别名加载这个文件。

```javascript
// 加载 ./node_modules/es-module-package/src/submodule.js
import submodule from 'es-module-package/submodule';
```

2）main 的别名

`exports` 字段的别名如果是 `.`，就代表模块的主入口，优先级高于 `main` 字段，并且可以直接简写成 `exports` 字段的值。

```json
{
    "exports": {
        ".": "./main.js"
    }
}

// 等同于
{
    "exports": "./main.js"
}
```

由于 `exports` 字段只有支持 ES6 的 NodeJS 才认识，所以可以用来兼容旧版本的 NodeJS。

```json
{
    "main": "./main-legacy.cjs",
    "exports": {
        ".": "./main-modern.cjs"
    }
}
```

3）条件加载

利用 `.` 这个别名，可以为 ES6 模块和 CommonJS 指定不同的入口。目前，这个功能需要在 NodeJS 运行的时候，打开 `--experimental-conditional-exports` 标志。

```json
{
    "type": "module",
    "exports": {
        ".": {
            "require": "./main.cjs",
            "default": "./main.js"
        }
    }
}

// 可以简写为
// 注意：如果还有其他别名，则不能简写
{
    "exports": {
        "require": "./main.cjs",
        "default": "./main.js"
    }
}
```

#### ES6 模块加载 CommonJS 模块

```json
{
    "type": "module",
    "main": "./index.cjs",
    "exports": {
        "require": "./index.cjs",
        "default": "./wrapper.mjs"
    }
}
```

上面代码指定了 CommonJS 入口文件 `index.cjs`。下面是这个文件的代码：

```javascript
// ./node_modules/pkg/index.cjs
exports.name = 'value';
```

然后，ES6 模块可以加载这个文件。

```javascript
// ./node_modules/pkg/wrapper.mjs
import cjsModule from './index.cjs';
export const name = cjsModule.name;

// 注意：import 命令加载 CommonJS 模块，只能整体加载，不能只加载单一的输出项
// 特例：NodeJS 内置模块可以整体加载，也可以加载指定的输出项
// ✅
import packageMain from 'commonjs-package';
// ❎
import { method } from 'commonjs-package';

// 还有一种变通的加载方法，就是使用 NodeJS 内置的 `module.createRequire()` 方法
// ES6 模块通过 `module.createRequire()` 方法可以加载 CommonJS 模块
// cjs.cjs
module.exports = 'cjs';

// esm.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const cjs = require('./cjs.cjs');
cjs === 'cjs'; // true
```

#### CommonJS 模块 加载 ES6 模块

CommonJS 模块的 `require` 命令不能加载 ES6 模块。只能使用 `import()` 这个方法加载。

```javascript
(async () => {
    await import('./my-app.mjs');
})();
```

#### 加载路径

ES6 模块的加载路径必须给出脚本的**完整路径**，不能省略脚本的后缀名。`import` 命令和 `package.json` 文件的 `main` 字段如果省略脚本的后缀名，会报错。

为了与浏览器的 `import` 加载规则相同，NodeJS 的 `.mjs` 文件支持 URL 路径。

```javascript
// 同一个脚本只要参数不同，就会被加载多次，并且保存成不同的缓存
import './foo.mjs?query=1';
```

目前，NodeJS 的 `import` 命令只支持加载本地模块（file: 协议）和 data: 协议，不支持加载远程模块。此外，脚本路径只支持相对路径，不支持绝对路径（`/` 或 `//` 开头的路径）。与浏览器不同的是，NodeJS 的 `import` 命令是**异步加载**。

#### 内部变量

ES6 模块应该是通用的，同一个模块不用修改，就可以运行于浏览器环境和服务器环境。为了达到这个目标，Node 规定 ES6 模块之中不能使用 CommonJS 模块特有的一些内部变量。

首先，就是 `this` 关键字。ES6 模块之中，顶层的 `this` 指向 `undefined`；CommonJS 模块的顶层 `this` 指向当前模块，这是两者的一个重大差异。

其次，以下这些顶层变量在 ES6 模块之中也是不存在的。

- arguments
- require
- module
- exports
- __filename
- __dirname

#### 循环加载（Circular Dependency）

循环加载指的是，A 脚本的执行依赖 B 脚本，B 脚本的执行又依赖 A 脚本。通常，循环加载表示存在强耦合，如果处理不好，还可能导致递归加载，使得程序无法执行，因此应该避免出现。但是实际上，这是很难避免的，尤其是依赖关系复杂的大型项目。对于 JS 语言来说，目前最常见的两种模块格式 CommonJS 和 ES6，**处理循环加载的方法是不一样的，返回的结果也不一样**。

```javascript
// a.js
const b = require('b');

// b.js
const a = require('a');
```

#### CommonJS 模块的循环加载

CommonJS 的一个模块，就是一个脚本文件。`require` 命令第一次加载该脚本，就会执行整个脚本，然后在内存生成一个对象。以后需要用到这个模块的时候，就会到 `exports` 属性上面取值。即使再次执行 `require` 命令，也不会再次执行该模块，而是到缓存之中取值。也就是说，{% label info@CommonJS 模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果 %}，除非手动清除系统缓存。

```json
{
    // 模块名
    "id": "...",
    // 模块输出的各种接口
    "exports": {...},
    // 该模块的脚本是否执行完毕
    "loaded": true,
    ...
}
```

CommonJS 模块的重要特性是加载时执行，即脚本代码在 `require` 的时候，就会全部执行。**一旦出现某个模块被循环加载**，就{% label info@只会输出已经执行的部分 %}，还未执行的部分不会输出。

```javascript
// a.js
exports.done = false;
// 加载 b.js，此时 a.js 代码就停在这里，等待 b.js 执行完毕，再往下执行
var b = require('./b.js');
console.log('在 a.js 中，b.done = %j', b.done);
exports.done = true;
console.log('a.js 执行完毕');

// b.js
exports.done = false;
// 发生了循环加载
// 系统会去 a.js 模块对应的 exports 属性取值，可是因为 a.js 还没有执行完
// 从 exports 属性只能取回已经执行的部分（exports.done = false;），而不是最后的值
var a = require('./a.js');
// b.js 接着往下执行，等到全部执行完毕，再把执行权交还给 a.js
console.log('在 b.js 中，a.done = %j', a.done);
exports.done = true;
console.log('b.js 执行完毕');

// main.js
var a = require('a.js');
// 这里不会再次执行 b.js，而是输出缓存的 b.js 的执行结果
var b = require('b.js');
console.log('在 main.js 中，a.done=%j，b.done=%j', a.done, b.done);
```

```shell
# 执行 main.js
node main.js

在 b.js 中，a.done = false
b.js 执行完毕
在 a.js 中，b.done = true
a.js 执行完毕
在 main.js 中，a.done=true，b.done=true
```

#### ES6 模块的循环加载

ES6 模块处理循环加载与 CommonJS 模块有本质不同。ES6 模块是动态引用，如果使用 `import` 从一个模块加载变量 `import foo from 'foo'`，那些变量不会被缓存，而是成为一个指向被加载模块的引用，**需要开发者自己保证，真正取到的时候能够取到值**。

```javascript
// a.mjs
import { bar } from './b';
console.log('a.mjs');
console.log(bar);
export let foo = 'foo';

// b.mjs
import { foo } from './a';
console.log('b.mjs');
console.log(foo);
export let bar = 'bar';
```

```shell
node --experimental-modules a.mjs

b.mjs
ReferenceError: foo is not defined
```

首先，执行 `a.mjs` 后，引擎发现它加载了 `b.mjs`，因此会优先执行 `b.mjs`，然后再执行 `a.mjs`。接着，执行 `b.mjs` 时，已知它从 `a.mjs` 输入了 `foo` 接口，这时不会去执行 `a.mjs`，而是认为这个接口已经存在了，继续往下执行。执行到第三行 `console.log(foo);` 时，才发现这个接口没有定义，因此报错。

解决这个问题的方法，就是让 `b.mjs` 运行时，`foo` 已经定义。可以通过将 `foo` 写成函数来解决。

```javascript
// a.mjs
import { bar } from './b';
console.log('a.mjs');
console.log(bar());
function foo() {
    return 'foo';
}
export { foo };

// b.mjs
import { foo } from './a';
console.log('b.mjs');
console.log(foo());
function bar() {
    return 'bar';
}
export { bar };
```

#### 总结

ES6 模块与 CommonJS 模块的差异：

1. 当导出的是一个原始类型数据时，CommonJS 模块输出的是值的缓存，不存在动态更新，即输出的是**值的拷贝**，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值；ES6 模块输出的接口，与其对应的值是{% label info@动态绑定关系 %}，通过该接口，可以取到模块内部实时的值，即输出的是**值的引用**，这个值指向的地址是**只读**的，不能重新赋值
2. CommonJS 模块是**运行时加载**；ES6 模块是**编译时**输出接口
3. CommonJS 是单个值导出；ES6 模块可以导出多个
4. CommonJS 是动态语法，**可以写在条件判断语句中**；ES6 模块是静态语法**只能写在顶层**
5. CommonJS 的 `this` 指向当前模块；{% label info@ES6 模块自动采用严格模式 %}，`this` 指向 `undefined`
