---
layout: column_1_2_default
title: 标签分类
keywords:	 "Jcore,jcore,标签分类"
description: "jcore标签分类"
permalink: /category/
menu: category
---

<div class="f3">
	{% for category in site.categories %}
	<div class="column fJqueryba">
		<h2 class=""><a href="/{{ category | first }}/" class="gray_2">{{ category | first }}</a></h2>
		<ul class="columnUl">
			{% for post in category[1] %}
			<li>
				<b><a href="{{ post.url  }}" title="" class="gray_2" target="_blank">{{ post.title }}</a></b>
				<span>{{ post.date | date:"%Y年%m月%d日" }}</span>
			</li>
			{% endfor %}
		</ul>
	</div>
	{% endfor %}
</div>