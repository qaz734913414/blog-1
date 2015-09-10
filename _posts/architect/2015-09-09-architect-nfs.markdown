---
layout: column_1_2
title:  "架构实践.高可用NFS集群"
description: "架构实践.高可用NFS集群 架构实践 nfs"
keywords: 架构实践,高可用NFS集群,nfs
origin: 张嘉杰.原创
date:   2015-09-09
category: architect
tags: linux nfs
---
`NFS（Network File System）`即网络文件系统，是`FreeBSD`支持的文件系统中的一种，它允许网络中的计算机之间通过`TCP/IP`网络共享资源。  
<!--more-->
在`NFS`的应用中，本地`NFS`的客户端应用可以透明地读写位于远端`NFS`服务器上的文件，就像访问本地文件一样。

# NFS搭建

-----

> NFS服务端部署环境准备

服务器系统|角色|IP|内网IP
----|----|----|----
CentOS6.6 x86_64|NFS服务端（NFS-SERVER）|192.168.24.7|10.128.10.7
CentOS6.6 x86_64|NFS客户端（NFS-CLIENT1）|192.168.24.8|10.128.10.8
CentOS6.6 x86_64|NHS客户端（NFS-CLIENT2）|192.168.24.9|10.128.10.9

>  服务器版本

{% highlight bash %}

[root@nfs-server ~]$ cat /etc/redhat-release
CentOS release 6.6 (Final)
[root@nfs-server ~]$ uname -r
2.6.32-504.el6.x86_64

{% endhighlight %}

>  NFS软件列表

`NFS`可以被视为一个`RPC`程序，在启动任何一个`RPC`程序之前，需要做好端口的对应映射作用，这个映射工作就是由`rpcbind`服务来完成的,因此在提供`NFS`之前必须先启动`rpcbind`服务

{% highlight bash %}

首先准备以下软件包
* nfs-utils（NFS服务主程序，包括rpc.nfsd、rpc.mountd两个deamons和相关文档说明及执行命令文件等）
* rpcbind（CentOS6.X下面RPC主程序，CentOS5.X下面为portmap）

{% endhighlight %}

>  安装NFS软件包

三台机器都需要安装`NFS`软件包，showmount命令在`NFS`包中，客户端`NFS`服务不配置，不启动

{% highlight bash %}

# 查看NFS软件的安装情况（CentOS6.6，没有默认安装NFS软件包，CentOS5默认会安装）
[root@nfs-server ~]$ rpm -aq nfs-utils rpcbind
# 安装NFS软件包
[root@nfs-server ~]$ yum install nfs-utils rpcbind -y
================================================================================================================
 软件包                         架构                  版本                            仓库                 大小
================================================================================================================
正在安装:
 nfs-utils                      x86_64                1:1.2.3-64.el6                  base                331 k
 rpcbind                        x86_64                0.2.0-11.el6                    base                 51 k
为依赖而安装:
 keyutils                       x86_64                1.4-5.el6                       base                 39 k
 libevent                       x86_64                1.4.13-4.el6                    base                 66 k
 libgssglue                     x86_64                0.1-11.el6                      base                 23 k
 libtirpc                       x86_64                0.2.1-10.el6                    base                 79 k
 nfs-utils-lib                  x86_64                1.1.5-11.el6                    base                 68 k
 python-argparse                noarch                1.2.1-2.1.el6                   base                 48 k
 
{% endhighlight %}

>  NFS服务器配置

* `NFS`的常用目录

	目录路径|目录说明
	----|----
	/etc/exports|NFS服务的主要配置文件
	/usr/sbin/exportfs|NFS服务的管理命令
	/usr/sbin/showmount|客户端的查看命令
	/var/lib/nfs/etab|记录NFS分享出来的目录的完整权限设定值
	/var/lib/nfs/xtab|记录曾经登录过的客户端信息

