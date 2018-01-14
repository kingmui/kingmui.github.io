---
title: JavaScript 函数式编程
date: 2019-06-02 13:44:00
tags:
  - JavaScript
comments: true
---

函数式编程风格起源于 20 世纪 30 年代 `lambda` 演算的发明。函数自 17 世纪诞生以来，一直是作为微积分的一部分而存在的。**函数可以作为函数的参数传递，还可以作为函数的执行结果被返回**。更复杂的函数被称为高阶函数，它可以精确的控制函数，既可以将函数当作参数传递，也可以将函数作为执行结果返回，或者二者兼而有之。在 20 世纪 30 年代，Alonzo Church 在普林斯顿大学用高阶函数做实验时发明了 `lambda` 演算。

20 世纪 50 年代初，John McCarthy 借鉴了 `lambda` 演算的概念，并将它应用到一门新的名为 Lisp 的编程语言上。Lisp 实现了高阶函数的概念，并**将函数作为第一类成员或者第一类公民**。一个函数被当作第一类成员时，它不仅可以被声明为一个变量，而且可以被当作函数参数传递。这些函数甚至可以作为函数的执行结果被返回。

## 什么是函数式编程

JavaScript 可以进行函数式编程，因为 JavaScript 中的函数就是第一类公民。这意味着**变量可以做的事情函数同样也可以**。ES6 标准中还添加了不少语言特性，可以帮助我们更充分地使用函数式编程技术，其中包括箭头函数、Promise 对象和扩展运算符等。

<!-- more -->

```javascript
const createScream = logger => message => logger(message.toUpperCase() + '!!!');
```

需要注意函数声明过程中使用箭头的数目，**一个以上的箭头表示我们声明的是高阶函数**。

我们可以说 JavaScript 就是函数式编程语言，因为它的函数是第一类成员。这意味着**函数就是数据**。它们可以像变量那样被保存、检索或者在应用程序内部传递。

## 命令式和声明式

函数式编程还是更广义编程范式的一部分：声明式编程。

### 声明式编程

声明式编程是一种编程风格，采用该风格的应用程序代码有一个比较突出的特点，那就是**对执行结果的描述远胜于执行过程**，即它关注的是你要做什么，而不是如何做。它表达逻辑而不显式地定义步骤。这意味着我们需要根据逻辑的计算来声明要显示的组件。它没有描述控制流步骤。声明式编程的例子有 HTML、SQL 等。

**HTML file**

```html
<div>
  <p>Declarative Programming</p>
</div>
```

**SQL file**

```mysql
select * from studens where firstName = 'declarative';
```

在一个声明式程序中，**语法本身描述了将会发生什么，相关的执行细节被隐藏了**。

声明式程序**易于解释具体用途**。因为其代码本身就描述了将会发生什么。

声明式方法更易读，因此也更方便解释具体用途。每个这类函数的具体实现细节都被封装起来。本质上来说，使用声明式编程编写的应用程序更容易解释具体用途，当一个应用易于解释具体用途时，该应用也更易于进行功能扩展。

### 命令式编程

命令式编程风格的特点是，其代码重点关注的是**达成目标的具体过程**。需要辅以大量注释说明帮助用户理解它的具体用途。

下面是一个例子，数组中的每个元素都乘以 2，我们使用声明式 `map` 函数，让编译器来完成其余的工作。而使用命令式，需要编写所有的流程步骤。

```javascript
const numbers = [1, 2, 3, 4, 5];

// 声明式
const doubleWithDec = numbers.map(number => number * 2);

// 命令式
const doubleWithImp = [];
for (let i = 0; i < numbers.length; i++) {
  const numberdouble = numbers[i] * 2;
  doubleWithImp.push(numberdouble);
}
```

## 函数式编程基本概念

函数式编程是声明式编程的一部分。JavaScript 中的函数是第一类公民，这意味着函数是数据，你可以像保存变量一样在应用程序中保存、检索和传递这些函数。

函数式编程有些核心的概念，如下：

