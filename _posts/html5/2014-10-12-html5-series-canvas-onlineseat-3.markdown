---
layout: page
title:  "html5系列.画布进阶.在线选座购票实现（三）"
description: "html5系列.画布进阶.在线选座购票"
keywords: html5,html5进阶,canvas,画布,在线选座,选座购票,在线选座购票
origin: 张嘉杰.原创
date:   2014-10-12
category: html5
tags: html5 在线选座
---
`canvas+javascript`在线选座购票前端实现，利用`canvas`画出场馆图、区域座位（普通票、套票、情侣票）。都具备拖动及缩放功能。
<!--more-->

这里就不写`java`服务端请求返回接口的方法了，直接给出返回`JSON`数据：

{% highlight javascript %}

// 接口返回的json数据
{ // 基础数据接口
  "result" : {
    "img" : "http://www.jcore.cn/resources/images/demo/onlineseat.jpg", // 场馆区域图
    "prices" : [ // 票价
      {"name":"A","color":"FF6432","price":3000,"istp":false,"ticketTypeInfo":"3000"},
      {"name":"B","color":"FFCD32","price":1680,"istp":false,"ticketTypeInfo":"1680"},
      {"name":"C","color":"96CD69","price":1280,"istp":false,"ticketTypeInfo":"1280"},
      {"name":"D","color":"008000","price":1000,"istp":false,"ticketTypeInfo":"1000"},
      {"name":"E","color":"64CDFF","price":880,"istp":false,"ticketTypeInfo":"880"},
      {"name":"F","color":"008080","price":580,"istp":false,"ticketTypeInfo":"580"},
      {"name":"G","color":"CD9BCD","price":380,"istp":false,"ticketTypeInfo":"380"},
      {"name":"H","color":"9B649B","price":180,"istp":false,"ticketTypeInfo":"180"}
    ],
    "areas" : [ // 区域
      {"id":1,"name":"1区","remain":0,"rect":"454,248|459,305|477,307|477,337|457,338|443,394|506,420|527,340|529,286|526,249|498,254|493,238|454,248"},
      {"id":2,"name":"2区","remain":0,"rect":"441,401|430,424|453,437|441,460|417,447|406,463|386,473|373,485|343,501|350,526|365,522|380,552|420,533|459,499|482,469|504,428|504,426|445,403|441,401"},
      {"id":3,"name":"3区","remain":0,"rect":"299,501|293,527|274,524|262,552|286,562|307,563|336,563|355,560|375,555|364,523|346,530|338,504|327,504|326,521|313,522|312,505|300,505|299,501"},
      {"id":4,"name":"4区","remain":0,"rect":"195,401|137,428|164,478|195,513|224,536|257,553|271,521|289,524|295,504|258,485|221,447|202,456|190,433|205,426|195,401"},
      {"id":5,"name":"5区","remain":0,"rect":"182,245|144,238|141,257|114,252|110,286|112,331|119,374|135,422|192,394|180,336|159,336|160,305|177,305|182,245"},
      {"id":6,"name":"6区","remain":0,"rect":"531,269|585,260|586,327|577,385|565,414|518,395|528,353|533,309|531,269"},
      {"id":7,"name":"7区","remain":0,"rect":"517,403|562,421|534,472|496,514|455,548|391,577|382,557|416,540|441,520|468,493|496,453|517,403"},
      {"id":8,"name":"8区","remain":11,"rect":"377,556|385,577|344,585|339,566|377,556"},
      {"id":9,"name":"9区","remain":0,"rect":"297,564|295,583|251,577|259,556|297,564"},
      {"id":10,"name":"10区","remain":0,"rect":"256,554|246,575|187,548|139,510|100,466|71,405|119,393|135,433|157,471|192,512|256,554"},
      {"id":11,"name":"11区","remain":0,"rect":"108,269|54,260|51,307|57,353|68,400|119,388|108,327|108,269"}
    ],
    "tplist":[] // 套票
  },
  "error":null // 错误提示
}