* `NFS`服务端的权限设置，`/etc/exports`文件配置格式中小括号中的参数

	参数名称(*为重要参数)|参数用途
	----|----
	rw*|Read-write，表示可读写权限
	ro|Read-only，表示只读权限
	sync*|请求或写入数据时，数据同步写入到NF SServer中，（优点：数据安全不会丢，缺点：系能较差）
	async*|请求或写入数据时，先返回请求，再将数据写入到NFSServer中，异步写入数据
	no_root_squash|访问NFS Server共享目录的用户如果是root的话，它对共享目录具有root权限
	not_squash|访问NFS Server共享目录的用户如果是root的话，则它的权限，将被压缩成匿名用户
	all_squash*|不管访问NFS Server共享目录的身份如何，它的权限都被压缩成一个匿名用户，同事它的UID、GID都会变成nfsnobody账号身份
	anonuid*|匿名用户ID
	anongid*|匿名组ID
	insecure|允许客户端从大于1024的TCP/IP端口连NFS服务器
	secure|限制客户端只能从小于1024的TCP/IP端口连接NFS服务器(默认设置)
	wdelay|检查是否有相关的写操作，如果有则将这些写操作一起执行，这样可提高效率(默认设置)
	no_wdelay|若有写操作则立即执行（应与sync配置）
	subtree_check|若输出目录是一个子目录，则NFSW:务器将检查其父目录的权限(默认设置)
	no_subtree_check|即使输出目录是一个子目录，NFS服务器也不检查其父目录的权限，这样做可提高效率

> 启动NFS服务端

{% highlight bash %}

# 查看rpcbind状态
[root@nfs-server ~]# /etc/init.d/rpcbind status
rpcbind is stopped
# 启动rpcbind状态
[root@nfs-server ~]# /etc/init.d/rpcbind start
Starting rpcbind:                                          [  OK  ]
# 查看rpcbind状态
[root@nfs-server ~]# /etc/init.d/rpcbind status
rpcbind (pid  1826) is running...
# 查看rpcbind默认端口111
[root@nfs-server ~]# lsof -i :111
COMMAND  PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
rpcbind 1826  rpc    6u  IPv4  12657      0t0  UDP *:sunrpc 
rpcbind 1826  rpc    8u  IPv4  12660      0t0  TCP *:sunrpc (LISTEN)
rpcbind 1826  rpc    9u  IPv6  12662      0t0  UDP *:sunrpc 
rpcbind 1826  rpc   11u  IPv6  12665      0t0  TCP *:sunrpc (LISTEN)
# 查看rpcbind服务端口
[root@nfs-server ~]# netstat -lntup|grep rpcbind
tcp        0      0 0.0.0.0:111                 0.0.0.0:*                   LISTEN      1826/rpcbind        
tcp        0      0 :::111                      :::*                        LISTEN      1826/rpcbind        
udp        0      0 0.0.0.0:729                 0.0.0.0:*                               1826/rpcbind        
udp        0      0 0.0.0.0:111                 0.0.0.0:*                               1826/rpcbind        
udp        0      0 :::729                      :::*                                    1826/rpcbind        
udp        0      0 :::111                      :::*                                    1826/rpcbind 
# 查看rpcbind开机是否自启动
[root@nfs-server ~]# chkconfig --list rpcbind
rpcbind         0:off   1:off   2:on    3:on    4:on    5:on    6:off
# 查看nfs端口信息（没有发现）
[root@nfs-server ~]# rpcinfo -p localhost
   program vers proto   port  service
    100000    4   tcp    111  portmapper
    100000    3   tcp    111  portmapper
    100000    2   tcp    111  portmapper
    100000    4   udp    111  portmapper
    100000    3   udp    111  portmapper
    100000    2   udp    111  portmapper
