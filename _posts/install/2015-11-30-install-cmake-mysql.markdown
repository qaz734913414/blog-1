---
layout: column_1_2
title:  "MySQL5.6源码安装"
description: "linux安装,vmware虚拟机安装,centos6.6安装,MySQL5.6源码安装"
keywords: linux,shell,mysql
origin: 张嘉杰.原创
date:   2015-11-30
category: linux
tags: linux shell mysql
---

周末和做`MySQL``DBA`的一位朋友一起聊了一下午，比如说：`MySQL主从复制`、`MySQL备份恢复方案及策略`、`MySQL高可用方案`、`一定规模的MySQL自动化运维经验`等方面的话题。
<!--more-->
最近我也刚好需要迁移数据库至`MySQL`中，所以把以前的一些实施案例分享出来，这篇文章主要是介绍`MySQL5.6.27`源码编译。之所以选择`MySQL5.6.27`，也是听了该朋友的介绍。
（一般`MySQL`发版超过20个版本以后，基本就是主流了），下面开始安装吧。

> 部署环境准备

服务器系统|角色|IP
----|----|----
CentOS6.6 x86_64|mysql1|192.168.24.5
CentOS6.6 x86_64|mysql2|192.168.24.6

> 服务器、软件版本

{% highlight bash %}
-------mysql1服务器-------
[root@mysql1 ~] cat /etc/redhat-release
CentOS release 6.6 (Final)
[root@mysql1 ~] uname -r
2.6.32-504.el6.x86_64

-------mysql2服务器-------
[root@mysql2 ~] cat /etc/redhat-release
CentOS release 6.6 (Final)
[root@mysql2 ~] uname -r
2.6.32-504.el6.x86_64
{% endhighlight %}

> 安装 MySQL5.6.27

{% highlight bash %}

# 安装aliyun epel源
[root@mysql1 ~]# wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-6.repo
正在保存至: “/etc/yum.repos.d/CentOS-Base.repo”

# yum安装cmake、ncurses-devel
[root@mysql1 ~]# yum install cmake ncurses-devel -y
=========================================================================================
 软件包                 架构            版本                         仓库           大小
=========================================================================================
正在安装:
 cmake                  x86_64          2.8.12.2-4.el6               base          8.0 M
 ncurses-devel          x86_64          5.7-4.20090207.el6           base          641 k

# 创建安装目录
[root@mysql1 ~]# mkdir -p /jcore/{server/mysql/{data,tmp},tools,scripts,backup,data/mysql/{3306,3307}/data}
[root@mysql1 ~]# tree /jcore/  
/jcore/
├── backup
├── data
│   └── mysql
│       ├── 3306
│       │   └── data
│       └── 3307
│           └── data
├── scripts
├── server
│   └── mysql
│       ├── data
│       └── tmp
└── tools

# 下载mysql到/jcore/tools/目录下
[root@mysql1 ~]# wget http://mirrors.sohu.com/mysql/MySQL-5.6/mysql-5.6.27.tar.gz -P /jcore/tools/
正在保存至: “/jcore/tools/mysql-5.6.27.tar.gz”
[root@mysql1 ~]# cd /jcore/tools/

# 解压mysql
[root@mysql1 tools]# tar zxf mysql-5.6.27.tar.gz

# 进入mysql目录
[root@mysql1 tools]# cd mysql-5.6.27

# cmake安装mysql
[root@mysql1 mysql-5.6.27]# cmake . \
> -DCMAKE_INSTALL_PREFIX=/jcore/server/mysql \
> -DMYSQL_DATADIR=/jcore/server/mysql/data \
> -DMYSQL_UNIX_ADDR=/jcore/server/mysql/tmp/mysql.sock \
> -DMYSQL_TCP_PORT=3306 \
> -DDEFAULT_CHARSET=utf8 \
> -DDEFAULT_COLLATION=utf8_general_ci \
> -DEXTRA_CHARSETS=gbk,gb2312,utf8,ascii \
> -DWITH_INNOBASE_STORAGE_ENGINE=1 \
> -DWITH_FEDERATED_STORAGE_ENGINE=1 \
> -DWITH_BLACKHOLE_STORAGE_ENGINE=1 \
> -DWITH_FAST_MUTEXES=1 \
> -DWITH_ZLIB=bundled \
> -DENABLED_LOCAL_INFILE=1 \
> -DWITH_READLINE=1 \
> -DWITH_EMBEDDED_SERVER=1 \
> -DWITH_DEBUG=0

# 编译安装（这个过程时间有点长）
[root@mysql1 mysql-5.6.27]# make && make install

# 创建mysql用户、用户组
[root@mysql1 mysql-5.6.27]# useradd -M -s /sbin/nologin mysql         
[root@mysql1 mysql-5.6.27]# id mysql
uid=500(mysql) gid=500(mysql) 组=500(mysql)

# 设置目录权限
[root@mysql1 mysql-5.6.27]# chown mysql.mysql /jcore/*/mysql/ -R      
[root@mysql1 mysql-5.6.27]# ll -ld /jcore/{data,server}/mysql
drwxr-xr-x  4 mysql mysql 4096 11月 30 02:11 /jcore/data/mysql
drwxr-xr-x 14 mysql mysql 4096 11月 30 02:39 /jcore/server/mysql