{ // 座位数据接口
  "result":[
    {"id":8,"name":"A","x":31,"y":5,"pinfo":"看台8区1排1座","tp":0,"sale":0},
    {"id":8,"name":"A","x":30,"y":5,"pinfo":"看台8区1排2座","tp":0,"sale":1},
    {"id":8,"name":"B","x":29,"y":5,"pinfo":"看台8区1排3座","tp":0,"sale":1},
    {"id":8,"name":"B","x":28,"y":5,"pinfo":"看台8区1排4座","tp":0,"sale":0},
    {"id":8,"name":"C","x":27,"y":5,"pinfo":"看台8区1排5座","tp":0,"sale":0},
    {"id":8,"name":"C","x":26,"y":5,"pinfo":"看台8区1排6座","tp":0,"sale":1},
    {"id":8,"name":"D","x":25,"y":5,"pinfo":"看台8区1排7座","tp":0,"sale":1},
    {"id":8,"name":"D","x":31,"y":7,"pinfo":"看台10区1排1座","tp":0,"sale":1},
    {"id":8,"name":"E","x":30,"y":7,"pinfo":"看台10区1排2座","tp":0,"sale":1},
    {"id":8,"name":"E","x":29,"y":7,"pinfo":"看台10区1排3座","tp":0,"sale":1},
    {"id":8,"name":"F","x":28,"y":7,"pinfo":"看台10区1排4座","tp":0,"sale":0},
    {"id":8,"name":"F","x":27,"y":7,"pinfo":"看台10区1排5座","tp":0,"sale":1},
    {"id":8,"name":"G","x":26,"y":7,"pinfo":"看台10区1排6座","tp":0,"sale":1},
    {"id":8,"name":"G","x":25,"y":7,"pinfo":"看台10区1排7座","tp":0,"sale":1},
    {"id":8,"name":"H","x":25,"y":7,"pinfo":"看台10区1排7座","tp":0,"sale":1},
    {"id":8,"name":"H","x":25,"y":7,"pinfo":"看台10区1排7座","tp":0,"sale":0}
  ],
  "error":null // 错误提示
}

{% endhighlight %}

> 画出影院场馆（影院场馆可售区域）：

模拟后端返回`JSON`数据，画出场馆区域。  
`html`部分：

{% highlight html %}

<canvas id="canvas" width=650 height=600 style="border:1px solid #000; background-color: ivory;"></canvas>

{% endhighlight %}

`javascript`部分：

{% highlight javascript %}

// 根据JSON数据画出场馆及可售区域
var canvas = document.getElementById("canvas"), // canvas 元素
    context = canvas.getContext("2d"), // 创建 context 对象
    baseResult = baseJSON["result"],
    seatResult = seatJSON["result"];
    
// 创建图片对象
var img = new Image();

// 设置图片路径
img.src = baseResult["img"];

// 图片加载以后绘图，否则为空白图片
img.onload = function(){
  context.drawImage(img,0,0);
  var areas = baseResult["areas"];
  for(var i=areas.length;i--;){
    var area = areas[i];
    var _rect = area["rect"];
    context.beginPath();  // 画图开始
    var rects = _rect.split("|");
    for (var r=rects.length;r--;) // 遍历画图闭合线坐标
    {
      var _rect = rects[r].split(","); // 拆分点标
      context.lineTo(_rect[0], _rect[1]); // 按点画闭合线
      console.log(area["remain"]);
    } 
    if(area["remain"] == 0){ // 无座位可售区域
        context.fillStyle = "#cccccc"; // 默认半透明灰色
        context.globalAlpha = .9; // 透明度
        context.fill(); 	// 闭合区域填充颜色
    }
    context.stroke(); // 画图结束
  }
}

{% endhighlight %}

###DEMO中暂未展示缩放和点击事件。:)   

-----------------------

<a class="btn btn-primary btn-sm" href="/resources/demo{{ page.url}}-seatarea.html" target="_blank">查看DEMO</a> 

-----------------------

> 点击影院场馆可售区域，显示该区域座位：

### OK,今天就先说到这儿 :) 由于近期比较忙更新相对比较缓慢。完整DEMO还在整理中。

-----------------------


