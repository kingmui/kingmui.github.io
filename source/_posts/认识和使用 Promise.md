---
title: 认识和使用 Promise
date: 2019-04-05 13:35:53
tags:
  - JavaScript
comments: true
---

{% note info %}
`Promise` 对象用于表示一个异步操作的最终状态（完成或失败），以及该异步操作的结果值。
{% endnote %}

```javascript
new Promise( function(resolve, reject) {...} /* executor */  );
```

`Promise` 构造函数执行时立即调用“处理器函数”（executor function）， `resolve` 和 `reject` 两个函数作为参数传递给“处理器函数”。“处理器函数”内部通常会执行一些异步操作，一旦异步操作执行完毕(可能成功/失败)，要么调用 `resolve` 函数来将 `promise` 状态改成 `fulfilled`，要么调用 `reject` 函数将 `promise` 的状态改为 `rejected`。如果在“处理器函数”中抛出一个错误，那么该 `promise` 状态为 `rejected`。

**一个 Promise 有以下几种状态**:

- `pending`: 初始状态，既不是成功，也不是失败状态。
- `fulfilled`: 意味着操作成功完成。
- `rejected`: 意味着操作失败。
- `settled`: 处在 `fulfilled` 或 `rejected` 状态而不是 `pending` 状态。

因为 `Promise.prototype.then` 和 `Promise.prototype.catch` 方法返回 `promise` 对象， 所以它们**可以被链式调用**。

<!-- more -->

### 约定

不同于老式的传入回调，在应用 `Promise` 时，我们将会有以下约定：

- 在 JavaScript 事件队列的**当前运行完成**之前，回调函数永远不会被调用。
- 通过 `.then` 形式添加的回调函数，甚至在异步操作完成之后才被添加的函数，都会被调用。
- 通过多次调用 `.then`，可以添加多个回调函数，它们会**按照插入顺序并且独立运行**。

### 链式调用

一个常见的需求就是连续执行两个或者多个异步操作，这种情况下，每一个后来的操作都在前面的操作执行成功之后，带着上一步操作所返回的结果开始执行。我们可以通过创造一个 `Promise chain` 来完成这种需求。

在过去，做多重的异步操作，会导致经典的**回调地狱**：

```javascript
doSomething(function(result) {
  doSomethingElse(
    result,
    function(newResult) {
      doThirdThing(
        newResult,
        function(finalResult) {
          console.log('Got the final result: ' + finalResult);
        },
        failureCallback
      );
    },
    failureCallback
  );
}, failureCallback);
```

通过新式函数，我们把回调绑定到被返回的 `Promise` 上代替以往的做法，形成一个 `Promise` 链：

```javascript
doSomething()
  .then(result => doSomethingElse(result))
  .then(newResult => doThirdThing(newResult))
  .then(finalResult => console.log(`Got the final result: ${finalResult}`))
  .catch(failureCallback);
```

`then` 里的参数是可选的，`catch(failureCallback)` 是 `then(null, failureCallback)` 的缩略形式。

基本上，一个 `Promise` 链式遇到异常就会停止，查看链式的底端，寻找 `catch` 处理程序来代替当前执行。通过捕获所有的错误，甚至抛出异常和程序错误，`Promise` 解决了回调地狱的基本缺陷。

**注意**：如果想要在回调中获取上个 `Promise` 中的结果，上个 `Promise` 中必须要返回结果。

### Catch 的后续链式操作

在一个失败操作（即一个 `catch`）之后可以继续使用链式操作，即使链式中的一个动作失败之后还能有助于新的动作继续完成。请阅读下面的例子：

```javascript
new Promise((resolve, reject) => {
  console.log('Initial');
  resolve();
})
  .then(() => {
    throw new Error('Something failed');
    // 由于“Something failed”错误导致了拒绝操作，所以“Do this”文本没有被输出。
    console.log('Do this');
  })
  .catch(() => {
    console.log('Do that');
  })
  .then(() => {
    console.log('Do this whatever happened before');
  });

// Initial
// Do that
// Do this whatever happened before
```

### 组合

[Promise.resolve()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve) 和 [Promise.reject()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject) 是手动创建一个已经 `resolve` 或者 `reject` 的 `promise` 快捷方法。它们有时很有用。

[Promise.all()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) 和 [Promise.race()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) 是并行运行异步操作的两个组合式工具。

**Promise.all()**

`Promise.all(iterable)` 方法返回一个 `Promise` 实例，此实例在 `iterable` 参数内所有的 `promise` 都完成（`resolved`）或参数中不包含 `promise` 时回调完成（`resolve`）；如果参数中 `promise` 有一个失败（`rejected`），此实例回调失败（`reject`），失败原因的是第一个失败 `promise` 的结果。