# 设置mysql_install_db权限
[root@mysql1 mysql-5.6.27]# chmod 755 ./scripts/mysql_install_db

# 创建mysql端口为3306的配置文件
[root@mysql1 mysql-5.6.27]# cat >/jcore/data/mysql/3306/my.cnf<<EOF
[client]
port    = 3306
socket  = /jcore/data/mysql/3306/mysql.sock

[mysql]
no-auto-rehash

[mysqld]
user    = mysql
port    = 3306
socket  = /jcore/data/mysql/3306/mysql.sock
basedir = /jcore/server/mysql
datadir = /jcore/data/mysql/3306/data
open_files_limit    = 1024
back_log = 600
max_connections = 800
max_connect_errors = 3000
explicit_defaults_for_timestamp=true
#table_cache = 614
external-locking = FALSE
max_allowed_packet =8M
sort_buffer_size = 1M
join_buffer_size = 1M
thread_cache_size = 100
thread_concurrency = 2
query_cache_size = 2M
query_cache_limit = 1M
query_cache_min_res_unit = 2k
#default_table_type = InnoDB
thread_stack = 192K
#transaction_isolation = READ-COMMITTED
tmp_table_size = 2M
max_heap_table_size = 2M
long_query_time = 1
#log_long_format
#log-error = /jcore/data/mysql/3306/error.log
#log-slow-queries = /jcore/data/mysql/3306/slow.log
pid-file = /jcore/data/mysql/3306/mysql.pid
log-bin = /jcore/data/mysql/3306/mysql-bin
relay-log = /jcore/data/mysql/3306/relay-bin
relay-log-info-file = /jcore/data/mysql/3306/relay-log.info
binlog_cache_size = 1M
max_binlog_cache_size = 1M
max_binlog_size = 2M
expire_logs_days = 7
key_buffer_size = 16M
read_buffer_size = 1M
read_rnd_buffer_size = 1M
bulk_insert_buffer_size = 1M
#myisam_sort_buffer_size = 1M
#myisam_max_sort_file_size = 10G
#myisam_max_extra_sort_file_size = 10G
#myisam_repair_threads = 1
#myisam_recover

lower_case_table_names = 1
skip-name-resolve
slave-skip-errors = 1032,1062
replicate-ignore-db=mysql

server-id = 1

innodb_additional_mem_pool_size = 4M
innodb_buffer_pool_size = 32M
innodb_data_file_path = ibdata1:128M:autoextend
innodb_file_io_threads = 4
innodb_thread_concurrency = 8
innodb_flush_log_at_trx_commit = 2
innodb_log_buffer_size = 2M
innodb_log_file_size = 4M
innodb_log_files_in_group = 3
innodb_max_dirty_pages_pct = 90
innodb_lock_wait_timeout = 120
innodb_file_per_table = 0

[mysqldump]
quick
max_allowed_packet = 2M

[mysqld_safe]
log-error=/jcore/data/mysql/3306/mysql_3306.err
pid-file=/jcore/data/mysql/3306/mysqld.pid
EOF

# 创建mysql启动脚本
[root@mysql1 mysql-5.6.27]# cat>/jcore/data/mysql/3306/mysql<<EOF
#!/bin/sh

#init
port=3306
mysql_user="root"
mysql_pwd="122333"
CmdPath="/jcore/server/mysql/bin"
mysql_sock="/jcore/data/mysql/\${port}/mysql.sock"
#startup function
function_start_mysql()
{
    if [ ! -e "\$mysql_sock" ];then
      printf "Starting MySQL...\n"
      /bin/sh \${CmdPath}/mysqld_safe --defaults-file=/jcore/data/mysql/\${port}/my.cnf 2>&1 > /dev/null &
    else
      printf "MySQL is running...\n"
      exit
    fi
}

#stop function
function_stop_mysql()
{
    if [ ! -e "\$mysql_sock" ];then
       printf "MySQL is stopped...\n"
       exit
    else
       printf "Stoping MySQL...\n"
       \${CmdPath}/mysqladmin -u \${mysql_user} -p\${mysql_pwd} -S /jcore/data/mysql/\${port}/mysql.sock shutdown
   fi
}

#restart function
function_restart_mysql()
{
    printf "Restarting MySQL...\n"
    function_stop_mysql
    sleep 2
    function_start_mysql
}

case \$1 in
start)
    function_start_mysql
;;
stop)
    function_stop_mysql
;;
restart)
    function_restart_mysql
;;
*)
    printf "Usage: /jcore/data/mysql/\${port}/mysql {start|stop|restart}\n"
esac
EOF

# 安装mysql，指定加载配置文件
[root@mysql1 mysql-5.6.27]# ./scripts/mysql_install_db --user=mysql \
--defaults-file=/jcore/data/mysql/3306/my.cnf \
--basedir=/jcore/server/mysql \
--datadir=/jcore/data/mysql/3306/data

