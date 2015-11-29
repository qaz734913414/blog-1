---
layout: column_1_2
title:  "MySQL5.6源码安装"
description: "linux安装,vmware虚拟机安装,centos6.6安装,MySQL5.6源码安装"
keywords: linux,shell,mysql
origin: 张嘉杰.原创
date:   2015-11-30
category: linux
tags: linux shell mysql
---

周末和做`MySQL``DBA`的一位朋友一起聊了一下午，比如说：`MySQL主从复制`、`MySQL备份恢复方案及策略`、`MySQL高可用方案`、`一定规模的MySQL自动化运维经验`等方面的话题。
<!--more-->
最近我也刚好需要迁移数据库至`MySQL`中，所以把以前的一些实施案例分享出来，这篇文章主要是介绍`MySQL5.6.27`源码编译。之所以选择`MySQL5.6.27`，也是听了该朋友的介绍。
（一般`MySQL`发版超过20个版本以后，基本就是主流了）

> 部署环境准备

服务器系统|角色|IP
----|----|----
CentOS6.6 x86_64|MySQL5.6.27|192.168.24.5
CentOS6.6 x86_64|MySQL5.6.27|192.168.24.6

> 服务器、软件版本

{% highlight bash %}
-------mysql1服务器-------
[root@mysql1 ~] cat /etc/redhat-release
CentOS release 6.6 (Final)
[root@mysql1 ~] uname -r
2.6.32-504.el6.x86_64

-------mysql2服务器-------
[root@mysql2 ~] cat /etc/redhat-release
CentOS release 6.6 (Final)
[root@mysql2 ~] uname -r
2.6.32-504.el6.x86_64
{% endhighlight %}

> 安装 MySQL5.6.27



###到这里基本就完成了。:)

-----------------------
