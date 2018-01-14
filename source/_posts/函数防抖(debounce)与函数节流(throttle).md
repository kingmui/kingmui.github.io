---
title: 函数防抖(debounce)与函数节流(throttle)
date: 2018-06-20 11:03:39
tags:
  - JavaScript
  - 性能优化
comments: true
---

{% note info %}
在前端开发中有一部分的用户行为会频繁的触发事件执行，而对于 DOM 操作、资源加载等耗费性能的处理，很可能导致界面卡顿，甚至浏览器的崩溃。函数节流(throttle)和函数防抖(debounce)就是为了解决类似需求应运而生的。
{% endnote %}

### 前言

浏览器的 `resize`、`scroll`、`keypress`、`mousemove` 等事件在触发时，会不断地调用绑定在事件上的回调函数，极大地浪费资源，降低前端性能。为了优化体验，需要对这类事件进行调用次数的限制。

在开发的过程中，你可能会遇到下面的情况：

1. 监听 `Window` 对象的 `resize`，`scroll` 事件
2. 拖拽时监听 `mousemove`
3. 文字输入时，对输入字符串进行处理，比如要把 markdwon 转换成 html
4. 监听文件变化，重启服务

<!-- more -->

第一到第三种情况，事件短时间内被频繁触发，如果在事件中有大量的计算，频繁操作 `DOM`，资源加载等重行为，可能会导致界面卡顿，严重点甚至会让浏览器崩掉。对于第四种情况，有的开发者保存编辑好的文件喜欢按多次 Ctrl+S，若是快速的重启服务还能 Hold 住，但是要是重启一个应用，就可能多次不必要的重启。

针对上面这一系列的需求，于是就有了 `debounce` 和 `throttle` 两种解决方案。

### 函数防抖（debounce）

当事件触发之后，必须等待某一个时间(N)之后，回调函数才会执行，假若在等待的时间内，事件又触发了则重新设置等待时间(N)，直到在时间(N)内事件不被触发，则在最后一次触发事件后，执行函数。

作用是在短时间内多次触发同一个函数，**只执行最后一次，或者只在开始时执行**。

以用户拖拽改变窗口大小，触发 `resize` 事件为例，在这过程中窗口的大小一直在改变，所以如果我们在 `resize` 事件中绑定函数，这个函数将会一直触发，而这种情况大多数情况下是毫无意义的，还会造成资源的大量浪费。

这时候可以使用函数防抖来优化相关操作：

```javascript
// 普通方案
window.addEventListener('resize', () => {
  console.log('trigger');
})
```

优化方案：

```javascript
/**
 * @param     fn     {Function}   实际要执行的函数
 * @param     delay  {Number}     延迟时间，单位是毫秒（ms）
 * @return    {Function}
 */
function debounce(fn, delay){
    // 维护一个 timer
    let timer = null;
    // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
    return function() {
        // 保存函数调用时的上下文和参数，传递给 fn
        let context = this;
        let args = arguments;

        // 函数被调用，清除定时器
        if (timer) clearTimeout(timer);

        // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），再过 delay 毫秒就执行 fn
        timer = setTimeout(function(){
            fn.apply(context, args);
        }, delay)
    }
}
```

```javascript
function foo() {
  console.log('trigger');
}
// 在 debounce 中包装我们的函数，2 秒后触发
window.addEventListener('resize', debounce(foo, 2000));
```

- 首先，我们为 `resize` 事件绑定处理函数，这时 `debounce` 函数会立即调用，因此给 `resize` 事件绑定的函数实际上是 `debounce` 内部返回的函数。
- 每一次事件被触发，都会清除当前的 `timer` 然后重新设置超时调用。这就会导致每一次高频事件都会取消前一次的超时调用，导致事件处理程序不能被触发。
- 只有当高频事件停止，最后一次事件触发的超时调用才能在 `delay` 时间后执行。


更进一步，我们不希望非要等到事件停止触发后才执行，我希望立刻执行函数，然后等到停止触发 n 秒后，才可以重新触发执行。
这里增加一个 `immediate` 参数来设置是否要立即执行：

```javascript
function debounce(fn, delay, immediate){
    var timer = null;
    return function(){
        var context = this;
        var args = arguments;
        if (timer) clearTimeout(timer);
        if (immediate) {
            // 根据距离上次触发操作的时间是否到达 delay 来决定是否要现在执行函数
            var doNow = !timer;
            // 每一次都重新设置 timer，就是要保证每一次执行至少 delay 秒后才可以执行
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
            // 立即执行
            if (doNow) {
                clearTimeout(timer);
                fn.apply(context, args);
            }
        } else {
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        }
    }
}
```

