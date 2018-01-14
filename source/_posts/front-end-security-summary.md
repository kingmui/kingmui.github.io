---
title: 前端安全总结
date: 2020-03-21 19:56:55
tags:
  - 安全
comments: true
---

{% note info %}
随着互联网的高速发展，网络迅速普及。人们在享受网络带来便捷的同时，也面临着日益严重的网络安全问题。在一些出名的案例中，上百万的密码、邮件地址和信用卡信息被泄露给了公众，导致网站用户面临个人尴尬和财务威胁。在移动互联网时代，前端人员除了传统的 XSS、CSRF 等安全问题之外，又时常遭遇网络劫持等新型安全问题。当然，浏览器自身也在不断地进化和发展，引入内容安全策略（Content Security Policy）、Same-Site Cookies 等新技术来增强安全性，但是仍存在很多潜在的威胁，这需要前端开发人员不断进行“查漏补缺”。
{% endnote %}

本文介绍以下几种常见的前端安全问题及其解决方案：

1. 同源策略
2. XSS
3. CSRF
4. SQL 注入
5. 点击劫持
6. `window.opener` 安全问题
7. 文件上传漏洞

<!-- more -->

### [同源策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)

{% note %}
同源的定义：如果两个 URL 的**协议**、**域名**和**端口**都相同的话，则这两个 URL 是同源。
{% endnote %}

同源策略是一个重要的安全策略，它用于限制一个 origin 的文档或者它加载的脚本如何能与另一个源的资源进行交互。它能帮助阻隔恶意文档，减少可能被攻击的媒介。

- 同源策略限制了来自不同源的 JavaScript 脚本对当前 DOM 对象读和写的操作
- 同源策略限制了不同源的站点读取当前站点的 Cookie、IndexDB、LocalStorage 等数据
- 同源策略限制了通过 XMLHttpRequest 等方式将站点的数据发送给不同源的站点

解决方案：

1. **跨文档消息机制**：可以通过 [window.postMessage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage) 安全地实现跨源通信
2. **跨域资源共享（CORS）**：[跨域资源共享](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Access_control_CORS)是一种机制，它使用额外的 HTTP 头（`Access-Control-Allow-Origin: *`）来告诉浏览器让运行在一个 origin (domain) 上的 Web 应用被准许访问来自不同源服务器上的指定的资源
3. **内容安全策略（CSP）**：[内容安全策略](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)是一个额外的安全层，用于检测并削弱某些特定类型的攻击，包括跨站脚本 (XSS) 和数据注入攻击等。HTTP 响应头 [Content-Security-Policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy) 允许站点管理者控制用户代理能够为指定的页面加载哪些资源
4. **JSONP**：JSONP（JSON with Padding）是 JSON 的一种“使用模式”，可以让网页从别的域名获取资料，即跨域读取数据。原理是利用 `<script>` 标签没有跨域限制的“漏洞”来达到与第三方通讯的目的。

```javascript
const script = document.createElement('script');
script.src = 'https://api.cross-domain.com?callback=jsonp';
document.body.appendChild(script);

function jsonp(data) {
  console.log('data', data);
}
```

### [跨站脚本攻击](https://developer.mozilla.org/zh-CN/docs/Glossary/Cross-site_scripting)（Cross Site Scripting）

