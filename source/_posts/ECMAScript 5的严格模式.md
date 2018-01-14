---
title: ECMAScript 5的严格模式
date: 2019-04-10 16:48:09
tags:
  - JavaScript
comments: false
---

{% note info %}
ECMAScript 5 引入了 `strict mode`，现在已经被大多浏览器实现(包括 IE10)。会使 web 浏览器更容易的解析代码(只需要添加 `"use strict";` 在源码的最上面)。
{% endnote %}

严格模式不仅仅是一个子集：它的产生是为了形成与正常代码不同的语义。不支持严格模式与支持严格模式的浏览器在执行严格模式代码时会采用不同行为。所以在没有对运行环境展开**特性测试**来验证对于严格模式相关方面支持的情况下，就算采用了严格模式也不一定会取得预期效果。严格模式代码和非严格模式代码可以共存，因此项目脚本可以渐进式地采用严格模式。

严格模式对正常的 JavaScript 语义做了一些更改。

1. 严格模式通过**抛出错误**来消除了一些原有**静默错误**。
2. 严格模式修复了一些导致 JavaScript 引擎难以执行优化的缺陷：有时候，相同的代码，严格模式可以比非严格模式下**运行得更快**。
3. 严格模式**禁用了**在 ECMAScript 的未来版本中可能会定义的一些语法。

### 非严格模式到严格模式的区别

严格模式同时改变了语法及运行时行为。

<!-- more -->

**语法错误**

如果代码中使用 `"use strict"` 开启了严格模式，则下面的情况都会在脚本运行之前抛出 `SyntaxError` 异常:

- 八进制语法：`var n = 023` 和 `var s = "\047"`
- `with` 语句
- 使用 `delete` 删除一个变量名(而不是属性名)：`delete myVariable`
- 使用 `eval` 或 `arguments` 作为变量名或函数名
- 使用未来保留字(也许会在 ECMAScript 6 中使用)：`implements, interface, let, package, private, protected, public, static,和 yield` 作为变量名或函数名
- 在语句块中使用函数声明：`if(a < b) { function f() {} }`
- 其他错误
  - 对象字面量中使用两个相同的属性名：`{a: 1, b: 3, a: 7}`
  - 函数形参中使用两个相同的参数名：`function f(a, b, b) {}`

这些错误是有利的，因为可以揭示简陋的错误和坏的实践，这些错误会在代码运行前被抛出。

**新的运行时错误**

JavaScript 曾经会在一些上下文的某些情况中静默的失败，严格模式会在这些情况下抛出错误。如果你的代码包含这样的场景，请务必测试以确保没有代码受到影响。再说一次，严格模式是可以设置在代码粒度下的。

1. 给一个未声明的变量赋值

严格模式下无法再意外创建全局变量。在普通的 JavaScript 里面给一个拼写错误的变量名赋值会使全局对象新增一个属性并继续“工作”（尽管后面可能出错：在现在的 JavaScript 中有可能）。严格模式中意外创建全局变量被抛出错误替代。

```javascript
function f(x) {
  'use strict';
  var a = 12;
  b = a + x * 35; // Uncaught ReferenceError: b is not defined
}
f(5);
```

改变一个全局对象的值可能会造成不可预期的后果。如果你真的想设置一个全局对象的值，把他作为一个参数并且明确的把它作为一个属性：

```javascript
var global = this; // in the top-level context, "this" always refers the global object
function f(x) {
  'use strict';
  var a = 12;
  global.b = a + x * 35;
}
f(5);
```

其次，严格模式会使引起静默失败(silently fail，注：不报错也没有任何效果)的赋值操作抛出异常。例如，NaN 是一个不可写的全局变量。在正常模式下，给 NaN 赋值不会产生任何作用；开发者也不会受到任何错误反馈。但在严格模式下，给 NaN 赋值会抛出一个异常。任何在正常模式下引起静默失败的赋值操作 (给不可写属性赋值，给只读属性(getter-only)赋值赋值，给不可扩展对象(non-extensible object)的新属性赋值) 都会抛出异常。

