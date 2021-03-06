---
layout: column_1_2
title:  "架构实践.高负载高并发电商网站"
description: "架构实践,高负载高并发电商网站,"
keywords: 架构实践,缓存,分布式,大数据
origin: 张嘉杰.原创
date:   2014-09-29
category: architect
tags: linux j2ee web database 高并发 架构
---
最近公司面临改革（日事日毕，日清日高），从以前的点对点的开发模式，转战到平台的开发模式上来，显然是一次大变动呐。`基础代码架构`、`服务器`、`数据库`、`缓存`、`监控`、`搜索`、`服务`、`日志`都需要从新规划，下面我来说说关于架构一些想法。
<!--more-->

-----------------------

> 设计思路

<font color="#fa8072">1）多级缓存、静态化</font>

{% highlight html %}

1. 客户端页面缓存
2. 应用缓存（memcache）
3. 内存数据库（mongodb、redis）
4. cache机制（数据库、中间件）

{% endhighlight %}

<font color="#fa8072">2）高可用</font>

{% highlight html %}

1. 负载均衡、容灾、备份
2. 读写分离
3. 依赖关系（低耦合）
4. 监控

{% endhighlight %}

<font color="#fa8072">3）伸缩性</font>

{% highlight html %}

1. 对业务、数据库的拆分（异步非阻塞，可提高吞吐量）
2. 无状态（不依赖模块状态，可提高吞吐量）
3. 原子操作与并发控制（乐观锁、mutex、写时复制等等）
4. 容错隔离

{% endhighlight %}




> 应用架构

整个架构是分层的分布式的架构，纵向包括`CDN`，`反向代理`，`web应用`，`业务层`，`基础服务层`，`数据存储层`。水平方向包括对整个平台的`配置管理部署`和`监控`。

{% highlight html %}

+--------------------------------------------+ +--------+ +---------+
|                    CDN                     | | Config | | Monitor |
+--------------------------------------------+ +--------+ +---------+
+--------------------------------------------+ |        | |         |
|                   Nginx                    | | Deploy | |   Log   |
+--------------------------------------------+ |        | |         |
+--------------------------------------------+ +--------+ +---------+
|                    App                     | |        | |         |
+---+--------+--+------------+--+--------+---+ |        | |         |
|   +--------+  +------------+  +--------+   | |        | |         |
|   |Tomcat  |  |   Jboss    |  | Spring |   | |        | |         |
|   +--------+  +------------+  +--------+   | |        | |         |
+--------------------------------------------+ |        | | System  |
+--------------------------------------------+ |        | |         |
|                  Service                   | |   Z    | |         |
+---+--------+--+------------+--+---------+--+ |   o    | |         |
|   +--------+  +------------+  +---------+  | |   o    | |         |
|   | Mina   |  |   Spring   |  |Hibernate|  | |   k    | +---------+
|   +--------+  +------------+  +---------+  | |   e    | |         |
+--------------------------------------------+ |   e    | |         |
+--------------------------------------------+ |   p    | |         |
|                Base Service                | |   e    | |         |
+-+---------+--+---------------+-+---------+-+ |   r    | |   App   |
| +---------+  +---------------+ +---------+ | |        | |         |
| |   MQ    |  |     Cache     | |  Data   | | |        | |         |
| +---------+  +---------------+ +---------+ | |        | |         |
| |ActiveMQ |  |   Mencache    | |  Flume  | | |        | |         |
| +---------+  +--+--+---------+ +---------+ | |        | +---------+
| +---------+--+--+  +---------+-+---------+ | |        | |         |
| |    Search     |  |         HA          | | |        | |         |
| +---------------+  +---------------------+ | |        | |         |
| |  Solr/Lucene  |  | Zookeeper/Heartbeat | | |        | |         |
| +---------------+  +---------------------+ | |        | |         |
+--------------------------------------------+ |        | | Service |
+--------------------------------------------+ |        | |         |
|                  Database                  | |        | |         |
+--+--------------+-----+-----------------+--+ |        | |         |
|  +--------------+     +-----------------+  | |        | |         |
|  | Oracle/MySql |     |  mongodb/redis  |  | |        | |         |
|  +--------------+     +-----------------+  | |        | |         |
+--+--------------+-----+-----------------+--+ +--------+ +---------+

{% endhighlight %}

> 剖析架构

<font color="#fa8072">1）CDN</font>

{% highlight html %}

一般电子商务平台都会用CDN做网络服务。  
我们公司使用的是第三方CND，第三方CDN有很多种，如蓝汛、网宿、快网等。

{% endhighlight %}

<font color="#fa8072">2）负载均衡、反向代理</font>

{% highlight html %}

