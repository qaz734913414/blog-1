---
layout: column_1_2_default
title: Tag标签
keywords:	 "Jcore,jcore,Tag标签"
description: "jcoreTag标签"
permalink: /tag/
---

<div class="f5">
	{% for tag in site.tags %}
	<div class="column fJqueryba">
		<h2 class=""><a name="{{ tag[0] }}" class="gray_2"></a>{{ tag[0] }}</h2>
		<ul class="columnUl">
			{% for post in tag[1] %}
			<li>
				<b><a href="{{ post.url }}" title="" class="gray_2" target="_blank">{{ post.title }}</a></b>
				<span>{{ post.date | date:"%Y年%m月%d日" }}</span>
			</li>
			{% endfor %}
		</ul>
	</div>
	{% endfor %}
</div>