# 设置mysql环境变量
[root@mysql1 mysql-5.6.27]# echo 'export PATH=$PATH:/jcore/server/mysql/bin' >>/etc/profile
[root@mysql1 mysql-5.6.27]# source /etc/profile

# 执行mysql文件权限
[root@mysql1 mysql-5.6.27]# chmod 755 /jcore/data/mysql/3306/mysql

# 启动mysql
[root@mysql1 mysql-5.6.27]# /jcore/data/mysql/3306/mysql start

# 查看mysql端口
[root@mysql1 mysql-5.6.27]# lsof -i:3306
COMMAND   PID  USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
mysqld  21262 mysql   12u  IPv6  70372      0t0  TCP *:mysql (LISTEN)

# 设置mysql密码
[root@mysql1 mysql-5.6.27]# mysqladmin -uroot password '122333' -S /jcore/data/mysql/3306/mysql.sock

# 直接命令执行mysql命令
[root@mysql1 mysql-5.6.27]# mysql -uroot -p'122333' -S /jcore/data/mysql/3306/mysql.sock -e "show databases;"
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| test               |
+--------------------+

{% endhighlight %}

> 本机安装多实例（开启另外一个端口：3307）

{% highlight bash %}

# 复制3306目录中配置文件、脚本至3307目录中
[root@mysql1 mysql-5.6.27]# cp /jcore/data/mysql/3306/{mysql,my.cnf} /jcore/data/mysql/3307/
[root@mysql1 mysql-5.6.27]# ll /jcore/data/mysql/3307/
总用量 12
drwxr-xr-x 2 mysql mysql 4096 11月 30 02:11 data
-rw-r--r-- 1 root  root  2064 11月 30 03:05 my.cnf
-rwxr-xr-x 1 root  root  1065 11月 30 03:05 mysql

# 替换文件中的所有端口为3307
[root@mysql1 mysql-5.6.27]# sed -i 's#3306#3307#g' /jcore/data/mysql/3307/my.cnf /jcore/data/mysql/3307/mysql

# 安装mysql，指定加载配置文件
[root@mysql1 mysql-5.6.27]# ./scripts/mysql_install_db --user=mysql \
--defaults-file=/jcore/data/mysql/3307/my.cnf \
--basedir=/jcore/server/mysql \
--datadir=/jcore/data/mysql/3307/data

# 启动mysql
[root@mysql1 mysql-5.6.27]# /jcore/data/mysql/3307/mysql start

# 查看mysql端口
[root@mysql1 mysql-5.6.27]# lsof -i:3307
COMMAND   PID  USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
mysqld  22122 mysql   12u  IPv6  71789      0t0  TCP *:opsession-prxy (LISTEN)

# 设置mysql密码
[root@mysql1 mysql-5.6.27]# mysqladmin -uroot password '122333' -S /jcore/data/mysql/3307/mysql.sock

# 直接命令执行mysql命令
[root@mysql1 mysql-5.6.27]# mysql -uroot -p'122333' -S /jcore/data/mysql/3307/mysql.sock -e "show databases;"
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| test               |
+--------------------+

{% endhighlight %}

> mysql2主机安装多实例（端口：3306，3307）

{% highlight bash %}

# 打包mysql1主机中/jcore/目录排除tools目录
[root@mysql1 mysql-5.6.27]# tar -zcf mysql-5.6.27_cmark.tar.gz --exclude=tools /jcore/

# mysql2主机创建目录
[root@mysql2 ~]# mkdir -p /jcore/{server/mysql/{data,tmp},tools,scripts,data/mysql/{3306,3307}/data}

# mysql2主机远程下载mysql1中的压缩文件
[root@mysql2 ~]# scp root@192.168.24.5:/jcore/tools/mysql-5.6.27/mysql-5.6.27_cmark.tar.gz /jcore/tools/

# mysql2主机加压文件至根目录
[root@mysql2 ~]# tar -zxf /jcore/tools/mysql-5.6.27_cmark.tar.gz -C /

# mysql2主机创建mysql用户、用户组
[root@mysql2 ~]# useradd -M -s /sbin/nologin mysql         
[root@mysql2 ~]# id mysql
uid=500(mysql) gid=500(mysql) 组=500(mysql)

# mysql2主机设置目录权限
[root@mysql2 ~]# chown mysql.mysql /jcore/*/mysql/ -R      
[root@mysql2 ~]# ll -ld /jcore/{data,server}/mysql
drwxr-xr-x  4 mysql mysql 4096 11月 30 02:11 /jcore/data/mysql
drwxr-xr-x 14 mysql mysql 4096 11月 30 02:39 /jcore/server/mysql

# mysql2主机启动mysql
[root@mysql2 ~]# /jcore/data/mysql/3306/mysql start
[root@mysql2 ~]# /jcore/data/mysql/3307/mysql start

[root@mysql2 ~]# ss -lntup|grep mysql
tcp    LISTEN     0      600                   :::3306                 :::*      users:(("mysqld",3751,12))
tcp    LISTEN     0      600                   :::3307                 :::*      users:(("mysqld",4498,12))

{% endhighlight %}

###到这里基本就完成了，明儿继续，睡觉。:)

-----------------------
