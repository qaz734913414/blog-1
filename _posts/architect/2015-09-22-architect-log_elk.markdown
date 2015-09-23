---
layout: column_1_2
title:  "架构实践.实时日志集中管理平台之ELK"
description: "架构实践.实时日志集中管理平台之ELK"
keywords: 架构实践,实时日志集中管理平台,elk
origin: 张嘉杰.原创
date:   2015-09-22
category: architect
tags: linux elk
---
日志监控和分析在保障业务稳定运行时，起到了很重要的作用，不过一般情况下日志都分散在各个生产服务器，且开发人员无法登陆生产服务器，这时候就需要一个集中式的日志收集装置，对日志中的关键字进行监控，触发异常时进行报警，并且开发人员能够查看相关日志。
<!--more-->

![ELK]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}.png)

`elk`架构是一种开源的日志管理方案组合，其中包含`elasticsearch`、`logstash`、`kibana`

{% highlight html %}
* logstash是一个管理日志和事件的工具，在部署时有两种运行模式：standalone、centralized
	+ standalone：就是所有的事情都在一台服务器上运行，包括日志收集、日志索引、前端WEB界面都部署在一台机器上
	+ centralized：就是多服务器模式，从很多服务器运输(ship)日志到一台总的日志(collector)服务器上用来索引和查找

* elasticsearch是一个基于lucene的开源搜索引擎，分布式的搜索分析系统
* kibana是一个可视化日志和数据系统，作为WEB前端可以很容易的和elasticsearch系统结合
{% endhighlight %}

> 部署环境准备

服务器系统|角色|IP|软件
----|----|----|----
CentOS6.6 x86_64|WEB1服务端（WEB1）|192.168.24.100|logstash-forwarder、nginx、tomcat、jdk
CentOS6.6 x86_64|WEB2服务端（WEB2）|192.168.24.101|logstash-forwarder、nginx、tomcat、jdk
CentOS6.6 x86_64|日志服务端（LOG）|192.168.24.102|logstash、logstash-forwarder、elasticsearch、kibana、jdk

> 服务器使用的包版本

{% highlight html %}
elasticsearch-1.7.2.noarch.rpm
jdk-7u80-linux-x64.rpm
kibana-4.1.2-linux-x64.tar.gz
logstash-1.5.4-1.noarch.rpm
logstash-forwarder-0.4.0-1.x86_64.rpm
nginx-1.8.0-1.el6.ngx.x86_64.rpm
pssh-2.3.1.tar.gz
pv-1.4.4-1.el6.rf.x86_64.rpm
{% endhighlight %}

> 服务器、系统版本

{% highlight bash %}
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

-------log备份服务器-------
[root@log ~] cat /etc/redhat-release
CentOS release 6.6 (Final)
[root@log ~] uname -r
2.6.32-504.el6.x86_64
{% endhighlight %}

> 统一服务端安装

* 统一安装 Logstash Forwarder（db、web1、web2、log）

{% highlight bash %}
# 下载 Logstash Forwarder
[root@web ~]# wget https://download.elastic.co/logstash-forwarder/binaries/logstash-forwarder-0.4.0-1.x86_64.rpm

# yum 安装 Logstash Forwarder
[root@web ~]# rpm -ivh logstash-forwarder-0.4.0-1.x86_64.rpm

# 查看 Logstash Forwarder 配置
[root@web ~]# rpm -qc logstash-forwarder
/etc/logstash-forwarder.conf

# 备份配置文件
cp /etc/logstash-forwarder.conf /etc/logstash-forwarder.conf.back
{% endhighlight %}

> 日志服务端

* ***安装 Java 环境***

{% highlight bash %}
# 下载 jdk
[root@log ~]# wget --no-check-certificate --no-cookies --header "Cookie: oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jdk/7u80-b15/jdk-7u80-linux-x64.rpm

# rpm 安装 jdk
[root@log ~]# rpm -ivh jdk-7u80-linux-x64.rpm

# 设置环境变量
[root@log ~]# cat >>/etc/profile<<EOF
#================================= 
JAVA_HOME=/usr/java/jdk1.7.0_80/
JRE_HOME=$JAVA_HOME/jre/
PATH=$JAVA_HOME/bin:$PATH
CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
export JAVA_HOME JRE_HOME PATH CLASSPATH
EOF

# 环境变量配置文件生效
[root@log ~]# . /etc/profile

