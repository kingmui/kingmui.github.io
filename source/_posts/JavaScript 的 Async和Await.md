---
title: JavaScript 的 Async/Await
date: 2019-04-05 17:01:33
tags:
  - JavaScript
comments: true
---

在过去很长的时间里，JavaScript 开发人员在处理异步代码时不得不依赖回调函数来解决。结果，我们中的很多人都经历过回调地域。

然后我们迎来了 Promise。他们为回调提供了更有组织的替代方案，并且大多数社区很快也都转而使用它们。

现在，随着最新添加的 Async / Await，我们终于可以编写更高质量的 JavaScript 代码！

### 什么是 Async/Await？

Async / Await 是一个备受期待的 JavaScript 功能，它使异步函数的使用更加愉快和易于理解。它构建在 Promise 之上，并与所有现有的基于 Promise 的 API 兼容。

**Async - 定义异步函数**

```javascript
async function someName(){...}
```

- 自动把函数转换为 `Promise`
- 当调用异步函数时，函数返回值会被 `resolve` 处理
- 异步函数内部可以使用 `await`

<!-- more -->

**Await - 暂停异步函数的执行**

```javascript
const result = await someAsyncCall();
```

- 当使用在 `Promise` 前面时，`await` 等待 `Promise` 完成，并返回 `Promise` 的结果
- `await` 只能和 `Promise` 一起使用，不能和 `callback` 一起使用
- `await` 只能用在 `async` 函数中

假设我们想从服务器获取一些 JSON 文件。我们将编写一个使用 axios 库的函数，并将 HTTP GET 请求发送到 `https://tutorialzine.com/misc/files/example.json`。我们必须等待服务器响应，因此这个 HTTP 请求必然是异步的。

```javascript
// Promise approach

function getJSON() {
  // To make the function blocking we manually create a Promise.
  return new Promise(function(resolve) {
    axios.get('https://tutorialzine.com/misc/files/example.json').then(function(json) {
      // The data from the request is available in a .then block
      // We return the result using resolve.
      resolve(json);
    });
  });
}

// Async/Await approach

// async 关键字将自动创建一个新的 Promise 并返回它
async function getJSONAsync() {
  // await 关键字使我们不必编写 .then() 语句块。
  let json = await axios.get('https://tutorialzine.com/misc/files/example.json');

  // The result of the GET request is available in the json variable.
  // 我们就像在普通的同步函数中一样返回它
  return json;
}
```

很明显，使用 Async / Await 版本的代码更短，更容易阅读。除了使用的语法不同之外，两个函数功能完全相同，它们都返回 Promises 并使用 axios 的 JSON 响应来解析。我们可以这样调用我们的异步函数：

```javascript
getJSONAsync().then(function(result) {
  // Do something with result.
});
```

### Async/Await 是否会取代 Promise

不会。当我们在使用 Async / Await 时，我们仍在使用 Promise，也就是说 `Async/Await` 底层依然使用了 `Promise`。从长远来看，对 Promises 的良好理解实际上对您很有帮助。

甚至有一些 Async / Await 用例并没有削减它，我们不得不回到 Promises 寻求帮助。 一个使用场景是当我们需要进行多个独立的异步调用并等待所有这些调用完成时。

如果我们尝试使用 async 和 await 执行此操作，将发生以下情况：

```javascript
async function getABC() {
  let A = await getValueA(); // getValueA 花费 2 秒
  let B = await getValueB(); // getValueB 花费 4 秒
  let C = await getValueC(); // getValueC 花费 3 秒

  return A * B * C;
}
```

每次遇到 `await` 关键字时，`Promise` 都会停下，一直到运行结束，所以总共花费是 2+4+3 = 9 秒。`await` 把异步变成了同步。

这不是最佳的解决方案，因为三个变量 A，B 和 C 不相互依赖。换句话说，在我们得到 B 之前，我们不需要知道 A 的值。所以我们可以并行得到它们并且等待几秒钟。

多个异步函数同时执行时，需要借助 `Promise.all`。这将确保在继续之前我们仍然拥有所有结果，但异步调用将并行触发，而不是一个接一个地触发。

```javascript
async function getABC() {
  // Promise.all() 允许同时执行所有的异步函数
  let results = await Promise.all([getValueA, getValueB, getValueC]);

  return results.reduce((total, value) => total * value);
}
```

这种方式将花费更少的时间。`getValueA` 和 `getValueC` 调用将在 `getValueB` 结束时完成。我们将有效地将执行时间减少到最慢请求的时间 4 秒（`getValueB` 的耗时），而不是时间的总和。

### Async/Await 的错误处理

在 Async/Await 语法中，我们可以使用 `try/catch` 进行错误处理。在 Promise 中的 `.catch()` 分支会进入 `catch` 语句。

```javascript
async function doSomethingAsync() {
  try {
    // This async call may fail.
    let result = await someAsyncCall();
  } catch (error) {
    // If it does we will catch the error here.
  }
}
```

`catch` 子句将处理由等待的异步调用或我们可能在 `try` 块内写入的任何其他失败代码所引发的错误。

如果有必要，我们也可以在执行异步函数时捕获错误。由于所有异步函数都返回 Promise，因此我们可以在调用它们时简单地包含一个 `.catch()` 事件处理程序。

```javascript
// Async function without a try/catch block.
async function doSomethingAsync(){
    // This async call may fail.
    let result = await someAsyncCall();
    return result;
}

// We catch the error upon calling the function.
doSomethingAsync().
    .then(successHandler)
    .catch(errorHandler);
```

选择您喜欢的错误处理方法并坚持下去非常重要。同时使用 `try / catch` 和 `.catch()` 很可能会导致未知的问题。

### 引用

[JavaScript Async/Await Explained in 10 Minutes](https://tutorialzine.com/2017/07/javascript-async-await-explained)