### 函数节流（throttle）

节流是另一种处理类似问题的解决方法。**节流函数允许一个函数在规定的时间内只执行一次**。

它和防抖动最大的区别是，{% label info@节流函数不管事件触发有多频繁，都会保证在规定时间内一定会执行一次真正的事件处理函数 %}。

比如在页面的无限加载场景下，我们需要在用户在滚动页面时，每隔一段时间发一次 Ajax 请求，而不是在用户停下滚动页面操作时才去请求数据。这样的场景，就适合用节流阀技术来实现。

其他的应用场景如：输入框的联想，可以限定用户在输入时，只在每两秒钟响应一次联想。

主要有两种实现方法：

- [时间戳](#时间戳实现：)
- [定时器](#定时器实现：)

区别：使用时间戳实现的节流函数会在第一次触发事件时立即执行，以后每过 delay 秒之后才执行一次，并且最后一次触发事件不会被执行；而定时器实现的节流函数在第一次触发时不会执行，而是在 delay 秒之后才执行，当最后一次停止触发后，还会再执行一次函数。

#### 时间戳实现：

```javascript
/**
* @param func    {Function}   实际要执行的函数
* @param delay   {Number}     执行间隔，单位是毫秒（ms），默认100ms
* @return        {Function}   返回一个`节流`函数
*/
function throttle (func, delay = 100) {
    var prev = Date.now();
    return function(){
        var context = this;
        var args = arguments;
        var now = Date.now();
        if (now - prev >= delay){
            prev = Date.now();
            func.apply(context, args);
        }
    }
}
```

当高频事件触发时，第一次应该会立即执行（给事件绑定函数与真正触发事件的间隔如果大于 `delay` 的话），而后再怎么频繁触发事件，也都是会每 `delay` 秒才执行一次。而当最后一次事件触发完毕后，事件也不会再被执行了。

#### 定时器实现：

当触发事件的时候，我们设置一个定时器，在触发事件的时候，如果定时器存在，就不执行；直到 `delay` 秒后，定时器执行回调函数，清空定时器，这样就可以设置下个定时器。

```javascript
function throttle (func, delay) {
    var timer = null;
    return function() {
        var context = this;
        var args = arguments;
        if (!timer) {
            timer = setTimeout(function(){
                func.apply(context, args);
                timer = null;
            }, delay);
        }
    }
}
```

当第一次触发事件时，肯定不会立即执行函数，而是在 `delay` 秒后才执行。之后连续不断触发事件，也会每 `delay` 秒执行一次。当最后一次停止触发后，由于定时器的 `delay` 延迟，可能还会执行一次函数。

可以综合使用时间戳与定时器，完成一个事件触发时立即执行，触发完毕还能执行一次的节流函数：

```javascript
var throttle = function(func, delay) {
    var timer = null;
    var startTime = Date.now();

    return function() {
        var curTime = Date.now();
        var remaining = delay - (curTime - startTime);
        var context = this;
        var args = arguments;

        if (timer) clearTimeout(timer);
        if (remaining <= 0) {
            func.apply(context, args);
            startTime = Date.now();
        } else {
            timer = setTimeout(func, remaining);
        }
    }
}
```

需要在每个 `delay` 时间中一定会执行一次函数，因此在节流函数内部使用开始时间、当前时间与 `delay` 来计算 `remaining`，当 `remaining <= 0` 时表示执行该函数了，如果还没到时间的话就设定在 `remaining` 时间后再触发。当然在 `remaining` 这段时间中如果又一次发生事件，那么会取消当前的计时器，并重新计算一个 `remaining` 来判断当前状态。

### 总结

函数节流(throttle)和函数防抖(debounce)都是通过延时逻辑操作来提升性能的方法，在前端优化中是常见且重要的解决方式。可以从概念和实际应用中理解两者的区别，在需要的时候选择合适的方法处理。

防止一个事件频繁触发回调函数的方式：

- 防抖动：将几次操作合并为一次操作进行。原理是维护一个计时器，规定在 `delay` 时间后触发函数，但是在 `delay` 时间内再次触发的话，就会取消之前的计时器而重新设置。这样一来，只有最后一次操作能被触发。
- 节流：使得一定时间内只触发一次函数。它和防抖动最大的区别就是，节流函数不管事件触发有多频繁，都会保证在规定时间内一定会执行一次真正的事件处理函数，而防抖动只是在最后一次事件后才触发一次函数。原理是通过判断是否到达一定时间来触发函数，若没到规定时间则使用计时器延后，而下一次事件则会重新设定计时器。
