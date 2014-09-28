---
layout: default1
title: jcore豆瓣读书
keywords:	 "Jcore,douban,豆瓣读书"
description: "jcore豆瓣读书"
permalink: /read/
menu: read
---

<hr/>

<article>
	<div id="archives">
		<div id="douban">
			<!--
			数据源来自我的豆瓣读书...
			<div id="bookreading" class="douban-list"></div>
			<div id="bookread" class="douban-list"></div>
			<div id="bookwish" class="douban-list"></div>
			-->
		</div>
	</div>
<hr/>	


<div class="douban-books">
  
  <!-- 读过的 -->
  <div class="db-status-read">
    <div class="loading"></div>
    <div class="db-status-title">读过的书</div>
    <ul id="db-read-books" class="db-books">
      <script id="read-template" type="text/x-handlebars-template">
        {{#each this}}
          <li>
            <a href="{{book.alt}}" target="_blank">
              <img src="{{book.images.medium}}" />
              <h3>
                <span>{{book.title}}</span>
              </h3>
            </a>
          </li>
        {{/each}}
      </script>
    </ul>
  </div>
  
  <!-- 正在读 -->
  <div class="db-status-reading">
    <div class="loading"></div>
    <div class="db-status-title">在读的书</div>
    <ul id="db-reading-books" class="db-books">
      <script id="reading-template" type="text/x-handlebars-template">
        {{#each this}}
          <li>
            <a href="{{book.alt}}" target="_blank">
              <img src="{{book.images.medium}}" />
              <h3>
                <span>{{book.title}}</span>
              </h3>
            </a>
          </li>
        {{/each}}
      </script>
    </ul>
  </div>
  
  <!-- 想读的 -->
  <div class="db-status-wish">
    <div class="loading"></div>
    <div class="db-status-title">想读的书</div>
    <ul id="db-wish-books" class="db-books">
      <script id="wish-template" type="text/x-handlebars-template">
        {{#each this}}
          <li>
            <a href="{{book.alt}}" target="_blank">
              <img src="{{book.images.medium}}" />
              <h3>
                <span>{{book.title}}</span>
              </h3>
            </a>
          </li>
        {{/each}}
      </script>
    </ul>
  </div>
  
</div>

	
</article>
<script type="text/javascript">
(function() {
  var DoubanBooks = {
    init: function(opt) {
      var apikey = opt.apikey ? '&apikey=' + opt.apikey : '';
      this.url = 'https://api.douban.com/v2/book/user/' + opt.username + '/collections?count=100' + apikey + '&callback=?';
      this.fetch();      
    },
    template: function(type, obj) {
      var tmpl = $('#' + type + '-template').html(),
          ctnr = $('#db-' + type + '-books');
      // 编译模版
      var _tmpl = Handlebars.compile(tmpl);
      
      $(".loading").hide();
      ctnr.append(_tmpl(obj));
    },
    fetch: function() {
      var self = this;
      // 获取 JSON 数据
      $.getJSON(this.url, function(data) {
        data = data.collections;
        $.map(data, function(book) {
          switch(book.status) {
            case "wish":
              self.wishBooks = [book];
              self.template('wish', self.wishBooks);
              break;
            case "reading":
              self.readingBooks = [book];
              self.template('reading', self.readingBooks);
              break;
            case "read":
              self.readBooks = [book];
              self.template('read', self.readBooks);
              break;
          };
        });
      });   
    }
  };
  DoubanBooks.init({
    username: '70894126', // 豆瓣用户名
    apikey: '0c6613784f53b1f425323a68edfb15dc'
  });
})();
</script>
<script src="http://cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0-rc.4/handlebars.min.js"></script>


