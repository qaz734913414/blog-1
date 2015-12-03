---
layout: column_1_2
title:  "架构实践.MySQL多级主从复制"
description: "架构实践.MySQL多级主从复制"
keywords: 架构实践,MySQL多级主从复制,mysql
origin: 张嘉杰.原创
date:   2015-12-03
category: architect
tags: linux mysql database
---

`MySQL`主从架构是`MySQL集群`中最基本、最常用的一种架构部署，能够满足很多业务需求，`MySQL`读和写在性能方面的开销区别是较大的，一般来说服务器20%写的压力，80%读的压力，当然也得看实际业务情况。
<!--more-->
今天主要介绍的是多级主从复制的方案，`Master->Slave1->Slave2`。

![mysql-master-slave]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}.png)

> 部署环境准备

服务器系统|角色|IP
----|----|----
CentOS6.6 x86_64|mysql_master|192.168.24.5
CentOS6.6 x86_64|mysql_slave1|192.168.24.6
CentOS6.6 x86_64|mysql_slave2|192.168.24.7

> 服务器、软件版本

{% highlight bash %}
-------mysql_master服务器-------
[root@mysql_master ~] cat /etc/redhat-release
CentOS release 6.6 (Final)
[root@mysql_master ~] uname -r
2.6.32-504.el6.x86_64

-------mysql_slave1服务器-------
[root@mysql_slave1 ~] cat /etc/redhat-release
CentOS release 6.6 (Final)
[root@mysql_slave1 ~] uname -r
2.6.32-504.el6.x86_64

-------mysql_slave2服务器-------
[root@mysql_slave2 ~] cat /etc/redhat-release
CentOS release 6.6 (Final)
[root@mysql_slave2 ~] uname -r
2.6.32-504.el6.x86_64
{% endhighlight %}

> MySQL多级主从复制（master端口3306 > slave1端口3306 > slave2端口3306）

{% highlight bash %}
# mysql_master1查看server-id
[root@mysql_master ~]# grep "server-id" /jcore/data/mysql/3306/my.cnf
server-id = 1

# mysql_slave1修改server-id
[root@mysql_slave1 ~]# sed -i 's#^server-id.*#server-id = 2#g' /jcore/data/mysql/3306/my.cnf
[root@mysql_slave1 ~]# grep "server-id" /jcore/data/mysql/3306/my.cnf
server-id = 2

# mysql_slave2修改server-id
[root@mysql_slave2 ~]# sed -i 's#^server-id.*#server-id = 3#g' /jcore/data/mysql/3306/my.cnf
[root@mysql_slave2 ~]# grep "server-id" /jcore/data/mysql/3306/my.cnf
server-id = 3

# 增加slave日志更新开启（slave1 > slave2之间复制，该参数很关键）
[root@mysql_slave1 ~]# sed -i '/server-id/a\log_slave_updates = 1' /jcore/data/mysql/3306/my.cnf

# mysql_slave1生成新的server uuid
[root@mysql_slave1 ~]# sed -i 's#^server-uuid=.*#server-uuid='`cat /proc/sys/kernel/random/uuid`'#g' /jcore/data/mysql/3306/data/auto.cnf

# mysql_slave1重启mysql服务使server-id生效
[root@mysql_slave1 ~]# /jcore/data/mysql/3306/mysql restart
Restarting MySQL...
Stoping MySQL...
Starting MySQL...

# mysql_slave2生成新的server uuid
[root@mysql_slave2 ~]# sed -i 's#^server-uuid=.*#server-uuid='`cat /proc/sys/kernel/random/uuid`'#g' /jcore/data/mysql/3306/data/auto.cnf

# mysql_master2重启mysql服务使server-id生效
[root@mysql_slave2 ~]# /jcore/data/mysql/3306/mysql restart
Restarting MySQL...
Stoping MySQL...
Starting MySQL...


