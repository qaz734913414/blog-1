---
layout: default1
title: jcore豆瓣读书
keywords:	 "Jcore,douban,豆瓣读书"
description: "jcore豆瓣读书"
---
<div style="width:1000px;margin:0 auto;" >

<h2><b>读书</b></h2>
<hr/>
数据源来自我的豆瓣读书...
<article>
	<div id="archives">
		<div id="douban">
<!--
			<div id="bookreading" class="douban-list"></div>
			<div id="bookread" class="douban-list"></div>
			<div id="bookwish" class="douban-list"></div>
-->
		</div>
	</div>
</article>
<script type="text/javascript" src="{{ site.staticurl }}/resources/js/douban.js"></script>
<script type="text/javascript">
	var dbapi = new DoubanApi();
	window.onload = function(){
		dbapi.show();
	};
</script>
</div>

