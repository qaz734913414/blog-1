---
layout: column_1_2
title:  "架构实践.MySQL双主复制"
description: "架构实践.MySQL双主复制"
keywords: 架构实践,MySQL双主复制,mysql
origin: 张嘉杰.原创
date:   2015-12-02
category: architect
tags: linux mysql database
---

Master-Master复制的两台服务器，既是master，又是另一台服务器的slave。这样，任何一方所做的变更，都会通过复制应用到另外一方的数据库中。双主复制有两种模式：
`Master-Master in Active-Active Mode``Master-Master in Active-Passive Mode`。
<!--more-->
如果`master`和`slave`机需要相互同步数据，做成`双主master`就可以实现数据相互同步了，搭建双主复制与主从复制并没有太多区别，
差别仅仅是两台机器都开启二进制日志

![mysql-master-slave]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}.png)

> 部署环境准备

服务器系统|角色|IP
----|----|----
CentOS6.6 x86_64|mysql_master|192.168.24.5
CentOS6.6 x86_64|mysql_slave|192.168.24.6

> 服务器、软件版本

{% highlight bash %}
-------mysql_master1服务器-------
[root@mysql_master1 ~] cat /etc/redhat-release
CentOS release 6.6 (Final)
[root@mysql_master1 ~] uname -r
2.6.32-504.el6.x86_64

-------mysql_master2服务器-------
[root@mysql_master2 ~] cat /etc/redhat-release
CentOS release 6.6 (Final)
[root@mysql_master2 ~] uname -r
2.6.32-504.el6.x86_64
{% endhighlight %}

> MySQL双主复制（mysql-master1端口3306，mysql-master2端口3306）

