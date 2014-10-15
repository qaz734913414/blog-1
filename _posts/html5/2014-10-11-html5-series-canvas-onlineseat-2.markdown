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
`canvas+javascript`在线选座购票后端实现，利用`canvas`的绘图方法，标出场馆热点区域，框选热点区域内可售座位，批量设置票价，保存座位数据。
<!--more-->

> 设置影院场馆（影院场馆可售区域）：

简单的`canvas`来画场馆热点闭合区域。  
`html`部分：

{% highlight html %}

<canvas id="canvas" width=300 height=300 style="border:1px solid #000; background-color: ivory;"></canvas>

{% endhighlight %}

`javascript`部分：

{% highlight javascript %}

//闭合区域简单实现
var canvas = document.getElementById("canvas"), // canvas 元素
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

<a class="btn btn-primary btn-sm" href="/resources/demo{{ page.url}}-polygon.html" target="_blank">查看DEMO</a> 

-----------------------

> 设置可售区域座位：

简单的`canvas`来画所有座位区域（10x10的格子）。  
`html`部分：

{% highlight html %}

<canvas id="canvas" width="500" height="500" style="border:1px solid #000; background-color: ivory;"></canvas>

{% endhighlight %}

`javascript`部分：

{% highlight javascript %}

var canvas = document.getElementById("canvas"), // canvas 元素
    context = canvas.getContext("2d"), // 创建 context 对象
    position,
    a, b,
    xnum = 10, // X轴座位个数
    ynum = 10, // Y轴座位个数
    width = 20, // 座位宽
    height = 20, // 座位高
    space = 2, // 座位间距
    imageURL = "http://www.jcore.cn/resources/images/demo/", // 图片默认路径
    seatImgs = { // 座位图片对象数组
        s1 : imageURL + "icon-seat-1.png", //可选座位
        s2 : imageURL + "icon-seat-2.png", //不可选座位
        s3 : imageURL + "icon-seat-3.png", //锁住座位
        s4 : imageURL + "icon-seat-4.png", //套票座位
        s5 : imageURL + "icon-seat-5.png", //选中座位
    };

// 座位x，y轴间距
function surface(_a, _b) {  
    return {
        x: _a * (width + space),
        y: _b * (height + space)
    };
}

// 多图片的预加载函数
function loadImages(sources, callback){
  var count = 0, images ={}, imgNum = 0;
  for(src in sources){ imgNum++; }
  for(src in sources){
    images[src] = new Image();
    images[src].src = sources[src];
    if(images[src].complete){  //是否有缓冲存在
      if(++count >= imgNum){
        callback(images); //满足数量直接返回
      }
      continue;
    }
    images[src].onload = function(){
      if(++count >= imgNum){
        callback(images);
      }
    };
  }
}

// 图片加载以后绘图，否则为空白图片
loadImages(seatImgs,function(images){
  //遍历画座位
  for (a = 0; a < xnum; a += 1) {
      for (b = 0; b < ynum; b += 1) {
          position = surface(a, b);
          context.fillStyle = "#008899"; // 设置默认座位颜色
          context.fillRect(position.x, position.y, width, height);
          context.drawImage(images["s1"], position.x, position.y, width, height);
      }
  }
});

{% endhighlight %}

-----------------------

<a class="btn btn-primary btn-sm" href="/resources/demo{{ page.url}}-seatarea.html" target="_blank">查看DEMO</a> 

-----------------------

### OK,今天就先说到这儿 :)

-----------------------


