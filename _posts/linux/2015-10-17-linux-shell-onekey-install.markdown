---
layout: column_1_2
title:  "一键搭建（博客、论坛、CMS）系统"
description: "一键搭建（博客、论坛、CMS）系统"
keywords: linux,shell,blog,bbs,cms,wordpress,discuz,dedecms
origin: 张嘉杰.原创
date:   2015-10-17
category: shell
tags: linux shell wordpress discuz dedecms
---
花了一天的时间写了个傻瓜式一键安装的脚本程序，`Wordpress`搭建博客，`Discuz`搭建论坛，`DedeCms`搭建`CMS`平台，如果你对于网站质量、
访问速度以及稳定性有所要求，或者你以后还想借助服务器干点其它什么事情，相信这篇文章会对你有所帮助。
<!--more-->

> 个人博客搭建流程 

{% highlight html %}

需要要作如下准备
-----------------------
1. 购买一个独立域名
2. 购买服务器空间(国内主机需要备案，香港、国外不用)
3. 域名解析(绑定域名，完成解析)
4. 上传程序脚本(一键安装LNAMP+WordPress+Discuz+DedeCms)
5. 浏览器输入域名(解析成功后，开始安装wp)
6. 网站正式上线
-----------------------
这里只介绍 4、5 两步

{% endhighlight %}

> 部署环境准备

服务器系统|角色|IP 
----|----|----
CentOS6.6 x86_64|服务端 |192.168.24.100

> 软件介绍

软件|介绍 
----|----|----
WordPress|WordPress是一种使用PHP语言开发的博客平台，用户可以在支持PHP和MySQL数据库的服务器上架设属于自己的网站。附加插件里默认安装了（多说留言插件、七牛CND插件、支持手机端浏览插件）
Discuz|Discuz! 的基础架构采用世界上最流行的web编程组合PHP+MySQL实现，是一个经过完善设计，适用于各种服务器环境的高效论坛系统解决方案。
DedeCms|Dedecms是以简单、实用、开源而闻名，是国内最知名的PHP开源网站管理系统，也是使用用户最多的PHP类CMS系统，基于PHP+MySQL的技术架构。

>  服务器版本

{% highlight bash %}

[root@web1 ~]$ cat /etc/redhat-release
CentOS release 6.6 (Final)
[root@web1 ~]$ uname -r
2.6.32-504.el6.x86_64

{% endhighlight %}

>  脚本目录

{% highlight bash %}

#先来介绍一下目录结构
[root@web1 exam]# tree -l 5 /server/
5 [error opening dir]
/server/
├── data 数据目录
├── exam 安装脚本目录
│   ├── blog.sh #博客安装脚本额
│   ├── global.sh #全局变量脚本
│   ├── lib #脚本工具包
│   │   ├── asserts.sh #断言验证脚本
│   │   ├── commons.sh #常用方法脚本
│   │   └── log.sh #日志脚本
│   ├── log #日志目录
│   │   └── log-2015-10-17.log #日志文件
│   └── module #模块目录
│       ├── env #初始化目录
│       │   ├── install_dir.sh #添加用户、组、文件脚本
│       │   ├── install_env.sh #异常处理脚本
│       │   └── libiconv-1.14.tar.gz #php安装所需包
│       ├── lanmp #httpd、nginx、mysql、php集成安装目录
│       │   ├── httpd #apache服务目录
│       │   │   ├── apr-1.5.2.tar.gz #apache2.4+安装所需包
│       │   │   ├── apr-util-1.5.4.tar.gz #apache2.4+安装所需
│       │   │   ├── config #apache配置目录
│       │   │   │   └── httpd-2.4.16 #apache配置版本目录
│       │   │   │       ├── httpd.conf 
│       │   │   │       ├── httpd-vhosts.conf
│       │   │   │       └── vhosts #多域名配置目录
│       │   │   │           └── wordpress.conf
│       │   │   ├── httpd-2.4.16.tar.gz #apache安装包
│       │   │   └── install_httpd-2.4.16.sh #apache安装脚本
│       │   ├── mysql #mysql目录
│       │   │   ├── install_mysql-5.5.46-linux2.6-x86_64.sh #mysql安装脚本
│       │   │   └── mysql-5.5.46-linux2.6-x86_64.tar.gz #mysql安装包
│       │   ├── nginx #nginx目录
│       │   │   ├── config #nginx配置目录
│       │   │   │   └── nginx-1.6.3 #nginx配置版本目录
│       │   │   │       ├── fastcgi.conf
│       │   │   │       ├── nginx
│       │   │   │       ├── nginx.conf
│       │   │   │       └── vhosts #多域名配置目录
│       │   │   │           └── wordpress.conf
│       │   │   ├── install_nginx-1.6.3.sh #nginx安装脚本
│       │   │   └── nginx-1.6.3.tar.gz #nginx安装包
│       │   └── php #php目录
│       │       ├── install_httpd_php-5.5.7.sh #httpd集成php安装包
│       │       ├── install_nginx_php-5.5.7.sh #nginx集成php安装包
│       │       └── php-5.5.7.tar.gz #php安装包
│       └── www #web项目目录
│			  ├── dede #DedeCMS程序目录
│           │   ├── DedecmsV53-UTF8-Final.tar.gz #DedeCMS安装包
│           │   └── install_DedecmsV53-UTF8-Final.sh #DedeCMS安装脚本
│           ├── discuz #DiscuzBBS程序目录
│           │   ├── Discuz_X3.1_TC_UTF8.zip #DiscuzBBS安装包
│           │   ├── install_Discuz_X3.1_TC_UTF8.sh #DiscuzBBS安装脚本
│           └── wordpress #wordpress程序目录
│               ├── plugins #插件目录
│       	      │   ├── duoshuo.zip #多说留言插件
│       	      │   ├── mobilepress.zip #手机端浏览插件
│       	      │   ├── wpjam-qiniu.zip #七牛CND插件
│       	      │   └── wp-player.zip #内外网音乐插件
│               ├── install_wordpress-4.2-zh_CN.sh #wordpress安装脚本
│               └── wordpress-4.2-zh_CN.tar.gz #wordpress安装包
├── exam.zip #脚本包
├── log #日志目录
├── scripts #脚本主目录
└── temp #临时文件目录

