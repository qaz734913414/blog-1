---
layout: page
title:  "html5系列.存储"
description: "html5系列.存储"
keywords: html5,html5进阶,localStroage,sessionStroage
origin: 张嘉杰.原创
date:   2014-09-16
category: html5
tags: html5
---
客户端存储大多是依赖`cookie`来完成，`cookie`不适合大数据存储。依赖多服务器的请求来完成，速度不快且效率不高。`html5`之后新的储存的新方法：`localStroage`、`sessionStroage`。`localStroage`是没有时间限制的存储，`sessionStroage`针对单个`session`的数据存储，关闭浏览器存储数据消失。
<!--more-->

> localStroage、sessionStroage 使用方法

{% highlight html %}
#存储value到指定key
setItem : function(key, value)

#获取指定key的value
getItem : function(key)

#删除指定key的value
removeItem : function(key)

#清除所有的key/value
clear : function()

#数据所有的key
key : function(i)

#数据长度
length : int

{% endhighlight %}

###下面有简单的例子 :)

-----------------------

<a class="btn btn-primary btn-sm" href="/resources/demo{{ page.url}}.html" target="_blank">查看DEMO</a> 

-----------------------
