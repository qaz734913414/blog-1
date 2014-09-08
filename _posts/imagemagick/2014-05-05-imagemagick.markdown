---
layout: page
title:  "imagemagick 安装"
description: "imagemagick 安装"
keywords: imagemagick,jmagick,linux,mac
origin: 张嘉杰.原创
date:   2014-05-05
categories: imagemagick
tags: imagemagick jmagick linux mac
---
公司商品页图片儿用java程序压缩以后，展示出来不是很清楚，图片的质量被领导质疑，和技术总监商量测试完以后决定使用`imagemagick`来压缩图片。
下面我分别来介绍一下`linux`和`mac`下的安装方法。  
<!--more-->
因为公司的服务器都是`linux CentOS5.5`。家里用的是`mac`笔记本。好了，开始吧。

linux下：(公司测试服务器已经安装过imagemagick、和jmagick)
{% highlight bash %}
# 查看ImageMagick版本号
[root@zjj ~]# rpm -qa | grep ImageMagick
ImageMagick-6.2.8.0-4.el5_1.1

# 查看jmagick版本号
[root@zjj ~]# rpm -qa | grep jmagick
jmagick-6.4.0-3

# 先卸载imagemagick老版本
[root@zjj ~]# rpm -e ImageMagick-6*
error: "ImageMagick-6.2.8.0-4.el5_1.1" specifies multiple packages

# 加上两个参数就行
[root@zjj ~]# rpm -e --allmatches --nodeps ImageMagick-6.2*

# 卸载jmagick老版本
[root@zjj ~]# rpm -e jmagick*
error: package jmagick-6.4.0-3.x86_64.rpm is not installed
	
# 加上两个参数就行
[root@zjj ~]# rpm -e --allmatches --nodeps ImageMagick-6.2*

# 从jmagick网站下载6.4.0版本的imagemagick和jmagick
[root@zjj ~]# wget http://downloads.jmagick.org/6.4.0/ImageMagick-6.4.0-0.tar.gz
[root@zjj ~]# tar zxvf ImageMagick-6.4.0-0.tar.gz && cd ImageMagick-6.4.0 
[root@zjj ImageMagick-6.4.0]# ./configure --prefix=/usr/local/ImageMagick && make && make install

# 查看java目录（安装jmagick需要with-java-home）
[root@zjj]# which java 

[root@zjj ~]# wget http://downloads.jmagick.org/6.4.0/jmagick-6.4.0-src.tar.gz
[root@zjj ~]# tar zxvf jmagick-6.4.0-src.tar.gz && cd 6.4.0
[root@zjj 6.4.0]# ./configure --prefix=/usr/local/jmagick --with-magick-home=/usr/local/ImageMagick --with-java-home=/usr/local/java

# 复制相关so文件，到jre目录
[root@zjj]# cp /usr/local/jmagick/lib/libJMagick.so /usr/local/java/jre/lib/amd64/
[root@zjj]# cp /usr/local/jmagick/lib/jmagick-6.4.0.jar /usr/local/java/jre/lib/ext/

{% endhighlight %}

完成以上步骤。就安装成功了。  
要在程序里面使用`jmagick`来调用`ImageMagick`，需要在代码里面设置`systemclassloader=no`或者在`tomcat`下`catalina.sh`里面添加`CATALINA_OPTS="-Djmagick.systemclassloader=no"`  
需要注意的一点：服务器是64位，那jdk必须也是64位，否则得话程序里调用`jmagick.jar`是不会成功的！

mac下：(家里的版本是OSX 10.9.3)。
{% highlight bash %}

# 查看已安装的插件集合
root:~ zjj$ brew list

# 查看是否有imagemagick插件
root:~ zjj$ brew search imagemagick

# 安装imagemagick插件
root:~ zjj$ brew install imagemagick

{% endhighlight %}

`mac`下相对对比较简单哈。不熟悉`brew`命令的朋友，参考我这个帖子 [mac新做系统安装软件]。

-----------------------

相关参考文章地址：

imagemagick - <http://www.imagemagick.org/script/index.php>

-----------------------

[mac新做系统安装软件]: /2014/02/10/newmac/