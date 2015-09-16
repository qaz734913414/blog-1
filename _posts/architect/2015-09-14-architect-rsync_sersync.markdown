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

{% highlight shell %}
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

> Sersync客户端安装（web服务器）

{% highlight shell %}
# 创建并进入目录
[root@web ~]# mkdir -p /server/app && cd /server/app/

# 下载Sersync安装包
[root@web app]# wget http://7q5apr.com1.z0.glb.clouddn.com/resources/repos/backup/sersync2.5.4_64bit_binary_stable_final.tar.gz
--2015-09-10 23:41:42--  http://7q5apr.com1.z0.glb.clouddn.com/resources/repos/backup/sersync2.5.4_64bit_binary_stable_final.tar.gz
正在解析主机 7q5apr.com1.z0.glb.clouddn.com... 118.212.135.173, 218.58.222.99
正在连接 7q5apr.com1.z0.glb.clouddn.com|118.212.135.173|:80... 已连接。
已发出 HTTP 请求，正在等待回应... 200 OK
长度：727290 (710K) [application/x-compressed]
正在保存至: “sersync2.5.4_64bit_binary_stable_final.tar.gz”
100%[======================================================================================================================================>] 727,290      474K/s   in 1.5s    
2015-09-10 23:41:44 (474 KB/s) - 已保存 “sersync2.5.4_64bit_binary_stable_final.tar.gz” [727290/727290])

# 解压并修改目录名称和目录结构
[root@web app]# tar zxf sersync2.5.4_64bit_binary_stable_final.tar.gz && \
mv GNU-Linux-x86/ sersync/ && \
cd sersync/ && \
mkdir {bin,conf,log} && \
mv confxml.xml conf && \
mv sersync2 bin/sersync

# 查看目录结构
[root@web sersync]# tree
.
├── bin
│   └── sersync
├── conf
│   └── confxml.xml
└── log

{% endhighlight %}

{% highlight xml %}
# 更新sersync配置文件confxml.xml
[root@web sersync]# cp conf/confxml.xml conf/confxml.xml.bak && \
cat >>conf/confxml.xml<<EOF
<?xml version="1.0" encoding="ISO-8859-1"?>
<head version="2.5">
    <host hostip="localhost" port="8008"></host>
    <debug start="false"/>
    <fileSystem xfs="false"/>
    <filter start="false">
        <exclude expression="(.*)\.svn"></exclude>
        <exclude expression="(.*)\.gz"></exclude>
        <exclude expression="^info/*"></exclude>
        <exclude expression="^static/*"></exclude>
    </filter>
    <inotify>
        <delete start="true"/>
        <createFolder start="true"/>
        <createFile start="false"/>
        <closeWrite start="true"/>
        <moveFrom start="true"/>
        <moveTo start="true"/>
        <attrib start="false"/>
        <modify start="false"/>
    </inotify>

    <sersync>
        <localpath watch="/backup">
            <remote ip="192.168.24.101" name="backup"/>
        </localpath>
        <rsync>
            <commonParams params="-artuz"/>
            <auth start="true" users="rsync_backup" passwordfile="/etc/rsync.password"/>
            <userDefinedPort start="false" port="874"/><!-- port=874 -->
            <timeout start="false" time="100"/><!-- timeout=100 -->
            <ssh start="false"/>
        </rsync>
        <crontab start="false" schedule="600"><!--600mins-->
            <crontabfilter start="false">
                <exclude expression="*.php"></exclude>
                <exclude expression="info/*"></exclude>
            </crontabfilter>
        </crontab>
        <plugin start="false" name="command"/>
    </sersync>
</head>
EOF
{% endhighlight %}

> 启动sersync服务

参数名称|参数说明
----|----
-d|启用守护进程模式
-r|在监控前，将监控目录与远程主机用rsync命令推送一遍
-n|指定开启守护线程的数量，默认为10个
–o|指定配置文件，默认使用confxml.xml文件

{% highlight shell %}
# 运行sersync服务
[root@web sersync]# /server/app/sersync/bin/sersync -r -d -o /server/app/sersync/conf/confxml.xml >/server/app/sersync/log/rsync.log 2>&1 &

set the system param
execute：echo 50000000 > /proc/sys/fs/inotify/max_user_watches
execute：echo 327679 > /proc/sys/fs/inotify/max_queued_events
parse the command param
option: -r      rsync all the local files to the remote servers before the sersync work
option: -d      run as a daemon
option: -o      config xml name：  /server/app/sersync/conf/confxml.xml
daemon thread num: 10
parse xml config file
host ip : localhost     host port: 8008
daemon start，sersync run behind the console 
use rsync password-file :
user is rsync_backup
passwordfile is         /etc/rsync.password
config xml parse success
please set /etc/rsyncd.conf max connections=0 Manually
sersync working thread 12  = 1(primary thread) + 1(fail retry thread) + 10(daemon sub threads) 
Max threads numbers is: 22 = 12(Thread pool nums) + 10(Sub threads)
please according your cpu ，use -n param to adjust the cpu rate
------------------------------------------
rsync the directory recursivly to the remote servers once
working please wait...
execute command: cd /backup && rsync -artuz -R --delete ./ rsync_backup@192.168.24.101::backup --password-file=/etc/rsync.password >/dev/null 2>&1 
run the sersync: 
watch path is: /backup

# 添加测试文件
[root@web sersync]# touch /backup/{a..z}.html

# 验证同步完毕
[root@backup ~]# ls /backup/
a.html  c.html  e.html  g.html  i.html  k.html  m.html  o.html  q.html  s.html  u.html  w.html  y.html
b.html  d.html  f.html  h.html  j.html  l.html  n.html  p.html  r.html  t.html  v.html  x.html  z.html

# sersync实时备份服务加入开机启动
cat >>/etc/rc.local<<EOF
########start up sersync backup by zhangjie at 20150913########
/server/app/sersync/bin/sersync -r -d -o /server/app/sersync/conf/confxml.xml >/server/app/sersync/log/rsync.log 2>&1 &
EOF
{% endhighlight %}

###OK，今天先到这儿了 :) 

-----------------------
