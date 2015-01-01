---
layout: column_1_2
title:  "html5系列.画布进阶.迷宫解锁"
description: "html5系列.画布进阶.迷宫解锁"
keywords: html5,canvas,画布进阶,迷宫解锁
origin: 张嘉杰.原创
date:   2015-01-01
category: html5
tags: html5 canvas unlock
---
迷宫解锁用途还是蛮广泛的，大多数手机基本都会自带这个功能的，应用端也有一些利用该功能的：如支付宝等等，但是好多朋友不知道其实现的原理，这里我用`html5`展示实现过程。
<!--more-->
说点题外话，有时候一部分人拿到一个问题可能会感觉无从下手，然后一直没有进展，最后导致耽误工期，主要还是解决问题的思路问题，个人认为应该把问题拆细了，然后在逐一解决。
（ps：经常会对一起工作的同事这么说）。还是不啰嗦了开始吧。

> 实现思路
{% highlight html %}

1. 画圆：空心圆、选中圆、错误圆
2. 画内圆和内圆之间连接的线（圆：外圆、内圆）
3. 解锁成功、解锁失败的控制

{% endhighlight %}

> 实现过程（画圆：空心、选中、错误）

`javascript部分`
{% highlight javascript %}

(function(global, doc){
  
  var _canvas    = doc.createElement("canvas"), // 构造canvas
      _context;
  _canvas.width  = 500;
  _canvas.height = 500;
  doc.querySelector("body").appendChild(_canvas);
  _context = _canvas.getContext("2d");

  // 空心圆
  _context.beginPath();
  _context.arc(40, 40, 35, 0, Math.PI*2, true);
  _context.lineWidth = 1.0;
  _context.strokeStyle = "#cccccc";
  _context.stroke();
  _context.closePath();
  
  // 选中的圆
  _context.beginPath();
  _context.arc(140, 40, 35, 0, Math.PI*2, true);
  _context.lineWidth = 1.0;
  _context.fillStyle = "#cbeac0";
  _context.strokeStyle = "#46c017";
  _context.fill();
  _context.stroke();
  _context.closePath();
  // 选中的圆，小圆
  _context.beginPath();
  _context.arc(140, 40, 10, 0, Math.PI*2, true);
  _context.fillStyle = "#46c017";
  _context.fill();
  _context.closePath();
  
  // 错误的圆
  _context.beginPath();
  _context.arc(240, 40, 35, 0, Math.PI*2, true);
   _context.lineWidth = 1.0;
  _context.fillStyle = "#f8d0cd";
  _context.strokeStyle = "#f7574b";
  _context.fill();
  _context.stroke();
  _context.closePath();
  // 错误的圆，小圆
  _context.beginPath();
  _context.arc(240, 40, 10, 0, Math.PI*2, true);
  _context.fillStyle = "#f7574b";
  _context.fill();
  _context.closePath();
  
  
    // 选中的圆
  _context.beginPath();
  _context.arc(40, 140, 35, 0, Math.PI*2, true);
  _context.lineWidth = 1.0;
  _context.fillStyle = "#cbeac0";
  _context.strokeStyle = "#46c017";
  _context.fill();
  _context.stroke();
  _context.closePath();
  // 选中的圆，小圆
  _context.beginPath();
  _context.arc(40, 140, 10, 0, Math.PI*2, true);
  _context.fillStyle = "#46c017";
  _context.fill();
  _context.closePath
  
    // 选中的圆
  _context.beginPath();
  _context.arc(140, 140, 35, 0, Math.PI*2, true);
  _context.lineWidth = 1.0;
  _context.fillStyle = "#cbeac0";
  _context.strokeStyle = "#46c017";
  _context.fill();
  _context.stroke();
  _context.closePath();
  // 选中的圆，小圆
  _context.beginPath();
  _context.arc(140, 140, 10, 0, Math.PI*2, true);
  _context.fillStyle = "#46c017";
  _context.fill();
  _context.closePath();
  
  // 画线连接
  _context.beginPath(); // 开始路径绘制
  _context.moveTo(40, 140);
  _context.lineTo(140, 140);
  _context.lineWidth = 3.0; // 设置线宽
  _context.strokeStyle = "#46c017"; // 设置线的颜色
  _context.stroke();  // 进行线的着色，这时整条线才变得可见
  _context.closePath();
  
})(window, document);

{% endhighlight %}

-----------------------

<a class="button" href="/resources/demo{{ page.url}}-arc.html" target="_blank">查看DEMO</a>

-----------------------

### 还是蛮简单的吧。OK,今天就先说到这儿 :)

-----------------------
