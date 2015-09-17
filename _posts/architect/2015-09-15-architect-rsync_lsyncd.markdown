---
layout: column_1_2
title:  "架构实践.数据实时同步备份之rsync+lsyncd"
description: "架构实践.数据实时同步备份之rsync+lsyncd"
keywords: 架构实践,实时同步备份服务器,rsync+lsyncd,lsyncd
origin: 张嘉杰.原创
date:   2015-09-15
category: architect
tags: linux rsync lsyncd
---
`Lysncd`实际上是`lua`语言封装了`inotify+rsync`工具，完美解决了`inotify+rsync`海量文件同步带来的文件频繁发送文件列表的问题。
<!--more-->

![rsync+lsyncd]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}.png)

# lsyncd 数据实时同步工具

`Lysncd`实际上是`lua`语言封装了`inotify+rsync`工具，采用了`linux`内核（`2.6.13` 及以后）里的`inotify`触发机制，然后通过`rsync`去差异同步，达到实时的效果。我认为它最令人称道的特性是，完美解决了`inotify+rsync`海量文件同步带来的文件频繁发送文件列表的问题 —— 通过时间延迟或累计触发事件次数实现，它的配置方式很简单，可读性非常强。`Lsyncd`也有多种工作模式可以选择，本地目录`cp`，本地目录`rsync`，远程目录`rsyncssh`。

