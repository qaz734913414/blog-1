---
layout: page
title:  "javascript进阶.遍历效率"
description: "遍历效率 循环效率 javascript遍历效率"
keywords: javascript,循环,效率
origin: 张嘉杰.原创
date:   2013-04-05
categories: javascript
tags: javascript 高效率
---
在前端开发过程中，大家经常都会用到循环遍历一些`dom`、`html`片段等等，但是关于`javascript`循环的效率问题，可能很多人都不太关心这些细节。下面我用一段代码来演示一下，每种循环的执行时间。大家可以参考一下。  
<!--more-->

脚本如下：
{% highlight javascript %}

function log(out){ console.log(out);  }
if (typeof String.prototype.format !== "function") {
    /* 字符串模板 */
    String.prototype.format = function () {
        var s = this, //字符串指针
            length = arguments.length; //参数长度
        while (--length >= 0){
            s = s.replace(new RegExp('\\{' + length + '\\}', 'g'), arguments[length]);
        }
        return s;
    };
}
/* 执行计时器 */
function Timer(){
    var _beginTime; //开始时间
    //开始计时函数
    this.begin = function(){
        _beginTime = new Date().getTime(); //初始化开始时间
    };
    //结束及时函数
    this.end = function(out){
        var _outStr = out || "";
        var _endTime = new Date().getTime() - _beginTime; //初始化结束时间（新时间-开始时间）
        log("[执行时间为{0}毫秒...] {1}".format(_endTime,_outStr));
    };
}

/* 构造空数组 */
function makeArr(num) {
    var arr = [];
    for (var i = num; i--;){
        arr.push('test');
    }
    arr.join('');
    return arr;
}
var arr = makeArr(10000000);//创建测试数组
var time = new Timer(); //创建计时对象

//循环表达式模板（五种类型的循环，不执行操作，只遍历数组）
var forTemplates = [
    "for (var i in arr) {};",
    "for (var i = 0, a; a = arr[i++];) {}",
    "for (var i = 0; i < arr.length; i++) {}",
    "for (var i = 0, len = arr.length; i < len; i++) {}",
    "for (var i = arr.length; i--;) {}"
];

//按执行效率测试
//-----------------------------------1
time.begin();
window.eval( forTemplates[0] );
time.end( forTemplates[0] );
//-----------------------------------2
time.begin();
eval( forTemplates[1] );
time.end( forTemplates[1] );
//-----------------------------------3
time.begin();
eval( forTemplates[2] );
time.end( forTemplates[2] );
//-----------------------------------4
time.begin();
eval( forTemplates[3] );
time.end( forTemplates[3] );
//-----------------------------------5
time.begin();
eval( forTemplates[4] );
time.end( forTemplates[4] );

{% endhighlight %}

执行结果截了张图，供大家参考： 
<a href="{{ "/resources/demo" | prepend: site.staticurl }}{{ page.url }}.html" target="_blank">运行例子</a>

![javascript高率遍历]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-0.png)

-----------------------
