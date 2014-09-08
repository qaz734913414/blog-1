---
layout: default1
title: jcore豆瓣读书
keywords:	 "Jcore,douban,豆瓣读书"
description: "jcore豆瓣读书"
---
<div style="width:1000px;margin:0 auto;" >
<script type="text/javascript" src="{{ site:staticurl }}/resources/js/douban.js"></script>
<script type="text/javascript">
	var dbapi = new DoubanApi();
	window.onload = function(){
		dbapi.show();
	};
</script>
</div>

