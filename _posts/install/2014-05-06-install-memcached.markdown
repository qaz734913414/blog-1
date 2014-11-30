---
layout: column_1_2
title:  "安装.Memcache"
description: "linux安装,安装Memcache"
keywords: Memcache,linux
origin: 张嘉杰.原创
date:   2014-05-06
category: install
tags: memcache linux
---
`Memcache`是一个高性能的分布式的内存对象缓存系统，通过在内存里维护一个统一的巨大的`hash`表，它能够用来存储各种格式的数据，包括图像、视频、文件以及数据库检索的结果等。
简单的说就是将数据调用到内存中，然后从内存中读取，从而大大提高读取速度。
<!--more-->
公司的服务器都是`linux CentOS5.5`。

> libevent安装及配置

{% highlight bash %}

# 进入/usr/local/src/目录，并下载libevent
$ cd /usr/local/src/ && wget http://down.shshenchu.com/libevent-2.0.21-stable.tar.gz

# 解压libevent，并进入libevent目录
$ tar -zxvf libevent-2.0.21-stable.tar.gz && cd libevent-2.0.21-stable

# 生成makefile，并编译和安装
$ ./configure --prefix=/usr/local/libevent && make -j2 && make isntall
make[3]: Leaving directory `/usr/local/libevent-2.0.21-stable/test'
make[2]: Leaving directory `/usr/local/libevent-2.0.21-stable/test'
make[1]: Leaving directory `/usr/local/libevent-2.0.21-stable'
make: *** 没有规则可以创建目标“isntall”。 停止。 

# yum查看并安装GCC
$ yum search gcc && yum isntall gcc

# 先清空在重新编译安装
$ make clean && make -j2 && make isntall

{% endhighlight %}

> memcached安装及配置

{% highlight bash %}

# 进入/usr/local/src/目录，并下载memcached
$ cd /usr/local/src/ && wget http://down.shshenchu.com/memcached-1.4.20.tar.tar

# 解压memcached，并进入memcached目录
$ tar -zxvf memcached-1.4.20.tar.tar && memcached-1.4.20

# 生成makefile，并编译和安装
$ ./configure --prefix=/usr/local/memcached --with-libevent=/usr/local/libevent/ && make -j2 && make install

{% endhighlight %}

完成以上步骤。就安装成功了。  

> memcached服务

{% highlight bash %}

# 启动memcached服务端
/usr/local/memcached/bin/memcached -d -m 128 -u root -p 12000 -c 256 -P /usr/local/memcached/logs/memcached.pid

# 结束memcache进程
kill `cat /usr/local/memcached/logs/memcached.pid`

{% endhighlight %}

参数选项说明：

{% highlight html %}

-d:是启动一个守护进程
-m:是分配给memcache使用的内存数量，单位是MB.
-u:是运行memcache的用户
-l:是监听的服务器IP地址，如果有多个地址的话
-p:是设置memcache监听的端口
-c:选项是最大运行的并发连接数，默认是1024
-P:是设置保存memcache的pid文件

{% endhighlight %}

-----------------------

相关参考文章地址：

libevent官网 - <http://libevent.org/>
memcached官网 - <http://www.memcached.org/>

-----------------------
