
NProgress.start();

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
	$('div.main > div:eq(0)').html(html);
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

$("pre").addClass("prettyprint");
prettyPrint();

$(".point-time").each(function(){
	var x = 5;
	var y = 0;
	var rand = parseInt(Math.random() * (x - y + 1) + y);
	$(this).addClass("point"+rand);
})

// totop
var e = $("#rocket-to-top"),
	t = $(document).scrollTop(),
	n,
	r,
	i = !0;
	$(window).scroll(function() {
		var t = $(document).scrollTop();
		t == 0 ? e.css("background-position") == "0px 0px" ? e.fadeOut("slow") : i && (i = !1, $(".level-2").css("opacity", 1), e.delay(100).animate({
			marginTop: "-1000px"
		},
		"normal",
		function() {
			e.css({
				"margin-top": "-100px",
				display: "none"
			}),
			i = !0
		})) : e.fadeIn("slow")
	});
	e.hover(function() {
		$(".level-2").stop(!0).animate({
			opacity: 1
		})
	}, function() {
		$(".level-2").stop(!0).animate({
			opacity: 0
		})
	});

	$(".level-3").click(function() {
		function t() {
			var t = e.css("background-position");
			if (e.css("display") == "none" || i == 0) {
				clearInterval(n),
				e.css("background-position", "0px 0px");
				return
			}
			switch (t){
			case "0px 0px":
				e.css("background-position", "-298px 0px");
				break;
			case "-298px 0px":
				e.css("background-position", "-447px 0px");
				break;
			case "-447px 0px":
				e.css("background-position", "-596px 0px");
				break;
			case "-596px 0px":
				e.css("background-position", "-745px 0px");
				break;
			case "-745px 0px":
				e.css("background-position", "-298px 0px");
			}
		}
		if (!i) return;
		n = setInterval(t, 50),
		$("html,body").animate({scrollTop: 0},"slow");
	});




NProgress.done();
