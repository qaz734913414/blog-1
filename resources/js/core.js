$(function(){
	NProgress.start();
	
	$(window).scroll(function() { if($(window).scrollTop() >= 100){ $('.topfade').fadeIn(300); }else{ $('.topfade').fadeOut(300); } });

	$('.topfade').click(function(){ $('html,body').animate({scrollTop: '0px'}, 800);});
	
	
	
	var entries = null;
	function htmlEscape(s) {
		return String(s).replace(/[&<>"'\/]/g, function(s) {
			var entityMap = {
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				'"': '&quot;',
				"'": '&#39;',
				"/": '&#x2F;'
			};
			return entityMap[s];
		});
	}
	function findEntries(q) {
		var matches = [];
		var rq = new RegExp(q, 'im');
		var rl = /^http:\/\/havee\.me\/(.+)\.html$/;
		for (var i = 0; i < entries.length; i++) {
			var entry = entries[i];
			var title = $(entry.getElementsByTagName('title')[0]).text();
			var link = $(entry.getElementsByTagName('link')[0]).attr('href');
			//var title_en = rl.exec(link)[1].replace(/-/g, ' ');
			var content = $(entry.getElementsByTagName('content')[0]).text();
			//if (rq.test(title) || rq.test(title_en) || rq.test(content)) {
			if (rq.test(title) || rq.test(content)) {
				matches.push({'title': title, 'link': link, 'content': content});
			}
		}
		
		var html = '<div class="bt-hd cl"><span>搜索结果</span><s></s></div>';
		html += '<ul class="main-ua">';
		if(matches.length==0) html += '<li>很抱歉！没有找到与 '+q+' 相关文章！</li>';
		for (var i = 0; i < matches.length; i++) {
			var match = matches[i];
			html += '<li>';
			html += '<header><h4 class="h4 entry-title"><a href="' + match.link + '">' + htmlEscape(match.title) + '</a></h4></header>';
			html += '<section><p>' + htmlEscape(match.content) + '</p></section>';
			html += '</li>';
		}
		html += '</ul>';
		
		NProgress.done();
		$('.main-l,.default404').html(html);
	}
	$('#search-form').submit(function() {
		NProgress.start();
		var query = $('#query').val();
		$('#query').blur().attr('disabled', true);
		$('.main-contenter').hide();
		$('#search-loader').show();
		if (entries == null) {
			$.ajax({url: '/atom.xml?r=' + (Math.random() * 99999999999), dataType: 'xml', success: function(data) {
				entries = data.getElementsByTagName('entry');
				findEntries(query);
			}});
		} else {
			findEntries(query);
		}
		$('#query').blur().attr('disabled', false);
		return false;
	});
	
	
	
	NProgress.done();
});