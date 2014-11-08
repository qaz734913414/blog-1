---
layout: column_1_2
title:  "javascript进阶.游戏.斜45度地图人物移动"
description: "javascript game map 斜45度地图人物移动"
keywords: javascript,game,map,斜45度地图人物移动
origin: 张嘉杰.原创
date:   2014-11-06
category: javascript
tags: javascript game 算法 Astar move
---
实现人物移动的过程，直白点说就是：点击屏幕人物移动到相应的地方，这里涉及到`坐标转换`、`动画循环`。今儿我继续在45度地图点击寻路之后，加入人物移动，和人物到达目的地够自动执行函数。  
<!--more-->

好了大家先来看一下，鼠标点击屏幕，小球移动到相应的坐标，八方向动画函数的实现过程。

> 移动的小球

`css`部分

{% highlight css %}

*{ margin: 0;padding: 0; }
body { width: 400px; height: 400px; border: 1px solid #000000;}
#role { position: absolute; width: 20px; height: 20px; background: #ff8b04; -moz-border-radius: 20px; -webkit-border-radius: 20px; border-radius: 20px;}

{% endhighlight %}

`html`部分

{% highlight html %}

<div id="role"></div>

{% endhighlight %}

`javascript`部分

{% highlight javascript %}

var move = new moving({ x: 0, y : 0 }, 100);
var role = document.getElementById("role"); // 人物对象
document.body.onmouseup = function(e) {

    console.log("start...");

    move.start({ x: e.pageX, y : e.pageY });
    move.update(function(point){
        role.style.left = point.x + "px";
        role.style.top  = point.y + "px";
    });
    move.finish(function(){
        console.log("end...");
    });
};

// 移动函数
function moving(startPoint, fps){

    var _nowPoint = startPoint,  // 起始坐标
        // 临时变量
        _endPoint, // 结束坐标
        _direction, // 人物方向
        _onupdate, // 执行过程函数
        _onfinish, // 到达目标回调函数
        _timer,
        // 内部对象
        self = this;

    // 移动函数
    this.move = function(){

        if(Math.abs(_nowPoint.x - _endPoint.x) <=1 &&
           Math.abs(_nowPoint.y - _endPoint.y) <=1 ) // 判断到达结束目标
        {
            self.end(); // 执行结束函数
        }else if(Math.abs(_nowPoint.x - _endPoint.x) <= 1){
            if(_nowPoint.y < _endPoint.y) _direction = 0; else _direction = 3;
        }else if(Math.abs(_nowPoint.y - _endPoint.y) <= 1){
            if(_nowPoint.x < _endPoint.x) _direction = 2; else _direction = 1;
        }else{
            if(_nowPoint.x > _endPoint.x){
                if(_nowPoint.y < _endPoint.y) _direction = 4; else _direction = 6;
            }else{
                if(_nowPoint.y < _endPoint.y) _direction = 5; else _direction = 7;
            }
        }

        switch (_direction){ // 判断移动方向
            case 0: _nowPoint.y +=1; break; // 下
            case 1: _nowPoint.x -=1; break; // 左
            case 2: _nowPoint.x +=1; break; // 右
            case 3: _nowPoint.y -=1; break; // 上
            case 4: _nowPoint.x -=1; _nowPoint.y +=1; break; // 左下
            case 5: _nowPoint.x +=1; _nowPoint.y +=1; break; // 右下
            case 6: _nowPoint.x -=1; _nowPoint.y -=1; break; // 左上
            case 7: _nowPoint.x +=1; _nowPoint.y -=1; break; // 右上
        }

        if(_onupdate) _onupdate(_nowPoint);
    }

    // 执行函数
    this.start = function(endPoint, onfinish){
        _endPoint = endPoint; // 赋值结束坐标
        _onfinish = onfinish; // 结束函数
        window.clearInterval(_timer); // 清空定时器
        _timer = window.setInterval(this.move, 1000/fps); // 执行移动函数
    }

    // 终止函数
    this.end = function(){
        window.clearInterval(_timer); // 清空定时器
        if(_onfinish) _onfinish(); // 执行回调函数
    }

    // 更新函数
    this.update = function(callback){
        _onupdate = callback;
    }

    // 结束函数
    this.finish = function(callback){
        _onfinish = callback;
    }

}

{% endhighlight %}

-----------------------

<a class="button" href="/resources/demo{{ page.url}}.html" target="_blank">查看DEMO</a>

-----------------------

### OK，今儿先到这儿了。:) 

-----------------------
