---
layout: column_1_2
title:  "话.基础shell相关面试题（持续更新）"
description: "grep,sed,awk,话.基础shell相关面试题（持续更新）"
keywords: linux,shell,grep,sed,awk
origin: 张嘉杰.原创
date:   2015-09-08
category: shell
tags: linux shell grep sed awk
---
`shell`依然是`linux`提供的非常灵活快速的命令行工具，并且也是一门非常有用的编程语言，作为和`linux`系统之间的桥梁，对于经常接触服务器的朋友是一种必备的技能。
<!--more-->
多啰嗦一句：技术其实是一个积累的过程，多静下以来研究技术，当喜欢上了每天小有心得的感觉，更会习惯于解决问题时的那种畅快。

> 进入正题：下面给出几道朋友公司的面试题（偏运维、架构方向）

{% highlight bash %}
1. 统计多个文件，要返回结果：第一列url（排重），第二列（url排重，原文本第二列数字相加），第三列（url出现在哪几个本中的第几行）
2. 倒序显示第二列数字最大的结果集
文件一：
http://www.jcore.cn 3
http://www.baidu.com 5
http://www.csdn.com 2
http://www.sina.com.cn 4
文件二：
http://www.qq.com 6
http://www.360.cn 8
http://www.google.com 12
http://www.baidu.com 2
http://www.jcore.cn 18
-----------------------
[root@test ~]# awk '{a[$1]+=$2;f[$1]=FILENAME"("FNR") "f[$1]} END{for(i in a){print i"\t"a[i]"\t"f[i]} }' 1.txt 2.txt | sort -k2nr
http://www.jcore.cn     21      2.txt(5) 1.txt(1) 
http://www.google.com   12      2.txt(3) 
http://www.360.cn       8       2.txt(2) 
http://www.baidu.com    7       2.txt(4) 1.txt(2) 
http://www.qq.com       6       2.txt(1) 
http://www.sina.com.cn  4       1.txt(4) 
http://www.csdn.com     2       1.txt(3)

{% endhighlight %}

## 本文持续更新...

-----------------------
