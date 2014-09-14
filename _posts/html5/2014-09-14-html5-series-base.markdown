---
layout: page
title:  "html5系列.基础知识"
description: "html5系列.基础知识"
keywords: html5,html5基础,webstorm
origin: 张嘉杰.原创
date:   2014-09-14
category: html5
tags: html5
---
简单说一下`html5`的性特性：`新内容标签`、`表单控件`、`多媒体（音频、视频）`、`canvas`、`离线存储`。至于浏览器支持方面：IE（9版本以下不支持）、Safari、Chrome、Firefox、Opera等现代浏览器。
<!--more-->

> 创建一个html5页面 

{% highlight html %}

<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title></title>
  </head>
  <body>
  ......
  </body>
</html>

{% endhighlight %}

> html5新的表单元素

{% highlight html %}

<datalist>	标签定义可选数据的列表
<keygen>	标签定义生成密钥
<output>	标签定义不同类型的输出

{% endhighlight %}

> html5新的 (input type=类型) 元素

{% highlight html %}

<input type="number" name="quantity" />
<input type="date" name="bday" />
<input type="color" name="favcolor" />
<input type="range" name="points" />
<input type="month" name="bdaymonth" />
<input type="week" name="week_year" />
<input type="datetime" name="bdaytime" />
<input type="datetime-local" name="bdaytime" />
<input type="email" name="email" />
<input type="search" name="googlesearch" />
<input type="tel" name="usrtel" />
<input type="url" name="homepage" />

{% endhighlight %}
-----------------------

相关参考文章地址：

w3schools-html5 - <http://www.w3schools.com/html/html5_geolocation.asp>

-----------------------

