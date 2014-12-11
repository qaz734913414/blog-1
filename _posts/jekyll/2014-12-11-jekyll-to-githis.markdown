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

> 项目迁移

1.访问 [Githis] 项目主页点击 `Github`登录

![step4]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-3.png)  

2.点击部署项目

![step5]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-4.png)  

3.添加网站

![step6]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-5.png)  

4.设置push钩子地址

![step7]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-6.png)  

最后绑定自己的域名，把`CNAME`解析到`githis.com`稍后访问域名即可。

###OK，今儿就到这儿了，休息了 :)

-----------------------

[Githis]:		http://www.githis.com/
[Github Pages]:	http://pages.github.com
[Jekyll]:		http://jekyllrb.com
