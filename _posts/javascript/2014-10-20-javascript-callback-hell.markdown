---
layout: column_1_2
title:  "javascript进阶.callback回调地狱"
description: "javascript callback 回调地狱"
keywords: javascript,callback,回调地狱
origin: 张嘉杰.原创
date:   2014-10-20
category: javascript
tags: javascript ajax nodejs
---
前几年`Ajax`流行的时候，刮起了一阵异步风暴，随着`Node.js`的流行，又刮来一大波异步风暴。随着页面异步功能的相互依赖，代码逻辑如果控制的不合理，就会陷入无穷的 [回调地狱] 中。
<!--more-->

> 金字塔回调模式

{% highlight javascript %}

loadImg('a.jpg', function() {
    loadImg('b.jpg', function() {
        loadImg('c.jpg', function() {
            //...
        });
    });
});

{% endhighlight %}

当异步的任务很多的时候，维护大量的`callback`将是一场灾难。

> Promise

`Promise`规范已经出来一段时间了，流行的`Promise`类库也不少，不清楚的朋友，[戳这里](http://qed.dk/poul-foged/2014/03/03/en-sammenligning-af-JavaScript-promise-biblioteker/)。  

`Promise`规范中，每个任务都有三种状态：默认(`pending`)、完成(`fulfilled`)、失败(`rejected`)。  

> 简单的事件队列管理实现

{% highlight javascript %}

// 队列函数
function Queue(){
  
  var _queueArray = [], // 队列数组
      _errorQueueName = null // 错误队列名称消息
  
  // 添加执行队列函数
  this.add = function(queueName,queueFun){
    _queueArray.push({ // 添加队列
      name : queueName,
      fun  : queueFun
    });
    return this;
  }
  // 执行队列函数
  this.run = function(){ // 执行队列
    var _queue = _queueArray.shift(); // 队列函数
    if(!_queue) return; // 函数不存在，直接返回
    try{
      _queue.fun(); // 依次执行函数
      this.run(); // 回调自己
    }catch(e){ // 异常处理
      _errorQueueName = _queue.name; 
    }
  }
  // 全部成功，执行函数
  this.done = function(doneFun){
    this.run();
    if(!_errorQueueName) doneFun();
    return this; 
  }
  // 一个失败输出函数
  this.fail = function(failFun){
    if(_errorQueueName) failFun(_errorQueueName);
  };
}

{% endhighlight %}

使用方法：

{% highlight javascript %}

// 函数集合
var funs = {
  test1 : function(){ ... },
  test2 : function(){ ... },
  test3 : function(){ ... },
  fun_done : function(){ alert("所有函数,执行成功..."); },
  fun_fail : function(name){ alert(name + "函数,执行失败..."); }
}

var queue = new Queue(); //初始化Queue对象

queue
.add("queue_fun1",funs.test1) //队列函数1
.add("queue_fun2",funs.test2) //队列函数2
.add("queue_fun3",funs.test3) //队列函数3
.done(funs.fun_done) // 执行成功函数
.fail(funs.fun_fail); // 执行失败函数

{% endhighlight %}

-----------------------

<a class="button" href="/resources/demo{{ page.url}}.html" target="_blank">查看DEMO</a>

-----------------------

### OK，今儿先到这儿了，后续会用`Generator`对象来重构`Queue`函数 :)

-----------------------

相关参考文章地址：

Callback-Hell - <http://www.callbackhell.com/>  
JavaScript-Promises - <http://qed.dk/poul-foged/2014/03/03/en-sammenligning-af-JavaScript-promise-biblioteker/>

-----------------------

[回调地狱]:  http://www.callbackhell.com/