MySQL多机快速安装过程，前面已经说过了，不知道的朋友点这里：[MySQL安装](http://www.jcore.cn/2015/11/30/install-cmake-mysql/)。

{% highlight bash %}
# mysql_master1查看server-id
[root@mysql_master1 ~]# grep "server-id" /jcore/data/mysql/3306/my.cnf
server-id = 1

# mysql_master2修改server-id
[root@mysql_slave ~]# sed -i 's#^server-id = .*#server-id = 2#g' /jcore/data/mysql/3306/my.cnf
[root@mysql_master2 ~]# grep "server-id" /jcore/data/mysql/3306/my.cnf
server-id = 2

# mysql_master2生成新的server uuid
[root@mysql_master2 ~]# sed -i 's#^server-uuid=.*#server-uuid='`cat /proc/sys/kernel/random/uuid`'#g' /jcore/data/mysql/3306/data/auto.cnf

# mysql_master2重启mysql服务使server-id生效
[root@mysql_master2 ~]# /jcore/data/mysql/3306/mysql restart
Restarting MySQL...
Stoping MySQL...
Starting MySQL...

# mysql_master1授权主机
[root@mysql_master1 ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e " \
grant replication client, \
replication slave on *.* to \
'jcore'@'192.168.24.%' identified by '122333'; \
reset master; \
show binary logs;
"
+------------------+-----------+
| Log_name         | File_size |
+------------------+-----------+
| mysql-bin.000001 |       120 |
+------------------+-----------+

# mysql_master2授权主机
[root@mysql_master2 ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e " \
grant replication client, \
replication slave on *.* to \
'jcore'@'192.168.24.%' identified by '122333'; \
reset master; \
show binary logs;
"
Warning: Using a password on the command line interface can be insecure.
+------------------+-----------+
| Log_name         | File_size |
+------------------+-----------+
| mysql-bin.000001 |       120 |
+------------------+-----------+

# mysql_master2开启slave服务
# Slave_IO_Running、Slave_SQL_Running 都必须为yes
[root@mysql_master2 ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e " \
change master to \
master_host='192.168.24.5', \
master_user='jcore', \
master_password='122333', \
master_port=3306, \
master_log_file='mysql-bin.000001', \
master_log_pos= 120; \
start slave;
"

# mysql_master2看到 Slave_IO_Running: Yes、Slave_SQL_Running: Yes，代表成功
[root@mysql_master2 ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e "show slave status \G;"|grep "Slave.*Running:"
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes
            
# mysql_master1开启slave服务
# Slave_IO_Running、Slave_SQL_Running 都必须为yes
[root@mysql_master1 ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e " \
change master to \
master_host='192.168.24.6', \
master_user='jcore', \
master_password='122333', \
master_port=3306, \
master_log_file='mysql-bin.000001', \
master_log_pos= 120; \
start slave;
"

# mysql_master1看到 Slave_IO_Running: Yes、Slave_SQL_Running: Yes，代表成功
[root@mysql_master1 ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e "show slave status \G;"|grep "Slave.*Running:"
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes

{% endhighlight %}

> 双主复制验证

{% highlight bash %}
# mysql_master1、mysql_master2 表结构一致
####################################
[root@mysql_master1 ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e "show databases;"
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| test               |
+--------------------+

[root@mysql_master2 ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e "show databases;"
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| test               |
+--------------------+
####################################

# mysql_master1创建测试库
[root@mysql_master1 ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e " \
create database jcore; \
use jcore; \
create table blog(id int(2),name varchar(12)); \
insert into blog values(1,'zhangjie'),(2,'zhangjiajie');
select * from blog; \
show processlist;
" 
+------+-------------+
| id   | name        |
+------+-------------+
|    1 | zhangjie    |
|    2 | zhangjiajie |
+------+-------------+
+----+-------------+-------------------+-------+-------------+------+-----------------------------------------------------------------------------+------------------+
| Id | User        | Host              | db    | Command     | Time | State                                                                       | Info             |
+----+-------------+-------------------+-------+-------------+------+-----------------------------------------------------------------------------+------------------+
|  3 | jcore       | 192.168.24.6:4328 | NULL  | Binlog Dump |  430 | Master has sent all binlog to slave; waiting for binlog to be updated       | NULL             |
|  5 | system user |                   | NULL  | Connect     |  278 | Waiting for master to send event                                            | NULL             |
|  6 | system user |                   | NULL  | Connect     |  278 | Slave has read all relay log; waiting for the slave I/O thread to update it | NULL             |
| 11 | root        | localhost         | jcore | Query       |    0 | init                                                                        | show processlist |
+----+-------------+-------------------+-------+-------------+------+-----------------------------------------------------------------------------+------------------+

# mysql_master2查看（已经同步）
[root@mysql_master2 ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e " \
use jcore; \
insert into blog values(3,'jcore'),(4,'whale'); \
select * from blog; \
show processlist;
"
+------+-------------+
| id   | name        |
+------+-------------+
|    1 | zhangjie    |
|    2 | zhangjiajie |
|    3 | jcore       |
|    4 | whale       |
+------+-------------+
+----+-------------+--------------------+-------+-------------+------+-----------------------------------------------------------------------------+------------------+
| Id | User        | Host               | db    | Command     | Time | State                                                                       | Info             |
+----+-------------+--------------------+-------+-------------+------+-----------------------------------------------------------------------------+------------------+
|  4 | system user |                    | NULL  | Connect     |  647 | Waiting for master to send event                                            | NULL             |
|  5 | system user |                    | NULL  | Connect     |  217 | Slave has read all relay log; waiting for the slave I/O thread to update it | NULL             |
|  7 | jcore       | 192.168.24.5:59661 | NULL  | Binlog Dump |  495 | Master has sent all binlog to slave; waiting for binlog to be updated       | NULL             |
| 11 | root        | localhost          | jcore | Query       |    0 | init                                                                        | show processlist |
+----+-------------+--------------------+-------+-------------+------+-----------------------------------------------------------------------------+------------------+

# 返回mysql_master1查看（发现也已经同步）
[root@mysql_master1 ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e " \
use jcore; \
select * from blog; \
show processlist;
"
+------+-------------+
| id   | name        |
+------+-------------+
|    1 | zhangjie    |
|    2 | zhangjiajie |
|    3 | jcore       |
|    4 | whale       |
+------+-------------+
+----+-------------+-------------------+-------+-------------+------+-----------------------------------------------------------------------------+------------------+
| Id | User        | Host              | db    | Command     | Time | State                                                                       | Info             |
+----+-------------+-------------------+-------+-------------+------+-----------------------------------------------------------------------------+------------------+
|  3 | jcore       | 192.168.24.6:4328 | NULL  | Binlog Dump |  858 | Master has sent all binlog to slave; waiting for binlog to be updated       | NULL             |
|  5 | system user |                   | NULL  | Connect     |  706 | Waiting for master to send event                                            | NULL             |
|  6 | system user |                   | NULL  | Connect     |  211 | Slave has read all relay log; waiting for the slave I/O thread to update it | NULL             |
| 12 | root        | localhost         | jcore | Query       |    0 | init                                                                        | show processlist |
+----+-------------+-------------------+-------+-------------+------+-----------------------------------------------------------------------------+------------------+

{% endhighlight %}


###到这里MySQL双主复制就完成了，OK，今天先到这儿了 :) 

-----------------------