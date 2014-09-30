---
layout: page
title:  "架构实践.CAS单点登录实现过程"
description: "架构实践.单点登录部署 架构实践 sso cas tomcat"
keywords: 架构实践,单点登录部署,sso,cas,tomcat
origin: 张嘉杰.原创
date:   2014-05-29
category: architect
tags: sso cas tomcat
---
SSO开源框架有很多，[JSecurity]、[JOSSO]、[CAS]，对比之后个人比较倾向`JOSSO`,测试完成，发现`JOSSO`不能跨域访问，果断舍弃。继续研究 CAS。  
<!--more-->

首先检查环境，然后下载需要的工具

{% highlight bash %}

# 查看jdk版本
$ java -version
java version "1.7.0_10"

# 下载工具(依次为tomcat、cas-server、cas-client)
$ wget http://ftp.cuhk.edu.hk/pub/packages/apache.org/tomcat/tomcat-7/v7.0.55/bin/apache-tomcat-7.0.55-deployer.tar.gz
$ wget http://downloads.jasig.org/cas/cas-server-4.0.0-release.tar.gz
$ wget http://downloads.jasig.org/cas-clients/cas-client-3.2.1-release.tar.gz

{% endhighlight %}

修改本地host。因为公司电脑是win7系统，host路径为：`C:\Windows\System32\drivers\etc\host`增加：  
{% highlight html %}

192.168.1.10 sso.228.com.cn #单点登录服务器
192.168.1.11 web.228.com.cn #网站服务
192.168.1.12 wap.228.com.cn #手机服务

{% endhighlight %}

部署CAS服务

>  生成证书

{% highlight bash %}

# 创建keytool证书（参考下图）
$ keytool -genkey -alias 228 -keyalg RSA -keystore "/home/ssokey/228key"

{% endhighlight %}

![创建keytool证书]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-0.png)

{% highlight bash %}

# 生成keytool证书（参考下图）
$ keytool -export -file /home/ssokey/228key.crt -alias 228 -keystore /home/ssokey/228key

{% endhighlight %}

![生成keytool证书]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-1.png)

{% highlight bash %}

# keytool证书导入jdk（参考下图）
$ keytool -import -keystore "/usr/local/jdk1.7.0_10/jre/lib/security/cacerts" -file /home/ssokey/228key.crt -alias 228

{% endhighlight %}

![keytool证书导入jdk]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-2.png)

>  部署服务端

{% highlight bash %}

# 解压 apache-tomcat-7.0.55.tar.gz       
$ tar xvf /home/tomcat/apache-tomcat-7.0.55.tar.gz
# 解压 cas-server-4.0.0-release.tar.gz     
$ tar xvf /home/software/cas-server-4.0.0-release.tar.gz
# 移动cas-management-webapp-4.0.0.war 到 tomcat  /webapps/ 目录下
$ mv cas-server-4.0.0/modules/cas-server-webapp-4.0.0.war /home/tomcat/tomcat_sso/webapps/

{% endhighlight %}


{% highlight bash %}

# 修改 /conf/server.xml 增加下面的内容（参考下图）
# 添加 scheme="https" secure="true" SSLEnabled="true" clientAuth="false" sslProtocol="TLS" keystoreFile="/home/ssokey/228key" keystorePass="ylpwsso"
$ vim /home/tomcat/apache-tomcat-7.0.55/conf/server.xml

{% endhighlight %}

![修改server.xml]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-3.png)

访问地址 https://sso.228.com.cn:8011/cas-server-webapp-4.0.0 打开网站。因为本地8080端口被oracle端口占用，所以修改tomcat端口为8011。

![修改server.xml]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-4.png)

![修改server.xml]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-5.png)

输入用户名密码登录

![修改server.xml]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-6.png)

OK, 今天就到这儿了。到此为止CAS单点登录基础DEMO就算是完成了。后续我会继续分享集成登录到具体应用中的方法。

-----------------------

相关参考文章地址：

CAS - <http://www.jasig.org/cas>  
Tomcat-Container-Authentication - <https://wiki.jasig.org/display/CASC/Tomcat+Container+Authentication>  
CAS-client-integration-tomcat-v7 - <https://github.com/Jasig/java-cas-client/tree/master/cas-client-integration-tomcat-v7>  
CAS-demo - <https://wiki.jasig.org/display/CASUM/Demo>  
CAS-client-simple-webapp - <https://wiki.jasig.org/display/CASC/JA-SIG+Java+Client+Simple+WebApp+Sample>

-----------------------

[JSecurity]: http://www.jsecurity.org/
[JOSSO]: http://www.josso.org/
[CAS]: http://www.jasig.org/