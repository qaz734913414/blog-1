---
layout: column_1_2
title:  "nodejs实践之express"
description: "nodejs实践之express nodejs express"
keywords: nodejs,express
origin: 张嘉杰.原创
date:   2015-02-10
category: javascript
tags: javascript nodejs express
---
折腾`nodejs`有一段时间了，今天手贱升级后发现一堆模块不能用了，只能卸载重装了。顺便就写篇关于`mac`环境下安装`nodejs`、`npm`、`express`，并利用`express-generator`构建项目。。  
<!--more-->

不熟悉`brew`命令的朋友，[戳这里](/2014/02/10/newmac/)。 

> 安装nodejs
{% highlight bash %}
root:~ zjj$ brew install nodejs
==> Downloading https://homebrew.bintray.com/bottles/node-4.2.1.mavericks.bottle.tar.gz
Already downloaded: /Library/Caches/Homebrew/node-4.2.1.mavericks.bottle.tar.gz
==> Pouring node-4.2.1.mavericks.bottle.tar.gz
==> Caveats
Bash completion has been installed to:
  /usr/local/etc/bash_completion.d
==> Summary
  /usr/local/Cellar/node/4.2.1: 2738 files, 36M
{% endhighlight %}

> 安装express
{% highlight bash %}
root:~ zjj$ sudo npm install -g express
express@4.13.3 /usr/local/lib/node_modules/express
├── escape-html@1.0.2
├── merge-descriptors@1.0.0
├── cookie@0.1.3
├── array-flatten@1.1.1
├── utils-merge@1.0.0
├── cookie-signature@1.0.6
├── content-type@1.0.1
├── methods@1.1.1
├── range-parser@1.0.3
├── etag@1.7.0
├── vary@1.0.1
├── fresh@0.3.0
├── path-to-regexp@0.1.7
├── content-disposition@0.5.0
├── serve-static@1.10.0
├── parseurl@1.3.0
├── depd@1.0.1
├── qs@4.0.0
├── finalhandler@0.4.0 (unpipe@1.0.0)
├── debug@2.2.0 (ms@0.7.1)
├── on-finished@2.3.0 (ee-first@1.1.1)
├── type-is@1.6.10 (media-typer@0.3.0, mime-types@2.1.8)
├── accepts@1.2.13 (negotiator@0.5.3, mime-types@2.1.8)
├── send@0.13.0 (destroy@1.0.3, statuses@1.2.1, ms@0.7.1, mime@1.3.4, http-errors@1.3.1)
└── proxy-addr@1.0.10 (forwarded@0.1.0, ipaddr.js@1.0.5)
{% endhighlight %}

> 安装express-generator
{% highlight bash %}
root:~ zjj$ sudo npm install -g express-generator
/usr/local/bin/express -> /usr/local/lib/node_modules/express-generator/bin/express
express-generator@4.13.1 /usr/local/lib/node_modules/express-generator
├── sorted-object@1.0.0
├── mkdirp@0.5.1 (minimist@0.0.8)
└── commander@2.7.1 (graceful-readlink@1.0.1)
{% endhighlight %}

> 查看node版本
{% highlight bash %}
root:~ zjj$ node -v
v4.2.1
{% endhighlight %}

> 查看npm版本
{% highlight bash %}
root:~ zjj$ npm -v
2.14.7
{% endhighlight %}

> 查看express版本
{% highlight bash %}
root:~ zjj$ express -V
4.13.1
{% endhighlight %}

