---
layout: column_1_2
title:  "html5系列.画布进阶.刮刮乐"
description: "html5系列.画布进阶.刮刮乐"
keywords: html5,html5进阶,canvas,画布,游戏,刮刮乐
origin: 张嘉杰.原创
date:   2014-10-08
category: html5
tags: html5 canvas
---
今儿之前的同事电话说有个简单的需求需要实现，刮刮乐（橡皮擦）效果，刮到80%的时候执行另外一个函数（中奖、不中奖）。今儿打算用`canvas+javascript`来实现这个效果。
<!--more-->

> 刮刮乐（橡皮擦）实现过程

`html`部分：

{% highlight html %}

<canvas></canvas>

{% endhighlight %}

`javascript`部分：

{% highlight javascript %}

function imageClip(filter){

    var canvas = document.querySelector('canvas'),
        context = canvas.getContext('2d'),
        img = new Image(), // 图片对象
        finish; // 执行成功函数

    img.src = 'http://www.jcore.cn/resources/images/2014/09/20/html5-series-clip-pic-0.png'; // 设置图片
    img.onload = function(e) // 加载图片完成
    {
        var imgw = img.width,  // 图片宽
            imgh = img.height, // 图片高
            offsetX = canvas.offsetLeft, // 距离左边位置
            offsetY = canvas.offsetTop, //  距离上边位置
            mousedown = false; // 是否点击

        // 设置 canvas 宽、高、背景
        canvas.width  = imgw;
        canvas.height = imgh;
        canvas.style.backgroundImage = 'url('+img.src+')';

        // 设置模糊 颜色、透明度
        context.fillStyle = 'gray';
        context.globalAlpha = 0.6;

        // 绘制图片
        context.fillRect(0,0,imgw,imgh);

        // 模糊层绘制到 canvas 上
        context.globalCompositeOperation = 'destination-out';

        // 按下鼠标事件
        function eventDown(e){
            e.preventDefault(); // 阻止冒泡
            mousedown = true; // 设置为点击事件
        }

        // 抬起鼠标事件
        function eventUp(e){
            e.preventDefault(); // 阻止冒泡
            mousedown = false; // 设置为是否鼠标点击事件
            clearMask(); // 清空模糊层
        }

        // 清空模糊层函数
        function clearMask(){
            var num = 0, // 计数器
                datas = context.getImageData(0,0,imgw,imgh), // 噪点对象
                datasLength = datas.data.length; // 噪点数量
            for (var i = 0; i < datasLength; i++) {
                if (datas.data[i] == 0) num++; // 为0则已经清空，计数器++
            }
            if (num >= datasLength * filter) { // 噪点清空数量大于当前百分比
                if(finish) finish(); // 执行成功函数
            };
        }

        // 移动鼠标事件
        function eventMove(e){
            e.preventDefault(); // 阻止冒泡
            if(mousedown) {
                if(e.changedTouches){ // 手机事件
                    e = e.changedTouches[e.changedTouches.length-1];
                }
                var x = (e.clientX + document.body.scrollLeft || e.pageX) - offsetX || 0, // X轴坐标
                    y = (e.clientY + document.body.scrollTop  || e.pageY) - offsetY || 0; // Y轴坐标

                // 清空模糊层
                context.beginPath();
                context.arc(x, y, 30, 0, Math.PI * 2); // 画圆
                context.fill();
            }
        }

        // 绑定手机事件
        canvas.addEventListener('touchstart', eventDown);
        canvas.addEventListener('touchend', eventUp);
        canvas.addEventListener('touchmove', eventMove);
        // 绑定浏览器事件
        canvas.addEventListener('mousedown', eventDown);
        canvas.addEventListener('mouseup', eventUp);
        canvas.addEventListener('mousemove', eventMove);
    };

    this.finish = function(callback){
        finish = callback;
    }

}

{% endhighlight %}

调用方法：

{% highlight javascript %}

var clip = new imageClip(0.1);
clip.finish(function(){
  alert("clip success...");
});

{% endhighlight %}

-----------------------

<a class="button" href="/resources/demo{{ page.url}}.html" target="_blank">查看DEMO</a>

-----------------------

### OK,今天就先说到这儿 :)

-----------------------
