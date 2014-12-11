(function() {
	var DoubanBooks = {
		init: function(opt) {
			var apikey = opt.apikey ? '&apikey=' + opt.apikey : '';
			this.url = 'https://api.douban.com/v2/book/user/' + opt.username + '/collections?count=100' + apikey + '&callback=?';
			this.fetch(); 
		},
		template: function(type, obj) {
			var tmpl = $('#' + type + '-template').html(),
				ctnr = $('#db-' + type + '-books');
			// 编译模版
			var _tmpl = Handlebars.compile(tmpl);
			$(".loading").hide();
			ctnr.append(_tmpl(obj));
		},
		fetch: function() {
			var self = this;
			// 获取 JSON 数据
			$.getJSON(this.url, function(data) {
				data = data.collections;
				$.map(data, function(book) {
					switch(book.status) {
						case "wish":
							self.wishBooks = [book];
							self.template('wish', self.wishBooks);
							break;
						case "reading":
							self.readingBooks = [book];
							self.template('reading', self.readingBooks);
							break;
						case "read":
							self.readBooks = [book];
							self.template('read', self.readBooks);
							break;
					};
				});
			});
		}
	};
	DoubanBooks.init({
		username: '70894126', // 豆瓣用户名
		apikey: '0c6613784f53b1f425323a68edfb15dc' //豆瓣API KEY
	});
})();