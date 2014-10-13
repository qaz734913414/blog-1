---
layout: page
title:  "html5系列.画布进阶.在线选座购票实现（二）"
description: "html5系列.画布进阶.在线选座购票"
keywords: html5,html5进阶,canvas,画布,在线选座,选座购票,在线选座购票
origin: 张嘉杰.原创
date:   2014-10-11
category: html5
tags: html5 在线选座
---
`html+javascript`在线选座购票后端实现，利用`map`、`area`标签标出场馆热点区域，框选热点区域内可售座位，批量设置票价，保存座位数据。
<!--more-->

> 设置影院场馆（影院场馆可售区域）：

首先来说一下`canvas`来画场馆热点闭合区域。  
`html`部分：
{% highlight html %}

<canvas id="canvas" width=300 height=300 style="border:1px solid #000; background-color: ivory;"></canvas>

{% endhighlight %}

`javascript`部分：

{% highlight javascript %}

//闭合区域简单实现
var canvas = document.getElementById("myCanvas"), // canvas 元素
    context = canvas.getContext("2d"), // 创建 context 对象
    canvasOffset = canvas.getBoundingClientRect(),
    offsetX = canvasOffset.left,
    offsetY = canvasOffset.top,
    storedLines = [],
    startX = 0,
    startY = 0,
    radius = 4,
    canvasMouseX,
    canvasMouseY;

// 创建图片对象
var img = new Image();

// 设置图片路径
img.src = "http://www.jcore.cn/resources/images/demo/onlineseat.jpg";

// 图片加载以后绘图，否则为空白图片
img.onload = function(){
	context.drawImage(img,0,0);
}

context.strokeStyle = "orange";

//按下鼠标事件函数
canvas.onmousedown = function (e) {
  handleMouseDown(e);
};

//按下鼠标函数
function handleMouseDown(e) {
  canvasMouseX = parseInt(e.clientX - offsetX);
  canvasMouseY = parseInt(e.clientY - offsetY);

  if (hitStartCircle(canvasMouseX, canvasMouseY)) {
    fillPolyline();
    return;
  }
  storedLines.push({
    x: canvasMouseX,
    y: canvasMouseY
  });
  if (storedLines.length == 1) {
    startX = canvasMouseX;
    startY = canvasMouseY;
    context.fillStyle = "green";
    context.beginPath();
    context.arc(canvasMouseX, canvasMouseY, radius, 0, 2 * Math.PI, false);
    context.fill();
  } else {
    var c = storedLines.length - 2;
    context.strokeStyle = "orange";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(storedLines[c].x, storedLines[c].y);
    context.lineTo(canvasMouseX, canvasMouseY);
    context.stroke();
  }
}

function hitStartCircle(x, y) {
  var dx = x - startX;
  var dy = y - startY;
  return (dx * dx + dy * dy < radius * radius)
}

//闭合折线填充函数
function fillPolyline() {
  context.strokeStyle = "red";
  context.fillStyle = "blue";
  context.lineWidth = 1;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img,0,0);
  context.beginPath();
  context.moveTo(storedLines[0].x, storedLines[0].y);
  for (var i = 0; i < storedLines.length; i++) {
    context.lineTo(storedLines[i].x, storedLines[i].y);
  }
  context.closePath();
  context.fill();
  context.stroke();
  storedLines = [];
}

{% endhighlight %}

-----------------------

这里是`javascript`闭合区域的简单例子：<a class="btn btn-primary btn-sm" href="/resources/demo{{ page.url}}-polygon.html" target="_blank">查看DEMO</a> 

-----------------------

> 设置可售区域座位：

{% highlight html %}

{% endhighlight %}

> 设置座位票价、是否套票、情侣票：

{% highlight html %}

{% endhighlight %}

### OK,今天就先说到这儿 :)

-----------------------


