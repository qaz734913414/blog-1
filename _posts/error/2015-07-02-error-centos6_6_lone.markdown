---
layout: column_1_2
title:  "错误：Device eth0 does not seem to be present, delaying initialization"
description: "linux,centOS,WMware"
keywords: linux,centOS,WMware
origin: 张嘉杰.原创
date:   2015-07-02
category: linux
tags: WMware CentOS6.6
---
关于使用`WMware`克隆`CentOS6.6`模板机，无法`ping`通网络的问题，重启网卡出现错误。
<!--more-->

错误：`Device eth0 does not seem to be present, delaying initialization`

> 异常截图

![异常截图]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-0.png)  

> 解决异常

解决问题如下：
{% highlight bash %}
# 查看网卡
$ vi /etc/sysconfig/network-scripts/ifcfg-eth0 
{% endhighlight %}

![配置文件修改]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-1.png)  

{% highlight bash %}
# 删除此文件
$ rm -rf /etc/udev/rules.d/70-persistent-net.rules

# 重启机器
$ reboot

# 重启网卡
$ /etc/inid.d/network restart 或者 service network restart
{% endhighlight %}

![重启网卡成功]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-2.png)  

###OK，今儿先到这儿了。

-----------------------
