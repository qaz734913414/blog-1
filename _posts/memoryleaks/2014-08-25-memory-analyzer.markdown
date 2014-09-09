---
layout: page
title:  "关于内存工具MemoryAnalyzer的分析和使用"
description: "关于内存工具MemoryAnalyzer的分析和使用"
keywords: MemoryAnalyzer,dump,architect
origin: 张嘉杰.原创
date:   2014-08-25
categories: architect
tags: MemoryAnalyzer dump architect
---
公司网站`tomcat`容器老是突然进程消失，或者应用挂起无反应。所以用`jmap`抓出`dump`利用`MemoryAnalyzer`工具来分析异常。  
<!--more-->
首先执行以下命令生成dump文件  

{% highlight bash %}

#查看java进程号
ps -ax|grep java 

#jmap命令 [file 保存dump名称 pid 为java进程号]
jmap -dump:format=b,file=<dump>.bin <pid>
	
{% endhighlight %}

1. MemoryAnalyzer下载地址  <http://www.eclipse.org/mat/downloads.php>
2. MemoryAnalyzer官方文档  <http://help.eclipse.org/indigo/index.jsp>  （此文档写得比较详细）

关于官方文档解释不全的问题，补充以下链接提供参考。  
1. OQL （类似sql的dump查询分析）  
		<http://visualvm.java.net/oqlhelp.html>  
2. 10 Tips for using the Eclipse Memory Analyzer  （十个常用技巧）  
		<http://eclipsesource.com/blogs/2013/01/21/10-tips-for-using-the-eclipse-memory-analyzer/>

-----------------------
