---
layout: column_1_2
title:  "html5系列.存储"
description: "html5系列.存储"
keywords: html5,html5进阶,localStroage,sessionStroage
origin: 张嘉杰.原创
date:   2014-09-16
category: html5
tags: html5
---
客户端存储大多是依赖`cookie`来完成，`cookie`不适合大数据存储。依赖多服务器的请求来完成，速度不快且效率不高。`html5`之后新的储存的新方法：`localStroage`、`sessionStroage`。`localStroage`是没有时间限制的存储，`sessionStroage`针对单个`session`的数据存储，关闭浏览器存储数据消失。
<!--more-->

> localStroage、sessionStroage 使用方法

{% highlight javascript %}

# 存储value到指定key
setItem : function(key, value)

# 获取指定key的value
getItem : function(key)

# 删除指定key的value
removeItem : function(key)

# 清除所有的key/value
clear : function()

# 数据所有的key
key : function(i)

# 数据长度
length : int

{% endhighlight %}

> 浏览器查看方式

![console-resources]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-0.png)    

### 下面有简单的例子 :)

-----------------------

<a class="button" href="/resources/demo{{ page.url}}.html" target="_blank">查看DEMO</a>

-----------------------

> <font color="# fa8072">封装了个简单逻辑的脚本</font>

判断浏览器端是否支持`Storage`对象，支持则默认使用`localStore`，不支持则使用`Cookie`。  

{% highlight javascript %}

(function(win){
	
	var Store = function(type) {
		var localstore = {
			proto: window.localStorage,
			type: 'localStorage',
			set: function(key, val) {
				this.s.setItem(key, JSON.stringify(val));
				return val;
			},
			get: function(key) {
				var value = this.proto.getItem(key);
				if (typeof value != 'string') { return undefined }
				try { return JSON.parse(value) }
				catch(e) { return value || undefined }
			},
			remove: function(key) { this.proto.removeItem(key) },
			removeAll: function() { this.proto.clear() },
			getAll: function() {
				var ret = {};
				for (var i=0; i<this.proto.length; i++) {
					var key = this.proto.key(i);
					ret[key] = this.get(key);
				}
				return ret;
			}
		};
		var sessionstore = {
			proto: window.sessionStorage,
			type: 'sessionStorage',
			set: localstore.set,
			get: localstore.get,
			remove: localstore.remove,
			removeAll: localstore.removeAll,
			getAll: localstore.getAll
		};
		var cookiestore = {
			proto: document.cookie,
			type: 'cookie',
			set: function (name, value, expires, path, secure) {
				var valueToUse;
				if (value !== undefined && typeof(value) === "object"){
					valueToUse = JSON.stringify(value);
				}else{
					valueToUse = encodeURIComponent(value);
				}
				document.cookie = name + "=" + valueToUse +
					(expires ? ("; expires=" + new Date(expires).toUTCString()) : '') +
					"; path=" + (path || '/') +
					(secure ? "; secure" : '');
			},
			get: function (name) {
				var cookies = this.getAllRawOrProcessed(false);
				if (cookies.hasOwnProperty(name)) return this.processValue(cookies[name]);
				else return undefined;
			},
			processValue: function(value) {
				if (value.substring(0, 1) == "{") {
					try {
						return JSON.parse(value);
					}catch(e) {return value;}
				}
				if (value == "undefined") return undefined;
				return decodeURIComponent(value);
			},
			getAllRawOrProcessed: function(process) {
				var cookies = document.cookie.split('; '), s = {};
				if (cookies.length === 1 && cookies[0] === '') return s;
				for (var i = 0 ; i < cookies.length; i++) {
					var cookie = cookies[i].split('=');
					if (process) s[cookie[0]] = this.processValue(cookie[1]);
					else s[cookie[0]] = cookie[1];
				}
				return s;
			},
			getAll: function() {
				return this.getAllRawOrProcessed(true);
			},
			remove: function (name) {
				this.set(name, "", -1);
			},
			removeAll: function() {
				var cookies = this.getAll();
				for (var i in cookies) {
					this.remove(i);
				}
				return this.getAll();
			}
		}

		if(type == 'local'){ //local
			return localstore;
		}else if(type == 'session'){ //session
			return sessionstore;
		}else{ //cookie
			return cookiestore;
		}
	};

	win.store = new Store((typeof Storage !== "undefined") ? 'local' : 'cookie');
	win.Store = Store;
})(window)

{% endhighlight %}

使用方法：

{% highlight javascript %}

# 存储类型 localStore、sessionStore、cookie
store.type : string

# 存储原型方法 window.localStorage、window.sessionStore、document.cookie
store.proto : function()

# 存储value到指定key
store.set : function(key, value)

# 获取指定key的value
store.get : function(key)

# 删除指定key的value
store.remove : function(key)

# 删除所有的key/value
store.removeAll : function()

# 获取所有存储对象
store.getAll : function()
	
{% endhighlight %}

-----------------------

相关参考文章地址：

DOM-Storage-guide - <https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Storage>

-----------------------

