---
layout: default1
title: jcore文章分类
keywords:	 "Jcore,jcore,文章分类"
description: "jcore文章分类"
permalink: /category/
menu: category
---

{% capture site_categories %}{% for category in site.categories %}{{ category | first }}{% unless forloop.last %},{% endunless %}{% endfor %}{% endcapture %}
{% assign category_words = site_categories | split:',' | sort %}
<h2 class="categoryh2">分类</h2>
<ul class="tag-box">
	{% for item in (0..site.categories.size) %}{% unless forloop.last %}
	{% capture this_word %}{{ category_words[item] | strip_newlines }}{% endcapture %}
	<li><a class="categorytitle" href="#{{ this_word | cgi_escape }}">{{ this_word }} <sup>{{ site.categories[this_word].size }}</sup></a></li>
	{% endunless %}{% endfor %}
</ul>
<hr>
{% for item in (0..site.categories.size) %}{% unless forloop.last %}
{% capture this_word %}{{ category_words[item] | strip_newlines }}{% endcapture %}
<h2 class="categoryh2" id="{{ this_word | cgi_escape }}">{{ this_word }}</h2>
	{% for post in site.categories[this_word] %}{% if post.title != null %}
	<ul><li>{{ post.date | date: "%Y-%m-%d" }} &raquo; <a class="categorytitle" href="{{ post.url }}">{{ post.title }}</a></li></ul>
	{% endif %}{% endfor %}
{% endunless %}{% endfor %}
<br />