XSS 是一种安全漏洞，攻击者可以利用这种漏洞在网站上注入恶意的客户端代码。当被攻击者登陆网站时就会自动运行这些恶意代码，从而，攻击者可以突破网站的访问权限，冒充受害者。根据开放式 Web 应用安全项目（OWASP），XSS 在 2017 年被认为是 [7 种最常见的 Web 应用程序漏洞之一](https://owasp.org/www-project-top-ten/OWASP_Top_Ten_2017/Top_10-2017_A7-Cross-Site_Scripting_(XSS%29)。

如果 Web 应用程序没有部署足够的安全验证，那么，这些攻击很容易成功。浏览器无法探测到这些恶意脚本是不可信的，所以，这些脚本可以任意读取 cookie，session tokens，或者其它敏感的网站信息，或者让恶意脚本重写 HTML 内容。

在以下2种情况下，容易发生 XSS 攻击：

1. 数据从一个不可靠的链接进入到一个 Web 应用程序
2. 没有过滤掉恶意代码的动态内容被发送给 Web 用户

恶意内容一般包括 JavaScript，但是，有时候也会包括 HTML，FLASH 或是其他浏览器可执行的代码。XSS 攻击的形式千差万别，但他们通常都会：将 cookies 或其他隐私信息发送给攻击者，将受害者重定向到由攻击者控制的网页，或是经由恶意网站在受害者的机器上进行其他恶意操作。

XSS 有三种形式，通常针对用户的浏览器。

#### 存储型 XSS 攻击

利用漏洞提交恶意 JavaScript 代码，例如在 `input`，`textarea` 等所有可能输入文本信息的区域，输入 `<script src="http://恶意网站"></script>` 等，提交后信息会存在服务器中，当用户再次打开网站请求到相应的数据时，恶意脚本就会将用户的 Cookie 信息等数据上传到黑客服务器。

#### 反射型 XSS 攻击

用户将一段含有恶意代码的请求提交给 Web 服务器，Web 服务器接收到请求时，又将恶意代码反射给了浏览器端，这就是反射型 XSS 攻击。在现实生活中，黑客经常会通过 QQ 群或者邮件等渠道诱导用户去点击这些恶意链接，所以对于这些不明链接我们一定要慎之又慎。

Web 服务器不会存储反射型 XSS 攻击的恶意脚本，这是和存储型 XSS 攻击不同的地方。

#### 基于 DOM 的 XSS 攻击

通过修改原始的客户端代码，受害者浏览器的 DOM 环境改变，导致有效载荷的执行。也就是说，页面本身并没有变化，但由于DOM环境被恶意修改，有客户端代码被包含进了页面，并且意外执行。

#### 预防策略

1. 将 Cookie 等敏感信息设置为 `httponly`，禁止 JavaScript 通过 `document.cookie` 获得
2. 对所有的输入做严格的校验尤其是在服务器端，**过滤掉任何不合法的输入**，比如手机号必须是数字，通常可以采用正则表达式
3. 删除或禁用任何可能包含可运行代码指令的标记。对 HTML 来说，这些包括类似 `<script>`、`<object>`、`<embed>` 和 `<link>` 的标签
4. **转义单引号、双引号和尖括号等特殊字符**，可以采用 `encodeURIComponent` 编码，或者过滤掉这些特殊字符
5. 启用内容安全策略（CSP）作为针对 XSS 攻击的深度防御控制。主要以白名单的形式配置可信任的内容来源。在网页中，能够使白名单中的内容正常执行（包含 JS，CSS，Image 等），而非白名单的内容无法正常执行，从而减少 XSS 攻击，当然，也能够减少运营商劫持的内容注入攻击

```html
// header
Content-Security-Policy: default-src https:

// meta tag
<meta http-equiv="Content-Security-Policy" content="default-src https:">
```

### [跨站请求伪造](https://developer.mozilla.org/zh-CN/docs/Glossary/CSRF)（Cross-site request forgery）

#### 小明的悲惨遭遇

这一天，小明同学百无聊赖地刷着 Gmail 邮件。大部分都是没营养的通知、验证码、聊天记录之类。但有一封邮件引起了小明的注意：

{% note %}
甩卖比特币，一个只要998！！
{% endnote %}

聪明的小明当然知道这种肯定是骗子，但还是抱着好奇的心态点了进去（请勿模仿）。果然，这只是一个什么都没有的空白页面，小明失望的关闭了页面。一切似乎什么都没有发生......

在这平静的外表之下，黑客的攻击已然得手。小明的 Gmail 中，被偷偷设置了一个过滤规则，这个规则使得所有的邮件都会被自动转发到 `haker AT hackermail.com`。小明还在继续刷着邮件，殊不知他的邮件正在一封封地，如脱缰的野马一般地，持续不断地向着黑客的邮箱转发而去。

不久之后的一天，小明发现自己的域名已经被转让了。懵懂的小明以为是域名到期自己忘了续费，直到有一天，对方开出了 $650 的赎回价码，小明才开始觉得不太对劲。

小明仔细查了下域名的转让，对方是拥有自己的验证码的，而域名的验证码只存在于自己的邮箱里面。小明回想起那天奇怪的链接，打开后重新查看了“空白页”的源码：

```html
<form method="POST" action="https://mail.google.com/mail/h/ewt1jmuj4ddv/?v=prf" enctype="multipart/form-data">
  <input type="hidden" name="cf2_emc" value="true"/>
  <input type="hidden" name="cf2_email" value="hacker@hakermail.com"/>
  .....
  <input type="hidden" name="irf" value="on"/>
  <input type="hidden" name="nvp_bu_cftb" value="Create Filter"/>
</form>
<script>
  document.forms[0].submit();
</script>
```

1. 这个页面只要打开，就会向 Gmail 发送一个 Post 请求。请求中，执行了 “Create Filter” 命令，将所有的邮件，转发到 “hacker AT hakermail.com”
2. 小明由于刚刚就登陆了 Gmail，所以这个请求发送时，携带着小明的登录凭证（Cookie），Gmail 的后台接收到请求，验证了确实有小明的登录凭证，于是成功给小明配置了过滤器
3. 黑客可以查看小明的所有邮件，包括邮件里的域名验证码等隐私信息。拿到验证码之后，黑客就可以要求域名服务商把域名重置给自己

小明很快打开 Gmail，找到了那条过滤器，将其删除。然而，已经泄露的邮件，已经被转让的域名，再也无法挽回了......

以上就是小明的悲惨遭遇。而“点开一个黑客的链接，所有邮件都被窃取”这种事情并不是杜撰的，此事件原型是 2007 年 [Gmail 的 CSRF 漏洞](https://www.davidairey.com/google-gmail-security-hijack/)。

#### 什么是 CSRF

{% note %}
CSRF（Cross-site request forgery）跨站请求伪造：**攻击者诱导受害者进入第三方网站**，在第三方网站中，向被攻击网站发送跨站请求。利用受害者在被攻击网站已经获取的注册凭证，**绕过后台的用户验证**，达到冒充用户对被攻击的网站执行某项操作的目的。
{% endnote %}

一个典型的 CSRF 攻击有着如下的流程：

1. 受害者登录 a.com，并保留了登录凭证（Cookie）
2. 攻击者引诱受害者访问了 b.com
3. b.com 向 a.com 发送了一个请求：a.com/act=xx。浏览器会默认携带 a.com 的 Cookie
4. a.com 接收到请求后，对请求进行验证，并确认是受害者的凭证，误以为是受害者自己发送的请求
5. a.com 以受害者的名义执行了 act=xx
6. 攻击完成，攻击者在受害者不知情的情况下，冒充受害者，让 a.com ∂执行了自己定义的操作

#### 几种常见的攻击类型

- GET 类型的 CSRF

GET 类型的 CSRF 利用非常简单，只需要一个 HTTP 请求，一般会这样利用：

```html
<img src="http://bank.example/withdraw?amount=10000&for=hacker" />
```

在受害者访问含有这个 img 的页面后，浏览器会自动发出一次 HTTP 请求。bank.example 就会收到包含受害者登录信息的一次跨域请求

- POST 类型的 CSRF

这种类型的 CSRF 利用起来通常使用的是一个自动提交的表单，如：

```html
<form action="http://bank.example/withdraw" method="POST">
  <input type="hidden" name="account" value="xiaoming" />
  <input type="hidden" name="amount" value="10000" />
  <input type="hidden" name="for" value="hacker" />
</form>
<script> document.forms[0].submit(); </script>
```

访问该页面后，表单会自动提交，相当于模拟用户完成了一次 POST 操作。

POST 类型的攻击通常比 GET 要求更加严格一点，但仍不复杂。任何个人网站、博客，被黑客上传页面的网站都有可能是发起攻击的来源，后端接口不能将安全寄托在仅允许 POST 上面。

- 链接类型的 CSRF

链接类型的 CSRF 并不常见，比起其他两种用户打开页面就中招的情况，这种需要用户点击链接才会触发。这种类型通常是在论坛中发布的图片中嵌入恶意链接，或者以广告的形式诱导用户中招，攻击者通常会以比较夸张的词语诱骗用户点击，例如：

```html
<a href="http://test.com/csrf/withdraw.php?amount=1000&for=hacker" taget="_blank">
重磅消息！！
<a/>
```

由于之前用户登录了信任的网站 A，并且保存登录状态，只要用户主动访问上面的这个 PHP 页面，则表示攻击成功。

#### CSRF 的特点

- 攻击一般发起在第三方网站，而不是被攻击的网站。被攻击的网站无法防止攻击发生
- 攻击利用受害者在被攻击网站的登录凭证，冒充受害者提交操作；而不是直接窃取数据
- 整个过程攻击者并不能获取到受害者的登录凭证，仅仅是“冒用”
- 跨站请求可以用各种方式：图片 URL、超链接、CORS、Form 提交等等。部分请求方式可以直接嵌入在第三方论坛、文章中，难以进行追踪

发起 CSRF 攻击的三个必要条件：

1. 目标站点一定要有 CSRF 漏洞
2. 用户要登录过目标站点，并且在浏览器上保持有该站点的登录状态
3. 需要用户打开一个第三方站点，如黑客的站点等

#### 预防策略

CSRF 通常从第三方网站发起，被攻击的网站无法防止攻击发生，只能通过增强自己网站针对 CSRF 的防护能力来提升安全性。

1. **充分利用好 Cookie 的 SameSite 属性**

  - SameSite 的值是 Strict，那么浏览器会完全禁止第三方 Cookie
  - Lax 相对宽松一点。在跨站点的情况下，从第三方站点的链接打开和从第三方站点提交 Get 方式的表单这两种方式都会携带 Cookie。但如果在第三方站点中使用 Post 方法，或者通过 img、iframe 等标签加载的 URL，这些场景都不会携带 Cookie
  - 如果使用 None 的话，在任何情况下都会发送 Cookie 数据

2. **验证请求的来源站点**

在服务器端验证请求来源的站点，即请求头中的 `Origin` 和 `Referer` 属性。`Referer` 是 HTTP 请求头中的一个字段，记录了该 HTTP 请求的**来源地址**，而 `Origin` 属性只包含了**域名信息**，并没有包含具体的 URL 路径。服务器的策略是优先判断 `Origin`，如果请求头中没有包含 `Origin` 属性，再根据实际情况判断是否使用 `Referer` 值。

Origin 在以下两种情况下并不存在：

- **IE11同源策略**：IE 11 不会在跨站 CORS 请求上添加 Origin 标头，Referer 属性将仍然是唯一的标识。最根本原因是因为 IE 11 对同源的定义和其他浏览器有不同，有两个主要的区别：
  - 授信范围（Trust Zones）：两个相互之间高度互信的域名，如公司域名（corporate domains），则不受同源策略限制
  - 端口：IE 未将端口号纳入到同源策略的检查中，因此 `https://company.com:81/index.html` 和 `https://company.com/index.html` 属于同源并且不受任何限制

- **302重定向**：在 302 重定向之后 Origin 不包含在重定向的请求中，因为 Origin 可能会被认为是其他来源的敏感信息。对于 302 重定向的情况来说都是定向到新的服务器上的 URL，因此浏览器不想将 Origin 泄漏到新的服务器上

3. **CSRF Token**

前面讲到 CSRF 的另一个特征是，攻击者无法直接窃取到用户的信息（Cookie，Header，网站内容等），仅仅是冒用 Cookie 中的信息。

而 CSRF 攻击之所以能够成功，是因为服务器误把攻击者发送的请求当成了用户自己的请求。那么我们可以要求所有的用户请求都携带一个 CSRF 攻击者无法获取到的 Token。服务器通过校验请求是否携带正确的 Token，来把正常的请求和攻击的请求区分开，也可以防范 CSRF 的攻击。

4. **在 HTTP 头中自定义属性并验证**

这种方法也是使用 token 并进行验证，和上一种方法不同的是，这里并不是把 token 以参数的形式置于 HTTP 请求之中，而是把它放到 HTTP 头中自定义的属性里。通过 XMLHttpRequest 这个类，可以一次性给所有该类请求加上 `csrftoken` 这个 HTTP 头属性，并把 token 值放入其中。这样解决了上种方法在请求中加入 token 的不便，同时，通过 XMLHttpRequest 请求的地址不会被记录到浏览器的地址栏，也不用担心 token 会透过 Referer 泄露到其他网站中去

然而这种方法的局限性非常大。XMLHttpRequest 请求通常用于 Ajax 方法中对于页面局部的异步刷新，并非所有的请求都适合用这个类来发起，而且通过该类请求得到的页面不能被浏览器所记录下，从而进行前进，后退，刷新，收藏等操作，给用户带来不便。另外，对于没有进行 CSRF 防护的遗留系统来说，要采用这种方法来进行防护，要把所有请求都改为 XMLHttpRequest 请求，这样几乎是要重写整个网站，这代价无疑是不能接受的。

### SQL注入

SQL 注入漏洞使得恶意用户能够通过在数据库上执行任意 SQL 代码，从而允许访问、修改或删除数据，而不管该用户的权限如何。成功的注入攻击可能会伪造身份信息、创建拥有管理员权限的身份、访问服务器上的任意数据甚至破坏或修改数据使其变得无法使用。

拼接 SQL 时未仔细过滤，黑客可提交畸形数据改变语义。例如查询某篇文章，提交了这样的数据 `id=-1 or 1=1` 等。由于 `1=1` 恒真，导致 `where` 语句永远是 ture，那么查询的结果相当于整张表的内容，攻击者就达到了目的。或者，通过屏幕上的报错提示推测 SQL 语句等。

#### 预防策略

1. 禁止目标网站利用动态拼接字符串的方式访问数据库
2. 减少不必要的数据库抛出的错误信息
3. 对数据库的操作赋予严格的权限控制
4. 净化和过滤掉不必要的 SQL 保留字，例如：where、or、exec 等

### 点击劫持

1. 诱使用户点击看似无害的按钮（实则点击了透明 iframe 中的按钮）
2. 监听鼠标移动事件，让危险按钮始终在鼠标下方
3. 使用 HTML5 拖拽技术执行敏感操作（例如 deploy key）

#### 预防策略

1. 服务端添加 `X-Frame-Options` 响应头，这个 HTTP 响应头是为了防御用 iframe 嵌套的点击劫持攻击。这样浏览器就会阻止嵌入网页的渲染
2. JS 判断顶层视口的域名是不是和本页面的域名一致，不一致则不允许操作，`top.location.hostname === self.location.hostname`
3. 敏感操作使用更复杂的步骤（验证码、输入项目名称以删除）

### [window.opener](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/opener) 安全问题

`window.opener` 表示打开当前窗体页面的的父窗体的是谁。例如，在 A 页面中，通过一个带有 `target="_blank"` 的 `<a>` 标签打开了一个新的页面 B，那么在 B 页面里，`window.opener` 的值为 A 页面的 `window` 对象。

一般来说，打开同源的页面，不会有什么问题。但对于跨域的外部链接来说，存在一个被钓鱼的风险。比如你正在浏览购物网站，从当前网页打开了某个外部链接，在打开的外部页面，可以通过 `window.opener.location` 改写来源站点的地址。利用这一点，将来源站点改写到钓鱼站点页面上，例如跳转到伪造的高仿购物页面，当再回到购物页面的时候，是很难发现购物网站的地址已经被修改了的，这个时候你的账号就存在被钓鱼的可能了。

#### 预防策略

1. 设置 rel=noopener 属性

```html
<!-- rel=noopener 规定禁止新页面传递源页面的地址，通过设置了此属性的链接打开的页面，其 window.opener 值为 null -->
<a href="https://xxxx" rel="noopener noreferrer"> 外链 <a>
```

2. 将外链替换为内部的跳转连接服务，跳转时先跳到内部地址，再由服务器 redirect 到外链
3. 可以由 `widow.open` 打开外链

### 文件上传漏洞

服务器未校验上传的文件，致使黑客可以上传恶意脚本。

#### 预防策略

1. 用文件头来检测文件类型，使用白名单过滤
2. 上传后将文件彻底重命名并移动到不可执行的目录下
3. 升级服务器软件以避免路径解析漏洞
4. 升级用到的开源编辑器
5. 管理后台设置强密码