```javascript
'use strict';

// 给不可写属性赋值
var obj1 = {};
Object.defineProperty(obj1, 'x', { value: 42, writable: false });
obj1.x = 9; // Uncaught TypeError: Cannot assign to read only property 'x' of object

// 给只读属性赋值
var obj2 = {
  get x() {
    return 17;
  }
};
obj2.x = 5; // Uncaught TypeError: Cannot set property x of #<Object> which has only a getter

// 给不可扩展对象的新属性赋值
var fixed = {};
Object.preventExtensions(fixed);
fixed.newProp = 'ohai'; // Uncaught TypeError: Cannot add property newProp, object is not extensible
```

2. 尝试删除一个不可配置的属性

在严格模式下，试图删除不可删除的属性时会抛出异常(之前这种操作不会产生任何效果)。

```javascript
'use strict';
delete Object.prototype; // Uncaught TypeError: Cannot delete property 'prototype' of function Object() { [native code] }
```

在非严格模式中，这样的代码只会静默失败，这样可能会导致用户误以为删除操作成功了。

3. 一个对象内出现重名属性

在 Gecko 版本 34 之前，严格模式要求一个对象内的所有属性名在对象内必须唯一。正常模式下重名属性是允许的，最后一个重名的属性决定其属性值。因为只有最后一个属性起作用，当代码要去改变属性值而不是修改最后一个重名属性的时候，复制这个对象就产生一连串的 bug。在严格模式下，重名属性被认为是语法错误。**这个问题在 ECMAScript6 中已经不复存在了**。

```javascript
'use strict';
var o = { p: 1, p: 2 }; // !!! 语法错误
```

4. 函数参数名不唯一

严格模式要求函数的参数名唯一。在正常模式下，最后一个重名参数名会**掩盖**之前的重名参数。之前的参数仍然可以通过 `arguments[i]` 来访问，还不是完全无法访问。然而，这种隐藏毫无意义而且可能是意料之外的 (比如它可能本来是打错了)，所以在严格模式下重名参数被认为是语法错误。

```javascript
function sum(a, a, c) { // !!! 语法错误
  "use strict";
  return a + a + c; // 代码运行到这里会出错
}
```

5. 禁止八进制数字语法

严格模式禁止八进制数字语法。ECMAScript 并**不包含八进制语法**，但所有的浏览器都支持这种以零(0)开头的八进制语法: `0644 === 420` 还有 `"\045" === "%"`。在 ECMAScript 6 中支持为一个数字加 `0o` 的前缀来表示八进制数。

```javascript
var a = 0o10; // ES6: 八进制
```

有些新手开发者认为数字的前导零没有语法意义，所以他们会用作对齐措施 — 但其实这会改变数字的意义！八进制语法很少有用并且可能会错误使用，所以严格模式下八进制语法会引起语法错误。

```javascript
"use strict";
var sum = 015 + // !!! 语法错误
          197 +
          142;
```

6. 禁止给原始值设置属性

ECMAScript 6 中的严格模式禁止设置 primitive 值的属性。不采用严格模式，设置属性将会简单忽略(no-op)，采用严格模式，将抛出 `TypeError` 错误。

```javascript
(function() {
  'use strict';

  false.true = ''; // Uncaught TypeError: Cannot create property 'true' on boolean 'false'
  (14).sailing = 'home'; // Uncaught TypeError: Cannot create property 'sailing' on number '14'
  'with'.you = 'far away'; // Uncaught TypeError: Cannot create property 'you' on string 'with'
})();
```

7. `arguments` 对象和函数属性

