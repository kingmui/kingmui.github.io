---
title: 学习Javascript闭包（Closure）
date: 2018-05-05 15:52:28
tags:
  - JavaScript
comments: false
---

{% note info %}
闭包是由**函数**以及**创建该函数的词法环境**组合而成。**这个环境包含了这个闭包创建时所能访问的所有局部变量**。 -- MDN
{% endnote %}

{% note info %}
闭包是有权访问另一个函数作用域的函数。 -- 《JavaScript 高级程序设计(第 3 版)》
{% endnote %}

{% note info %}
函数对象可以通过作用域链相互关联起来，函数体内部的变量都可以保存在函数作用域内，这种特性在计算机科学文献中称为闭包。 -- 《JavaScript 权威指南(第 6 版)》
{% endnote %}

{% note info %}
当函数可以**记住并访问所在的词法作用域**时，就产生了闭包，即使函数是在当前词法作用域之外执行。 -- 《你不知道的 JavaScript(上卷)》
{% endnote %}

{% note info %}
闭包是个函数，而它「记住了周围发生了什么」。表现为由「一个函数」体中定义了「另个函数」。 -- [闭包的秘密](https://www.gracecode.com/posts/2385.html)
{% endnote %}

{% note info %}
闭包就是能够读取其他函数内部变量的函数。 -- [阮一峰](http://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html)
{% endnote %}

要使用闭包，只需要简单地将一个函数定义在另一个函数内部，并将它暴露出来。要暴露一个函数，可以将它返回或者传给其他函数。

**内部函数将能够访问到外部函数作用域中的变量**，即使外部函数已经执行完毕。

由于在 Javascript 语言中，只有函数内部的子函数才能读取局部变量，因此可以把闭包简单理解成**定义在一个函数内部的函数**。

所以，在本质上，闭包就是**将函数内部和函数外部连接起来的一座桥梁**。

闭包很有用，因为它允许将函数与其所操作的某些数据（环境）关联起来。这显然类似于面向对象编程。在面向对象编程中，对象允许我们将某些数据（对象的属性）与一个或者多个方法相关联。

<!-- more -->

### 用闭包模拟私有方法

编程语言中，比如 Java，是支持将方法声明为私有的，即它们只能被同一个类中的其它方法所调用。

而 JavaScript 没有这种原生支持，但我们可以使用闭包来模拟私有方法。私有方法不仅仅有利于限制对代码的访问：还提供了管理全局命名空间的强大能力，避免非核心的方法弄乱了代码的公共接口部分。

下面的示例展现了如何使用闭包来定义公共函数，并令其可以访问私有函数和变量。这个方式也称为**模块模式**（module pattern）：

```javascript
var Counter = (function() {
  var privateCounter = 0;
  function changeBy(val) {
    privateCounter += val;
  }
  return {
    increment: function() {
      changeBy(1);
    },
    decrement: function() {
      changeBy(-1);
    },
    value: function() {
      return privateCounter;
    }
  };
})();

console.log(Counter.value()); /* logs 0 */
Counter.increment();
Counter.increment();
console.log(Counter.value()); /* logs 2 */
Counter.decrement();
console.log(Counter.value()); /* logs 1 */
```

### 闭包使用的例子

闭包的用途之一是**实现对象的私有数据**。数据私有是让我们能够面向接口编程而不是面向实现编程的基础。而面向接口编程是一个重要的概念，有助于我们创建更加健壮的软件，因为实现细节比接口约定相对来说更加容易被改变。

在 JavaScript 中，闭包是用来实现数据私有的原生机制。当你使用闭包来实现数据私有时，被封装的变量只能在闭包容器函数作用域中使用。你无法绕过对象被授权的方法在外部访问这些数据。在 JavaScript 中，任何定义在闭包作用域下的公开方法才可以访问这些数据。例如：

```javascript
const getSecret = secret => {
  return {
    get: () => secret
  };
};

test('Closure for object privacy.', assert => {
  const msg = '.get() should have access to the closure.';
  const expected = 1;
  const obj = getSecret(1);

  const actual = obj.get();

  try {
    assert.ok(secret, 'This throws an error.');
  } catch (e) {
    assert.ok(
      true,
      `The secret var is only available
      to privileged methods.`
    );
  }

  assert.equal(actual, expected, msg);
  assert.end();
});
```

在上面的例子里，`get()` 方法定义在 `getSecret()` 作用域下，这让它可以访问任何 `getSecret()` 中的变量，于是它就是一个被授权的方法。在这个例子里，它可以访问参数 `secret`。

对象不是唯一的产生私有数据的方式。闭包还可以被用来创建**有状态的函数**，这些函数的执行过程可能由它们自身的内部状态所决定。例如：

```javascript
// Secret - creates closures with secret messages.

// secret(msg: String) => getSecret() => msg: String
const secret = msg => () => msg;

test('secret', assert => {
  const msg = 'secret() should return a function that returns the passed secret.';

  const theSecret = 'Closures are easy.';
  const mySecret = secret(theSecret);

  const actual = mySecret();
  const expected = theSecret;

  assert.equal(actual, expected, msg);
  assert.end();
});
```

在函数式编程中，闭包经常用于偏函数应用和柯里化。为了说明这个，我们先定义一些概念：

**函数应用**：一个过程，指将参数传给一个函数，并获得它的返回值。

**偏函数应用**：一个过程，它传给某个函数其中一部分参数，然后返回一个新的函数，该函数等待接受后续参数。换句话说，偏函数应用是一个函数，它接受另一个函数为参数，这个作为参数的函数本身接受多个参数，它返回一个函数，这个函数与它的参数函数相比，接受更少的参数。偏函数应用提前赋予一部分参数，而返回的函数则等待调用时传入剩余的参数。

偏函数应用通过闭包作用域来提前赋予参数。你可以实现一个通用的函数来赋予指定的函数部分参数，它看起来如下：

```javascript
partialApply(targetFunction: Function, ...fixedArgs: Any[]) =>
  functionWithFewerParams(...remainingArgs: Any[])
```

`partialApply` 接受一个多参数的函数，以及一串我们想要提前赋给这个函数的参数，它返回一个新的函数，这个函数将接受剩余的参数。

下面给一个例子来说明，假设你有一个函数，求两个数的和：

```javascript
const add = (a, b) => a + b;
```

现在你想要得到一个函数，它能够对任何传给它的参数都加 `10`，我们可以将它命名为 `add10()`。`add10(5)` 的结果应该是 `15`。我们的 `partialApply()` 函数可以做到这个：

```javascript
const add10 = partialApply(add, 10);
add10(5);
```

在这个例子里，参数 `10` 通过闭包作用域被提前赋予 `add()`，从而让我们获得 `add10()`。

现在让我们看一下如何实现 `partialApply()`：

```javascript
// Generic Partial Application Function

const partialApply = (fn, ...fixedArgs) => {
  return function(...remainingArgs) {
    return fn.apply(this, fixedArgs.concat(remainingArgs));
  };
};

test('add10', assert => {
  const msg = 'partialApply() should partially apply functions';

  const add = (a, b) => a + b;

  const add10 = partialApply(add, 10);

  const actual = add10(5);
  const expected = 15;

  assert.equal(actual, expected, msg);
});
```

如你所见，它只是简单地返回一个函数，这个函数通过闭包访问了传给 `partialApply()` 函数的 `fixedArgs` 参数。

### 使用闭包的注意点

1. 如果不是某些特定任务需要使用闭包，在其它函数中创建函数是不明智的，因为闭包在处理速度和内存消耗方面对脚本性能具有负面影响。
2. 通常，函数的作用域及其所有变量都会在函数执行结束后被销毁。但是，在创建了一个闭包以后，这个函数的作用域就会一直保存到闭包不存在为止。
3. 由于闭包会使得函数中的变量都被保存在内存中，内存消耗很大，所以不能滥用闭包，否则会造成网页的性能问题，在 IE 中可能导致内存泄露。解决方法是，在退出函数之前，将不使用的局部变量全部删除。
4. 闭包会在父函数外部，改变父函数内部变量的值。所以，如果你把父函数当作对象（object）使用，把闭包当作它的公用方法（Public Method），把内部变量当作它的私有属性（private value），这时一定要小心，不要随便改变父函数内部变量的值。
5. 闭包只能取得包含函数中任何变量的**最后一个值**，这是因为闭包所保存的是整个变量对象，而不是某个特殊的变量。

### 垃圾回收

当函数被调用过了，并且以后不会被用到，那么垃圾回收机制就会销毁由函数创建的作用域。JavaScript 有两种垃圾回收机制，即 **标记清除** 和 **引用计数**，对于现代浏览器，绝大多数都会采用标记清除。

- **标记清除**

  - 垃圾收集器在运行的时候会**给**存储在内存中的**所有变量加上标记**，然后它会去掉环境中变量以及被环境中的变量引用的变量的标记。而在此之后再被加上标记的变量将被视为准备删除的变量，原因是环境中的变量已经无法访问到这些变量了。最后，垃圾收集器完成内存清除工作，销毁那些带标记的值并且回收它们所占用的内存空间。

- **引用计数**
  - 引用计数是跟踪记录**每个值被引用的次数**。当声明了一个变量并将一个引用类型值赋给该变量时，这个值的引用次数就是 1。相反，如果包含对这个值引用的变量又取得了另外一个值，则这个值的引用次数减 1。下次运行垃圾回收器时就可以释放那些引用次数为 0 的值所占用的内存。缺点：循环引用会导致引用次数永远不为 0。

在 JavaScript 中，如果一个对象不再被引用，那么这个对象就会被垃圾回收机制回收；如果两个对象互相引用，而不再被第 3 者所引用，那么这两个互相引用的对象也会被回收。

### 引用

[什么是闭包？](https://www.zcfy.cc/article/master-the-javascript-interview-what-is-a-closure-2127.html)
