---
layout: default1
title: jcore文章分类
keywords:	 "Jcore,jcore,文章分类"
description: "jcore文章分类"
permalink: /category/
menu: category
---
<style>
.year{color:rgb(0,180,0);margin-left:35px;font-weight:lighter;}
.time{color:#1abc9c;letter-spacing:1px;}
.link{margin-left:13.5em;margin-top:-24px;}
.link a{text-shadow:0 0 1px;letter-spacing:2px;transition:padding-left 0.25s;-webkit-transition:padding-left 0.25s;-moz-transition:padding-left 0.25s;-o-transition:padding-left 0.25s;}
.link a:hover{color:#00D809;padding-left:15px;}
.timing{position:relative;margin-left:70px;font-size:18px;height:6em;}
.timing:before{content:"";width:5px;left:8em;top:10px;bottom:-35px;background:#e6e6e6;position:absolute;}
.point-time{position:absolute;width:15px;height:15px;top:5px;left:8em;background:#1c87bf;margin-left:-5px;border-radius:100%;box-shadow:0 0 0 4px #fff;}
.point1{background-color:#f6393f;}
.point2{background-color:#1c87bf;}
.point3{background-color:#95c91e;}
.point4{background-color:#ffb902;}
.point5{background-color:#d32d93;}
@media (max-width:875px){
	.year{margin-left:2px;margin-top:-5px;margin-bottom:15px;font-size:30px;}
	.time{font-size:16px;}
	.timing{margin-left:29px;}
	.timing:before{left:4em;width:4px;}
	.point-time{left:4em;}
	.point-time{width:13px;height:13px;margin-left:-4px;box-shadow:0 0 0 3px #fff;}
	.link{margin-left:6.45em;margin-top:-20px;font-size:16px;}
	.link a:hover{padding-left:0;}
}
.category{color:#1BAF69;text-shadow:0 0 1px;font-weight:600;text-transform:Capitalize;margin-top:35px;}
.category-box-sub,.category-sub{list-style:none;}
.category-box-sub{font-size:20px;margin-left:-38px;}
.category-sub{color:#1abc9c;letter-spacing:1px;font-size:18px;margin-left:-39px;}
.category-box-sub a{text-shadow:0 0 1px;letter-spacing:2px;text-transform:Capitalize;transition:padding-left 0.25s;-webkit-transition:padding-left 0.25s;-moz-transition:padding-left 0.25s;-o-transition:padding-left 0.25s;}
.category-box-sub a:hover{color:#00D809;padding-left:10px;}
.category-sub-title{text-shadow:0 0 1px;letter-spacing:2px;word-break:break-all;transition:padding-left 0.25s;-webkit-transition:padding-left 0.25s;-moz-transition:padding-left 0.25s;-o-transition:padding-left 0.25s;}
.category-sub-title:hover{padding-left:10px;}
#line{margin-top:35px;margin-bottom:30px;}
@media (max-width:875px){
	.category-sub{font-size:16px;margin-left:-35px;}
	.category-box-sub{margin-left:-35px;}
	.category-box-sub a:hover,.category-sub-title:hover{padding-left:0;}
}
</style>

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