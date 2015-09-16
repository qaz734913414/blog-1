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

