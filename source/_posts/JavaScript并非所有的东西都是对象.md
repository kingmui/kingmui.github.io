---
title: JavaScript并非所有的东西都是对象
date: 2018-01-19 10:14:12
tags:
  - JavaScript
comments: false
---

{% note info %}
虽然很多语言宣称：“一切皆是对象”，但在 javascript 中，并不是所有的值都是对象。这篇博文解释了 javascript 中的两种值类型：原始值（primitive）和对象（object），以及混合使用两种类型时的注意事项。
{% endnote %}

### 原始值 vs 对象

javascript 中的值可以被划分为两大类：原始值（primitive）和对象（object）。

**下面的值是原始值。**

1. 字符串
2. 数字：在 JavaScript 中所有的数字都是浮点数
3. 布尔值
4. `null`
5. `undefined`

<!-- more -->

**所有其它的值都是对象（object）**。对象可以进一步划分：

1. 原始值的包装器：`Boolean`, `Number`, `String`。
2. 用字面量创建的对象。下面的字面量产生对象，也可以通过构造函数创建对象。

- `[]` 就是 `new Array()`
- `{}` 就是 `new Object()`
- `function() {}` 就是 `new Function()`
- `/\s*/` 就是 `new RegExp("\\s*")`

3. 日期：`new Date()`

### 区别

1. 对象是可变的。

```javascript
var obj = {};
obj.foo = 123; // 添加属性和值
// 123
obj.foo; // 读属性，返回属性的值
// 123
```

2. 每个对象都有自己唯一的标识符，因此通过字面量或构造函数创建的对象和任何其他对象都不相等，我们可以通过 `===` 进行比较。

```javascript
{} === {}; // false
```

对象是通过引用来比较的，只有两个对象有相同的标识，才认为这个对象是相等的。

```javascript
var obj = {};
obj === obj; // true
```

3. 变量保存了对象的引用。因此，如果两个变量引用了相同的对象，我们改变其中一个变量时，另一个也会随之改变。

```javascript
var var1 = {};
var var2 = var1;

var1.foo = 123; // 修改变量 val1 的属性
// 123
var2.foo; // val2 也改变了
// 123
```

正如预期的那样，原始值和对象不一样：

- 原始值是不可变的，你不能给它们添加属性。

```javascript
var str = 'abc';
str.foo = 123; // 添加属性（此操作将被忽略）
str.foo; // 读属性的值，返回 undefined
// undefined
```

- 原始值没有内部标识，原始值是按值比较的：比较两个原始值的依据是他们的内容，如果两个原始值的内容相同，就认为这两个原始值相同。

```javascript
'abc' === 'abc'; // true
```

这意味着，一个原始值的标识就是它的值，javascript 引擎没有为原始值分配唯一标识。

### 陷阱：原始值和它们的包装类型

原始值类型 `boolean`, `number` 以及 `string` 都有自己对应的包装类型 `Boolean`, `Number` 和 `String`。包装类型的实例都是对象值，两种类型之间的转换也很简单：

- 转换为包装类型：`new String("abc")`
- 转换为原始类型：`new String("abc").valueOf()`

**原始值类型以及它们相应的包装器类型有很多不同点**，例如：

```javascript
typeof 'abc'; // 'string'
typeof new String('abc'); // 'object'

'abc' instanceof String; // false
new String('abc') instanceof String; // true

'abc' === new String('abc'); // false;
```

**包装类型的实例是一个对象**，因此和 JavaScript 对象一样，包装类型也无法进行值的比较（只能比较引用）。

```javascript
var a = new String('abc');
var b = new String('abc');
a == b; // false
a == a; // true
```

### 原始值没有自己的方法

包装对象类型很少被直接使用，但它们的原型对象定义了许多其对应的原始值也可以调用的方法。 例如，`String.prototype` 是包装类型 `String` 的原型对象。它的所有方法都可以使用在字符串原始值上。包装类型的方法 `String.prototype.indexOf` 在字符串原始值上也有，它们并不是两个拥有相同名称的方法，而的的确确就是同一个方法：

```javascript
'abc'.charAt === String.prototype.charAt; // true
```

