---
layout: page
title:  "使用wget遍历下载整站"
description: "使用wget遍历下载整站"
keywords: linux,shell,wget
origin: 张嘉杰.原创
date:   2014-09-12
category: shell
tags: linux shell wget
---
最近同事的博客，域名快到期了，同事说用`wget`已经把网站静态化镜像了一份，但是文件头`mimetype`需要批量替换。在这里给朋友们分享一下如何使用`wget`遍历备份整站目录，并使用`sed`批量替换文件内容。
<!--more-->

命令如下：
{% highlight bash %}

# wget遍历下载整站命令
$ wget -r -p -np -k -e robots=off -U "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36" "http://baidu.com"

{% endhighlight %}

参数解释:
{% highlight html %}

-r,		--recursive 递归下载  
-p,		--page-requisites 下载显示HTML文件的所有图片  
-np,		--no-parent 不追溯到父目录  
-k,		--convert-links 转换非相对链接为相对链接  
-e,		--execute=COMMAND 执行一个 “.wgetrc”命令  
robots=off	--无视robots.txt  
-U,		--user-agent=AGENT 设定代理的名称为 AGENT  
"Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN; rv:1.9.1.6) Gecko/20091201 Firefox/3.5.6" 伪装agent

{% endhighlight %}

不清楚伪装`agent`的朋友往下看截图：  

![伪装agent]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-0.png)  

{% highlight bash %}

# 查找并替换文件
$ find . -name "*.html" -exec bash -c "sed -e 's/<meta.*>/<meta http-equiv=\"content-type\" content=\"text\/html;charset=utf-8\">/g' {} > {}.tmp; mv -f {}.tmp {}" \;

{% endhighlight %}

把根目录下所有`html`文件中的`<meta.*>`标签全部替换成`<meta http-equiv="content-type" content="text/html;charset=utf-8">`。

-----------------------
