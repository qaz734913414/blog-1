---
layout: column_1_2
title:  "安装.CentOS6.6"
description: "linux安装,mac安装,安装CentOS6.6"
keywords: linux,centOS,centOS6.6
origin: 张嘉杰.原创
date:   2015-07-01
category: linux
tags: linux CentOS6.6
---
截止目前CentOS 6.x最新版本为`CentOS 6.6`，下面主要介绍一下`CentOS 6.6`安装需要的工具和图形安装配置过程。  
<!--more-->

> 环境、工具准备

安装环境：Mac OS X 10.9.3  
安装系统：CentOS 6.6（CentOS-6.6-x86_64-bin-DVD1.iso）[[CentOS6.6下载]]  
安装工具：WMware Fusion 7、SecureCRT 7.3.3 [链接: <http://pan.baidu.com/s/1o6OhxsI>  密码: kcji]

SecureCRT的具体破解方法：License输出内容为注册必填内容。
![破解SecureCRT]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-0.png)

> 安装CentOS 6.6

打开`WMware Fusion`，开始安装`CentOS 6.6`。

![安装CentOS6.6-1]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-1.png)  
![安装CentOS6.6-2]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-2.png)  
![安装CentOS6.6-3]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-3.png)  
![安装CentOS6.6-4]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-4.png)  
![安装CentOS6.6-5]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-5.png)  
![安装CentOS6.6-6]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-6.png)  
![安装CentOS6.6-7]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-7.png)  
![安装CentOS6.6-8]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-8.png)  
![安装CentOS6.6-9]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-9.png)  
![安装CentOS6.6-10]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-10.png)  
![安装CentOS6.6-11]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-11.png)  
![安装CentOS6.6-12]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-12.png)  
![安装CentOS6.6-13]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-13.png)  
![安装CentOS6.6-14]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-14.png)  
![安装CentOS6.6-15]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-15.png)  
![安装CentOS6.6-16]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-16.png)  
![安装CentOS6.6-17]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-17.png)  
![安装CentOS6.6-18]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-18.png)  
![安装CentOS6.6-19]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-19.png)  
![安装CentOS6.6-20]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-20.png)  
![安装CentOS6.6-21]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-21.png)  
![安装CentOS6.6-22]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-22.png)  
![安装CentOS6.6-23]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-23.png)  
![安装CentOS6.6-24]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-24.png)  
![安装CentOS6.6-25]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-25.png)  
![安装CentOS6.6-26]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-26.png)  
![安装CentOS6.6-27]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-27.png)  
![安装CentOS6.6-28]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-28.png)  
![安装CentOS6.6-29]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-29.png)  
![安装CentOS6.6-30]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-30.png)  
![安装CentOS6.6-31]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-31.png)  
![安装CentOS6.6-32]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-32.png)  

> 解决虚拟机访问外网问题

到这里`CentOS 6.6`就安装完毕了。`ping`一下`百度`发现如下错误：  
![CentOS6.6 ping不通]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-33.png)  

解决问题如下：
{% highlight bash %}
# 查看网卡
$ vi /etc/sysconfig/network-scripts/ifcfg-eth0 
{% endhighlight %}

![CentOS6.6 ping不通]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-34.png)  

{% highlight bash %}
# 重启网卡
$ /etc/inid.d/network restart 或者 service network restart
{% endhighlight %}

![CentOS6.6 ping不通]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-34.png)  

OK，今儿先到这儿了。

-----------------------

[CentOS6.6下载]: <http://mirrors.aliyun.com/centos/6.6/isos/x86_64/CentOS-6.6-x86_64-bin-DVD1.iso>
