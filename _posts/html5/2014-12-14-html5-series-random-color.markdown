---
layout: column_1_2
title:  "html5系列.画布.随机（位置、蠕动、颜色）的点"
description: "html5系列.画布.随机点（位置、蠕动、颜色）的点"
keywords: html5,canvas,画布,随机位置,随机蠕动,随机颜色
origin: 张嘉杰.原创
date:   2014-12-14
category: html5
tags: html5 canvas random color
---
和老同事一起吃饭的时候，谈起他当年去A类公司面试的一道题目，当时没有在规定的时间内完成。要求：在`canvas`画布上，随机生成固定大小的点，随机位置，随机蠕动，随机颜色。
<!--more-->

> 实现过程

`css`样式

{% highlight html %}

<style type="text/css">
  canvas { position:absolute; top:0px; left:0px; background-color:black; }
</style>

{% endhighlight %}

`html`部分：

{% highlight html %}

<canvas id="c" width="auto" height="auto"></canvas>

{% endhighlight %}

`javascript`部分：

{% highlight javascript %}

(function( global, doc ){

    var c = doc.getElementById('c'),
        cx = c.getContext('2d'),
        points = { // 点对象
            speed  : 5, // 移动步长
            size   : 1, // 点的大小
            length : 5000 // 点数量
        },
        walkers = []; // 所有点步长数组

    c.width = global.innerWidth;
    c.height = global.innerHeight;

    // 获取随机区间数
    function RandomInt(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    // 获取随机区间颜色
    function RandomColor() {
        var r = RandomInt(0, 255),
            g = RandomInt(0, 255),
            b = RandomInt(0, 255);
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }

    // 设置随机点出现的位置
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }

    // 设置单个点的步长范围和颜色
    function Walker(posX, posY, color) {
        this.speed = points.speed; // 步长
        this.size  = points.size;  // 点的大小
        this.color = color; // 颜色
        this.point = new Point(posX, posY); // 随机位置点
        this.update = function() { // 更新点的位置和颜色
            this.point.x += RandomInt(-this.speed, this.speed);
            this.point.y += RandomInt(-this.speed, this.speed);
            cx.fillStyle = this.color;
            cx.fillRect(this.point.x, this.point.y, this.size, this.size);
        }
    }

    // 循环创建每个点的 随机位置 随机颜色
    for(var i = 0; i < points.length; i++) {
        var w = new Walker(RandomInt(0, c.width), RandomInt(0, c.height), RandomColor());
        walkers.push(w); // 添加数组
    }

    global.setInterval(function(){
        for(var i = 0; i < walkers.length; i++) {
            walkers[i].update(); //
        }
    }, 1000/60);

})(window, document);

{% endhighlight %}

-----------------------

<a class="button" href="/resources/demo{{ page.url}}.html" target="_blank">查看DEMO</a>

-----------------------

### 还是蛮简单的吧。OK,今天就先说到这儿 :)

-----------------------
