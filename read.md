---
layout: default1
title: jcore豆瓣读书
keywords:	 "Jcore,douban,豆瓣读书"
description: "jcore豆瓣读书"
permalink: /read/
menu: read
---

<hr/>

{% raw %}

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
	
{% endraw %}
	
<hr/>	