- 不可变性（Immutability）
- 纯函数（Pure Functions）
- 数据转换（Data Transformations）
- 高阶函数（Higher-Order Functions）
- 递归
- 组合

### 不可变性（Immutability）

不可变性就是指不可改变。在函数式编程中，**数据是不可变的，它们永远无法修改**。如果要改变或更改数据，则必须复制数据副本来更改。在不修改原生数据结构的前提下，我们在这些数据结构的拷贝上进行编辑，并使用它们取代原生的数据。

例如，这是一个 `student` 对象和 `changeName` 函数，如果要更改学生的名称，则需要先复制 `student` 对象，然后返回新对象。

在 JavaScript 中，函数参数是对实际数据的引用，你不应该使用 `student.firstName = 'testing11'`，这会改变实际的 `student` 对象，应该使用 `Object.assign` 复制对象并返回新对象。

```javascript
let student = {
  firstName: 'testing',
  lastName: 'testing',
  marks: 500
};

function changeName(student) {
  // student.firstName = "testing11" //should not do it
  let copiedStudent = Object.assign({}, student);
  copiedStudent.firstName = 'testing11';
  return copiedStudent;
}

console.log(changeName(student));

console.log(student);
```

### 纯函数

纯函数是一个**返回结果只依赖于输入参数**的函数。纯函数**至少需要接收一个参数**并且**总是返回一个值或者其他函数**。它们**不会产生副作用，不修改全局变量**，或者任何应用程序的 `state`。它们将输入的参数当作不可变数据。

**纯函数的可测试性**

> 纯函数天生是可测试的。它们不会改变执行环境或者“世界”中的任何东西，因此不需要装配或者卸载复杂的测试环境。纯函数需要访问的任意数据都是通过参数进行传递的。当测试一个纯函数时，用户控制着参数，因此也可以预估执行结果。

纯函数是函数式编程中的另外一个核心概念。它会使你的开发工作更容易，因为它们不会影响应用程序的状态。当编写函数时，请务必遵循以下三条规则：

1. 函数应该至少接收一个参数
2. 函数应该返回一个值或者其他函数
3. 函数不应该修改或者影响任何传给它的参数

```javascript
let student = {
  firstName: 'testing',
  lastName: 'testing',
  marks: 500
};

// 非纯函数
function appendAddress() {
  student.address = { streetNumber: '0000', streetName: 'first', city: 'somecity' };
}

console.log(appendAddress());

// 纯函数
function appendAddress(student) {
  let copystudent = Object.assign({}, student);
  copystudent.address = { streetNumber: '0000', streetName: 'first', city: 'somecity' };
  return copystudent;
}

console.log(appendAddress(student));
console.log(student);
```

### 数据转换

如果数据是不可变的，那么应用程序内部如何进行状态转换呢？函数式编程的做法是将一种数据转换为另外一种数据。我们使用函数生成转换后的副本。这些函数使得命令式的代码更少，并且大大降低了复杂度。

用户不需要通过一个特定的框架来了解如何从一种数据集转换到另外一种。JavaScript 语言已经内置了完成该任务所需的工具，如 `Array.map`、`Array.reduce`、`Array.join`、`Array.filter`等。

```javascript
let cities = ['irving', 'lowell', 'houston'];

// we can get the comma separated list
console.log(cities.join(','));
// irving,lowell,houston

// if we want to get cities start with i
const citiesI = cities.filter(city => city[0] === 'i');
console.log(citiesI);
// [ 'irving' ]

// if we want to capitalize all the cities
const citiesC = cities.map(city => city.toUpperCase());
console.log(citiesC);
// [ 'IRVING', 'LOWELL', 'HOUSTON' ]
```

### 高阶函数

高阶函数的使用对于函数式编程也是必不可少的。高阶函数是可以操作其他函数的函数。它们可以将函数当作参数传递，也可以返回一个函数，或者二者兼而有之。

柯里化（Currying）是一种采用了高阶函数的函数式编程技巧。柯里化实际上是一种将某个操作中已经完成的结果保留，直到其余部分后续也完成后可以一并提供的机制。这是通过在一个函数中返回另外一个函数实现的，即柯里函数。

