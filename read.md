---
layout: default1
title: jcore豆瓣读书
keywords:	 "Jcore,douban,豆瓣读书"
description: "jcore豆瓣读书"
---
<div style="width:1000px;margin:0 auto;" >
<div id="book" style="display: none">
    <h3>在读：</h3>

    <div id="reading"></div>
    <h3>读过：</h3>

    <div id="read"></div>
    <h3>想读：</h3>

    <div id="wish"></div>
</div>
<script type="text/javascript" src="{{ site:staticurl }}/resources/js/douban.js"></script>
<script type="text/javascript">
	var dbapi = new DoubanApi();
	window.onload = function(){
		dbapi.show();
	};
</script>
</div>

