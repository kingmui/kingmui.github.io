---
title: 使用CSS3动画属性实现太阳系行星运转模拟动画
date: 2017-10-28 23:25:14
reward: true
tags:
  - CSS3
  - HTML5
  - animation
---

{% img http://oytx6hj82.bkt.clouddn.com/solarsystem.png 400 solarsystem %}
{% blockquote %}
太阳系行星运转模拟
{% endblockquote %}
[查看动画效果](https://kingmui.github.io/CodeDemo/solarSystem/solarsystem.html)<!-- more -->
{% codeblock 源代码 lang:html https://github.com/kingmui/CodeDemo/blob/master/solarSystem/solarsystem.html solarsystem.html %}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="description" content="太阳系,CSS动画,Web前端与移动开发">
  <meta name="keywords" content="solarSystem,HTML5,CSS3,Web前端开发">
  <meta name="generator" content="WebStorm 2017.2">
  <meta name="author" content="kingmui.github.io">
  <title>solarSystem</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      min-width: 1000px;
      font-family: Microsoft YaHei;
      background-color: rgb(8, 14, 36);
    }

    /*版心*/
    .wrap {
      width: 700px;
      margin: 25px auto;
      overflow: hidden;
    }

    /*标题*/
    .title {
      text-align: center;
      font-size: 24px;
      letter-spacing: 2px;
      color: azure;
    }

    /*行星块*/
    .planet {
      height: 660px;
      position: relative;
    }

    /*太阳*/
    .sun {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: rgb(255, 165, 0);
      box-shadow: 0 0 30px azure;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -30px;
      margin-left: -30px;
    }

    /*水星路径*/
    .mercuryPath {
      width: 130px;
      height: 130px;
      border: 1px solid #545866;
      box-sizing: border-box;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -65px;
      margin-left: -65px;
      animation: planetrotate 10s linear infinite;
      -moz-animation: planetrotate 10s linear infinite;
      -webkit-animation: planetrotate 10s linear infinite;
      -o-animation: planetrotate 10s linear infinite;
    }

    /*水星*/
    .mercury {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: #505080;
      box-shadow: 0 0 8px azure;
      position: absolute;
      top: 40px;
    }

    /*金星路径*/
    .venusPath {
      width: 200px;
      height: 200px;
      border: 1px solid #545866;
      box-sizing: border-box;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -100px;
      margin-left: -100px;
      animation: planetrotate 13s linear infinite;
      -moz-animation: planetrotate 13s linear infinite;
      -webkit-animation: planetrotate 13s linear infinite;
      -o-animation: planetrotate 13s linear infinite;
    }

    /*金星*/
    .venus {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background-color: #baa681;
      box-shadow: 0 0 8px azure;
      position: absolute;
      top: 65px;
    }

    /*地球路径*/
    .earthPath {
      width: 270px;
      height: 270px;
      border: 1px solid #545866;
      box-sizing: border-box;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -135px;
      margin-left: -135px;
      animation: planetrotate 15s linear infinite;
      -moz-animation: planetrotate 15s linear infinite;
      -webkit-animation: planetrotate 15s linear infinite;
      -o-animation: planetrotate 15s linear infinite;
    }

    /*地球*/
    .earth {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background-image: radial-gradient(#53ecf4, #22abd0, #1290b2);
      box-shadow: 0 0 8px azure;
      position: absolute;
      top: 95px;
      animation: planetrotate 5s linear infinite;
      -moz-animation: planetrotate 5s linear infinite;
      -webkit-animation: planetrotate 5s linear infinite;
      -o-animation: planetrotate 5s linear infinite;
    }

    /*月球*/
    .moon {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: white;
      box-shadow: 0 0 8px azure;
      position: absolute;
      top: 14px;
    }

    /*火星路径*/
    .marsPath {
      width: 340px;
      height: 340px;
      border: 1px solid #545866;
      box-sizing: border-box;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -170px;
      margin-left: -170px;
      animation: planetrotate 18s linear infinite;
      -moz-animation: planetrotate 18s linear infinite;
      -webkit-animation: planetrotate 18s linear infinite;
      -o-animation: planetrotate 18s linear infinite;
    }

    /*火星*/
    .mars {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #fa8757;
      box-shadow: 0 0 8px azure;
      position: absolute;
      top: 130px;
    }

    /*木星路径*/
    .jupiterPath {
      width: 410px;
      height: 410px;
      border: 1px solid #545866;
      box-sizing: border-box;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -205px;
      margin-left: -205px;
      animation: planetrotate 20s linear infinite;
      -moz-animation: planetrotate 20s linear infinite;
      -webkit-animation: planetrotate 20s linear infinite;
      -o-animation: planetrotate 20s linear infinite;
    }

    /*木星*/
    .jupiter {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #937749;
      box-shadow: 0 0 8px azure;
      position: absolute;
      top: 130px;
    }

    /*土星路径*/
    .saturnPath {
      width: 480px;
      height: 480px;
      border: 1px solid #545866;
      box-sizing: border-box;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -240px;
      margin-left: -240px;
      animation: planetrotate 22s linear infinite;
      -moz-animation: planetrotate 22s linear infinite;
      -webkit-animation: planetrotate 22s linear infinite;
      -o-animation: planetrotate 22s linear infinite;
    }

    /*土星*/
    .saturn {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background-color: #f1e0b4;
      box-shadow: 0 0 8px azure;
      position: absolute;
      top: 160px;
    }

    /*土星环*/
    .ring {
      width: 30px;
      height: 35px;
      border: 2px solid #f1e0b4;
      box-sizing: border-box;
      border-radius: 50%;
      box-shadow: 0 0 15px #977b4b;
      position: absolute;
      top: 155px;
      left: -2px;
    }

    /*天王星路径*/
    .uranusPath {
      width: 550px;
      height: 550px;
      border: 1px solid #545866;
      box-sizing: border-box;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -275px;
      margin-left: -275px;
      animation: planetrotate 25s linear infinite;
      -moz-animation: planetrotate 25s linear infinite;
      -webkit-animation: planetrotate 25s linear infinite;
      -o-animation: planetrotate 25s linear infinite;
    }

    /*天王星*/
    .uranus {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background-color: #05a1d8;
      box-shadow: 0 0 8px azure;
      position: absolute;
      top: 205px;
    }

    /*海王星路径*/
    .neptunePath {
      width: 620px;
      height: 620px;
      border: 1px solid #545866;
      box-sizing: border-box;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -310px;
      margin-left: -310px;
      animation: planetrotate 30s linear infinite;
      -moz-animation: planetrotate 30s linear infinite;
      -webkit-animation: planetrotate 30s linear infinite;
      -o-animation: planetrotate 30s linear infinite;
    }

    /*海王星*/
    .neptune {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background-color: #02ebf4;
      box-shadow: 0 0 8px azure;
      position: absolute;
      top: 235px;
    }

    .intro {
      color: azure;
      text-align: center;
      font-size: 14px;
    }

    .copyright {
      display: block;
      margin-top: 10px;
    }

    .copyright a {
      text-decoration: none;
      color: #FF0066;
    }

    /*Internet Explorer 9，以及更早的版本，不支持 @keyframe 规则或 animation 属性。*/
    /*定义动画 planetrotate*/
    @keyframes planetrotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    /* Firefox */
    @-moz-keyframes planetrotate {
      from {
        -moz-transform: rotate(0deg);
      }
      to {
        -moz-transform: rotate(360deg);
      }
    }

    /* Safari & Chrome */
    @-webkit-keyframes planetrotate {
      from {
        -webkit-transform: rotate(0deg);
      }
      to {
        -webkit-transform: rotate(360deg);
      }
    }

    /* Opera */
    @-o-keyframes planetrotate {
      from {
        -o-transform: rotate(0deg);
      }
      to {
        -o-transform: rotate(360deg);
      }
    }
  </style>
</head>
<body>
<div class="wrap">
  <div class="title">太阳系行星运转模拟</div>
  <div class="planet">
    <!--太阳-->
    <div class="sun"></div>
    <!--水星-->
    <div class="mercuryPath">
      <div class="mercury"></div>
    </div>
    <!--金星-->
    <div class="venusPath">
      <div class="venus"></div>
    </div>
    <!--地球-->
    <div class="earthPath">
      <div class="earth">
        <div class="moon"></div>
      </div>
    </div>
    <!--火星-->
    <div class="marsPath">
      <div class="mars"></div>
    </div>
    <!--木星-->
    <div class="jupiterPath">
      <div class="jupiter"></div>
    </div>
    <!--土星-->
    <div class="saturnPath">
      <div class="saturn"></div>
      <div class="ring"></div>
    </div>
    <!--天王星-->
    <div class="uranusPath">
      <div class="uranus"></div>
    </div>
    <!--海王星-->
    <div class="neptunePath">
      <div class="neptune"></div>
    </div>
  </div>
  <div class="intro">
    建议使用Chrome、Firefox、Safari、Opera、IE10及以上版本的Internet Explorer浏览本页面
    <span class="copyright">
      Copyright&copy; <a href="https://www.facebook.com/KINGMUIHK" target="_blank">KINGMUI</a> 2017 All Rights Reserved
    </span>
  </div>
</div>
</body>
</html>
{% endcodeblock %}