# 查看java版本
[root@log ~]# java -version 
java version "1.7.0_80"
Java(TM) SE Runtime Environment (build 1.7.0_80-b15)
Java HotSpot(TM) 64-Bit Server VM (build 24.80-b11, mixed mode)
{% endhighlight %}

* ***安装 Elasticsearch***

{% highlight bash %}
# 下载 Elasticsearch
[root@log ~]# wget https://download.elastic.co/elasticsearch/elasticsearch/elasticsearch-1.7.2.noarch.rpm

# yum 安装 Elasticsearch
[root@log ~]# rpm -ivh elasticsearch-1.7.2.noarch.rpm 

# 查看 Elasticsearch 的配置文件
[root@log ~]# rpm -qc elasticsearch
/etc/elasticsearch/elasticsearch.yml
/etc/elasticsearch/logging.yml
/etc/init.d/elasticsearch
/etc/sysconfig/elasticsearch
/usr/lib/sysctl.d/elasticsearch.conf
/usr/lib/systemd/system/elasticsearch.service
/usr/lib/tmpfiles.d/elasticsearch.conf

# 安装插件
[root@log ~]# cd /usr/share/elasticsearch/bin/ && ./plugin -install mobz/elasticsearch-head && ./plugin -install lukas-vlcek/bigdesk/2.5.0

# 启动 Elasticsearch 服务
[root@log ~]# /etc/init.d/elasticsearch start
Starting elasticsearch:                                    [  OK  ]

# 查看端口 9200
[root@log local]# netstat -nltp
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address               Foreign Address             State       PID/Program name   
tcp        0      0 0.0.0.0:22                  0.0.0.0:*                   LISTEN      959/sshd            
tcp        0      0 :::9300                     :::*                        LISTEN      2030/java           
tcp        0      0 :::22                       :::*                        LISTEN      959/sshd            
tcp        0      0 :::9200                     :::*                        LISTEN      2030/java  

# 测试访问服务
[root@log ~]# curl -X GET http://localhost:9200/
{
  "status" : 200,
  "name" : "Mojo",
  "cluster_name" : "elasticsearch",
  "version" : {
    "number" : "1.7.2",
    "build_hash" : "e43676b1385b8125d647f593f7202acbd816e8ec",
    "build_timestamp" : "2015-09-14T09:49:53Z",
    "build_snapshot" : false,
    "lucene_version" : "4.10.4"
  },
  "tagline" : "You Know, for Search"
}

# 刚刚加载的插件，通过浏览器可以查看（监控集群节点、查看索引、数据浏览等）
http://192.168.24.102:9200/_plugin/bigdesk/
http://192.168.24.102:9200/_plugin/head/
{% endhighlight %}

* ***安装 Kibana***

{% highlight bash %}
# 下载 Kibana
[root@log ~]# wget https://download.elastic.co/kibana/kibana/kibana-4.1.2-linux-x64.tar.gz

# 解压 Kibana
[root@log ~]# tar zxf kibana-4.1.2-linux-x64.tar.gz -C /usr/local/ && \
cd /usr/local/ && \
mv kibana-4.1.2-linux-x64 kibana

# 创建 Kibana 服务
vim /etc/rc.d/init.d/kibana
---------------------------------
#!/bin/bash
### BEGIN INIT INFO
# Provides:          kibana
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Runs kibana daemon
# Description: Runs the kibana daemon as a non-root user
### END INIT INFO

. /etc/init.d/functions

# Process name
NAME=kibana
DESC="Kibana4"
PROG="/etc/init.d/kibana"
# Configure location of Kibana bin
KIBANA_BIN=/usr/local/kibana/bin
# PID Info
PID_FOLDER=/var/run/kibana/
PID_FILE=/var/run/kibana/$NAME.pid
LOCK_FILE=/var/lock/subsys/$NAME
PATH=/bin:/usr/bin:/sbin:/usr/sbin:$KIBANA_BIN
DAEMON=$KIBANA_BIN/$NAME
# Configure User to run daemon process
DAEMON_USER=root
# Configure logging location
KIBANA_LOG=/var/log/kibana.log

# Script
RETVAL=0

if [ `id -u` -ne 0 ]; then
	echo "You need root privileges to run this script"
	exit 1
fi