Rsync搭建参考：[架构实践.数据同步备份之rsync](http://www.jcore.cn/2015/09/10/architect-rsync/)

> 部署环境准备

服务器系统|角色|IP
----|----|----
CentOS6.6 x86_64|WEB服务端（WEB）|192.168.24.100
CentOS6.6 x86_64|备份服务端（BACKUP）|192.168.24.101

> 服务器、软件版本

{% highlight bash %}
-------backup备份服务器-------
[root@backup ~] cat /etc/redhat-release
CentOS release 6.6 (Final)
[root@backup ~] uname -r
2.6.32-504.el6.x86_64
[root@backup ~]# rpm -qa rsync
rsync-3.0.6-12.el6.x86_64

-------web应用服务器-------
[root@web ~] cat /etc/redhat-release
CentOS release 6.6 (Final)
[root@web ~] uname -r
2.6.32-504.el6.x86_64
{% endhighlight %}

> Lsyncd客户端安装

{% highlight bash %}
# 查看yum源是否有安装包
[root@web ~]# yum search lsyncd
已加载插件：fastestmirror, security
Determining fastest mirrors
 * base: mirrors.aliyun.com
 * extras: mirrors.aliyun.com
 * updates: mirrors.aliyun.com
警告：没有匹配 lsyncd 的软件包
没有找到匹配的软件包

# 下载epel源
[root@web ~]# wget -O /etc/yum.repos.d/epel.repo http://mirrors.aliyun.com/repo/epel-6.repo

# 已查看到lsyncd版本（lsyncd.x86_64）
[root@web ~]# yum search lsyncd
已加载插件：fastestmirror, security
Loading mirror speeds from cached hostfile
 * base: mirrors.aliyun.com
 * epel: mirrors.aliyun.com
 * extras: mirrors.aliyun.com
 * updates: mirrors.aliyun.com
============================================================================= N/S Matched: lsyncd ==============================================================================
lsyncd.x86_64 : File change monitoring and synchronization daemon

# 安装lsyncd
[root@web ~]# yum install lsyncd.x86_64
================================================================================================================================================================================
 软件包                                   架构                                     版本                                            仓库                                    大小
================================================================================================================================================================================
正在安装:
 lsyncd                                   x86_64                                   2.1.5-0.el6                                     epel                                    73 k
 
# 查看lsyncd是否安装
[root@web ~]# rpm -qa|grep lsyncd
lsyncd-2.1.5-0.el6.x86_64
{% endhighlight %}

> /etc/lsyncd.conf配置选项说明

`lsyncd.conf`可以有多个`sync`，各自的`source`，各自的`target`，各自的模式，互不影响

* settings全局设置

	参数名称|参数说明
	----|----
	logfile|定义日志文件
	stausFile|定义状态文件
	nodaemon=true|表示不启用守护模式，默认
	statusInterval|将lsyncd的状态写入上面的statusFile的间隔，默认10秒
	inotifyMode|指定inotify监控的事件，默认是CloseWrite，还可以是Modify或CloseWrite or Modify
	maxProcesses|同步进程的最大个数。假如同时有20个文件需要同步，而maxProcesses=8，则最大能看到有8个rysnc进程
	maxDelays|累计到多少所监控的事件激活一次同步，即使后面的delay延迟时间还未到

* sync配置
	
	参数名称|参数说明
	----|----
	default.rsync|本地目录间同步，使用rsync，也可以达到使用ssh形式的远程rsync效果，或daemon方式连接远程rsyncd进程
	default.direct|本地目录间同步，使用cp、rm等命令完成差异文件备份
	default.rsyncssh|同步到远程主机目录，rsync的ssh模式，需要使用key来认证
	source|同步的源目录，使用绝对路径
	target|定义目的地址，本地目录同步、同步到远程服务器目录
	init|这是一个优化选项，当init=false，只同步进程启动以后发生改动事件的文件，原有的目录即使有差异也不会同步。默认是true
	delay|累计事件，等待rsync同步延时时间，默认15秒（最大累计到1000个不可合并的事件）。也就是15s内监控目录下发生的改动，会累积到一次rsync同步，避免过于频繁的同步
	excludeFrom|排除选项，后面指定排除的列表文件
	delete|为了保持target与souce完全同步，Lsyncd默认会delete=true来允许同步删除

* rsync配置

	参数名称|参数说明
	----|----
	bwlimit|限速，单位kb/s，与rsync相同（这么重要的选项在文档里竟然没有标出）
	compress|压缩传输默认为true。在带宽与cpu负载之间权衡，本地目录同步可以考虑把它设为false
	perms|默认保留文件权限
	

> /etc/lsyncd.conf配置

{% highlight bash %}
# 添加lsyncd配置
[root@web ~]# cat>>/etc/lsyncd.conf<<EOF
settings {
    logfile      = "/var/log/lsyncd/lsyncd.log",
    statusFile   = "/var/run/lsyncd/lsyncd.status",
    inotifyMode  = "CloseWrite",
    maxProcesses = 8,
    -- nodaemon =true,
    }

sync {
    default.rsync,
    source    = "/backup",
    target    = "192.168.24.101:/backup",
    -- excludeFrom = "/etc/rsyncd.d/rsync_exclude.lst",
    rsync     = {
        binary    = "/usr/bin/rsync",
        archive   = true,
        compress  = true,
        verbose   = true
        }
    }
EOF

# ssh免秘钥登录（一直enter）
[root@web ~]# ssh-keygen -t rsa
Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa): 
/root/.ssh/id_rsa already exists.
Overwrite (y/n)? y
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /root/.ssh/id_rsa.
Your public key has been saved in /root/.ssh/id_rsa.pub.
The key fingerprint is:
6d:4f:12:44:f6:c5:20:6c:3d:98:2d:65:d9:2b:32:5f root@backup
The keys randomart image is:
+--[ RSA 2048]----+
|         o=*+=.  |
|         o*+=.o  |
|         ..... . |
|         .o.. E  |
|        S ++.o   |
|         . +.    |
|            .    |
|                 |
|                 |
+-----------------+

# 发布到远程目标机
[root@web ~]# ssh-copy-id -i ~/.ssh/id_rsa.pub "-p 22 root@192.168.24.101"

# 创建推送目录
[root@web ~]# mkdir /backup

# 启动lsyncd服务
[root@web ~]# /etc/init.d/lsyncd start
正在启动 lsyncd：                                          [确定]

# 查看backup服务器/backup/目录
[root@backup ~]# ls /backup

# web服务器添加测试数据
[root@web ~]# touch /backup/{1..10}.html

# 查看backup服务器/backup/目录
[root@backup ~]# ls /backup
10.html  1.html  2.html  3.html  4.html  5.html  6.html  7.html  8.html  9.html

{% endhighlight %}

###OK，今天先到这儿了 :) 

-----------------------

参考文档：

[Lsyncd 2.1.x ‖ Layer 4 Config ‖ Default Behavior](https://github.com/axkibe/lsyncd/wiki/Lsyncd%202.1.x%20%E2%80%96%20Layer%204%20Config%20%E2%80%96%20Default%20Behavior)