在数字的包装类型 `Number` 的原型对象上有 `toFixed` 方法，即 `Number.prototype.toFixed`，但是当我们写如下代码时却发生错误：

```javascript
5.toFixed(3);
// Uncaught SyntaxError: Invalid or unexpected token
```

此错误是解析错误（SyntaxError），5 后面跟着一个点号（.），这个点被当作了小数点，而小数点后面应该是一个数，以下代码可以正常运行：

```javascript
(5).toFixed(3); // "5.000"
// 5..toFixed(3)
// "5.000"
```

### 值的分类：`typeof` 和 `instanceof`

如果你想要对值进行分类，你需要注意原始值和对象之间的区别。`typeof` 运算符可以用来区分原始值和对象。`instanceof` 可以用来区分对象。而且，`instanceof` 对于所有的原始值都返回 `false`。

**typeof 运算符**

`typeof` 可以用来判断原始值的类型，以及区分对象值和原始值：

```javascript
typeof 'abc'; // 'string'
typeof 123; // 'number'
typeof Symbol(); // 'symbol'
typeof {}; // 'object'
typeof []; // 'object'
```

`typeof` 返回以下字符串：

| 参数      | 结果        |
| --------- | ----------- |
| undefined | "undefined" |
| null      | "object"    |
| 布尔值    | "boolean"   |
| 数字      | "number"    |
| 字符串    | "string"    |
| 函数      | "function"  |
| 其他      | "object"    |

注释：

- `typeof` 在操作 `null` 时会返回 `"object"`，这是 JavaScript 语言本身的 bug。不幸的是，这个 bug 永远不可能被修复了，因为太多已有的代码已经依赖了这样的表现。这并不意味着，`null` 实际上就是一个对象。
- `typeof` 还可以**检查一个变量是否已声明**，而不会抛出异常。没有任何一个函数可以实现此功能，因为你不能把一个未声明的变量传递给函数的参数。

```javascript
typeof undeclaredVariable
// 'undefined'
undeclaredVariable
// Uncaught ReferenceError: undeclaredVariable is not defined
```

- 函数也是对象类型。这可能是很多人无法理解的，但有时候却是非常有用的。
- 数组是一个对象。

**instanceof 运算符**

在 JavaScript 中，判断一个变量的类型尝尝会用 `typeof` 运算符，在使用 `typeof` 运算符时采用引用类型存储值会出现一个问题，无论引用的是什么类型的对象，它都返回 "`object"`。ECMAScript 引入了另一个 Java 运算符 `instanceof` 来解决这个问题。`instanceof` 运算符与 `typeof` 运算符相似，用于识别正在处理的对象的类型。与 `typeof` 方法不同的是，`instanceof` 方法要求开发者明确地确认对象为某特定类型。

通常来讲，使用 `instanceof` 就是判断一个实例是否属于某种类型。例如：

```javascript
value instanceof Constructor
```

如果上面的表达式返回 `true`，则表示 `value` 是 `Constructor` 的一个实例。它等价于：

```javascript
Constructor.prototype.isPrototypeOf(value)
```

大多数对象是 `Object` 的实例，因为原型链的末端（prototype chain）是 `Object.prototype`。原始值不是任何对象的实例：

```javascript
'abc' instanceof Object; // false
'abc' instanceof String; // false
```

`instanceof` [复杂用法](https://www.ibm.com/developerworks/cn/web/1306_jiangjj_jsinstanceof/)

```javascript
console.log(Object instanceof Object); // true
console.log(Function instanceof Function); // true
console.log(Number instanceof Number); // false
console.log(String instanceof String); // false

console.log(Function instanceof Object); // true

console.log(Foo instanceof Function); // true
console.log(Foo instanceof Foo); // false
```

### 引用

原文：[JavaScript values: not everything is an object](http://2ality.com/2011/03/javascript-values-not-everything-is.html)

译文：[JavaScript 并非所有的东西都是对象](https://justjavac.com/javascript/2012/12/22/javascript-values-not-everything-is-an-object.html)

译者：[justjavac](http://weibo.com/justjavac)
