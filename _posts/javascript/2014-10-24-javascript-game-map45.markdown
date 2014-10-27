---
layout: page
title:  "javascript进阶.游戏.斜45度地图拼接"
description: "javascript game map 斜45度地图拼接"
keywords: javascript,game,map,斜45度地图拼接
origin: 张嘉杰.原创
date:   2014-10-24
category: javascript
tags: javascript game
---
很多玩过`大话西游`的朋友都知道，游戏的场景基本都是基于斜45度视角来的，这是一种增强立体感的技术，今儿打算用`html+javascript`实现斜45度地图（后续会用`css3`来实现）。
<!--more-->

> 实现过程

![多色菱形]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-0.png)  

下面有切图的例子：  
 
-----------------------

<a class="btn btn-primary btn-sm" href="/resources/demo{{ page.url}}-position.html" target="_blank">查看DEMO</a> 

-----------------------

`css`部分

{% highlight css %}

* { font-size: 9pt }
div.tile {
	position: absolute;
	background-image: url(http://www.jcore.cn/resources/images/2014/10/24/javascript-game-map45-0.png);
	width: 64px;
	height: 32px;
	line-height: 32px;
	text-align: center;
	border: 1px solid #000;
}

.d1 { background-position: -0px -0px; }
.d2 { background-position: -64px -0px; }
.d3 { background-position: -128px -0px; }
.d4 { background-position: -192px -0px; }
.d5 { background-position: -256px -0px; }
.d6 { background-position: -0px -32px; }
.d7 { background-position: -64px -32px; }
.d8 { background-position: -128px -32px; }
.d9 { background-position: -192px -32px; }
.d10 { background-position: -256px -32px; }
.d11 { background-position: -0px -64px; }
.d12 { background-position: -64px -64px; }
.d13 { background-position: -128px -64px; }
.d14 { background-position: -192px -64px; }
.d15 { background-position: -256px -64px; }
.d16 { background-position: -0px -96px; }
.d17 { background-position: -64px -96px; }
.d18 { background-position: -128px -96px; }
.d19 { background-position: -192px -96px; }
.d20 { background-position: -256px -96px; }
.d21 { background-position: -0px -128px; }
.d22 { background-position: -64px -128px; }
.d23 { background-position: -128px -128px; }
.d24 { background-position: -192px -128px; }
.d25 { background-position: -256px -128px; }
	
{% endhighlight %}

`html`部分

{% highlight html %}

	<div id="viewport" ></div>

{% endhighlight %}

{% highlight javascript %}

if (typeof String.prototype.format !== "function") {
    /* 字符串模板 */
    String.prototype.format = function () {
      var s = this, //字符串指针
          length = arguments.length; //参数长度
      while (--length >= 0){
        s = s.replace(new RegExp('\\{' + length + '\\}', 'g'), arguments[length]);
      }
      return s;
    };
}

  var vptx = 0, // x轴
      vpty = 0; // y轴
      tilePool = []; // 格子数量
      tileWidth = 64,  // 格子图片宽
      tileHeight = 32, // 格子图片高
      viewportTileWidth = 10,  // 地图宽数量
      viewportTileHeight = 10, // 地图高数量
      viewportWidth = (viewportTileWidth + 1) * tileWidth;    // 地图实际宽
      viewportHeight = (viewportTileHeight + 1) * tileHeight, // 地图实际高
      viewportOffsetX = viewportWidth / 2 - tileWidth / 2; // 修正地图显示x区域
      viewportOffsetY = 0; // 默认地图显示y区域

    for (var i = 0; i <= viewportTileHeight; i++) {
        for (var j = 0; j <= viewportTileWidth; j++) {
          var tx = vptx + j, // x坐标
              ty = vpty + i, // y坐标
              tl = (viewportOffsetX + (tx - ty) * tileWidth / 2),  // 左距离
              tr = (viewportOffsetY + (tx + ty) * tileHeight / 2), // 右距离
               d = Math.round(Math.random()*24)+1; // 随机显示颜色格子
             tml = '<div class="tile d{0}" id="t_{1}_{2}" style="display: block; left: {3}px; top: {4}px;">[{5},{6}]</div>'
                  .format(d,tx,ty,tl,tr,tx,ty); // 替换模板
          tilePool.push( tml ); // 加入数组
        }
    }
	
var viewport = document.getElementById("viewport");
viewport.style.width = "" + viewportWidth + "px"; // 设置显示区域宽
viewport.style.height = "" + viewportHeight + "px"; // 设置显示区域高
viewport.innerHTML = tilePool.join("");
{% endhighlight %}	

-----------------------

<a class="btn btn-primary btn-sm" href="/resources/demo{{ page.url}}-tile.html" target="_blank">查看DEMO</a> 

-----------------------

### OK，今儿先到这儿了，后续会用`css3`来实现斜45度地图。:)

-----------------------