在严格模式下，访问 `arguments.callee`， `arguments.caller`， `anyFunction.caller` 以及 `anyFunction.arguments` 都会抛出异常。唯一合法的使用应该是在其中命名一个函数并且重用之。
正常模式下，`arguments.callee` 指向当前正在执行的函数。这个作用很小：直接给执行函数命名就可以了！此外，`arguments.callee` 十分不利于优化，例如内联函数，因为 `arguments.callee` 会依赖对非内联函数的引用。在严格模式下，`arguments.callee` 是一个不可删除属性，而且赋值和读取时都会抛出异常。

```javascript
var s = document.getElementById('thing').style;
s.opacity = 1;
(function() {
  if ((s.opacity -= 0.1) < 0) s.display = 'none';
  else setTimeout(arguments.callee, 40);
})();
```

可以重新写成:

```javascript
'use strict';
var s = document.getElementById('thing').style;
s.opacity = 1;
(function fadeOut() {
  // name the function
  if ((s.opacity -= 0.1) < 0) s.display = 'none';
  else setTimeout(fadeOut, 40); // use the name of the function
})();
```

8. 严格模式禁用 `with`

严格模式禁用 `with`。`with` 所引起的问题是块内的任何名称可以映射(map)到 `with` 传进来的对象的属性，也可以映射到包围这个块的作用域内的变量(甚至是全局变量)，这一切都是在运行时决定的，在代码运行之前是无法得知的。严格模式下，使用 `with` 会引起语法错误，所以就不会存在 `with` 块内的变量在运行时才决定引用到哪里的情况。

```javascript
"use strict";
var x = 17;
with (obj) // !!! 语法错误
{
  // 如果没有开启严格模式，with中的这个x会指向with上面的那个x，还是obj.x？
  // 如果不运行代码，我们无法知道，因此，这种代码让引擎无法进行优化，速度也就会变慢。
  x;
}
```

一种取代 `with` 的简单方法是，将目标对象赋给一个短命名变量，然后访问这个变量上的相应属性。

**语义差异**

这些差异都是一些微小的差异。有可能单元测试没办法捕获这种微小的差异。你很有必要去小心地审查你的代码，来确保这些差异不会影响你代码的语义。幸运的是，这种小心地代码审查可以逐函数地完成。

1. 函数调用中的 `this`

在普通的函数调用 `f()` 中，`this` 的值会指向全局对象 `window`。在严格模式中，`this` 的值会指向 `undefined`。
当函数通过 `call` 和 `apply` 调用时，如果传入的 `thisvalue` 参数是一个非 `null` 和 `undefined` 的原始值(字符串，数字，布尔值)，则 `this` 的值会成为那个**原始值对应的包装对象**。如果 `thisvalue` 参数的值是 `undefined` 或 `null`，则 `this` 的值会指向全局对象 `window`。在严格模式中，`this` 的值就是 `thisvalue` 参数的值，**没有任何类型转换**。

2. `arguments` 对象属性不与对应的形参变量同步更新

在非严格模式中，修改 `arguments` 对象中某个索引属性的值，和这个属性对应的形参变量的值也会同时变化，反之亦然。这会让 JavaScript 的代码混淆引擎让代码变得更难读和理解。在严格模式中 `arguments` 对象会以**形参变量的拷贝的形式被创建和初始化**，因此 `arguments` 对象的改变**不会影响形参**。

3. `eval` 相关的区别

在严格模式中，`eval` 不会在当前的作用域内创建新的变量。另外，传入 `eval` 的字符串参数也会按照严格模式来解析。你需要全面测试来确保没有代码受到影响。另外，如果你并不是为了解决一个非常实际的解决方案中，尽量不要使用 `eval`。

严格模式下的 `eval` 不再为上层范围(surrounding scope, 注:包围 `eval` 代码块的范围)引入新变量。在正常模式下，代码 `eval("var x;")` 会给上层函数(surrounding function)或者全局引入一个新的变量 `x`。这意味着，一般情况下，在一个包含 `eval` 调用的函数内所有没有引用到参数或者局部变量的名称都必须在运行时才能被映射到特定的定义 (因为 `eval` 可能引入的新变量会覆盖它的外层变量)。在严格模式下 `eval` 仅仅为被运行的代码创建变量，所以 `eval` 不会使得名称映射到外部变量或者其他局部变量。