start() {
	echo -n "Starting $DESC : "
	pid=`pidofproc -p $PID_FILE kibana`
	if [ -n "$pid" ] ; then
		echo "Already running."
		exit 0
	else
	# Start Daemon
		if [ ! -d "$PID_FOLDER" ] ; then
			mkdir $PID_FOLDER
		fi
		daemon --user=$DAEMON_USER --pidfile=$PID_FILE $DAEMON 1>"$KIBANA_LOG" 2>&1 &
		sleep 2
		pidofproc node > $PID_FILE
		RETVAL=$?
		[[ $? -eq 0 ]] && success || failure
		echo
		[ $RETVAL = 0 ] && touch $LOCK_FILE
		return $RETVAL
	fi
}

reload()
{
    echo "Reload command is not implemented for this service."
    return $RETVAL
}

stop() {
	echo -n "Stopping $DESC : "
	killproc -p $PID_FILE $DAEMON
        RETVAL=$?
echo
	[ $RETVAL = 0 ] && rm -f $PID_FILE $LOCK_FILE
}
 
case "$1" in
	start)
		 start
		 ;;
	stop)
		 stop
		 ;;
	status)
		 status -p $PID_FILE $DAEMON
		 RETVAL=$?
		 ;;
	restart)
		 stop
		 start
		 ;;
	reload)
		 reload
		 ;;
	*)
		 # Invalid Arguments, print the following message.
		 echo "Usage: $0 {start|stop|status|restart}" >&2
		 exit 2
		 ;;
esac

# 修改启动权限
[root@log local]# chmod 755 /etc/rc.d/init.d/kibana

# 启动 Kibana 服务
[root@log local]# /etc/init.d/kibana start
Starting Kibana4 :                                         [  OK  ]

# 查看端口
[root@log local]# netstat -nltp
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address               Foreign Address             State       PID/Program name   
tcp        0      0 0.0.0.0:22                  0.0.0.0:*                   LISTEN      959/sshd            
tcp        0      0 0.0.0.0:5601                0.0.0.0:*                   LISTEN      2376/node           
tcp        0      0 :::9300                     :::*                        LISTEN      2030/java           
tcp        0      0 :::22                       :::*                        LISTEN      959/sshd            
tcp        0      0 :::9200                     :::*                        LISTEN      2030/java 
{% endhighlight %}

* ***安装 Logstash***

{% highlight bash %}
# 下载 Logstash 安装包
[root@log ~]# wget https://download.elastic.co/logstash/logstash/packages/centos/logstash-1.5.4-1.noarch.rpm

# yum 安装 Logstash
[root@log ~]# rpm -ivh logstash-1.5.4-1.noarch.rpm

# 测试 Logstash
[root@log ~]# /opt/logstash/bin/logstash -e 'input { stdin { } } output { stdout {} }'
Logstash startup completed

# 输入信息（看到输出则 Logstash 正常工作）
jcore.cn
2015-09-23T05:12:47.478Z log jcore.cn

# 设置FQDN，创建SSL证书的时候需要配置FQDN
[root@log ~]# cat >>/etc/hosts<<EOF
127.0.0.1 10-128-10-12
10.128.10.12 log.jcore.cn log
EOF

# 查看hostname结果
[root@log ~]# hostname
log
[root@log ~]# hostname -f
log.jcore.cn

# 设置内网网卡
[root@log ~]# cat >/etc/sysconfig/network-scripts/ifcfg-eth0:0<<EOF
DEVICE=eth0:0
TYPE=Ethernet
ONBOOT=yes
BOOTPROTO=none
IPADDR=10.128.10.12
NETMASK=255.255.255.0
GATEWAY=10.128.10.1
EOF

# 重启网卡（让 10.128.10.12 生效）
[root@log ~]# /etc/init.d/network restart
Shutting down interface eth0:                              [  OK  ]
Shutting down loopback interface:                          [  OK  ]
Bringing up loopback interface:                            [  OK  ]
Bringing up interface eth0:  Determining if ip address 192.168.24.102 is already in use for device eth0...
Determining if ip address 10.128.10.12 is already in use for device eth0...
                                                           [  OK  ]

# 设置ssl，之前设置的FQDN是log.jcore.cn
[root@log ~]# cd /etc/pki/tls/