> 创建一个简单的项目
{% highlight bash %}
root:~ zjj$ express nodeTest

   create : nodeTest
   create : nodeTest/package.json
   create : nodeTest/app.js
   create : nodeTest/public
   create : nodeTest/public/javascripts
   create : nodeTest/public/images
   create : nodeTest/public/stylesheets
   create : nodeTest/public/stylesheets/style.css
   create : nodeTest/routes
   create : nodeTest/routes/index.js
   create : nodeTest/routes/users.js
   create : nodeTest/views
   create : nodeTest/views/index.jade
   create : nodeTest/views/layout.jade
   create : nodeTest/views/error.jade
   create : nodeTest/bin
   create : nodeTest/bin/www

   install dependencies:
     $ cd nodeTest && npm install

   run the app:
     $ DEBUG=nodeTest:* npm start
{% endhighlight %}

> 查看node项目目录结构	
{% highlight bash %}
root:~ zjj$ ls -Fl ~/nodeTest/
-rw-r--r--   1 zjj  staff  1442 12 20 01:26 app.js			> 程序启动文件
drwxr-xr-x   3 zjj  staff   102 12 20 01:26 bin/			> 创建项目时已经提到，是真实的执行程序
drwxr-xr-x  10 zjj  staff   340 12 20 01:27 node_modules/	> 存放所有的项目依赖库
-rw-r--r--   1 zjj  staff   327 12 20 01:26 package.json	> 项目依赖配置
drwxr-xr-x   5 zjj  staff   170 12 20 01:26 public/			> 静态文件（css,js,img）
drwxr-xr-x   4 zjj  staff   136 12 20 01:26 routes/			> 路由文件
drwxr-xr-x   5 zjj  staff   170 12 20 01:26 views/			> 页面文件
{% endhighlight %}

> 进入项目目录，并初始化ngde依赖
{% highlight bash %}
root:~ zjj$ cd nodeTest && npm install
cookie-parser@1.3.5 node_modules/cookie-parser
├── cookie@0.1.3
└── cookie-signature@1.0.6

debug@2.2.0 node_modules/debug
└── ms@0.7.1

serve-favicon@2.3.0 node_modules/serve-favicon
├── fresh@0.3.0
├── etag@1.7.0
├── ms@0.7.1
└── parseurl@1.3.0

morgan@1.6.1 node_modules/morgan
├── on-headers@1.0.1
├── basic-auth@1.0.3
├── depd@1.0.1
└── on-finished@2.3.0 (ee-first@1.1.1)

body-parser@1.13.3 node_modules/body-parser
├── bytes@2.1.0
├── content-type@1.0.1
├── depd@1.0.1
├── qs@4.0.0
├── iconv-lite@0.4.11
├── on-finished@2.3.0 (ee-first@1.1.1)
├── raw-body@2.1.5 (unpipe@1.0.0, bytes@2.2.0, iconv-lite@0.4.13)
├── type-is@1.6.10 (media-typer@0.3.0, mime-types@2.1.8)
└── http-errors@1.3.1 (statuses@1.2.1, inherits@2.0.1)

express@4.13.3 node_modules/express
├── escape-html@1.0.2
├── merge-descriptors@1.0.0
├── array-flatten@1.1.1
├── cookie@0.1.3
├── utils-merge@1.0.0
├── cookie-signature@1.0.6
├── methods@1.1.1
├── vary@1.0.1
├── content-type@1.0.1
├── etag@1.7.0
├── fresh@0.3.0
├── content-disposition@0.5.0
├── range-parser@1.0.3
├── path-to-regexp@0.1.7
├── serve-static@1.10.0
├── parseurl@1.3.0
├── depd@1.0.1
├── qs@4.0.0
├── on-finished@2.3.0 (ee-first@1.1.1)
├── finalhandler@0.4.0 (unpipe@1.0.0)
├── proxy-addr@1.0.10 (forwarded@0.1.0, ipaddr.js@1.0.5)
├── type-is@1.6.10 (media-typer@0.3.0, mime-types@2.1.8)
├── send@0.13.0 (destroy@1.0.3, statuses@1.2.1, ms@0.7.1, mime@1.3.4, http-errors@1.3.1)
└── accepts@1.2.13 (negotiator@0.5.3, mime-types@2.1.8)

