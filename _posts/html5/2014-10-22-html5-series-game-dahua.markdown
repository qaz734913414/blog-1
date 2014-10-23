---
layout: page
title:  "html5系列.画布进阶.游戏.人物移动（媚灵狐）"
description: "html5系列.画布进阶.游戏.人物移动（媚灵狐）"
keywords: html5,html5进阶,canvas,画布,游戏,人物移动,大话西游,媚灵狐
origin: 张嘉杰.原创
date:   2014-10-22
category: html5
tags: html5 game 大话西游 媚灵狐
---
还依稀记得高中那会儿特别火爆的网易游戏回合制游戏`大话西游`吗？这儿先不讨论游戏中的各种怀念的细节了。今儿打算用`canvas+javascript`来循环播放多个随机位置，八方向人物移动的动画效果。
<!--more-->

> 大话西游（媚灵狐）

先来一张当年特别喜欢的游戏中的人物。

![媚灵狐]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-0.png)  

> 八方向（媚灵狐）

![媚灵狐-八方向]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-1.png)  

> 动画实现过程

`css`样式

{% highlight html %}

<style type="text/css">
  body { margin:1em; background:#eee; }
  #game {border:1px solid black;width:786px; height:793px; }
  #game canvas { display:block;  }
</style>

{% endhighlight %}

`html`部分：

{% highlight html %}

<p id="fps">--- fps</p> 
<div id="game">
  <canvas id="gameCanvas"></canvas>
</div>

{% endhighlight %}

`javascript`部分：

{% highlight javascript %}

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
    images[src].onload = function(){ // 图片加载完成
      if(++count >= imgNum){
        callback(images);
      }
    };
  }
}

var game = document.getElementById('game'), 
    fps  = document.getElementById('fps'), // 动画帧数
    canv = document.getElementById('gameCanvas'), // canvas 元素
    ctx  = canv.getContext('2d'), // 创建 context 对象
    gameImgs = { //背景图、八方向动画图
      bg : "http://www.jcore.cn/resources/images/2014/10/22/html5-series-game-dahua-0.png",
      mlh : "http://www.jcore.cn/resources/images/2014/10/22/html5-series-game-dahua-1.png"
    },
    sprites = [], // 人物数组
    size = { w:206, h:160, frames:8 }, // 帧数宽、高、帧个数
    avgDelay = 0, lastDraw = new Date;
// 图片加载以后绘图，否则为空白图片
loadImages(gameImgs,function(images){
  var bg = images["bg"];
  canv.width = bg.width; // 设置画布宽
  canv.height = bg.height; // 设置画布高
  ctx.drawImage(bg,0,0); // 画出背景图
  
  initSprites(images,function(){ // 初始化人物函数
    setInterval(function(){ 
      drawFrame(images); // 绘图函数
    },1000/30);
  });
  
});
// 初始化人物函数
function initSprites(images,callback){
  var bg = images["bg"]
  // 画出人物
  var padding = 200; // 人物活动范围
  for (var i=0;i<20;++i){ // 创建多个人物
    sprites[i] = {
      x : Math.random() * (bg.width-padding) + padding/2, // 人物活动范围内，随机x轴
      y : Math.random() * (bg.height-padding) + padding/2, // 人物活动范围内，随机y轴
      f : Math.round( Math.random() * 3 ) // 随机偏移值
    };
  }
  if(callback) callback();
}
// 绘图函数
function drawFrame(images){
  var bg = images["bg"], mlh = images["mlh"]; // 图片对象
  ctx.drawImage(bg,0,0); // 清空背景画布
  for (var i=0,len=sprites.length;i<len;++i){ // 遍历人物
    var s = sprites[i];
    s.x += Math.random() * 4 - 2; // 随机设置人物x轴
    s.y += Math.random() * 4 - 2; // 随机设置人物y轴
    if (s.x+size.w >= bg.width) s.x -= 10; // 控制x轴不超出活动范围
    if (s.y+size.h >= bg.height) s.y -= 10; // 控制y轴不超出活动范围
    var offset = (s.f++ % size.frames)*size.w; // 偏移值
    ctx.save();
    ctx.scale(.8,.8); // 人物大小
    ctx.drawImage(mlh, offset, 0, size.w, size.h, s.x, s.y, size.w, size.h ); // 人物按帧数播放
    ctx.restore();
  }
  // FPS
  var now = new Date, delay = (now - lastDraw);
  avgDelay += (delay - avgDelay) / 10;
  lastDraw = now;
  fps.innerHTML = (1000/avgDelay).toFixed(1) + " fps";
};


{% endhighlight %}

-----------------------

<a class="btn btn-primary btn-sm" href="/resources/demo{{ page.url}}.html" target="_blank">查看DEMO</a> 

-----------------------

### OK,今天就先说到这儿 :)

-----------------------
