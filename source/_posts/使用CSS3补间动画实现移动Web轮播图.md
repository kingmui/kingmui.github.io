---
title: 使用CSS3补间动画实现移动Web轮播图
date: 2017-10-22 21:48:13
reward: true
tags:
  - CSS3
  - javascript
  - animation
---

{% img http://oytx6hj82.bkt.clouddn.com/CarouselFigureView.png 600 CarouselFigureView %}
{% blockquote %}
tweenAnimationsVersion
{% endblockquote %}
[查看效果](https://kingmui.github.io/CodeDemo/CarouselFigureView/tweenAnimationsVersion/)<!-- more -->
{% codeblock 源代码 lang:javascript https://github.com/kingmui/CodeDemo/blob/master/CarouselFigureView/tweenAnimationsVersion/js/index.js index.js %}
;(function(){
	var banner = document.querySelector('.banner');
	var ul = banner.querySelector('ul');
	var lis = ul.children;
	var indicators = banner.querySelectorAll('ol>li');
	var liWidth = 0;
	var ulWidth = 0;
	var startX = 0;
	var startTime = 0;
	var count = 1;
	var timer;
	var Carousel = {};

	// 定时器
	Carousel.move = function(){
		timer = setInterval(function(){
			count++;
			Carousel.addTransition(ul);
			Carousel.setTranslate(ul,- liWidth * count);
		},2000);
	}
	Carousel.move();

	// 边界值判断
	Carousel.boundaryJudgment = function(){
		if(count >= lis.length -1){
			count = 1;			
		}
		if(count <= 0){
			count = lis.length - 2;			
		}
	}

	// 添加过度
	Carousel.addTransition = function(ele){
		ele.style.transition = "all .5s";
		ele.style.webkitTransition = "all .5s";
	}

	// 移除过度
	Carousel.removeTransition = function(ele){
		ele.style.transition = "none";
		ele.style.webkitTransition = "none";
	}

	// 设置偏移
	Carousel.setTranslate = function(ele,value,direction){
		var direction = direction || "X";
		ele.style.transform = "translate" + direction + "(" + value +"px)";
	}

	// 设置ul的宽
	Carousel.setUlWidth = function(){
		liWidth = banner.offsetWidth;
		ulWidth = lis.length * liWidth;
		for(var i = 0; i < lis.length; i++){
			lis[i].style.width = liWidth + "px";
		}
		ul.style.width = ulWidth + "px";
	}

	// 页面加载时：设置ul标签的宽和位置
	window.addEventListener("load",function(){
		Carousel.setUlWidth();
		Carousel.setTranslate(ul,- liWidth * count);
	});

	// 重置窗口大小时：设置ul标签的宽和位置
	window.addEventListener("resize",function(){
		clearInterval(timer);
		Carousel.setUlWidth();
		Carousel.removeTransition(ul);
		Carousel.setTranslate(ul,- liWidth * count);
		Carousel.move();
	});

	// CSS transition 结束后进行边界判断
	ul.addEventListener("transitionend",function(){
		if(count >= lis.length -1){
			count = 1;
			Carousel.removeTransition(ul);
			Carousel.setTranslate(ul,- liWidth * count);		
		}
		if(count <= 0){
			count = lis.length - 2;
			Carousel.removeTransition(ul);
			Carousel.setTranslate(ul,- liWidth * count);	
		}		
		// 同步小圆点
		for(var i = 0; i < indicators.length; i++){
			indicators[i].classList.remove("current");
		}
		indicators[count - 1].classList.add("current");
	});

	// 当触点与触控平面接触时
	ul.addEventListener("touchstart",function(e){
		startX = e.changedTouches[0].clientX;
		startTime = new Date();
		clearInterval(timer);
	});

	// 当触点在触控平面上移动时
	ul.addEventListener("touchmove",function(e){
		Carousel.boundaryJudgment();
		var distance = e.changedTouches[0].clientX - startX;
		Carousel.removeTransition(ul);
		Carousel.setTranslate(ul,-liWidth * count + distance);
	});

	// 当触点离开触控平面时
	ul.addEventListener("touchend",function(e){
		Carousel.boundaryJudgment();
		var distance = e.changedTouches[0].clientX - startX;
		var moveTime = new Date() - startTime;
		// console.log("距离：" + distance + ",时间：" + moveTime);
		if(Math.abs(distance) >= liWidth / 3 || moveTime <= 300 && Math.abs(distance) >= 30){
			distance > 0 ? count-- : count++;
		}
		Carousel.addTransition(ul);
		Carousel.setTranslate(ul,- liWidth * count);
		Carousel.move();
	});
})();
{% endcodeblock %}