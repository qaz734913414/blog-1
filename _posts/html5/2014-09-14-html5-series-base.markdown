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

> 兼容性问题 

![html5标签兼容性]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-0.png)    

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

> html5新元素

{% highlight html %}

<datalist>	标签定义可选数据的列表。
<keygen>	标签定义生成密钥。
<output>	标签定义不同类型的输出。
<article>	标签定义外部的内容。
<aside>		标签定义 article 以外的内容。aside 的内容应该与 article 的内容相关。
<details>	标签定义元素的细节，通过点击进行隐藏。
<dialog>	标签定义对话框或窗口。
<figcaption>	标签定义 figure 元素的标题。
<figure>	标签用于对元素进行组合。使用 figcaption 元素为元素组添加标题。
<footer>	标签定义 section 或 document 的页脚。
<header>	标签定义 section 或 document 的页眉。
<main>		标签定义文档的主要内容。
<meter>		标签定义度量衡。可在 min/max 属性中定义。
<nav>		标签定义导航链接的部分。
<rp>		标签定义在 ruby 注释中使用。
<rt>		标签定义字符（中文注音或字符）。
<ruby>		标签定义 ruby 注释（中文注音或字符）。
<section>	标签定义文档中的章节、页眉、页脚或文档中的其他部分。
<summary>	标签定义包含 details 元素的标题。
<time>		标签定义日期或时间。
<mark>		标签定义标记或高亮显示文本。此标签很常用，在搜索中可以高亮显示搜索关键词。
<progress>	标签运行中的进程。此标签来显示 javascript 中耗费时间的函数的进程。
--------------------------------------------------------------------------
<video>		标签定义视频。
<audio>		标签定义声音。
<source>	标签为媒介元素（<video>、<audio>）定义媒介资源。
<canvas>	标签定义图形。

{% endhighlight %}

这里我推荐两款之前常用的视频、音频插件：

<http://html5media.info/>  
<http://www.videojs.com/>


今天就到这儿吧。还有一些其他细节性的新属性，请大家戳这里 （[specification-html5] 、[w3schools-html5]）。

-----------------------

相关参考文章地址：

specification-html5 - <http://www.whatwg.org/specs/web-apps/current-work/multipage/>  
w3schools-html5 - <http://www.w3schools.com/html/html5_geolocation.asp>

-----------------------

[specification-html5]: http://www.whatwg.org/specs/web-apps/current-work/multipage/
[w3schools-html5]: http://www.w3schools.com/html/html5_geolocation.asp
