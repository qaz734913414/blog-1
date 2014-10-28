---
layout: column_1_2
title:  "一行代码实现shell乘法口诀"
description: "一行代码shell乘法口诀"
keywords: linux,shell,shell乘法口诀
origin: 张嘉杰.原创
date:   2011-06-12
category: shell
tags: linux shell
---
最近学习`shell`命令，先用shell实现一个乘法口诀表。脚踏实地，抱着平常心学习`shell`编程。学无止境，不能开启等死模式呐。:)
<!--more-->

虽然是一个很简单的两层循环。我们一步一步来优化。

{% highlight bash %}

# 9x9乘法口诀表实现（一）
$ for i in 1 2 3 4 5 6 7 8 9 ;do for j in 1 2 3 4 5 6 7 8 9 ;do printf "%2d " $((i*j)); done; echo; done

{% endhighlight %}

![9x9乘法口诀表实现（一）]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-0.png)  

{% highlight bash %}

# 9x9乘法口诀表实现（二）
$ for((i=1;i<10;i++)); do for((j=1;j<=i;j++)); do echo -ne "$j*$i=$(($i*$j))\t"; if [ $j -eq $i ]; then echo -e ''; fi; done; done

{% endhighlight %}

![9x9乘法口诀表实现（二）]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-1.png)  

{% highlight bash %}

# 9x9乘法口诀表实现（三）
$ for i in {1..9}; do for j in `seq 1 $i`; do echo -ne "${j}*${i}=$((j*i))\t"; done; echo; done

{% endhighlight %}

![9x9乘法口诀表实现（三）]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-2.png)  

{% highlight bash %}

# 9x9乘法口诀表实现（四）
$ seq 9 | sed 'H;g' | awk -v RS='' '{for(i=1;i<=NF;i++)printf("%d*%d=%d%s", i, NR, i*NR, i==NR?"\n":"\t")}'

{% endhighlight %}

![9x9乘法口诀表实现（四）]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-3.png)  

{% highlight bash %}

# 9x9乘法口诀表实现（五）
$ seq 1 9 | awk '{for(i=1;i<=$1;i++)printf i"*"$1"="i*$1" ";print ""}'

{% endhighlight %}

![9x9乘法口诀表实现（五）]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-4.png)  

到这里基本就完成了。使用到`for`循环、`seq`、`sed`、`awk`组合实现，还是可以学习到不少用法。  

###有更好的写法以后补充进来。:)

-----------------------

