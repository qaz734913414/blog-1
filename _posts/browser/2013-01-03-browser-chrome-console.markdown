---
layout: page
title:  "Chrome DevTools之Console"
description: "Chrome DevTools之Console"
keywords: chrome,console
origin: 张嘉杰.原创
date:   2013-01-03
category: browser
tags: chrome console
---
`Chrome DevTools`已经强大到没有朋友的地步了。适时的运用它，可以有效的提高开发效率，让BUG无处遁形。先说说`console`的具体用法吧。  
<!--more-->

> console.log 用法

{% highlight bash %}

# 输出普通信息
console.log("log...");

# 输出提示信息
console.info("info...");

# 输出警示信息
console.error("error...");

# 输出错误信息
console.warn("warn...");

{% endhighlight %}

![console-log]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-0.jpg)

不清楚`Chrome DevTools` 是什么的朋友，先来上个课，[Chrome DevTools School]。  

###好了今天先到这里了 :)

-----------------------

相关参考文章地址：

chrome-devTools-school - <http://discover-devtools.codeschool.com/>
console-api - <https://developer.chrome.com/devtools/docs/console-api/>  
commandline-api - <https://developer.chrome.com/devtools/docs/commandline-api/>  

-----------------------

[Chrome DevTools School]: http://discover-devtools.codeschool.com/