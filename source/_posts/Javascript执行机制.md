---
title: Javascript 执行机制
date: 2018-11-15 15:35:49
tags:
  - JavaScript
comments: true
---

### 关于 Javascript

Javascript 是一门**单线程**语言，在最新的 HTML5 中提出了 [Web-Worker](http://www.ruanyifeng.com/blog/2018/07/web-worker.html)，但 Javascript 是单线程这一核心仍未改变。所以一切的 Javascript 版“多线程”都是用单线程模拟出来的！

### Javascript 事件循环

既然 JS 是单线程语言，那么就像只有一个窗口的银行，客户需要排队一个一个办理业务，同理 JS 任务也要一个一个的按顺序执行。如果一个任务耗时过长，那么后一个任务就必须等着。那么问题来了，假如我们想浏览新闻，但是新闻包含的超清图片加载很慢，难道我们的网页要一直卡着直到图片完全加载出来吗？因此聪明的程序员将任务分为两类：

<!-- more -->

- 同步任务
- 异步任务

当我们打开网站时，网页的渲染过程就是一大堆同步任务，比如页面骨架和页面元素的渲染。而像加载图片之类占用资源大耗时久的任务，就是异步任务。关于这部分有严格的文字定义，但本文的目的是用最小的学习成本彻底弄懂执行机制，所以我们用导图来说明：

1. 同步任务和异步任务分别进入不同的执行“场所”。同步任务进入**主线程**，异步任务进入 `Event Table` 并注册函数
1. 当指定的任务完成时，`Event Table` 会将这个函数移入 `Event Queue`
1. 当主线程内的任务执行完毕，会去 `Event Queue` 读取对应的函数，进入主线程执行
1. 上述过程会不断重复，也就是常说的 `Event Loop` (事件循环)

![](http://cdn.kingmui.cn/javascript_event_queue_2.webp)

我们不禁要问了，那怎么知道主线程执行栈为空啊？JS 引擎存在 `monitoring process` 进程，会持续不断的检查主线程执行栈是否为空，一旦为空，就会去 `Event Queue` 那里检查是否有等待被调用的函数。

举个🌰

```javascript
let data = [];
$.ajax({
  url: 'www.javascript.com',
  data,
  success: () => {
    console.log('发送成功!');
  }
});
console.log('代码执行结束');
```

上面是一段简易的 Ajax 请求代码：

1. Ajax 进入 `Event Table`，注册回调函数 `success`
2. 执行 `console.log('代码执行结束')`
3. Ajax 事件完成，回调函数 `success` 进入 `Event Queue`
4. 主线程从 `Event Queue` 读取回调函数 `success` 并执行

### 又爱又恨的 setTimeout

大名鼎鼎的 `setTimeout` 无需再多言，大家对他的第一印象就是异步可以延时执行，我们经常这么实现延时 3 秒执行：

```javascript
setTimeout(() => {
  console.log('延时3秒');
}, 3000);
```

渐渐的 `setTimeout` 用的地方多了，问题也出现了，有时候明明写的延时 3 秒，实际却 5，6 秒才执行函数，这又是怎么回事呢？

先看个🌰

```javascript
setTimeout(() => {
  task();
}, 3000);
console.log('执行console');
```

根据前面我们的结论，`setTimeout` 是异步的，应该先执行 `console.log` 这个同步任务，所以我们的结论是：

```bash
# 执行console
# task()
```

然后我们修改一下前面的代码：

```javascript
setTimeout(() => {
  task();
}, 3000);

sleep(10000000);
```

乍一看其实差不多嘛，但我们把这段代码在 Chrome 执行一下，却发现控制台执行 `task()` 需要的时间远远超过 3 秒，说好的延时三秒，为什么现在需要这么长的时间啊？

这时候我们需要重新理解 `setTimeout` 的定义。我们先说上述代码是怎么执行的：

1. `task()` 进入 `Event Table` 并注册，计时开始
2. 执行 `sleep` 函数，很慢...很慢...非常慢，计时仍在继续
3. 3 秒到了，计时事件 `timeout` 完成，`task()` 进入 `Event Queue`，但是 `sleep` 也太慢了吧，还没执行完，只好等着
4. `sleep` 终于执行完了，`task()` 终于从 `Event Queue` 进入了主线程执行

上述的流程走完，我们知道 `setTimeout` 这个函数，是**经过指定时间后，把要执行的任务加入到 `Event Queue` 中**，又因为是单线程任务要一个一个执行，如果前面的任务需要的时间太久，那么只能等着，导致真正的延迟时间远远大于 3 秒。

我们还经常遇到 `setTimeout(fn, 0)` 这样的代码，0 秒后执行又是什么意思呢？是不是可以立即执行呢？

答案是不会的，`setTimeout(fn, 0)` 的含义是，指定某个任务在主线程最早可得的空闲时间执行，意思就是不用再等多少秒了，只要主线程执行栈内的同步任务全部执行完成，栈为空就马上执行。

关于 `setTimeout` 要补充的是，即便主线程为空，0ms 实际上也是达不到的。根据 HTML 的标准，最低是 4ms。

#### 使用 setTimeout 的注意事项

- **如果当前任务执行时间过久，会影延迟到期定时器任务的执行**

- **使用 setTimeout 设置的回调函数中的 this 环境不是指向回调函数**

```javascript
const name= 1;
const obj = {
  name: 2,
  test: 1,
  showName() {
    console.log(this.name, this.test);
  },
};

setTimeout(obj.showName, 1000);
obj.showName();

// 先输出 2 1
// 1s后输出 1 undefined
```

- **未激活的页面，setTimeout 执行最小间隔是 1000ms**

如果标签不是当前的激活标签，那么定时器最小的时间间隔是 1000ms，目的是为了优化后台页面的加载损耗以及降低耗电量。

- **延时执行时间有最大值**

Chrome、Safari、Firefox 都是以 32 bit 来存储延时值的，32 bit 最大只能存放的数字是 2147483647（2**31-1），这就意味着，如果 setTimeout 设置的延时值大于 2147483647ms（大约 24.8 天）时就会溢出，这将导致定时器会被立即执行。
  
- **setTimeout 存在嵌套调用问题**

如果 setTimeout 存在嵌套调用，调用超过 5 次后，系统会设置最短执行时间间隔为 4ms。

```javascript
let startTime = Date.now();
function cb() {
  const endTime = Date.now();
  console.log('cost time', endTime - startTime);
  startTime = startTime;
  setTimeout(cb, 0);
}
setTimeout(cb, 0);
```

之所以出现这样的情况，是因为在 Chrome 中，定时器被嵌套调用 5 次以上，系统会判断该函数方法被阻塞了，如果定时器的调用时间间隔小于 4ms，那么浏览器会将每次调用的时间间隔设置为 4ms。可以看下[源码](https://cs.chromium.org/chromium/src/third_party/blink/renderer/core/frame/dom_timer.cc)：

```c++
// Step 11 of the algorithm at
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html requires
// that a timeout less than 4ms is increased to 4ms when the nesting level is
// greater than 5.
constexpr int kMaxTimerNestingLevel = 5;
constexpr base::TimeDelta kMinimumInterval =
    base::TimeDelta::FromMilliseconds(4);
```

所以，一些实时性较高的需求就不太适合使用 setTimeout 了，比如你用 setTimeout 来实现 JavaScript 动画就不一定是一个很好的主意。

### 又恨又爱的 setInterval

上面说完了 `setTimeout`，当然不能错过它的孪生兄弟 `setInterval`。他俩差不多，只不过后者是循环的执行。对于执行顺序来说，`setInterval` 会每隔指定的时间将注册的函数置入 `Event Queue`，如果前面的任务耗时太久，那么同样需要等待。

唯一需要注意的一点是，对于 `setInterval(fn, ms)` 来说，我们已经知道不是每过 ms 毫秒会执行一次 `fn`，而是每过 ms 毫秒，会有 `fn` 进入 `Event Queue`。一旦 `setInterval` 的回调函数 `fn` 执行时间超过了延迟时间 ms，那么就完全看不出来有时间间隔了。

### Promise 与 process.nextTick(callback)

传统的定时器我们已经研究过了，接着我们探究 `Promise` 与 `process.nextTick(callback)` 的表现。

`process.nextTick(callback)` 类似 node.js 版的 `setTimeout`，在事件循环的下一次循环中调用 `callback` 回调函数。

{% label info@我们进入正题，除了广义的同步任务和异步任务，我们对任务有更精细的定义： %}

- macro-task(宏任务)：整体代码 script，setTimeout，setInterval，setImmediate，I/O 操作，UI 渲染
- micro-task(微任务)：Promise，async / await，process.nextTick，MutationObserver

不同类型的任务会进入对应的 `Event Queue`，比如 `setTimeout` 和 `setInterval` 会进入相同的 `Event Queue`。

事件循环的顺序决定了 JS 代码的执行顺序。进入整体代码（宏任务）后，开始第一次循环，接着执行所有的微任务，然后再次从宏任务开始，找到其中一个任务队列执行完毕，再执行所有的微任务。听起来有点绕，我们用文章最开始的一段代码说明：

```javascript
setTimeout(() => {
  console.log('setTimeout');
});

new Promise(resolve => {
  console.log('promise');
}).then(() => {
  console.log('then');
});

console.log('console');
```

1. 这段代码作为宏任务，进入主线程
2. 先遇到 `setTimeout`，那么将其回调函数注册后分发到宏任务 `Event Queue`
3. 接下来遇到了 `Promise`，`new Promise` 立即执行，`then` 函数分发到微任务 `Event Queue`。遇到 `console.log()`，立即执行
4. 整体代码作为第一个宏任务执行结束，看看有哪些微任务？我们发现了 `then` 在微任务 `Event Queue` 里面，执行
5. OK，第一轮事件循环结束了，我们开始第二轮循环，当然要从宏任务 `Event Queue` 开始。我们发现了宏任务 `Event Queue` 中 `setTimeout` 对应的回调函数，立即执行
6. 结束

事件循环，宏任务，微任务的关系如图所示：

![](http://cdn.kingmui.cn/javascript_event_queue_1.png)

我们来分析一段较复杂的代码，看看你是否真的掌握了 JS 的执行机制：

```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
  process.nextTick(() => {
    console.log('3');
  });
  new Promise(resolve => {
    console.log('4');
    resolve();
  }).then(() => {
    console.log('5');
  });
});

process.nextTick(() => {
  console.log('6');
});

new Promise(resolve => {
  console.log('7');
  resolve();
}).then(() => {
  console.log('8');
});

setTimeout(() => {
  console.log('9');
  process.nextTick(() => {
    console.log('10');
  });
  new Promise(resolve => {
    console.log('11');
    resolve();
  }).then(() => {
    console.log('12');
  });
});
```

第一轮事件循环流程分析如下：

1. 整体 script 作为第一个宏任务进入主线程，遇到 `console.log`，输出 1

2. 遇到 `setTimeout`，其回调函数被分发到**宏任务** `Event Queue` 中。我们暂且记为 `setTimeout1`

3. 遇到 `process.nextTick()`，其回调函数被分发到**微任务** `Event Queue` 中。我们记为 `process1`

4. 遇到 `Promise`，`new Promise` 直接执行，输出 7。`then` 被分发到**微任务** `Event Queue` 中。我们记为 `then1`

5. 又遇到了 `setTimeout`，其回调函数被分发到**宏任务** `Event Queue` 中，我们记为 `setTimeout2`

| 宏任务 Event Queue | 微任务 Event Queue |
| ------------------ | ------------------ |
| setTimeout1        | process1           |
| setTimeout2        | then1              |

6. 上表是第一轮事件循环宏任务结束时各 `Event Queue` 的情况，此时已经输出了 1 和 7

7. 我们发现了 `process1` 和 `then1` 两个微任务

8. 执行 `process1`，输出 6

9. 执行 `then1`，输出 8

好了，第一轮事件循环正式结束，这一轮的结果是输出 `1，7，6，8`。那么第二轮事件循环从 `setTimeout1` 宏任务开始：

1. 首先输出 2。接下来遇到了 `process.nextTick()`，同样将其分发到**微任务** `Event Queue` 中，记为 `process2`。`new Promise` 立即执行输出 4，`then` 也分发到**微任务** `Event Queue` 中，记为 `then2`

| 宏任务 Event Queue | 微任务 Event Queue |
| ------------------ | ------------------ |
| setTimeout2        | process2           |
|                    | then2              |

2. 第二轮事件循环宏任务结束，我们发现有 `process2` 和 `then2` 两个微任务可以执行
3. 输出 3
4. 输出 5

第二轮事件循环结束，第二轮输出 `2，4，3，5`。第三轮事件循环开始，此时只剩 `setTimeout2` 了，执行

1. 直接输出 9
2. 将 `process.nextTick()` 分发到**微任务** `Event Queue` 中。记为 `process3`
3. 直接执行 `new Promise`，输出 11
4. 将 `then` 分发到**微任务** `Event Queue` 中，记为 `then3`


| 宏任务 Event Queue | 微任务 Event Queue |
| ------------------ | ------------------ |
|                    | process3           |
|                    | then3              |

5. 第三轮事件循环宏任务执行结束，执行两个微任务 `process3` 和 `then3`
6. 输出 10
7. 输出 12

第三轮事件循环结束，第三轮输出 `9，11，10，12`。整段代码，共进行了三次事件循环，完整的输出为 `1，7，6，8，2，4，3，5，9，11，10，12`
(请注意，Node 环境下的事件监听依赖 `libuv` 与前端环境不完全相同，输出顺序可能会有误差)

### 写在最后

#### JS 的异步

我们开篇就说 Javascript 是一门单线程语言，不管是什么新框架新语法糖实现的所谓异步，其实都是用同步的方法去模拟的，牢牢把握住单线程这点非常重要。

#### 事件循环 Event Loop

事件循环是 JS 实现异步的一种方法，也是 JS 的执行机制。

#### Javascript 的执行和运行

执行和运行有很大的区别，Javascript 在不同的环境下，比如 Node，浏览器，Ringo等等，**执行方式是不同**的。而运行大多指 Javascript 解析引擎，是统一的。

#### 最后的最后

- Javascript 是一门单线程语言
- `Event Loop` 是 Javascript 的执行机制
