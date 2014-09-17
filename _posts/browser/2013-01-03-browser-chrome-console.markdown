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

> <font color="#fa8072">console.log</font>

{% highlight html %}

# 输出普通信息
console.log("log...");
# 输出提示信息
console.info("info...");
# 输出警示信息
console.warn("warn...");
# 输出错误信息
console.error("error...");

{% endhighlight %}

![console-log]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-0.jpg)    

> <font color="#fa8072">console.group & console.groupEnd</font>

{% highlight html %}

# 分组输出
console.group("core.dom");
console.log("core.dom begin...");
console.log("core.dom end...");
console.groupEnd();
console.group("core.init");
console.log("core.init...");
console.groupEnd();

{% endhighlight %}

![console-log]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-1.jpg)   

> <font color="#fa8072">console.assert</font>

{% highlight html %}

console.assert(1==="1",'1==="1"，条件不成立...');

{% endhighlight %}

![console-log]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-2.jpg)   

> <font color="#fa8072">console.table</font>

{% highlight html %}

# 表格输出
console.table([{'用户': '测试用户1', '访问': 74}, {'用户': '测试用户2', '访问': 90}]);

{% endhighlight %}

![console-log]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-3.jpg)   

> <font color="#fa8072">console.count</font>

{% highlight html %}

# 执行次数
function test(){ console.count('test函数被执行的次数：'); }
test();test();test();test();

{% endhighlight %}

![console-log]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-4.jpg)   


> <font color="#fa8072">console.dir | console.dirxml</font>

{% highlight html %}

# 节点输出
console.dir(document.body);
console.dirxml(document.body);

{% endhighlight %}

![console-log]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-5.jpg)   

> <font color="#fa8072">console.time & console.timeEnd</font>

{% highlight html %}

# 执行时间
console.time("执行时间");
var arr = new Array(10000);
for (var i = arr.length; i > 0; i--) {}
console.timeEnd("执行时间");

{% endhighlight %}

![console-log]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-6.jpg)  



不清楚`Chrome DevTools` 是什么的朋友，先来上个课，[Chrome DevTools School]。  

###好了今天先到这里了 :)

-----------------------

相关参考文章地址：

chrome-devTools-school - <http://discover-devtools.codeschool.com/>  
console-api - <https://developer.chrome.com/devtools/docs/console-api/>  
commandline-api - <https://developer.chrome.com/devtools/docs/commandline-api/>  

-----------------------

[Chrome DevTools School]: http://discover-devtools.codeschool.com/