一般大型的电子商务平台都会有不同的业务域和不同的集群服务。一般都是DNS做域名解析的分发、轮询，DNS方式简单，因为Cache而缺乏灵活性。  
一般基于商用的硬件F5或者LVS等开源负载做分发，都采取主备方式。  
分发到业务集群上后，会经过web服务器如nginx做负载均衡或者反向代理分发到集群中的应用节点。  
----------------------------------------------------------------------------------------------
关于负载，需要综合考虑的几个因素：  
1. 是否满足高并发高性能  
2. Session如何保持  
3. 是否支持压缩  
4. 负载均衡的算法如何  
常用的负载均衡软件，如LVS、Nginx、HAProxy等。  
我们公司使用的是LVS+Nginx这种方式，Nginx基于iphash的Session黏贴。

{% endhighlight %}

<font color="#fa8072">3）App接入</font>

{% highlight html %}

应用层运行在Jboss或者Tomcat容器中，代表独立的系统，比如前端购物、后端系统、手机端服务等等。  
----------------------------------------------------------------------------------------------
关于应用层容器，需要综合考虑的几个因素：
1. 是否采用servlet3.0异步servlet来提高整个系统的吞吐量  
2. app接入节点宕机，session随之丢失问题  
3. session的集中式存储如何水平扩展  
我们公司应用层容器之前是使用的weblogic，现在使用的是tomcat。多个tomcat之间集群Session共享。

{% endhighlight %}

<font color="#fa8072">4）业务服务</font>

{% highlight html %}

对于电子商务平台而言，涉及的领域有用户、商品、订单、红包、活动、秒杀、支付业务等等，模块划分和接口设计非常重要。
----------------------------------------------------------------------------------------------
关于服务层，需要综合考虑的几个因素：
1. 是否使用NIO通讯框架netty、mina等，实现高并发  
2. 是否部署多个节点做冗余，从而提高服务层的高可用性，并自动进行负载转发和失效转移  
我们公司的业务是混合在一起的，没有一个个都做到模块化。

{% endhighlight %}

<font color="#fa8072">5）基础服务中间件</font>

{% highlight html %}
对于电子商务平台，一般是由一个或多个基础服务中间件组成。这里罗列了一些常用的基础中间件。
----------------------------------------------------------------------------------------------
1. 消息队列（RabbitMQ、ActiveMQ等，推荐使用 RabbitMQ ）  
2. 事件驱动（EventBus机制）  
3. 缓存系统（Memcached[关系型数据库]；redis、mongodb、redis[内存型数据库]）  
4. 搜索平台（Solr、Lucene需考虑：索引的实时性、读写分离、全量索引和内存增量索引合并）  
5. HA（Heartbeat[类似HAProxy、Nginx]、keepalived 可用 zookeeper 做集群方案）  
6. 数据分析（Hadoop[流量统计、推荐引擎、趋势分析、用户行为分析、数据挖掘分类器、分布式索引等等]）  
7. 数据同步  
8. 日志收集  
我们公司平台使用到的中间件 ActiveMQ、Memcached、Lucene、Nginx、应用级日志Log4j、mount挂载项目。

{% endhighlight %}

<font color="#fa8072">6）数据存储</font>

{% highlight html %}

数据库存储大体分为以下几类：  
----------------------------------------------------------------------------------------------
1. 关系型（事务型）数据库 Oracle、Mysql等  
2. key/value数据库 Redis、Memcached等  
3. 文档型数据库 Mongodb等  
4. 列式数据库 HBase等  
5. 还有图形数据库、对象数据库、xml数据库等  
我们公司主业务数据库是oracle10g，规划准备迁到oracle11g上，相关业务也用到了Mysql。

{% endhighlight %}

<font color="#fa8072">7）管理与部署配置</font>

{% highlight html %}

统一的配置库，部署平台。  
我们公司使用的是Ant+Svn做的自动化部署平台。

{% endhighlight %}

<font color="#fa8072">8）监控、统计</font>

{% highlight html %}

一般电子商务平台分布式系统涉及各种设备，如网络交换机、各种型号的网卡，硬盘，内存等等。  
监控平台的性能、吞吐量、以及可用性比较重要，需规划统一的一体化的监控平台对系统进行各个层次的监控。  
----------------------------------------------------------------------------------------------
关于监控、统计，需要考虑到的几个监控范围：
1. 系统级别（CPU、内存、网络、IO）
2. 应用级别（业务日志、请求日志、异常日志）
3. 时效性（阀值告警、按小时/天离线分析、实时查询、业务监控、容器监控）
我们公司日志分析使用的是逆火，流量监控使用的是Graphs（仙人掌）。

{% endhighlight %}

###OK，今天先到这儿了 :) 

-----------------------
