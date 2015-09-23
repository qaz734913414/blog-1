---
layout: column_1_2
title:  "架构实践.多机免登录批量管理"
description: "架构实践.多机登录陆批量管理"
keywords: 架构实践,多机登录陆批量管理,sshpass,ssh,pssh,pdsh
origin: 张嘉杰.原创
date:   2015-09-18
category: architect
tags: linux sshpass ssh pssh pdsh
---
所谓的"免登录"其实是不存在的，只是说，从验证密码的登录方式，改为公私钥对的登录验证方式。使用后者的方式，每次会由ssh客户端自动发送验证信息，所以就免去了人工输入密码，看起来好像"免登录"一样。或者使用sshpass免交互面授权登录，为了方便多服务器用户密码最好一致。
<!--more-->

> 部署环境准备

服务器系统|角色|IP
----|----|----
CentOS6.6 x86_64|WEB1服务端（WEB1）|192.168.24.100
CentOS6.6 x86_64|WEB2服务端（WEB2）|192.168.24.101
CentOS6.6 x86_64|备份服务端（BACKUP）|192.168.24.102

>  服务器、软件版本

{% highlight bash %}
-------backup备份服务器-------
[root@backup ~] cat /etc/redhat-release
CentOS release 6.6 (Final)
[root@backup ~] uname -r
2.6.32-504.el6.x86_64

-------web1应用服务器-------
[root@web1 ~] cat /etc/redhat-release
CentOS release 6.6 (Final)
[root@backup ~] uname -r
2.6.32-504.el6.x86_64

-------web2应用服务器-------
[root@web2 ~] cat /etc/redhat-release
CentOS release 6.6 (Final)
[root@backup ~] uname -r
2.6.32-504.el6.x86_64
{% endhighlight %}


> 多机互信免密码（sshpass、ssh、pssh、pdsh）

* ***sshpass***

`ssh`登录不能在命令行中指定密码，`sshpass`的出现，解决了这一问题。它允许使用`-p`参数指定明文密码，然后直接登录远程服务器，它支持密码从命令行、文件、环境变量中读取。

{% highlight bash %}
# yum 查看 sshpass（sshpass.x86_64）
[root@backup ~]# yum search sshpass
已加载插件：fastestmirror, security
Loading mirror speeds from cached hostfile
 * base: mirrors.aliyun.com
 * epel: mirrors.aliyun.com
 * extras: mirrors.aliyun.com
 * updates: mirrors.aliyun.com
====================================== N/S Matched: sshpass =======================================
sshpass.x86_64 : Non-interactive SSH authentication utility

# 安装 sshpass
[root@backup ~]# yum install sshpass.x86_64
===================================================================================================
 软件包                 架构                  版本                       仓库                 大小
===================================================================================================
正在安装:
 sshpass                x86_64                1.05-1.el6                 epel                 19 k

# 批量访问多机并显示ip
[root@backup ~]# for i in `echo {0..1}`;do sshpass -p 122333 ssh -o StrictHostKeyChecking=no root@192.168.24.10$i "ifconfig eth0|grep -Po '(?<=dr:)\S+'";done
Address 192.168.24.100 maps to localhost, but this does not map back to the address - POSSIBLE BREAK-IN ATTEMPT!
192.168.24.100
Address 192.168.24.101 maps to localhost, but this does not map back to the address - POSSIBLE BREAK-IN ATTEMPT!
192.168.24.101
{% endhighlight %}

* ***ssh 密钥交换（免登录）***

通过`ssh-keygen`的密钥进行身份校验，免去输入密码的烦恼。

{% highlight bash %}
# 生成私钥和公钥的键值对 id_rsa，id_rsa.pub
[root@backup ~]# ssh-keygen -t rsa         
Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa): 
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /root/.ssh/id_rsa.
Your public key has been saved in /root/.ssh/id_rsa.pub.
The key fingerprint is:
c9:83:df:db:82:bf:72:8a:30:14:49:85:49:50:83:61 root@backup
The key s randomart image is:
+--[ RSA 2048]----+
|  E*=+.          |
| ...oo           |
|    o            |
|     . o .       |
|    . . S        |
|   .   . o       |
|    o   ...      |
|     o .o oo     |
|      . .=+o.    |
+-----------------+

# ssh-copy-id 拷贝到需要远程web1管理的机器上
[root@backup ~]# ssh-copy-id -i ~/.ssh/id_rsa.pub "-p 22 root@192.168.24.100"
Address 192.168.24.100 maps to localhost, but this does not map back to the address - POSSIBLE BREAK-IN ATTEMPT!
root@192.168.24.100's password: 
Now try logging into the machine, with "ssh '-p 22 root@192.168.24.100'", and check in:
  .ssh/authorized_keys
to make sure we haven't added extra keys that you weren't expecting.

# ssh-copy-id 拷贝到需要远程web2管理的机器上
[root@backup ~]# ssh-copy-id -i ~/.ssh/id_rsa.pub "-p 22 root@192.168.24.101"
Address 192.168.24.101 maps to localhost, but this does not map back to the address - POSSIBLE BREAK-IN ATTEMPT!
root@192.168.24.101's password: 
Now try logging into the machine, with "ssh '-p 22 root@192.168.24.101'", and check in:
  .ssh/authorized_keys