- `iterable`：一个可迭代对象，如 `Array` 或 `String。`
- 返回值：
  - 如果传入的参数是一个空的可迭代对象，则返回一个**已完成**（already resolved）状态的 `Promise`。{% label info@当且仅当传入的可迭代对象为空时为同步 %}。
  - 如果传入的参数不包含任何 promise，则返回一个**异步完成**（asynchronously resolved） `Promise。`
  - 其它情况下返回一个处理中（pending）的 `Promise`。这个返回的 `promise` 之后会在所有的 `promise` 都完成或有一个 `promise` 失败时**异步**地变为完成或失败。在任何情况下，`Promise.all` 返回的 `promise` 的完成状态的结果都是一个数组，**返回值将会按照参数内的 `promise` 顺序排列，而不是由调用 `promise` 的完成顺序决定**。

```javascript
var promise1 = Promise.resolve(3);
var promise2 = 42;
var promise3 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 100, 'foo');
});

Promise.all([promise1, promise2, promise3]).then(function(values) {
  console.log(values);
});
// expected output: Array [3, 42, "foo"]
```

**Promise.race()**

`Promise.race(iterable)` 方法返回一个 `promise`，一旦迭代器中的某个 `promise` 解决或拒绝，返回的 `promise` 就会解决或拒绝。

```javascript
var promise1 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 500, 'one');
});

var promise2 = new Promise(function(resolve, reject) {
  setTimeout(resolve, 100, 'two');
});

Promise.race([promise1, promise2]).then(function(value) {
  console.log(value);
  // Both resolve, but promise2 is faster
});
// expected output: "two"
```

- 返回值：
  - 一个待定的 `Promise` 只要给定的迭代中的一个 `promise` 解决或拒绝，就采用第一个 `promise` 的值作为它的值，从而异步地解析或拒绝（一旦堆栈为空）。{% label info@如果传的迭代是空的，则返回的 promise 将永远等待 %}。

### 时序

为了避免意外，即使是一个已经变成 `resolve` 状态的 `Promise`，传递给 `then` 的函数也总是会被**异步**调用：

```javascript
Promise.resolve().then(() => console.log(2));
console.log(1); // 1, 2
```

传递到 `then` 中的函数被置入了一个**微任务**队列，而不是立即执行，这意味着它是在 JavaScript 事件队列的所有运行时结束了，事件队列被清空之后才开始执行：

```javascript
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

wait().then(() => console.log(4));
Promise.resolve()
  .then(() => console.log(2))
  .then(() => console.log(3));
console.log(1); // 1, 2, 3, 4
```

### 嵌套

简便的 `Promise` 链式编程最好保持扁平化，不要嵌套 `Promise`。嵌套 `Promise` 是一种可以限制 `catch` 语句的作用域的控制结构写法。明确来说，嵌套的 `catch` 仅捕捉在其之前同时还必须是其作用域的 `failureres`，而捕捉不到在其链式以外或者其嵌套域以外的 `error`。如果使用正确，那么可以实现高精度的错误修复。

```javascript
doSomethingCritical()
  .then(result =>
    doSomethingOptional()
      .then(optionalResult => doSomethingExtraNice(optionalResult))
      .catch(e => {
        console.log(e.message);
      })
  ) // 即使有异常也会忽略，继续运行;(最后会输出)
  .then(() => moreCriticalStuff())
  .catch(e => console.log('Critical failure: ' + e.message)); // 没有输出
```

这个内部的 `catch` 语句仅能捕获到 `doSomethingOptional()` 和 `doSomethingExtraNice()` 的失败，而且还是在 `moreCriticalStuff()` 并发运行以后。重要提醒，如果 `doSomethingCritical()` 失败，这个错误才仅会被最后的（外部）`catch` 语句捕获到。

### Promise.prototype.finally()

`finally()` 方法返回一个 `Promise`，在 `promise` 执行结束时，无论结果是 `fulfilled` 或者是 `rejected`，在执行 `then()` 和 `catch()` 后，都会执行 `finally` 指定的回调函数。这为指定执行完 `promise` 后，无论结果是 `fulfilled` 还是 `rejected` 都需要执行的代码提供了一种方式，避免同样的语句需要在 `then()` 和 `catch()` 中各写一次的情况。

由于无法知道 `promise` 的最终状态，所以 `finally` 的回调函数中**不接收任何参数**，它仅用于无论最终结果如何都要执行的情况。

```javascript
p.finally(onFinally);

p.finally(function() {
  // 返回状态为(resolved 或 rejected)
});
```

**注意**: 在 `finally` 回调中 `throw`（或返回被拒绝的 `promise`）将以 `throw()` 指定的原因拒绝新的 `promise`。