# 查看NFS服务是否启动
[root@nfs-server ~]# /etc/init.d/nfs status
rpc.svcgssd 已停
rpc.mountd is stopped
nfsd is stopped
rpc.rquotad is stopped
# 启动NFS服务
[root@nfs-server ~]# /etc/init.d/nfs start
Starting NFS services:                                     [  OK  ]
Starting NFS quotas:                                       [  OK  ]
Starting NFS mountd:                                       [  OK  ]
Starting NFS daemon:                                       [  OK  ]
正在启动 RPC idmapd：                                      [确定]
# 查看nfs端口信息（已创建很多端口）
[root@nfs-server ~]# rpcinfo -p localhost
   program vers proto   port  service
    100000    4   tcp    111  portmapper
    100000    3   tcp    111  portmapper
    100000    2   tcp    111  portmapper
    100000    4   udp    111  portmapper
    100000    3   udp    111  portmapper
    100000    2   udp    111  portmapper
    100011    1   udp    875  rquotad
    100011    2   udp    875  rquotad
    100011    1   tcp    875  rquotad
    100011    2   tcp    875  rquotad
    100005    1   udp   9464  mountd
    100005    1   tcp  58712  mountd
    100005    2   udp  48690  mountd
    100005    2   tcp  52314  mountd
    100005    3   udp  44991  mountd
    100005    3   tcp   4620  mountd
    100003    2   tcp   2049  nfs
    100003    3   tcp   2049  nfs
    100003    4   tcp   2049  nfs
    100227    2   tcp   2049  nfs_acl
    100227    3   tcp   2049  nfs_acl
    100003    2   udp   2049  nfs
    100003    3   udp   2049  nfs
    100003    4   udp   2049  nfs
    100227    2   udp   2049  nfs_acl
    100227    3   udp   2049  nfs_acl
    100021    1   udp  11467  nlockmgr
    100021    3   udp  11467  nlockmgr
    100021    4   udp  11467  nlockmgr
    100021    1   tcp  53295  nlockmgr
    100021    3   tcp  53295  nlockmgr
    100021    4   tcp  53295  nlockmgr
# 查看nfs开机是否启动（未打开）
[root@nfs-server ~]# chkconfig --list nfs
nfs             0:off   1:off   2:off   3:off   4:off   5:off   6:off
# 设置nfs开机自启动
[root@nfs-server ~]# chkconfig nfs on
# 查看nfs开机是否启动（已打开）
[root@nfs-server ~]# chkconfig --list nfs
nfs             0:off   1:off   2:on    3:on    4:on    5:on    6:off

{% endhighlight %}

如何确定`rpcbind`服务一定在`NFS`服务之前启动？？？

{% highlight bash %}

# 无须调整，默认rpcbind开机顺序为13，nfs为30
[root@nfs-server ~]# cat /etc/init.d/rpcbind|grep 'chkconfig'        
# chkconfig: 2345 13 87（开机启动顺序13）
[root@nfs-server ~]# cat /etc/init.d/nfs|grep 'chkconfig'     
# chkconfig: - 30 60（开机启动顺序30）

{% endhighlight %}

题外话：一般生产环境中不使用`chkconfig`对服务做管理，而是直接添加在`/etc/rc.local`集中添加、管理服务（`yum`中没有相应的软件，使用编译安装，需要写启动脚本文件，等等情况）

{% highlight bash %}

# 启动文件中添加NFS启动服务
cat >>/etc/rc.local<< EOF
########start up nfs service by zhangjie at 20150909########
/etc/init.d/rpcbind start
/etc/init.d/nfs start
EOF

{% endhighlight %}

> 配置NFS服务端

`NFS`配置文件为`/etc/exports`，并且默认时空的

{% highlight bash %}

# 查看NFS配置文件
[root@nfs-server ~]# ll /etc/exports 
-rw-r--r--. 1 root root 0 1月  12 2010 /etc/exports

{% endhighlight %}

`/etc/exports`配置文件格式  
`NFS`共享的目录 `NFS`客户端地址（参1，参2...）  
`NFS`共享的目录 `NFS`客户端地址1（参1，参2...） 客户端地址2（参1，参2...）  

{% highlight bash %}