jade@1.11.0 node_modules/jade
├── commander@2.6.0
├── character-parser@1.2.1
├── void-elements@2.0.1
├── mkdirp@0.5.1 (minimist@0.0.8)
├── constantinople@3.0.2 (acorn@2.6.4)
├── with@4.0.3 (acorn@1.2.2, acorn-globals@1.0.9)
├── jstransformer@0.0.2 (is-promise@2.1.0, promise@6.1.0)
├── clean-css@3.4.8 (commander@2.8.1, source-map@0.4.4)
├── transformers@2.1.0 (promise@2.0.0, css@1.0.8, uglify-js@2.2.5)
└── uglify-js@2.6.1 (async@0.2.10, uglify-to-browserify@1.0.2, source-map@0.5.3, yargs@3.10.0)
{% endhighlight %}

> 启动node项目（debug模式）
{% highlight bash %}
root:nodeTest zjj$ DEBUG=nodeTest:* npm start

> nodeTest@0.0.0 start /Users/zjj/nodeTest
> node ./bin/www

  nodeTest:server Listening on port 3000 +0ms
{% endhighlight %}  
  
> 地址栏访问（http://localhost:3000）

![nodejs-express]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-1.png)

### 到这儿nodejs安装就完毕了。还是挺简单的。

> 写个简单的爬虫（抓取jcore.cn的友情链接）

> 1. 先添加两个模块（superagent获取源数据，cheerio解析数据）

{% highlight bash %}
root:nodeTest zjj$ npm install --save superagent
superagent@1.6.1 node_modules/superagent
├── extend@1.2.1
├── cookiejar@2.0.6
├── methods@1.0.1
├── reduce-component@1.0.1
├── mime@1.3.4
├── component-emitter@1.1.2
├── qs@2.3.3
├── formidable@1.0.14
├── readable-stream@1.0.27-1 (isarray@0.0.1, string_decoder@0.10.31, inherits@2.0.1, core-util-is@1.0.2)
└── form-data@0.2.0 (async@0.9.2, combined-stream@0.0.7, mime-types@2.0.14)

root:nodeTest zjj$ npm install --save cheerio
cheerio@0.19.0 node_modules/cheerio
├── entities@1.1.1
├── lodash@3.10.1
├── dom-serializer@0.1.0 (domelementtype@1.1.3)
├── css-select@1.0.0 (boolbase@1.0.0, css-what@1.0.0, nth-check@1.0.1, domutils@1.4.3)
└── htmlparser2@3.8.3 (domelementtype@1.3.0, entities@1.0.0, domutils@1.5.1, domhandler@2.3.0, readable-stream@1.1.13)
{% endhighlight %}

> 2. 具体实现（新建../routes/reptile.js，添加如下脚本）
{% highlight bash %}
var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');
var router = express.Router();

router.get('/', function (req, res, next) {
  superagent.get('http://www.jcore.cn/').end(function (err, sres) {
      if (err) return next(err);
      var $ = cheerio.load(sres.text);
      var links = [];
      $('ul.links li a').each(function (i, o) {
        links.push({
        	title: $(o).text(), href: $(o).attr('href')
        });
      });
      //res.send(links);
	  res.render('reptile', { links: links });
    });
});

module.exports = router;
{% endhighlight %}

> 3. jade模板（新建../views/reptile.jade，添加如下内容）
{% highlight bash %} 
extends layout

block content
  h1= '友情链接'
  each link,index in links
    ul
      li
        a(href=link.href, title=link.title) #{link.title}
{% endhighlight %}
		
> 地址栏访问（http://localhost:3000/reptile）

![nodejs-reptile]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-2.png)

### 到这儿挺简单的一个例子就完成了，今儿就到这儿吧。:)

-----------------------

相关参考文章地址：

Node.js - <https://nodejs.org/en/>  
Node.js intro git repository - <https://github.com/indexzero/nodejs-intro>