下面是一个柯里化的例子。函数 `userLogs` 会保存一些信息（username），在其余的信息（message）可用时返回一个函数方便其他函数调用或复用。

```javascript
const userLogs = userName => message => console.log(`${userName} -> ${message}`);

const log = userLogs('grandpa23');

log('attempted to load 20 fake members');

getFakeMembers(20).then(members => log(`successfully loaded ${member.length} members`), error => log('encountered an error loading members'));
```

### 递归

递归是用户创建的函数调用自身的一种技术。一般来说，在解决实际问题涉及到循环时，递归函数可以提供一种替代性的方案。**只要可能，最好使用递归而不是循环**。

**浏览器堆栈调用的不足之处**

> 应该尽可能地使用递归解决循环有关的问题。不过并非所有 JavaScript 引擎都对大量的递归调用做了性能优化。过多的递归调用会导致 JavaScript 报错。可以通过一些高级技术清理调用堆栈并停止递归调用来避免这些错误。未来的 JavaScript 引擎预计会完全解决调用堆栈的不足。

下面是一个演示递归的例子，在这个递归中，打印一个类似于楼梯的名称。我们也可以使用 `for` 循环，但只要可能，我们更喜欢递归。

```javascript
function printMyName(name, count) {
  if (count <= name.length) {
    console.log(name.substring(0, count));
    printMyName(name, ++count);
  }
}

console.log(printMyName('Bhargav', 1));

/*
B
Bh
Bha
Bhar
Bharg
Bharga
Bhargav
*/

// without recursion
var name = 'Bhargav';
var output = '';
for (let i = 0; i < name.length; i++) {
  output = output + name[i];
  console.log(output);
}
```

### 合成

[JavaScript 专题之函数组合](https://github.com/mqyqingfeng/Blog/issues/45)

在 React 中，我们将功能划分为小型可重用的纯函数，我们必须将所有这些可重用的函数放在一起，最终使其成为产品。将所有较小的函数组合成更大的函数，最终，得到一个应用程序，这称为合成。

函数式编程会将具体的业务逻辑**拆分成小型的纯函数**，以便能够将精力聚焦于特定任务。最终，用户将会需要把这些小型函数整合到一起。具体来说，用户可能需要合成它们，以串联或者并联的方式对它们进行调用，或者将它们合成为一个更大的函数，直到构造出一个应用程序为止。

对于合成来说，与之有关的实现、模式和技术真可谓五花八门。我们比较熟悉的一种方式就是链式调用。在 JavaScript 中，函数可以使用点符号连接在一起，其作用是获得上一个函数的返回值。

字符串有一个 `replace` 方法，该方法返回的模板字符串也包含一个 `replace` 方法。因此我们可以在转换一个字符时使用点符号将 `replace` 方法串联起来实现链式调用。

链式调用只是合成技术之一。合成的目标是**通过整合若干简单函数构造一个更高阶的函数**。

```javascript
const name = 'Bhargav Bachina';

const output = name
  .split(' ')
  .filter(name => name.length > 5)
  .map(val => {
    val = val.toUpperCase();
    console.log('Name:::::' + val);
    console.log('Count::::' + val.length);
    return val;
  });

console.log(output);
```

在 React 中，我们使用了不同于链接的方法，因为如果有 30 个这样的函数，就很难进行链接。这里的目的是将所有更简单的函数组合起来生成一个更高阶的函数。

```javascript
const name = compose(
  splitmyName,
  countEachName,
  comvertUpperCase,
  returnName
);

console.log(name);
```

underscore 中的 compose 函数的实现：

```javascript
function compose() {
  var args = arguments;
  var start = args.length - 1;
  return function() {
    var i = start;
    var result = args[start].apply(this, arguments);
    while (i--) result = args[i].call(this, result);
    return result;
  };
}
```

### 三个简单的规则

1. 保持数据的不可变性
2. 确保尽量使用纯函数，只接收一个参数，返回数据或者其他函数
3. 尽量使用递归处理循环（如果有可能的话）
