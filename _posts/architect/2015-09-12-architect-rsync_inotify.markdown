---
layout: column_1_2
title:  "架构实践.数据实时同步备份之rsync+inotify"
description: "架构实践.数据实时同步备份之rsync+inotify"
keywords: 架构实践,实时同步备份服务器,rsync+inotify,inotify
origin: 张嘉杰.原创
date:   2015-09-12
category: architect
tags: linux rsync inotify
---
`Inotify`是一种强大的、细颗粒的、异步的文件系统监控机制，`linux`内核从`2.6.13`起，加入`Inotify`可以监控文件系统中添加、删除、修改移动等各种事件，利用这个内核接口，就可以监控文件系统下文件的各种变化情况。
<!--more-->

![inotify+rsync]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}.png)

# Inotify 数据实时同步工具

> 背景，需求

在日常工作中，往往需要知道在某些文件（夹）上都有那些变化

{% highlight html %}
* 通知配置文件的改变
* 跟踪某些关键的系统文件的变化
* 监控某个分区磁盘的整体使用情况
* 系统崩溃时进行自动清理
* 自动触发备份进程
* 向服务器上传文件结束时发出通知
{% endhighlight %}

> Inotify+Rsync实时备份

用`Inotify`和`Rsync`配合可以达到实时备份的效果，原理是`Inotify`可以监控目录的变化，在检测到目录变化后通过调用`Rsync`把变化目录推送到备份主机，而实现实时备份。

`Rsync`搭建参考：[架构实践.数据同步备份之rsync](http://www.jcore.cn/2015/09/10/architect-rsync/)

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
[root@backup ~] cat /etc/redhat-release
CentOS release 6.6 (Final)
[root@backup ~] uname -r
2.6.32-504.el6.x86_64
{% endhighlight %}

> Inotify客户端安装（web服务器）

{% highlight bash %}
# 下载epel源
[root@web ~]# wget -O /etc/yum.repos.d/epel.repo http://mirrors.aliyun.com/repo/epel-6.repo
--2015-09-10 13:09:12--  http://mirrors.aliyun.com/repo/epel-6.repo
正在解析主机 mirrors.aliyun.com... 115.28.122.210, 112.124.140.210, 115.28.122.210
正在连接 mirrors.aliyun.com|115.28.122.210|:80... 已连接。
已发出 HTTP 请求，正在等待回应... 200 OK
长度：1083 (1.1K) [application/octet-stream]
正在保存至: “/etc/yum.repos.d/epel.repo”
100%[======================================================================================================================================>] 1,083       --.-K/s   in 0s      
2015-09-10 13:09:17 (200 MB/s) - 已保存 “/etc/yum.repos.d/epel.repo” [1083/1083])

# yum安装inotify
[root@web ~]# yum install inotify-tools -y
================================================================================================================================================================================
 软件包                                         架构                                    版本                                        仓库                                   大小
================================================================================================================================================================================
正在安装:
 inotify-tools                                  x86_64                                  3.14-1.el6                                  epel                                   46 k

# 查看inotify是否安装成功
[root@web ~]# rpm -qa inotify-tools
inotify-tools-3.14-1.el6.x86_64
{% endhighlight %}

> 安装完成文件介绍，参数说明

{% highlight bash %}
/usr/bin/inotifywait	#监控目录变化的工具  
/usr/bin/inotifywatch	#收集被监控的文件系统并统计相关信息
{% endhighlight %}

> inotifywait 参数说明

参数名称|参数说明
----|----
-m,–monitor|始终保持事件监听状态
-r,–recursive|递归查询目录
-q,–quiet|只打印监控事件的信息
–excludei|排除文件或目录时，不区分大小写
-t,–timeout|超时时间
–timefmt|指定时间输出格式
–format|指定时间输出格式
-e,–event|后面指定删、增、改等事件

> inotifywait events事件说明

事件名称|事件说明
----|----
access|读取文件或目录内容
modify|修改文件或目录内容
attrib|文件或目录的属性改变
close_write|修改真实文件内容
close_nowrite|
close|
open|文件或目录被打开
moved_to|文件或目录移动到
moved_from|文件或目录从移动
move|移动文件或目录移动到监视目录
create|在监视目录下创建文件或目录
delete|删除监视目录下的文件或目录
delete_self|
unmount|卸载文件系统

> Inotify 客户端备份目录监控（web服务器）

{% highlight bash %}
# 客户端1，执行监听命令
[root@web ~]# inotifywait -mrq --timefmt '%y/%m/%d %H:%M' --format '%T %w%f' -e create,delete,close_write /backup
15/09/10 13:31 /backup/text.txt
15/09/10 13:31 /backup/text.txt
15/09/10 13:31 /backup/text.txt
# 客户端1，执行添加和删除文件命令（可以看到变化）
[root@web ~]# touch /backup/text.txt
[root@web ~]# rm -rf /backup/text.txt

# 客户机实时备份脚本
[root@web ~]# cd /server/scripts && \
touch inotify.sh && \
chmod 755 inotify.sh && \
cat >>inotify.sh<<EOF
#!/bin/bash
/usr/bin/inotifywait -mrq  --format '%w%f' -e create,close_write,delete /backup | 
while read file
do
  cd /backup && \
  rsync -az --delete /backup/ rsync_backup@192.168.24.101::backup/ --password-file=/etc/rsync.password
done
EOF

# 后台运行Inotify实时备份
[root@web scripts]# sh inotify.sh &
[1] 3572

# Inotify实时备份服务加入开机启动
cat >>/etc/rc.local<<EOF
########start up inotify backup by zhangjie at 20150913########
/bin/sh inotify.sh &
EOF
{% endhighlight %}

> 优化 Inotify

{% highlight bash %}
# 在/proc/sys/fs/inotify目录下有三个文件，对inotify机制有一定的限制
[root@web ~]# ll /proc/sys/fs/inotify/ 
总用量 0
-rw-r--r-- 1 root root 0 9月   9 23:36 max_queued_events
-rw-r--r-- 1 root root 0 9月   9 23:36 max_user_instances
-rw-r--r-- 1 root root 0 9月   9 23:36 max_user_watches
-----------------------------
max_user_watches	#设置inotifywait或inotifywatch命令可以监视的文件数量(单进程)
max_user_instances	#设置每个用户可以运行的inotifywait或inotifywatch命令的进程数
max_queued_events	#设置inotify实例事件(event)队列可容纳的事件数量
-----------------------------
[root@web ~]# echo 50000000 >/proc/sys/fs/inotify/max_user_watches 
[root@web ~]# echo 50000000 >/proc/sys/fs/inotify/max_queued_events
-----------------------------
{% endhighlight %}

> 总结

`Rsync`和`Inotify`配合来实现实时同步，但是高并发的情况下会有延迟！一般10-300k的小文件，经过测试，每秒200个文件并发，数据同步几乎无延迟（小于1秒），如果高于200-300的并发，就可以会有延迟的情况。如果公司业务量比较大，就需要考虑其它方案：

{% highlight html %}
* Inotify（sersync）+Rsync文件级别
* drdb文件系统级别
* 第三方软件的同步功能：mysql同步，orange，mongodb
* 业务上，程序实现双写
* 业务逻辑解决
{% endhighlight %}

###OK，今天先到这儿了 :) 

-----------------------
