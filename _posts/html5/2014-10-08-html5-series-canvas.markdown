---
layout: column_1_2
title:  "html5系列.画布"
description: "html5系列.画布"
keywords: html5,html5进阶,canvas,画布
origin: 张嘉杰.原创
date:   2014-10-08
category: html5
tags: html5
---
`<canvas>`标签主要用于图形绘制，`canvas`通过`javascript`来绘制`2D`图形。`canvas`拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法。在`canvas`中，一旦图形被绘制完成，它就不会继续得到浏览器的关注。如果其位置发生变化，那么整个场景也需要重新绘制，包括任何或许已被图形覆盖的对象。
<!--more-->

> 创建 Canvas 元素

{% highlight html %}

# 创建canvas标签
<canvas id="myCanvas" width="400" height="400"></canvas>

{% endhighlight %}

> 通过 JavaScript 来绘制

{% highlight javascript %} 

// canvas 元素
var canvas = document.body.appendChild(document.getElementById("myCanvas"));

// 创建 context 对象
var context = canvas.getContext("2d");

// 创建图片对象
var img = new Image();

// 设置图片路径
img.src = "http://www.jcore.cn/resources/images/demo/map.png";

// 图片加载以后绘图，否则为空白图片
img.onload = function(){
	context.drawImage(img,0,0);
}

{% endhighlight %}

### OK,今天就先说到这儿很简单，也很基础，下面有简单的例子 :)

-----------------------

<a class="button" href="/resources/demo{{ page.url}}.html" target="_blank">查看DEMO</a>

-----------------------