# 创建证书
# openssl req -x509  -batch -nodes -newkey rsa:2048 -keyout lumberjack.key -out lumberjack.crt -subj /CN=logstash.example.com
[root@log ~]# openssl req -subj '/CN=log.jcore.cn/' -x509 -days 3650 -batch -nodes -newkey rsa:2048 -keyout private/logstash-forwarder.key -out certs/logstash-forwarder.crt
Generating a 2048 bit RSA private key
..........+++
......................+++
writing new private key to 'private/logstash-forwarder.key'
-----

# 创建 logstash-test.conf 文件
[root@log ~]# cat >/etc/logstash/conf.d/logstash-test.conf << EOF
input {
  lumberjack {
    port => 5000
    type => "logs"
    ssl_certificate => "/etc/pki/tls/certs/logstash-forwarder.crt"
    ssl_key => "/etc/pki/tls/private/logstash-forwarder.key"
  }
}

filter {
  if [type] == "syslog" {
    grok {
      match => { "message" => "%{SYSLOGTIMESTAMP:syslog_timestamp} %{SYSLOGHOST:syslog_hostname} %{DATA:syslog_program}(?:\[%{POSINT:syslog_pid}\])?: %{GREEDYDATA:syslog_message}" }
      add_field => [ "received_at", "%{@timestamp}" ]
      add_field => [ "received_from", "%{host}" ]
    }
    syslog_pri { }
    date {
      match => [ "syslog_timestamp", "MMM  d HH:mm:ss", "MMM dd HH:mm:ss" ]
    }
  }
}

output {
  elasticsearch { host => localhost }
  stdout { codec => rubydebug }
}
EOF

# 启动 logstash 服务
[root@log ~]# /etc/init.d/logstash start
logstash started.

# 查看端口 5000
[root@log ~]# netstat -nltp
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address               Foreign Address             State       PID/Program name   
tcp        0      0 0.0.0.0:22                  0.0.0.0:*                   LISTEN      959/sshd            
tcp        0      0 0.0.0.0:5601                0.0.0.0:*                   LISTEN      1996/node           
tcp        0      0 :::9300                     :::*                        LISTEN      1930/java           
tcp        0      0 :::9301                     :::*                        LISTEN      3074/java           
tcp        0      0 :::22                       :::*                        LISTEN      959/sshd            
tcp        0      0 :::5000                     :::*                        LISTEN      3074/java           
tcp        0      0 :::9200                     :::*                        LISTEN      1930/java 

# 本地测试创建 logstash-forwarder.conf 文件
[root@log ~]# cat >/etc/logstash-forwarder.conf<<EOF
{
  "network": {
    "servers": [ "log.jcore.cn:5000" ],
    "ssl ca": "/etc/pki/tls/certs/logstash-forwarder.crt",
    "timeout": 5
  },
  "files": [
    {
      "paths": [ 
        "/var/log/jcore.log"
      ],
      "fields": { 
        "type": "logs" 
      }
    }
  ]
}
EOF

# 启动本地 logstash-forwarder 服务
[root@log ~]# /etc/init.d/logstash-forwarder start
logstash-forwarder started

# 输入测试文字
[root@log ~]# echo "jcore.cn" >>/var/log/jcore.log

# 查看日志推送返回结果
[root@log ~]# cat /var/log/logstash/logstash.stdout
{
       "message" => "jcore.cn",
      "@version" => "1",
    "@timestamp" => "2015-09-23T07:51:30.823Z",
          "type" => "logs",
          "file" => "/var/log/jcore.log",
          "host" => "log",
        "offset" => "30"
}

# 浏览器查看 logstash 页面
http://192.168.24.102:5601/

# 增加节点和客户端配置一样，注意同步证书
/etc/pki/tls/certs/logstash-forwarder.crt
{% endhighlight %}

> 最终结果

![elk-elasticsearch-1]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-1.png)

![elk-elasticsearch-2]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-2.png)

![elk-kibana]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-3.png)

###OK，今天先到这儿了 :) 

-----------------------

参考文档：

JDK - <http://www.oracle.com/technetwork/java/javase/downloads/index.html>  
Elasticsearch - <https://www.elastic.co/downloads/elastiEcsearch>  
Logstash - <https://www.elastic.co/downloads/logstash>  
Kibana - <https://www.elastic.co/downloads/kibana>  
Redis - <http://redis.io/download>  
Centralized-Logging-Architecture - <http://jasonwilder.com/blog/2013/07/16/centralized-logging-architecture/>
