---
layout: page
title:  "html5系列.画布"
description: "html5系列.画布"
keywords: html5,html5进阶,canvas,画布
origin: 张嘉杰.原创
date:   2014-10-08
category: html5
tags: html5
---
`html5``<canvas>`标签主要用于图形绘制，`canvas`画布通过`javascript`来绘制`2D`图形。`canvas`拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法。后面会为大家送上连续完整的实例。
<!--more-->

> 创建 canvas 元素

{% highlight html %}

# 创建canvas标签
<canvas id="myCanvas" width="200" height="200"></canvas>

{% endhighlight %}

> 浏览器查看方式

![console-resources]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-0.png)    

# # # 下面有简单的例子 :)

-----------------------

<a class="btn btn-primary btn-sm" href="/resources/demo{{ page.url}}.html" target="_blank">查看DEMO</a>   

-----------------------

> <font color="# fa8072">封装了个简单逻辑的脚本</font>

判断浏览器端是否支持`Storage`对象，支持则默认使用`localStore`，不支持则使用`Cookie`。  

{% highlight javascript %}



{% endhighlight %}

使用方法：

{% highlight javascript %}


	
{% endhighlight %}

-----------------------
