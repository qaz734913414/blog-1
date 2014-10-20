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
前几年`Ajax`流行的时候，刮起了一阵异步风暴，随着`Node.js`的流行，又刮来一大波异步风暴。随着页面异步功能的相互依赖，代码逻辑如果控制的不合理，就会陷入无穷的回调地狱中。
<!--more-->

> 经典的callback异步队列实现（金字塔回调模式）

{% highlight html %}

loadImg('a.jpg', function() {
    loadImg('b.jpg', function() {
        loadImg('c.jpg', function() {
            console.log('all done!');
        });
    });
});

{% endhighlight %}

-----------------------

相关参考文章地址：

Callback-Hell - <http://www.callbackhell.com/>
JavaScript-Promises - <http://qed.dk/poul-foged/2014/03/03/en-sammenligning-af-JavaScript-promise-biblioteker/>

-----------------------

