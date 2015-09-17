---
layout: column_1_2
title:  "架构实践.双向数据实时同步备份之unison+inotify"
description: "架构实践.双向数据实时同步备份之unison+inotify"
keywords: 架构实践,实时同步备份服务器,unison+inotify,unison
origin: 张嘉杰.原创
date:   2015-09-16
category: architect
tags: linux rsync unison
---
`Unison`是一款跨平台的文件同步工具，不仅支持本地对本地同步，也支持通过`SSH`、`RSH`、`Socket`等网络协议进行同步。`Unison`支持双向同步操作。
<!--more-->

![unison+rsync]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}.png)

# unison 双向数据实时同步工具

> Unison+Inotify双向实时备份

`Unison`是一款跨平台的文件同步工具，不仅支持本地对本地同步，也支持通过`SSH`、`RSH`、`Socket`等网络协议进行同步。`Unison`支持双向同步操作

`Inotify`是一种强大的、细颗粒的、异步的文件系统监控机制，`linux`内核从`2.6.13`起，加入`Inotify`可以监控文件系统中添加、删除、修改移动等各种事件，利用这个内核接口，就可以监控文件系统下文件的各种变化情况。


`ssh`信任参考（帖子包含）：[设置多机ssh免登陆](http://www.jcore.cn/2015/08/10/install-python-pssh/)

`Inotify`搭建参考：[架构实践.数据实时同步备份之rsync+inotify](http://www.jcore.cn/2015/09/12/architect-rsync_inotify/)

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

> Unison安装（web、backup都需要安装unison+inotify）

{% highlight bash %}
# 查看yum源是否有安装包
[root@backup ~]# yum search unison
已加载插件：fastestmirror, security
Loading mirror speeds from cached hostfile
 * base: mirrors.aliyun.com
 * extras: mirrors.aliyun.com
 * updates: mirrors.aliyun.com
警告：没有匹配 unison 的软件包
没有找到匹配的软件包

# 下载epel源
[root@backup ~]# wget -O /etc/yum.repos.d/epel.repo http://mirrors.aliyun.com/repo/epel-6.repo

# 已经查看到版本（这里web、backup两台服务器都使用unison240.x86_64）
[root@backup ~]# yum search unison
已加载插件：fastestmirror, security
Loading mirror speeds from cached hostfile
 * base: mirrors.aliyun.com
 * epel: mirrors.aliyun.com
 * extras: mirrors.aliyun.com
 * updates: mirrors.aliyun.com
epel                                                                                                                                                     | 4.3 kB     00:00     
epel/primary_db                                                                                                                                          | 5.7 MB     00:27     
============================================================================= N/S Matched: unison ==============================================================================
unison227.x86_64 : Multi-master File synchronization tool
unison240.x86_64 : Multi-master File synchronization tool
unison240-gtk.x86_64 : Multi-master File synchronization tool - gtk interface
unison240-text.x86_64 : Multi-master File synchronization tool - text interface

# 安装unison
[root@backup ~]# yum install unison240.x86_64 -y
================================================================================================================================================================================
 软件包                                        架构                                   版本                                           仓库                                  大小
================================================================================================================================================================================
正在安装:
 unison240                                     x86_64                                 2.40.102-5.el6                                 epel                                  89 k
为依赖而安装:
 unison240-gtk                                 x86_64                                 2.40.102-5.el6                                 epel                                 985 k
 
# 查看unison是否安装
[root@web ~]# rpm -qa|grep unison
unison240-gtk-2.40.102-5.el6.x86_64
unison240-2.40.102-5.el6.x86_64

{% endhighlight %}

> Unison参数说明

{% highlight bash %}
# 示例说明
unison /backup/ ssh://192.168.24.101//backup -servercmd=~/usr/bin/unison -testserver
{% endhighlight %}

参数名称|参数说明
----|----
-testserver|测试连通性，连接到服务器即退出
-servercmd|告诉unison，服务器端的unison命令是什么
-auto|接受缺省的动作，然后等待用户确认是否执行
-batch|batch mode，全自动模式，接受缺省动作，并执行
-ignore|增加到忽略列表中
-ignorecase|[true|false|default]是否忽略文件名大小写
-follow|是否支持对符号连接指向内容的同步
-immutable|不变目录，扫描时即忽略
-silent|安静模式
-times|同步修改时间
-path|只同步 -path 参数指定的子目录以及文件，而非整个目录

> 执行需要同步双向备份的文件

{% highlight bash %}
# 执行unison同步，web服务器/backup/目录备份到backup服务器/backup1/目录下
[root@web ~]# unison -batch /backup/ ssh://192.168.24.101//backup1
Contacting server...
Connected [//backup//backup1 -> //web//backup]
Looking for changes
  Waiting for changes from server
Reconciling changes
Nothing to do: replicas have not changed since last sync.
# 查看backup服务器已经同步成功
[root@backup ~]# ls /backup1
a.html  c.html  e.html  g.html  i.html  k.html  m.html  o.html  q.html  s.html  u.html  w.html  y.html
b.html  d.html  f.html  h.html  j.html  l.html  n.html  p.html  r.html  t.html  v.html  x.html  z.html

# 执行unison同步，backup服务器/backup/目录备份到web服务器/backup1/目录下
[root@backup ~]# unison -batch /backup/ ssh://192.168.24.100//backup1
Contacting server...
Connected [//backup//backup -> //web//backup1]
Looking for changes
  Waiting for changes from server
Reconciling changes
Nothing to do: replicas have not changed since last sync.
# 查看web服务器已经同步成功
[root@ web ~]# ls /backup1
a.html  c.html  e.html  g.html  i.html  k.html  m.html  o.html  q.html  s.html  u.html  w.html  y.html
b.html  d.html  f.html  h.html  j.html  l.html  n.html  p.html  r.html  t.html  v.html  x.html  z.html
{% endhighlight %}

{% highlight bash %}
# 客户机双向实时备份脚本（backup换一下ip即可）
[root@web ~]# cd /server/scripts && \
touch unison.sh && \
chmod 755 unison.sh

# 编辑unison实时备份脚本
[root@web scripts]# vim unison.sh
--------------------------------------------
#!/bin/bash
backup_ip="192.168.24.101"
local_dir="/backup"
backup_dir="/backup1"
log_path="/var/log/inotify.log"
/usr/bin/inotifywait -mrq  --format '%w%f' -e create,close_write,delete $local_dir | 
while read line
do
	unison -batch $local_dir ssh://$backup_ip/$backup_dir
	echo -n "$line " >>$log_path
	echo `date "+%F %T"` >>$log_path
done
--------------------------------------------

# 后台执行unison实时备份脚本
[root@web scripts]# sh unison.sh &
[1] 44922

# unison实时备份服务加入开机启动
[root@web sersync]# cat >>/etc/rc.local<<EOF
########start up unison backup by zhangjie at 20150913########
/bin/sh /server/scripts/unison.sh &
EOF

{% endhighlight %}

###OK，今天先到这儿了 :) 

-----------------------

参考文档：

Unison - <http://www.cis.upenn.edu/~bcpierce/unison/docs.html>
