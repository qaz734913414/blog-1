---
layout: page
title:  "javascript进阶.多线程"
description: "多线程 伪多线程 javascript多线程"
keywords: javascript,多线程,伪多线程
origin: 张嘉杰.原创
date:   2013-04-06
category: javascript
tags: javascript 多线程
---
今儿下班路上，以前的一位同事电话问起`javascript`是否可以多线程（项目中碰到多个倒计时秒杀），首先可以肯定的是`html5`之前，浏览器端的`javascript`一定是单线程的。今天这里先不讨论`html5`之后的多线程问题。
<!--more-->

> javascript 模拟实现多线程的方案

{% highlight html %}

1. command模式
2. setTimeout
3. setInterval

{% endhighlight %}

> 封装了一个简单的模拟多线程函数

{% highlight javascript %}

// 模拟多线程函数
function Thread(_task, _delay, _times){
    this.runFlag = false; // 执行标识
    this.busyFlag = false; // 恢复标识
    this.taskArgs = Array.prototype.slice.call(arguments, 3);
    
    if (_times != undefined) {
        this.times = _times;
    } else { 
        this.times = 1;
    }
    
    var _point = this;
    
    this.timerID = -1; // 定时器内部标识
    
	// 开始函数
    this.start = function(){
        if (this.runFlag == false) {
            this.timerID = window.setInterval(_point.run, _delay);
            this.runFlag = true;
        }
    }
    
	// 执行函数
    this.run = function(){
        if (_point.busyFlag) 
            return;
        if (_point.times == -1)// 无限循环
        {
            _task(_point.taskArgs);
        } else {
            if (_point.times > 0) {
                _task(_point.taskArgs);
                _point.times -= 1;
                if (_point.times == 0) {
                    window.clearInterval(this.timerID); 
                }
            }
        }
    }
    
	// 休眠函数
    this.sleep = function(){
        this.busyFlag = true;
    }
    
	// 恢复函数
    this.resume = function(){
        this.busyFlag = false;
    }
    
	// 终止函数
    this.abort = function(){
        window.clearInterval(this.timerID);
    }
}

{% endhighlight %}

-----------------------

<a class="btn btn-primary btn-sm" href="/resources/demo{{ page.url}}.html" target="_blank">查看DEMO</a> 

-----------------------