to make sure we haven't added extra keys that you weren t expecting.

# 批量访问多机并显示ip
[root@backup ~]# for i in `echo {0..1}`;do ssh root@192.168.24.10$i "ifconfig eth0|grep -Po '(?<=dr:)\S+'";done                                               
Address 192.168.24.100 maps to localhost, but this does not map back to the address - POSSIBLE BREAK-IN ATTEMPT!
192.168.24.100
Address 192.168.24.101 maps to localhost, but this does not map back to the address - POSSIBLE BREAK-IN ATTEMPT!
192.168.24.101
{% endhighlight %}


* ***pssh***（建立在ssh多机免登录的基础上）

`pssh`是`python`编写可以在多台服务器上执行命令的工具，同时支持拷贝文件。

{% highlight bash %}
# 查看 pssh
[root@backup ~]# yum search pssh
已加载插件：fastestmirror, security
Loading mirror speeds from cached hostfile
 * base: mirrors.aliyun.com
 * epel: mirrors.aliyun.com
 * extras: mirrors.aliyun.com
 * updates: mirrors.aliyun.com

====================================== N/S Matched: pssh ======================================
mpssh.x86_64 : Parallel ssh tool
pssh.noarch : Parallel SSH tools

# 创建需要批量访问服务器的ip文件
cat>hosts.txt<<EOF 
192.168.24.100
192.168.24.101
EOF

# 并发连接多服务器
[root@backup ~]# pssh -i -h hosts.txt "uptime"             
[1] 00:25:37 [SUCCESS] 192.168.24.100
 00:25:37 up  2:56,  0 users,  load average: 0.00, 0.00, 0.00
Stderr: Address 192.168.24.100 maps to localhost, but this does not map back to the address - POSSIBLE BREAK-IN ATTEMPT!
[2] 00:25:37 [SUCCESS] 192.168.24.101
 00:25:37 up  7:05,  0 users,  load average: 0.00, 0.00, 0.00
Stderr: Address 192.168.24.101 maps to localhost, but this does not map back to the address - POSSIBLE BREAK-IN ATTEMPT!

{% endhighlight %}

* ***pdsh*** 

与`pssh`类似，`pdsh`可并行执行对远程目标主机的操作，在有批量执行命令或分发任务的需求时，使用这个命令可达到事半功倍的效果。同时，`pdsh`还支持交互模式，当要执行的命令不确定时，可直接进入`pdsh`命令行，非常方便。

{% highlight bash %}
# 查看 pdsh（pdsh.x86_64）
[root@backup ~]# yum search pdsh
已加载插件：fastestmirror, security
Loading mirror speeds from cached hostfile
 * base: mirrors.aliyun.com
 * epel: mirrors.aliyun.com
 * extras: mirrors.aliyun.com
 * updates: mirrors.aliyun.com
====================================== N/S Matched: pdsh ======================================
pdsh-mod-dshgroup.x86_64 : Provides dsh-style group file support for pdsh
pdsh-mod-genders.x86_64 : Provides libgenders support for pdsh
pdsh-mod-netgroup.x86_64 : Provides netgroup support for pdsh
pdsh-mod-nodeupdown.x86_64 : Provides libnodeupdown support for pdsh
pdsh-mod-torque.x86_64 : Provides support for running pdsh under Torque jobid
pdsh-rcmd-rsh.x86_64 : Provides bsd rcmd capability to pdsh
pdsh-rcmd-ssh.x86_64 : Provides ssh rcmd capability to pdsh
pdsh.x86_64 : Parallel remote shell program

# 安装 pdsh
[root@backup ~]# yum install pdsh
===============================================================================================
 软件包                    架构               版本                      仓库              大小
===============================================================================================
正在安装:
 pdsh                      x86_64             2.26-4.el6                epel             139 k
为依赖而安装:
 pdsh-rcmd-ssh             x86_64             2.26-4.el6                epel              11 k
 
# 并发连接多服务器
[root@backup ~]# pdsh -w ssh:192.168.24.10[0-1] "uptime"
192.168.24.100: Address 192.168.24.100 maps to localhost, but this does not map back to the address - POSSIBLE BREAK-IN ATTEMPT!
192.168.24.101: Address 192.168.24.101 maps to localhost, but this does not map back to the address - POSSIBLE BREAK-IN ATTEMPT!
192.168.24.101:  00:31:22 up  7:11,  0 users,  load average: 0.00, 0.00, 0.00
192.168.24.100:  00:31:22 up  3:01,  0 users,  load average: 0.00, 0.00, 0.00

# 并发连接多服务器（指定root用户，排除192.168.24.101服务器）
[root@backup ~]# pdsh -R ssh -l root -w 192.168.24.10[0-1] -x 192.168.24.101 "uptime"        
192.168.24.100: Address 192.168.24.100 maps to localhost, but this does not map back to the address - POSSIBLE BREAK-IN ATTEMPT!
192.168.24.100:  00:35:46 up  3:06,  1 user,  load average: 0.00, 0.00, 0.00

{% endhighlight %}

###OK，今天先到这儿了 :) 

-----------------------