# mysql_master授权主机
[root@mysql_master ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e " \
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

# mysql_slave1授权、开启slave服务
# Slave_IO_Running、Slave_SQL_Running 都必须为yes
[root@mysql_slave1 ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e " \
grant replication client, \
replication slave on *.* to \
'jcore'@'192.168.24.%' identified by '122333'; \
reset master; \
show slave status; \
change master to \
master_host='192.168.24.5', \
master_user='jcore', \
master_password='122333', \
master_port=3306, \
master_log_file='mysql-bin.000001', \
master_log_pos= 120; \
start slave;
"

# mysql_slave1看到 Slave_IO_Running: Yes、Slave_SQL_Running: Yes，代表成功
[root@mysql_slave1 ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e "show slave status \G;"|grep "Slave.*Running:"
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes

# mysql_slave2开启slave服务
# Slave_IO_Running、Slave_SQL_Running 都必须为yes
[root@mysql_slave2 ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e " \
reset master; \
show slave status; \
change master to \
master_host='192.168.24.6', \
master_user='jcore', \
master_password='122333', \
master_port=3306, \
master_log_file='mysql-bin.000001', \
master_log_pos= 120; \
start slave;
"

# mysql_slave2看到 Slave_IO_Running: Yes、Slave_SQL_Running: Yes，代表成功
[root@mysql_slave2 ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e "show slave status \G;"|grep "Slave.*Running:"
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes
            

{% endhighlight %}

> 多级主从复制验证

{% highlight bash %}
# mysql_master创建测试库
[root@mysql_master ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e " \
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
+----+-------+-------------------+-------+-------------+------+-----------------------------------------------------------------------+------------------+
| Id | User  | Host              | db    | Command     | Time | State                                                                 | Info             |
+----+-------+-------------------+-------+-------------+------+-----------------------------------------------------------------------+------------------+
|  2 | jcore | 192.168.24.6:4329 | NULL  | Binlog Dump |  247 | Master has sent all binlog to slave; waiting for binlog to be updated | NULL             |
|  3 | root  | localhost         | jcore | Query       |    0 | init                                                                  | show processlist |
+----+-------+-------------------+-------+-------------+------+-----------------------------------------------------------------------+------------------+

# mysql_slave1查看（已经同步）
[root@mysql_slave1 ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e " \
use jcore; \
select * from blog; \
show processlist;
"
+------+-------------+
| id   | name        |
+------+-------------+
|    1 | zhangjie    |
|    2 | zhangjiajie |
+------+-------------+
+----+-------------+--------------------+--------+-------------+------+-----------------------------------------------------------------------------+------------------+
| Id | User        | Host               | db     | Command     | Time | State                                                                       | Info             |
+----+-------------+--------------------+--------+-------------+------+-----------------------------------------------------------------------------+------------------+
|  1 | system user |                    | NULL   | Connect     |  102 | Slave has read all relay log; waiting for the slave I/O thread to update it | NULL             |
|  2 | system user |                    | NULL   | Connect     |  761 | Waiting for master to send event                                            | NULL             |
| 11 | jcore       | 192.168.24.7:35940 | NULL   | Binlog Dump |  192 | Master has sent all binlog to slave; waiting for binlog to be updated       | NULL             |
| 14 | root        | localhost          | jcore1 | Query       |    0 | init                                                                        | show processlist |
+----+-------------+--------------------+--------+-------------+------+-----------------------------------------------------------------------------+------------------+

# 回头mysql_slave2查看（也已经同步）
[root@mysql_slave2 ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e " \
use jcore; \
select * from blog; \
show processlist;
"
+------+-------------+
| id   | name        |
+------+-------------+
|    1 | zhangjie    |
|    2 | zhangjiajie |
+------+-------------+
+----+-------------+-----------+--------+---------+------+-----------------------------------------------------------------------------+------------------+
| Id | User        | Host      | db     | Command | Time | State                                                                       | Info             |
+----+-------------+-----------+--------+---------+------+-----------------------------------------------------------------------------+------------------+
| 22 | system user |           | NULL   | Connect |  272 | Waiting for master to send event                                            | NULL             |
| 23 | system user |           | NULL   | Connect |   80 | Slave has read all relay log; waiting for the slave I/O thread to update it | NULL             |
| 26 | root        | localhost | jcore1 | Query   |    0 | init                                                                        | show processlist |
+----+-------------+-----------+--------+---------+------+-----------------------------------------------------------------------------+------------------+

{% endhighlight %}

###到这里MySQL双主复制就完成了，OK，今天先到这儿了 :) 

-----------------------