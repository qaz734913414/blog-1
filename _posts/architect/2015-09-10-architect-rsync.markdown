---
layout: column_1_2
title:  "架构实践.数据同步备份服务器"
description: "架构实践.数据同步备份服务器"
keywords: 架构实践,数据同步备份服务器,rsync
origin: 张嘉杰.原创
date:   2015-09-10
category: architect
tags: linux rsync
---
服务器里数据最重要，商业用途的数据更加重要，一旦丢失，结果不堪设想。所以备份很重要，而文件的备份比较高效的备份是增量备份，`rsync`就是这样的一个工具
<!--more-->
实现多个服务器负载均衡，我们需要这几个服务器之间进行数据同步，`rsync`软件也能胜任，下面就来说说如何架设`rsync`服务器来达到文件增量备份和数据同步的功能

`rsync`是一款开源、快速、多功能、可实现全量及增量的本地或远处数据同步备份的优秀工具，相当于`scp`+`cp`+`rm`命令的集合，但优于他们每一个命令

# Rsync 数据同步工具

> 命令详解

{% highlight bash %}
------local模式------
# 复制hosts文件到/tmp/目录下
[root@nfs-server ~]# rsync -avz /etc/hosts /tmp/

# 建立空目录
[root@nfs-server ~]# mkdir /null
# 让/tmp/目录与/null/目录相同
[root@nfs-server ~]# rsync -avz --delete /null/ /tmp/
# 让/tmp/目录与/null/目录相同，排除1.txt,2.txt文件
[root@nfs-server ~]# rsync -avz --exclude={1.txt,2.txt} /null/ /tmp/

------remote模式------
# 远程push
[root@nfs-server ~]# rsync -avzP -e 'ssh -p 54211' /tmp/ zhangjie@192.168.24.8:/tmp/
# 远程pull
[root@nfs-server ~]# rsync -avzP -e 'ssh -p 54211' zhangjie@192.168.24.8:/tmp/ /opt/

{% endhighlight %}

> 常用参数

参数名称|参数用途
----|----
-a, --archive|归档模式，表示以递归方式传输文件，并保持所有文件属性
-v, --verbose|详细模式输出 
-z, --compress|对备份的文件在传输时进行压缩处理 
-r, --recursive|对子目录以递归模式处理
-t, --times|保持文件时间信息
-o, --owner|保持文件属主信息
-p, --perms|保持文件权限
-g, --group|保持文件属组信息
-P, --progress|显示备份过程
-D, --devices|保持设备文件信息
-l, --links|保留软链结
-e, --rsh=COMMAND|指定使用rsh、ssh方式进行数据同步

> rsync部署环境准备

服务器系统|角色|IP
----|----|----
CentOS6.6 x86_64|WEB服务端（LAMP01）|192.168.24.8
CentOS6.6 x86_64|WEB服务端（LNMP02）|192.168.24.9
CentOS6.6 x86_64|备份服务端（BACKUP）|192.168.24.10

>  服务器、软件版本

{% highlight bash %}
[root@backup ~] cat /etc/redhat-release
CentOS release 6.6 (Final)
[root@backup ~] uname -r
2.6.32-504.el6.x86_64
[root@backup ~]# rpm -qa rsync
rsync-3.0.6-12.el6.x86_64
{% endhighlight %}

> rsync服务器配置

默认`rsync`配置文件是不存在的

{% highlight bash %}
# 创建rsync服务配置文件
[root@backup ~]# touch /etc/rsyncd.conf

# 添加配置文件
cat >>/etc/rsyncd.conf<<EOF
#Rsync server
#create by zhangjie 2015-09-10
##rsync.conf start##
uid = rsync
gid = rsync
use chroot = no
max connections = 2000
timeout = 600
pid file = /var/run/rsyncd.pid
lock file = /var/run/rsync.lock
log file = /var/log/rsyncd.log
ignore errors
read only = false
list = false
hosts allow = 192.168.24.0/24
hosts deny = 0.0.0.0/32
auth users = rsync_backup
secrets file = /etc/rsync.password
#####################################
[backup]
comment = www by zhangjie 2015-09-10
path = /backup
EOF

