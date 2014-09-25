---
layout: page
title:  "定位女神在哪里"
description: "浏览器定位,女神在哪里,定位女神"
keywords: 浏览器定位,女神在哪里,定位女神,webkit,chrome,safari
origin: 张嘉杰.原创
date:   2014-09-19
category: browser
tags: webkit chrome html5
---
周五下班回家路上，接到了一位很久未联系的朋友打过来的电话（省略一些敏感话题），切入主题：哥们儿想知道自己的女神住哪儿，又不方便直接问。我想到了一个自己在`2012`年做项目的时候，使用过的一个方法，在这里分享给需要的朋友。
<!--more-->

> 实现思路： 

{% highlight html %}

1. 设计美观界面。  
2. 让女神访问固定地址，获取其IP、经度、纬度。  
2. 获取成功，触发邮件至139邮箱（设置短信提醒）。  
3. 通过短信返回URL地址，访问地图标出精确位置。

{% endhighlight %}

> HTML5 Geolocation API的使用方法及实现原理

女神访问页面脚本：
{% highlight javascript %}

# 判断浏览器是否支持geolocation
if(navigator.geolocation){
	var message = "",address="";
	navigator.geolocation.getCurrentPosition(
		function (position) {
			var lon = position.coords.longitude; //经度
			var lat = position.coords.latitude; //纬度
			if(position.address){ //是否支持address属性
				//通过address，可以获得国家、省份、城市
				var _a = position.address;
				address =  "(" + (_a.country + _a.province + _a.city) + ")";
			}
			message = ( "lat=" + lat + "&lon=" + lon );
            return {
                isSuccess : true,
                subject : "女神地址获取成功，速速查看^0^...",
                html : "<a href=\"http://jcore.cn/getaddress.html?\" "+message+" target=\"_blank\" >戳我..."+ address +"</a>"
            }
		}, 
		function (error) {
			var type = {
				1: '女神拒绝提供地理位置（自己想办法咯）',
				2: '获取不到女神位置信息（爱莫能助啊）',
				3: '超时（多访问几次，或者过段时间再次尝试）'
			}
			message = ('获取数据失败：' + type[error.code]);
            return {
                isSuccess : false,
                subject : "女神地址获取失败，不哭不哭T_T...",
                html : message
            }
		}
	);
}

{% endhighlight %}

###未完待续... :)

-----------------------

相关参考文章地址：

Geolocation-API - <http://www.htmq.com/geolocation/>  

-----------------------
