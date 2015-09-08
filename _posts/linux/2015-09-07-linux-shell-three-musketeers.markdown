---
layout: column_1_2
title:  "话.linux三剑客之利刃出鞘"
description: "grep,sed,awk,话.linux三剑客之利刃出鞘"
keywords: linux,shell,grep,sed,awk
origin: 张嘉杰.原创
date:   2015-09-07
category: shell
tags: linux shell grep sed awk
---
剑客起源于唐代传奇的中国武侠小说中，他们所使用的兵器`剑`的地位是至高无上的，一直也是兵器中的王者，符合了`剑`在中国古代社会的地位。今天给大家详细的总结一下`linux`系统下的利刃兵器：`awk`、`sed`、`grep`
<!--more-->

> 三剑客介绍（grep、sed、awk）

### 老三：grep

是一种强大的文本搜索工具，它能使用正则表达式搜索文本，并把匹配的行打印出来

{% highlight bash %}
# grep 常用选项
-c #只输出匹配行的计数
-i #不区分大小写
-h #查询多文件时不显示文件名
-l #查询多文件时只输出包含匹配字符的文件名
-n #显示匹配行及行号
-s #不显示不存在或无匹配文本的错误信息
-v #显示不包含匹配文本的所有行
-E #支持扩展的正则表达式
-P #调用perl语法正则

{% endhighlight %}

### 老二：sed

对文本的处理很强大，增、删、改、查样样能做

{% highlight bash %}
# sed 常用选项
-r #在脚本中使用扩展正则表达式
-n #不打印所有行到标准输出
-i #直接修改文件

{% endhighlight %}

### 老大：awk（带头大哥）

可以理解为一门编程语言，可以自定义变量，有条件语句，有循环，有数组，有正则，有函数

{% highlight bash %}
# awk 常用变量
$n	#当前记录的第n个字段，字段间由 FS分隔
$0	#完整的输入记录
FNR	#同NR，但相对于当前文件
FS	#字段分隔符（默认是任何空格）
NF	#当前记录中的字段数
NR	#当前记录数
OFS	#输出字段分隔符（默认值是一个空格）
ORS	#输出记录分隔符（默认值是一个换行符）

# awk 常用字符串函数
sub		#匹配记录中最大、最靠左边的子字符串的正则表达式，并用替换字符串替换这些字符串
gsub	#整个文档中进行匹配
index	#返回子字符串第一次被匹配的位置
substr	#返回从位置1开始的子字符串，如果指定长度超过实际长度，就返回整个字符串
split	#可按给定的分隔符把字符串分割为一个数组，默认按当前FS值进行分割
length	#返回记录的字符数
toupper #可用于字符串大小间的转换，该功能只在gawk中有效
tolower	#可用于字符串大小间的转换，该功能只在gawk中有效

# awk 常用函数
srand(x)	#x是rand()函数的种子
int(x)		#取整
rand()		#产生一个大于等于0而小于1的随机数

{% endhighlight %}

> 案例使用（有很多种方法，今天我们这里只说三剑客的使用方法）

1.快速取出本机IP？
{% highlight bash %}
# grep
ifconfig eth0|grep -Po '(?<=dr:)\S+'
# sed 
ifconfig eth0|sed -rn 's#.*r:(.*)  B.*#\1#gp'
# awk 
ifconfig eth0|awk -F '[ :]+' 'NR==2{print $4}'

{% endhighlight %}

![快速取出本机IP]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-0.png)  

-----------------------
