---
layout: column_1_2
title:  "jekyll 博客迁移到 githis"
description: "jekyll 博客迁移到 githis"
keywords: github,jekyll,mac,blog,githis,hooks
origin: 张嘉杰.原创
date:   2014-12-11
category: jekyll
tags: github jekyll mac blog hooks
---
最近不知道是什么原因`Github Pages`上越来越不稳定了，动不动访问缓存提示失败各种`503`。于是今天晚上准备把博客全部迁到 [Githis] 上面来，主要是因为它支持 [Jekyll]。
<!--more-->
需要注意的是`Github Pages`是基于`gh-pages`分支，而`Githis`目前只支持`master`分支。

> 如何实现自动同步

`Github`项目设置中有一个`HOOK（push钩子）`，当有内容更新时，自动`post`请求给`Githis`项目拉取，编译`jekyll`代码。

大家还是一步一步看图吧。

1.第一步点击设置

![step1]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-0.png)  

2.第二步设置钩子地址和钩子请求方式

![step2]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-1.png)  

3.第三步成功后看到成功推送请求

![step3]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-2.png)  

{% highlight bash %}
# 查看ruby版本
$ ruby -version 

#升级gem
$ sudo gem update --system

# 安装jekyll
$ gem install jekyll 

# 出现如下错误
ERROR:  While executing gem ... (OptionParser::MissingArgument)
    missing argument: -v
	
# 赋值权限执行
$ sudo gem install jekyll

#支持markdown语法
$ sudo gem install rdiscount

# 安装完毕创建博客目录
$ jekyll new blog

# 进入目录
$ cd blog

# 启动服务
$ jekyll server
{% endhighlight %}

完成以上步骤。外面访问地址栏 http://localhost:4000/ 就可以看到 jekyll 初始化的模板页面了。

下面介绍一下 jekyll 生成的目录结构。
{% highlight html %}

_config.yml 	# 配置文件
_includes	# 重复利用文件
_layouts	# 模板html文件
_posts		# 文章模板（格式：`YYYY-MM-DD-name-of-post.markdown`）
_site		# 生成文章html文档
css		# 样式
index.html	# 首页

{% endhighlight %}

先在 `Github` 上建立blog资源目录，至于 `Git` 的相关命令如下：
{% highlight bash %}

$ git init
$ git add README.md
$ git commit -m "first commit"
$ git remote add origin https://github.com/[gitgub名称]/blog.git
$ git push -u origin master

{% endhighlight %}

等待十分钟左右，访问地址栏 http://[gitgub名称].github.io/blog/ 即可。

至于绑定域名先在 `jekyll` 目录下添加文件 CNAME 里面写入相关域名。
域名解析A地址指向 `204.232.175.78` 稍后访问域名即可。

###有没有觉得很简单 :)

-----------------------

相关参考文章地址：

Git 安装地址 - <http://git-scm.com/book/en/Getting-Started-Installing-Git>  
Github Jcore - <http://github.com/jcores>  
Github Pages - <http://pages.github.com>  
Jekyll - <http://jekyllrb.com>  
Jekyll-Gh - <https://github.com/jekyll/jekyll>  
Jekyll-Help - <https://github.com/jekyll/jekyll-help>  
Liquid-Help - <https://github.com/shopify/liquid/wiki/liquid-for-designers>  
Markdown - <http://daringfireball.net/projects/markdown/syntax>  
Markdown 预览 - <https://stackedit.io/editor>

-----------------------

[Githis]:		http://www.githis.com/
[Github Pages]:	http://pages.github.com
[Jekyll]:		http://jekyllrb.com
