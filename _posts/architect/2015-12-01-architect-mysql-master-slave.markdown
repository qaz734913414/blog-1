---
layout: column_1_2
title:  "架构实践.MySQL主从复制"
description: "架构实践.MySQL主从复制"
keywords: 架构实践,MySQL主从复制,mysql
origin: 张嘉杰.原创
date:   2015-12-01
category: architect
tags: linux mysql database
---

<!--more-->

![mysql-master-slave]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}.png)

> 主从复制原理

`MySQL集群`基本都会选择这个策略。`master`将操作记录到`bin-log`中，`slave`的一个线程去`master`读取`bin-log`，并将他们保存到`relay-log`中，`slave`的另外一个线程去重放`relay-log`中的操作来实现和`master`数据同步。

> MySQL binlog支持的复制类型

{% endhighlight %}txt
1. Row level
日志中会记录每一行数据被修改的形式，然后再slave端在对相同的数据进行修改
优点：记录每一行的更改，很详细
缺点：记录数据特别大，推送从库会有延迟
2. Statement level（默认）
每一条会修改数据的sql都会记录到master的bin-log中
优点：binlog日志小，io性能高
缺点：记录不详细，主从复制可能会出现不一致的情况
3. Mixed
结合前两种的优点，在Mixed模式下，会根据MySQL执行的每一条语句来区分对日志记录的形式，在Statement、Row中任选一种
--------------------------------
企业场景如何选择 binlog 模式
1. 互联网公司使用MySQL的功能相对少（存储过程、触发器、函数），选择Statement level（默认）
2. 公司如果使用到MySQL的特殊功能（存储过程、触发器、函数），选择Mixed
--------------------------------
{% endhighlight %}

> 解决的问题

* 负载平衡（load balancing）
* 数据分布（Data distribution）
* 备份机制（Backup）
* 高可用性（High availability）

> 部署环境准备

服务器系统|角色|IP
----|----|----
CentOS6.6 x86_64|mysql_master|192.168.24.5
CentOS6.6 x86_64|mysql_slave|192.168.24.6

> 服务器、软件版本

{% highlight bash %}
-------mysql_master服务器-------
[root@mysql_master ~] cat /etc/redhat-release
CentOS release 6.6 (Final)
[root@mysql_master ~] uname -r
2.6.32-504.el6.x86_64

-------mysql_slave服务器-------
[root@mysql_slave ~] cat /etc/redhat-release
CentOS release 6.6 (Final)
[root@mysql_slave ~] uname -r
2.6.32-504.el6.x86_64
{% endhighlight %}

> MySQL主从复制（mysql-master端口3306，mysql-slave端口3306）

MySQL多机快速安装过程，前面已经说过了，不知道的朋友点这里：[MySQL安装](http://www.jcore.cn/2015/11/30/install-cmake-mysql/)，后面的各种复制、集群等等都是基于这个基础之上实现的。

{% highlight bash %}
# mysql_master 执行命令（初始化bin-log）
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

# mysql_master查看server-id
[root@mysql_master ~]# grep "server-id" /jcore/data/mysql/3306/my.cnf
server-id = 1

# mysql_slave修改server-id
[root@mysql_slave ~]# sed -i 's#^server-id = .*#server-id = 2#g' /jcore/data/mysql/3306/my.cnf
[root@mysql_slave ~]# grep "server-id" /jcore/data/mysql/3306/my.cnf
server-id = 2

# mysql_slave生成新的server uuid
[root@mysql_slave ~]# sed -i 's#^server-uuid=.*#server-uuid='`cat /proc/sys/kernel/random/uuid`'#g' /jcore/data/mysql/3306/data/auto.cnf

# mysql_slave重启mysql服务使server-id生效
[root@mysql_slave ~]# /jcore/data/mysql/3306/mysql restart
Restarting MySQL...
Stoping MySQL...
Starting MySQL...

# mysql_slave执行命令（初始化bin-log，查看从服务状态）
[root@ mysql_slave ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e " \
reset master; \
show binary logs; \
show slave status;
"
+------------------+-----------+
| Log_name         | File_size |
+------------------+-----------+
| mysql-bin.000001 |       120 |
+------------------+-----------+

# mysql_slave监听mysql_master端口3306服务
# Slave_IO_Running、Slave_SQL_Running 都必须为yes
[root@mysql_slave ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e " \
change master to \
master_host='192.168.24.5', \
master_user='jcore', \
master_password='122333', \
master_port=3306, \
master_log_file='mysql-bin.000001', \
master_log_pos= 120; \
start slave; \
"|grep "Slave.*Running:"

# 看到 Slave_IO_Running: Yes、Slave_SQL_Running: Yes，代表成功
[root@mysql_slave ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e "show slave status \G;"|grep "Slave.*Running:"
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes
{% endhighlight %}

> 主从复制验证

{% highlight bash %}
# mysql_master、mysql_slave 表结构一致
####################################
[root@mysql_master ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e "show databases;"
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| test               |
+--------------------+

[root@mysql_slave ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e "show databases;"
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| test               |
+--------------------+
####################################

# mysql_master创建测试库
[root@mysql_master ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e " \
drop database jcore; \
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
| 12 | jcore | 192.168.24.6:4345 | NULL  | Binlog Dump |  846 | Master has sent all binlog to slave; waiting for binlog to be updated | NULL             |
| 22 | root  | localhost         | jcore | Query       |    0 | init                                                                  | show processlist |
+----+-------+-------------------+-------+-------------+------+-----------------------------------------------------------------------+------------------+

# mysql_slave查看（已经同步）
[root@mysql_slave ~]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e " \
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
+----+-------------+-----------+-------+---------+------+-----------------------------------------------------------------------------+------------------+
| Id | User        | Host      | db    | Command | Time | State                                                                       | Info             |
+----+-------------+-----------+-------+---------+------+-----------------------------------------------------------------------------+------------------+
| 34 | system user |           | NULL  | Connect |  887 | Waiting for master to send event                                            | NULL             |
| 35 | system user |           | NULL  | Connect |   41 | Slave has read all relay log; waiting for the slave I/O thread to update it | NULL             |
| 42 | root        | localhost | jcore | Query   |    0 | init                                                                        | show processlist |
+----+-------------+-----------+-------+---------+------+-----------------------------------------------------------------------------+------------------+

{% endhighlight %}

###到这里MySQL主从复制就完成了，OK，今天先到这儿了 :) 

-----------------------

参考文档：

mysql-install-db - <http://dev.mysql.com/doc/refman/5.6/en/mysql-install-db.html>  
mysqldump - <http://dev.mysql.com/doc/refman/5.6/en/mysqldump.html>  
