---
title: JavaScript如何使用变量设置对象的键名
date: 2018-06-19 15:28:03
tags:
  - JavaScript
comments: true
---

`{thetop: 10}` 是一个有效的对象字面量。代码将创建一个属性名为 `thetop` 且值为 `10` 的对象。与以下内容相同：

```javascript
obj = {thetop: 10};
obj = {"thetop": 10};
```

在 ES5 及更早版本中，你{% label info@不能直接在对象字面量中使用变量作为属性名称 %}。唯一的选择是执行以下操作：

<!-- more -->

```javascript
var thetop = "top";
// 创建对象字面量
var aniArgs = {};

// 将变量属性名称赋值为 10
aniArgs[thetop] = 10;
```

ES6 将 `ComputedPropertyName` [定义](http://www.ecma-international.org/ecma-262/6.0/#sec-object-initializer)为对象字面量语法的一部分，这允许你像这样编写代码：

```javascript
var thetop = "top",
	obj = { [thetop]: 10 };
console.log(obj.top); // -> 10
```

[来源](https://stackoverflow.com/questions/2274242/how-to-use-a-variable-for-a-key-in-a-javascript-object-literal)