# 启动rsync服务（rsync --deamon --address=192.168.24.10，address限定只有访问此ip才能同步）
[root@backup ~]# rsync --deamon
# 查看rsync服务进程
[root@backup ~]# ps -ef|grep rsync
root       1546      1  0 07:03 ?        00:00:00 rsync --daemon
root       1548   1484  0 07:03 pts/0    00:00:00 grep --color=auto rsync

# 查看rsync服务端口
[root@backup ~]# netstat -lntup|grep rsync
tcp        0      0 0.0.0.0:873                 0.0.0.0:*                   LISTEN      1546/rsync          
tcp        0      0 :::873                      :::*                        LISTEN      1546/rsync
# 同上
[root@backup ~]# ss -lntup|grep rsync       
tcp    LISTEN     0      5                     :::873                  :::*      users:(("rsync",1546,5))
tcp    LISTEN     0      5                      *:873                   *:*      users:(("rsync",1546,3))
# 同上根据端口号查看
[root@backup ~]# lsof -i :873
COMMAND  PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
rsync   1546 root    3u  IPv4  11466      0t0  TCP *:rsync (LISTEN)
rsync   1546 root    5u  IPv6  11467      0t0  TCP *:rsync (LISTEN)

# rsync加入开机启动
cat >>/etc/rc.local<<EOF
########start up rsync service by zhangjie at 20150910########
rsync --deamon
EOF

# 查看rsync用户（不存在）
[root@backup ~]# id rsync
id: rsync：无此用户
# 创建用户（不能登录，不创建家目录）
[root@backup ~]# useradd rsync -s /sbin/nologin -M
# 查看rsync用户（已存在）
[root@backup ~]# id rsync
uid=501(rsync) gid=501(rsync) 组=501(rsync)

# 创建备份目录
[root@backup ~]# mkdir /backup
# 给予目录所属用户、组
[root@backup ~]# chown -R rsync.rsync /backup/
# 查看目录所属用户、组、权限
[root@backup ~]# ls -ld /backup/
drwxr-xr-x 2 rsync rsync 4096 9月   9 07:17 /backup/
# 创建rsync用户名：密码
[root@backup ~]# echo "rsync_backup:122333" >/etc/rsync.password

# 查看rsync密码文件权限（其他用户可见）
[root@backup ~]# ll /etc/rsync.password
-rw-r--r-- 1 root root 20 9月   9 07:22 /etc/rsync.password
# 修改密码文件权限
[root@backup ~]# chmod 600 /etc/rsync.password
# 查看rsync密码文件权限（其他用户不可见）
[root@backup ~]# ll /etc/rsync.password
-rw------- 1 root root 20 9月   9 07:22 /etc/rsync.password
{% endhighlight %}

> 配置rsync客户端（lamp01、lnmp02两台机器配置一致）

{% highlight bash %}
# 建立客户端密码文件
[root@lamp01 ~]# echo "122333" >/etc/rsync.password
# 修改客户端密码文件权限
[root@lamp01 ~]# chmod 600 /etc/rsync.password
# 查看客户端密码文件权限（其他用户不可见）
[root@backup ~]# ll /etc/rsync.password
-rw------- 1 root root 20 9月   9 07:22 /etc/rsync.password

# lamp01客户端推送目录文件至备份服务器（::backup对应/etc/rsyncd.conf配置文件中的[backup]）
[root@lamp01 ~]# rsync -avz /tmp/ rsync_backup@192.168.24.10::backup --password-file=/etc/rsync.password

# lnmp02客户端从备份服务器拉取目录文件至/tmp/目录
[root@lnmp02 ~]# rsync -avz rsync_backup@192.168.24.10::backup /tmp/ --password-file=/etc/rsync.password
{% endhighlight %}

###OK，今天先到这儿了 :) 

-----------------------

相关参考文章地址：

Rsync - <https://www.samba.org/ftp/rsync/rsync.html>
