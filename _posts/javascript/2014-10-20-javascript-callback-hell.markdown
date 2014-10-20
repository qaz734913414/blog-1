---
layout: page
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

在`Promises`规范中，每个任务都有三种状态：默认(pending)、完成(fulfilled)、失败(rejected)。  

> 简单的事件队列管理实现

{% highlight javascript %}



{% endhighlight %}

-----------------------

相关参考文章地址：

Callback-Hell - <http://www.callbackhell.com/>  
JavaScript-Promises - <http://qed.dk/poul-foged/2014/03/03/en-sammenligning-af-JavaScript-promise-biblioteker/>

-----------------------

[回调地狱]:  http://www.callbackhell.com/