{% endhighlight %}

> 执行一键安装脚本（具体脚本就不贴出来了）

{% highlight bash %}

# 远程下载脚本
[root@web1 ~]# curl -sSL http://7q5apr.com1.z0.glb.clouddn.com/install.sh | bash

# 执行 blog 脚本
[root@web1 ~]# cd /server/scripts/exam
[root@web1 exam]# sh init.sh
----------------------------------------
| DATE       : 2015-10-17 20:11:51
| HOSTNAME   : web1
| USER       : root
| IP         : 192.168.24.100
| VERSION    : 0.0.23
----------------------------------------
| 一键安装个人博客（LNAMP+WordPress+Discuz+Dede）
----------------------------------------
| MySQL: root/123456
| WordPress: wordpress/wordpress
| Discuz: discuz/discuz
| Dede: dede/dede
----------------------------------------
| WordPress: blog.jcore.cn
| Discuz: bbs.jcore.cn
| DedeCms: cms.jcore.cn
----------------------------------------
1) LNMP+WordPress
2) LNMP+Discuz
3) LNMP+DedeCms
4) LNMP+WordPress+Discuz+DedeCms
5) LAMP+WordPress
6) LAMP+Discuz
7) LAMP+DedeCms
8) LAMP+WordPress+Discuz+DedeCms
0) 退出

请选择[1-8]:（这里选择任意选项安装）
----------------------------------------
.
.
.
.

# 查看安装日志（安装过程大概20分钟，网速好的话会更快一些）
[root@web1 exam]# tail -f log/log-2015-10-17.log
[2015-10-17 23:18:30] INFO [blog.sh][10775] ---------- install_dir ok ----------
[2015-10-17 23:20:26] INFO [blog.sh][10775] ---------- install_env ok ----------
[2015-10-17 23:27:53] INFO [blog.sh][10775] ---------- install_mysql-5.5.46-linux2.6-x86_64 ok ----------
[2015-10-17 23:28:21] INFO [blog.sh][10775] ---------- install_nginx-1.6.3 ok ----------
[2015-10-17 23:35:35] INFO [blog.sh][10775] ---------- install_nginx_php-5.5.7 ok ----------
[2015-10-17 23:37:51] INFO [blog.sh][10775] ---------- install_wordpress-4.2-zh_CN ok ----------
[2015-10-17 23:38:17] INFO [blog.sh][10775] ---------- install_Discuz_X3.1_TC_UTF8 ok ----------
[2015-10-17 23:38:28] INFO [blog.sh][10775] ---------- install_DedecmsV53-UTF8-Final ok ----------

# 设置本机host就行（添加如下即可）
192.168.24.100 blog.jcore.cn bbs.jcore.cn cms.jcore.cn

{% endhighlight %} 

> wordpress 安装过程 

![wordpress]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-14.png)
![wordpress]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-15.png)
![wordpress]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-16.png)
![wordpress]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-17.png)
![wordpress]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-18.png)
![wordpress]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-19.png)

> dedecms 安装过程

![dedecms]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-0.png)
![dedecms]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-1.png)
![dedecms]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-2.png)
![dedecms]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-3.png)
![dedecms]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-4.png)
![dedecms]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-5.png)
![dedecms]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-6.png)

> discuz 安装过程

![discuz]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-7.png)
![discuz]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-8.png)
![discuz]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-9.png)
![discuz]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-10.png)
![discuz]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-11.png)
![discuz]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-12.png)
![discuz]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-13.png)

-----------------------