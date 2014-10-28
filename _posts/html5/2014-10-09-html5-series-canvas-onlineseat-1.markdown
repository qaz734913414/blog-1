---
layout: column_1_2
title:  "html5系列.画布进阶.在线选座购票实现（一）"
description: "html5系列.画布进阶.在线选座购票"
keywords: html5,html5进阶,canvas,画布,在线选座,选座购票,在线选座购票
origin: 张嘉杰.原创
date:   2014-10-09
category: html5
tags: html5 在线选座
---
身边的朋友经常周末都会购买电影票，一般到影院购买经常会出现排长队的囧状，所以有些朋友会选择影院提供的在线选座购票、或者在影院合作的第三方平台购票，像时光网、网票网、美团、糯米等等。在线选座购票的实现方案也各不相同`div+javascript`、`canvas+javascript`、`flash`。
<!--more-->
这里我用`html5`的`canvas+javascript`来实现在线选座购票过程。

> 实现思路：

{% highlight html %}

# 后端（javascript + java）
1. 设置影院场馆（影院场馆可售区域）
2. 设置可售区域座位
3. 设置座位票价、是否套票、情侣票
----------------------------------------------------------------------------------------------
# 前端（javascript + canvas）
1. 画出影院场馆（影院场馆可售区域）
2. 点击影院场馆可售区域，显示该区域座位（影院场馆区域、影院场馆座位区域可拖动）
3. 点击影院场馆座位，跳转支付

{% endhighlight %}

> 使用技术：

{% highlight html %}

+-----------+---------+-------------------------+
|  Project  | Version |       Description       |
+-----------------------------------------------+
|  jQuery   | 1.11.1  |  javaScript Framework   |
+-----------------------------------------------+
|   Java    | 1.7.55  |           JDK           |
+-----------------------------------------------+

{% endhighlight %}

> 设计图稿：

后端：  

![onlineseat-0]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-0.jpg)  

前端：  

![onlineseat-1]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-1.jpg)  

### OK,今天就先说到这儿 :)

-----------------------