```javascript
var x = 17;
var evalX = eval("'use strict'; var x = 42; x");
console.assert(x === 17);
console.assert(evalX === 42);
```

相应的，如果函数 `eval` 被在严格模式下的 `eval(...)` 以表达式的形式调用时，其代码会被当做严格模式下的代码执行。当然也可以在代码中显式开启严格模式，但这样做并不是必须的。

```javascript
function strict1(str) {
  'use strict';
  return eval(str); // str中的代码在严格模式下运行
}
function strict2(f, str) {
  'use strict';
  return f(str); // 没有直接调用eval(...): 当且仅当str中的代码开启了严格模式时
  // 才会在严格模式下运行
}
function nonstrict(str) {
  return eval(str); // 当且仅当str中的代码开启了"use strict"，str中的代码才会在严格模式下运行
}

strict1("'Strict mode code!'");
strict1("'use strict'; 'Strict mode code!'");
strict2(eval, "'Non-strict code.'");
strict2(eval, "'use strict'; 'Strict mode code!'");
nonstrict("'Non-strict code.'");
nonstrict("'use strict'; 'Strict mode code!'");
```

### 调用严格模式

严格模式可以应用到整个脚本或个别函数中。不要在封闭大括弧 `{}` 内这样做，在这样的上下文中这么做是没有效果的。在 `eval`、`Function`、内联事件处理属性、 `WindowTimers.setTimeout()` 方法中传入的脚本字符串，其行为类似于开启了严格模式的一个单独脚本，它们会如预期一样工作。

**为脚本开启严格模式**

为整个脚本文件开启严格模式，需要在所有语句之前放一个特定语句 `"use strict";` （或 `'use strict';`）

```javascript
// 为整个脚本开启严格模式
'use strict';
var v = "Hi!  I'm a strict mode script!";
```

这种语法存在陷阱，不能盲目的合并冲突代码。试想合并一个严格模式的脚本和一个非严格模式的脚本：合并后的脚本代码看起来是严格模式。反之亦然：非严格合并严格看起来是非严格的。合并均为严格模式的脚本或均为非严格模式的都没问题，只有在合并严格模式与非严格模式有可能有问题。建议按一个个函数去开启严格模式（至少在学习的过渡期要这样做）。

您也可以将整个脚本的内容用一个函数包括起来，然后在这个外部函数中使用严格模式。这样做就可以消除合并的问题，但是这就意味着您必须要在函数作用域外声明一个全局变量。

**为函数开启严格模式**

同样的，要给某个函数开启严格模式，得把 `"use strict";` (或 `'use strict';` )声明一字不漏地放在函数体所有语句之前。

```javascript
function strict() {
  // 函数级别严格模式语法
  'use strict';
  function nested() {
    return 'And so am I!';
  }
  return "Hi!  I'm a strict mode function!  " + nested();
}
function notStrict() {
  return "I'm not strict.";
}
```

### 严格中立的代码

迁移严格代码至严格模式的一个潜在消极面是，在遗留的老版本浏览器上，由于没有实现严格模式，JavaScript 语义可能会有所不同。在一些罕见的情况下（比如差劲的关联关系或者代码最小化），你的代码可能不能按照你书写或者测试里的模式那样运行。这里有一些让你的代码保持中立的规范：

1. 按照严格模式书写你的代码，并且确保你的代码不会发生仅仅在严格模式下发生的错误（比如上文所说的运行时错误）
2. 远离语义差异
   1. `eval`：仅仅在你知道你在干什么的情况下使用它
   2. `arguments` 总是通过形参的名字获取函数参数，或者在函数的第一行拷贝 `arguments`。`var args = Array.prototype.slice.call(arguments)`
3. `this`：仅在 `this` 指向你自己创建的对象时使用它