# 创建共享目录
mkdir /data
# NFS配置文件添加共享目录相关信息
cat >>/etc/exports<< EOF
########nfs sync dir by zhangjie at 20150909########
/data  192.168.24.0/24(rw,sync,all_squash)
EOF
# NFS平滑生效
/etc/init.d/nfs reload
--------------------------------
当然也可以直接用`exportfs`命令直接提供共享目录
exportfs -o rw,sync,all_squash 192.168.24.0/24:/data

{% endhighlight %}

{% highlight bash %}

# 查看共享记录
[root@nfs-server ~]# showmount -e localhost
Export list for localhost:
/data 192.168.24.*
# 本机挂载测试
[root@nfs-server ~]# mount -t nfs 192.168.24.7:/data /mnt
# 查看是否已经挂载成功
[root@nfs-server ~]# df -h
Filesystem          Size  Used Avail Use% Mounted on
/dev/sda3            18G  1.6G   15G  10% /
tmpfs               491M     0  491M   0% /dev/shm
/dev/sda1           190M   61M  120M  34% /boot
192.168.24.7:/data   18G  1.6G   15G  10% /mnt
# 创建一个测试文件
[root@nfs-server ~]# touch /data/test.txt
# 查看文件是否同步
[root@nfs-server ~]# ls /mnt/            
test.txt

{% endhighlight %}

> 配置NFS客户端（lamp01、lnmp02两台机器配置一致）

{% highlight bash %}

# 启动rpcbind服务
[root@lamp01 ~]# /etc/init.d/rpcbind start
Starting rpcbind:                                          [  OK  ]
# 测试是否可以连接NFS服务器
[root@lamp01 ~]# showmount -e 192.168.24.7
Export list for 192.168.24.7:
/data 192.168.24.*
# 挂载客户端NFS服务
[root@lamp01 ~]# mount -t nfs 192.168.24.7:/data /mnt
# 查看是否挂载成功
[root@lamp01 ~]# df -h
Filesystem          Size  Used Avail Use% Mounted on
/dev/sda3            18G  1.6G   15G  10% /
tmpfs               491M     0  491M   0% /dev/shm
/dev/sda1           190M   61M  120M  34% /boot
192.168.24.7:/data   18G  1.6G   15G  10% /mnt
# 最后在/etc/rc.local中加入服务
cat >>/etc/rc.local<< EOF
########start up rpcbind service by zhangjie at 20150909########
/etc/init.d/rpcbind start
mount -t nfs 192.168.24.7:/data /mnt
EOF

{% endhighlight %}

到这里基本就完成`NFS`客户端的配置了，下面我们来测试一下客户端往test.txt文件中写入数据

{% highlight bash %}

# 修改一下文件时间（应该是权限问题）
[root@lamp01 mnt]# touch test.txt 
touch: cannot touch 'test.txt': Permission denied

# 查看NFS服务器参数配置
[root@nfs-server /]# cat /etc/exports 
########nfs sync dir by zhangjie at 20150909########
/data  192.168.24.*(rw,sync)
# 查看NFS服务器完整参数配置（仔细看默认添加了很多参数，这里的anonuid用户、anongid组）
[root@nfs-server /]# cat /var/lib/nfs/etab 
/data   192.168.24.*(rw,sync,wdelay,hide,nocrossmnt,secure,root_squash,no_all_squash,no_subtree_check,secure_locks,acl,anonuid=65534,anongid=65534,sec=sys,rw,root_squash,no_all_squash)
# 查看用户组为65534的用户（nfsnobody用户）
[root@nfs-server /]# grep '65534' /etc/passwd
nfsnobody:x:65534:65534:Anonymous NFS User:/var/lib/nfs:/sbin/nologin
# 更改目录所属用户、所属组
[root@nfs-server /]# chown -R nfsnobody.nfsnobody /data/
# 查看目录所属用户、所属组
[root@nfs-server /]# ls -ld /data/
drwxr-xr-x 2 nfsnobody nfsnobody 4096 9月   8 07:16 /data/

