---
layout: column_1_2
title:  "集群管理工具pssh"
description: "集群管理工具pssh"
keywords: linux,shell,pssh
origin: 张嘉杰.原创
date:   2015-08-10
category: linux
tags: linux shell pssh
---
今儿一个朋友问我有没有批量并行执行脚本的命令，这里我给他推荐了一个工具，`pssh`是`python`编写可以在多台服务器上执行命令的工具，同时支持拷贝文件，是同类工具中很出色的，类似`pdsh`。
<!--more-->
为方便操作，使用前需要在个服务器上配置好密钥认证访问，这样无须在输入密码，用起来也比较方便。当然还是推荐用`ansible`和`saltstack`这样的扩展性比较强的工具。
还是那句话，看你的环境怎么爽怎么来。

> 安装 pssh

{% highlight bash %}

wget http://parallel-ssh.googlecode.com/files/pssh-2.3.1.tar.gz && \
tar xf pssh-2.3.1.tar.gz && \
cd pssh-2.3.1 && \
python setup.py install && \
cd .. && \
rm -rf pssh-2.3.*

{% endhighlight %}

参数解释:
{% highlight html %}

-h 执行命令的远程主机列表,文件内容格式 [user@]host[:port] 如 root@127.0.0.1:22
-H 执行命令主机，主机格式 user@ip:port
-l 远程机器的用户名
-p 一次最大允许多少连接
-P 执行时输出执行信息
-o 输出内容重定向到一个文件
-e 执行错误重定向到一个文件
-t 设置命令执行超时时间
-A 提示输入密码并且把密码传递给ssh(如果私钥也有密码也用这个参数)
-O 设置ssh一些选项
-x 设置ssh额外的一些参数，可以多个，不同参数间空格分开
-X 同-x,但是只能设置一个参数
-i 显示标准输出和标准错误在每台host执行完毕后

{% endhighlight %}

附加工具:
{% highlight html %}

pscp 传输文件到多个hosts，类似 scp
pslurp 从多台远程机器拷贝文件到本地
pnuke 并行在远程主机杀进程
prsync 使用rsync协议从本地计算机同步到远程主机

{% endhighlight %}

首先先设置多机ssh免登陆。

![ssh免登陆]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}.png)  

{% highlight bash %}

# 需要生成rsa的key
ssh-keygen -t rsa

#拷贝到需要远程管理的机器上（输入yes，执行完毕即可）
ssh-copy-id -i ~/.ssh/id_rsa.pub "-p 22 root@192.168.24.100"
ssh-copy-id -i ~/.ssh/id_rsa.pub "-p 22 root@192.168.24.101"
ssh-copy-id -i ~/.ssh/id_rsa.pub "-p 22 root@192.168.24.102"

#建立文件添加远程需要管理的机器IP
cat>hosts.txt<<EOF 
192.168.24.100
192.168.24.101
192.168.24.102
EOF

{% endhighlight %}

验证pssh并发的特性

![pssh时间]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-0.png)  
![pssh时间]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-1.png)  
![pssh延时3秒返回时间]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-2.png)  

{% highlight bash %}

#验证是否无需密码执行shell命令
pssh -i -h hosts.txt "uptime"

#多服务器建立目录，并返回建立目录列表
pssh -i -h hosts.txt "mkdir -p /data/{app,tmp,log,bin,conf,data} && ls -lhi /data"

#测试并发的特性
time pssh -i -h hosts.txt "sleep 3;uptime"

{% endhighlight %}

###到这里基本就完成了。还算是挺简单。:)

-----------------------

相关参考文章地址：

pssh-howto - <http://www.theether.org/pssh/docs/0.2.3/pssh-HOWTO.html>

-----------------------
