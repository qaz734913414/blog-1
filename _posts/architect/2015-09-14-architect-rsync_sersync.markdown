---
layout: column_1_2
title:  "架构实践.数据实时同步备份之rsync+sersync"
description: "架构实践.数据实时同步备份之rsync+sersync"
keywords: 架构实践,实时同步备份服务器,rsync+sersync,sersync
origin: 张嘉杰.原创
date:   2015-09-14
category: architect
tags: linux rsync sersync
---
`Sersync`是国内的一个开发者开源出来的，使用`c++`编写，采用多线程的方式进行同步，失败后还有重传机制，对临时文件过滤，自带`crontab`定时同步功能
<!--more-->

![sersync+rsync]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}.png)

# sersync 数据实时同步工具

> Sersync+Rsync实时备份

使用`linux2.6`内核的`inotify`监控`linux`文件系统事件，被监听目录下如果有文件发生修改，`sersync`将通过内核自动捕获到事件，并将该文件利用`rsync`同步到多台远程服务器。`sersync`仅仅同步发生增、删、改事件的单个文件或目录，不像`rsync`镜像同步那样需要比对双方服务器整个目录下数千万的文件，并且支持多线程同步，因此效率非常高


Rsync搭建参考：[架构实践.数据同步备份之rsync](http://www.jcore.cn/2015/09/10/architect-rsync/)

> 部署环境准备

服务器系统|角色|IP
----|----|----
CentOS6.6 x86_64|WEB服务端（WEB）|192.168.24.100
CentOS6.6 x86_64|备份服务端（BACKUP）|192.168.24.101

> 服务器、软件版本



###OK，今天先到这儿了 :) 

-----------------------
