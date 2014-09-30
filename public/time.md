---
layout: default1
title: jcore时光轴
keywords:	 "Jcore,jcore,时光轴"
description: "jcore时光轴"
permalink: /time/
menu: time
---

<div class="archive" >
	{% for post in site.posts reverse %}
    {% if post.layout == 'post' %}
    <article>
        <h3 class="year">{{ post.date | date: "%Y" }}</h3>
        <section>
        <span class="point-time "></span>
        <time datetime="{{ post.date | date: "%m" }}-{{ post.date | date: "%d" }}">

        <span>{{ post.date | date: "%m" }}月{{ post.date | date: "%d" }}日</span>
        <span></span>
        </time>
        <aside>
            <p class="things"><a href="{{ post.url }}">{{post.title}}</a></p>
        </aside>
    </section>
    {% endif %}
    {% endfor %}
    </article>
</div>