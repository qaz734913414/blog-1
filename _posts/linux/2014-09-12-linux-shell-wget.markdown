---
layout: column_1_2
title:  "使用wget遍历下载整站"
description: "使用wget遍历下载整站"
keywords: linux,shell,wget
origin: 张嘉杰.原创
date:   2014-09-12
category: linux
tags: linux shell wget
---
最近同事的博客，域名快到期了，同事说用`wget`已经把网站静态化镜像了一份，但是文件头`mimetype`需要批量替换。在这里给朋友们分享一下如何使用`wget`遍历备份整站目录，并使用`sed`批量替换文件内容。
<!--more-->

命令如下：
{% highlight bash %}

# wget遍历下载整站命令
$ wget --random-wait -r -p -np -k -e robots=off -U "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36" "http://baidu.com"

{% endhighlight %}

参数解释:
{% highlight html %}

--random-wait	--随机等待时间
-r,		--recursive 递归下载  
-p,		--page-requisites 下载显示HTML文件的所有图片  
-np,		--no-parent 不追溯到父目录  
-k,		--convert-links 转换非相对链接为相对链接  
-e,		--execute=COMMAND 执行一个 “.wgetrc”命令  
robots=off	--无视robots.txt  
-U,		--user-agent=AGENT 设定代理的名称为 AGENT  
"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36"  --伪装agent

{% endhighlight %}

不清楚伪装`agent`的朋友往下看截图：  

![伪装agent]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-0.png)  


首先把非`html`文件的文件批量替换成后缀为`.html`的文件。

{% highlight bash %}

# 批量替换符合类型的文件
$ find . -type f ! -name "*.html" -exec bash -c "mv -f {} {}.html" \;

{% endhighlight %}

把所有文件中的`<meta.*charset.*>`标签全部替换成`<meta http-equiv="content-type" content="text/html;charset=utf-8">`。  

{% highlight bash %}

# 查找并替换非目录文件
$ find . -type f -name "*.html" -exec bash -c "sed -e 's/<meta.*charset.*>/<meta http-equiv=\"content-type\" content=\"text\/html;charset=utf-8\">/g' {} > {}.tmp; mv -f {}.tmp {}" \;

# 出现以下错误
sed: RE error: illegal byte sequence

# 加上LC_CTYPE=C属性
$ find . -type f -name "*.html" -exec bash -c "LC_CTYPE=C sed -e 's/<meta.*charset.*>/<meta http-equiv=\"content-type\" content=\"text\/html;charset=utf-8\">/g' {} > {}.tmp; mv -f {}.tmp {}" \;

{% endhighlight %}

###到这里基本就完成了。注意`find`查找的文件路径就好了。:)

-----------------------

相关参考文章地址：

illegal-byte-sequence-on-Mac-OSX - <http://stackoverflow.com/questions/19242275/re-error-illegal-byte-sequence-on-mac-os-x>

-----------------------
