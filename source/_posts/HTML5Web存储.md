---
title: HTML5 Web 存储
date: 2017-11-03 11:02:55
tags:
  - HTML5
---

{% note info %}
随着互联网的快速发展，基于网页的应用越来越普遍，同时也变的越来越复杂，为了满足各式各样的需求，会经常性地在本地存储大量的数据。传统方式我们是以document.cookie来进行存储的，但是由于cookie的存储大小只有4k左右，并且解析也相当的复杂，每一次发送请求还会携带上cookie，这不仅会造成带宽的浪费，还会给开发者带来诸多不便。在此窘境下，HTML5规范提出了新的解决方案——Web存储。Web存储是将数据存储到用户的电脑上，这样不仅可以缓解服务器压力，同时也提高了用户体验。在 HTML5 中，数据不是由每个服务器请求传递的，而是只有在请求时使用数据。它使在不影响网站性能的情况下存储大量数据成为可能。
{% endnote %}

### cookie概念
- cookie是客户端保持状态的解决方案。cookie存储了服务端发送给客户端的一些特殊信息，这些信息以文本的方式存储在客户端。每当客户端向服务端发送请求时，**cookie数据始终会在同源的http请求中携带（即使不需要）**，即cookie会在浏览器和服务器间来回传递。而sessionStorage和localStorage不会自动把数据发送给服务器，仅会在本地存储。

<!-- more -->

- 因为受浏览器的同源策略影响，cookie始终是以域名为单位进行存储的，每个域名间的cookie是相互隔离的，也就是说**不同域名之间的cookie是不可以相互操作的**。
- 必须通过http协议访问页面，才能访问到cookie中的内容。
- cookie数据不能超过4k，因为每次http请求都会携带cookie，所以**cookie只适合保存很小的数据**，如会话标识。
- cookie的生命周期默认是会话周期，即关闭浏览器后cookie就没了。可以根据需要给cookie设置过期时间`document.cookie = "max-age=60;path=/";`
- cookie数据还有路径(path)的概念，一个域名下的cookie在该域名下的所有页面中都是可以被访问的。子路径中可以访问父路径中存储的cookie，但是父路径中无法访问子路径中的cookie，一般情况下，我们会把cookie存储到域名的根目录下`path=/`，这样，在该域名下所有的页面中都可以访问到。
- cookie数据在所有同源窗口中都是共享的。

### localStorage概念
{% blockquote w3school http://www.w3school.com.cn/html5/html_5_webstorage.asp HTML 5 Web 存储 %}
localStorage 方法存储的数据没有时间限制。第二天、第二周或下一年之后，数据依然可用。
{% endblockquote %}
- 将数据永久存储在本地，即使关闭页面，关闭电脑，断电等都不会删除数据，除非手动删除或用代码清除。
- **支持多窗口数据共享**，一些不涉及到安全的数据（不要太过庞大）都可以存储到本地。

### sessionStorage概念
{% blockquote w3school http://www.w3school.com.cn/html5/html_5_webstorage.asp HTML 5 Web 存储 %}
sessionStorage 方法针对一个 session 进行数据存储。当用户关闭浏览器窗口后，数据会被删除。
{% endblockquote %}
- 将数据临时存储在本地，一旦关闭掉当前页面，sessionStorage数据默认会被删除，即生命周期为关闭当前页面窗口。
- **不支持多窗口数据共享，但是支持链接跳转的数据共享**，在页面跳转的时候可以通过sessionStorage实现数据共享（同源策略）

### HTML 5 Web 存储特性
- 设置、读取方便。
- 容量较大，**sessionStorage可存储大约5M数据**、**localStorage可存储5M~20M数据**。
- 只能存储字符串，可以将对象通过`JSON.stringify()`方法编码后存储。

### HTML 5 Web 存储差异性
- 相同点
  - 都是将数据存储在web端，并且都是同源
- 不同点
  - cookie 只能存储4K数据，并且每一次请求都会携带上cookie，体验不好，浪费带宽
  - sessionStorage和localStorage直接存储在本地，请求不会携带，并且容量比cookie要大的多
  - sessionStorage 是临时会话，当窗口被关闭时就清除掉，而localStorage 永久存在，cookie有过期时间
  - cookie 和localStorage 都可以支持多窗口共享，而sessionStorage 不支持多窗口共享，但是支持链接跳转的数据共享

### sessionStorage和localStorage方法详解

| 方法/属性              | 说明           |
| ------------------ | ------------ |
| setItem(key,value) | 设置存储内容       |
| getItem(key)       | 读取存储内容       |
| removeItem(key)    | 删除键为key的存储内容 |
| clear()            | 清空所有存储内容     |
| key(n)             | 以索引值来获取键名    |
| length             | 存储的数据的个数     |

### 示例代码
``` html
<script>
// 存数据
	// 如果"键"一样，后面存储的会将前面存储的覆盖掉
	localStorage.setItem('username','fly1');
	localStorage.setItem('username','fly2');
	sessionStorage.setItem('usernameSession1','fly3');
	sessionStorage.setItem('usernameSession2','fly4');

// 取数据
	console.log(localStorage.getItem('username'));           // fly2
	console.log(sessionStorage.getItem('usernameSession1')); // fly3

// 数据的长度
	console.log(localStorage.length);   // 1
	console.log(sessionStorage.length); // 2

// 删除数据
	// localStorage.removeItem('username');
	// sessionStorage.removeItem('usernameSession2');

// 清除所有的数据
	// localStorage.clear();
	// sessionStorage.clear();

// 获取键名
	console.log(localStorage.key(0));   // username
	console.log(sessionStorage.key(0)); // usernameSession1
</script>

<!-- sessionStorage支持链接跳转的数据共享(包括在新窗口中打开) -->
<a href="sharing.html" target="_blank">跳转</a>
<script>
	sessionStorage.setItem('username','fly');
</script>
<!-- sharing.html -->
<script>
	console.log(sessionStorage.getItem('username')); // fly
</script>
```

### 总结
cookie数据始终在同源的http请求中携带（即使不需要），即cookie在浏览器和服务器间来回传递。而sessionStorage和localStorage不会自动把数据发给服务器，仅在本地保存。cookie数据还有路径（path）的概念，可以限制cookie只属于某个路径下。存储大小限制也不同，cookie数据不能超过4k，同时因为每次http请求都会携带cookie，所以cookie只适合保存很小的数据，如会话标识。sessionStorage和localStorage 虽然也有存储大小的限制，但比cookie大得多，可以达到5M或更大。数据有效期不同，sessionStorage：仅在当前浏览器窗口关闭前有效，自然也就不可能持久保持；localStorage：始终有效，窗口或浏览器关闭也一直保存，因此用作持久数据；cookie只在设置的cookie过期时间之前一直有效，即使窗口或浏览器关闭。作用域不同，sessionStorage不能在不同的浏览器窗口中共享，即使是同一个页面；localStorage 在所有同源窗口中都是共享的；cookie也是在所有同源窗口中都是共享的。