{% endhighlight %}

> NFS系统安全挂载
	
一般`NFS`服务器共享的只是普通的静态数据（图片、附件、视频等等），不需要执行suid、exec等权限，挂载的这个文件系统，只能作为存取至用，无法执行程序，对于客户端来讲增加了安全性，（如：很多木马篡改站点文件都是由上传入口上传的程序到存储目录，然后执行的）注意：非性能的参数越多，速度可能越慢

{% highlight bash %}

# 安全挂载参数（nosuid、noexec、nodev）
mount -t nfs nosuid,noexec,nodev,rw 192.168.24.7:/data /mnt
# 禁止更新目录及文件时间戳挂载（noatime、nodiratime）
mount -t nfs noatime,nodiratime 192.168.24.7:/data /mnt
# 安全加优化的挂载方式（nosuid、noexec、nodev、noatime、nodiratime、intr、rsize、wsize）
mount -t nfs -o nosuid,noexec,nodev,noatime,nodiratime,intr,rsize=131072,wsize=131072 192.168.24.7:/data /mnt
# 默认挂载方式（无）
mount -t nfs 192.168.24.7:/data /mnt

{% endhighlight %}

这里说一个有意思的`umount`卸载问题：进入挂在目录后如何卸载

{% highlight bash %}

# 进入挂在目录
[root@lnmp02 ~]# cd /mnt/
# 卸载/mnt/目录（提示：设备忙）
[root@lnmp02 mnt]# umount /mnt/
umount.nfs: /mnt: device is busy
umount.nfs: /mnt: device is busy
# 加上-lf参数，再次卸载/mnt/目录
[root@lnmp02 mnt]# umount -lf /mnt/
# 查看/mnt/已卸载
[root@lnmp02 mnt]# df -h
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda3        18G  1.6G   15G  10% /
tmpfs           491M     0  491M   0% /dev/shm
/dev/sda1       190M   61M  120M  34% /boot

{% endhighlight %}

> NFS服务内核优化

nfs内核参数优化文件路径|nfs内核参数优化文件说明
----|----
/proc/sys/net/core/rmem_default|指定该文件接收套接字缓冲区大小的省缺值
/proc/sys/net/core/rmem_max|指定该文件接收套接字缓冲区大小的最大值
/proc/sys/net/core/wmem_default|指定该文件发送套接字缓冲区大小的省缺值
/proc/sys/net/core/wmem_max|指定该文件发送套接字缓冲区大小的最大值

{% highlight bash %}

cat >>/etc/sysctl.conf<<EOF
# tune nfs kernel parametres
net.core.wmem_default = 8388608
net.core.rmem_default = 8388608
net.core.wmem_max = 16777216
net.core.rmem_max = 16777216
EOF

{% endhighlight %}

> NFS服务端防火墙控制

{% highlight bash %}

# 允许内部ip段访问（*）
iptables -A INPUT -s 10.128.10.0/24 -j ACCEPT
# 允许Ip段加端口访问
iptables -A INPUT -i eth1 -p tcp -s 10.128.10.0/24 --dport 111 -j ACCEPT
iptables -A INPUT -i eth1 -p udp -s 10.128.10.0/24 --dport 111 -j ACCEPT
iptables -A INPUT -i eth1 -p udp -s 10.128.10.0/24 --dport 2049 -j ACCEPT
iptables -A INPUT -i eth1 -p udp -s 10.128.10.0/24 -j ACCEPT

{% endhighlight %}

###OK，今天先到这儿了 :) 

-----------------------

相关参考文章地址：

nfs-howto - <http://nfs.sourceforge.net/nfs-howto/>  
whatis_nfs- <http://nfs.sourceforge.net/nfs-howto/ar01s02.html#whatis_nfs>  
Network_File_System - <https://en.wikipedia.org/wiki/Network_File_System>
