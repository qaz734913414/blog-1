---
layout: column_1_2
title:  "javascript进阶.立即调用的函数表达式"
description: "javascript 立即调用 函数表达式"
keywords: javascript,立即调用,函数表达式
origin: 张嘉杰.原创
date:   2014-12-12
category: javascript
tags: javascript
---

周末和同事赖宝谈到了`javascript``匿名函数`和`闭包`的问题，首先`匿名函数`的好处在于，可以减少局部变量，以免污染现有的运行环境。`匿名函数`最大的用途是创建`闭包`。
<!--more-->
（这是`javascript`语言的特性之一）。`jQuery`等库都用到了这样的原理。下面直接来看一些常见和特殊的立即调用的函数表达式。

{% highlight javascript %}

// 常见的几种写法 
new function(){ ... }();
var f = function(){ ... }();
(function(){ ... }());
(function(){ ... })();
;(function(){ ... }());

// 对于返回值没有特别的要求的可以这样写
!function(){ ... }();  // => true
~function(){ ... }();  // => -1
+function(){ ... }();  // => NaN
-function(){ ... }();  // => NaN

// 稍微特殊一点儿的可以这样写
delete function(){ ... }(); // => true
typeof function(){ ... }(); // => "undefined"
void function(){ ... }();   // => undefined

1, function() {}();  // => undefined
1 ^ function() {}(); // => 1
1 > function() {}(); // => false

[function(){ ... }()]; // => 返回数组

{% endhighlight %}

-----------------------

### OK，今儿先到这儿了。:) 

-----------------------

相关参考文章地址：

Immediately-Invoked Function Expression - <http://benalman.com/news/2010/11/immediately-invoked-function-expression/>
self-executing anonymous functions - <http://www.paulirish.com/2010/10-things-i-learned-from-the-jquery-source/>
