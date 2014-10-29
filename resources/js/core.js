
if (typeof String.prototype.format !== "function") {
	/* 字符串模板 */
	String.prototype.format = function () {
		var s = this, //字符串指针
			length = arguments.length; //参数长度
		while (--length >= 0){
			s = s.replace(new RegExp('\\{' + length + '\\}', 'g'), arguments[length]);
		}
		return s;
	};
}

function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) {
		return r[2];
	}
	return null;
}

(function(){

	// 多说API封装
	var DuoshuoAPI = {

		//最热文章  http://api.duoshuo.com/sites/listTopThreads.json?short_name=jcore&range=all&num_items=3
		//http://api.duoshuo.com/threads/counts.json?short_name=jcore&threads=

		// 初始化插件
		init : function(){

		},

		// 设置模板
		template : function(){

		},

		// 遍历获取
		fetch : function(){

		}

	}

})();


(function(){

	var Pagination = {
		code: '',

		// 初始化数据
		Extend: function(data) {
			data = data || {};
			Pagination.size = data.size || 0;
			Pagination.page = data.page || 1;
			Pagination.step = data.step || 3;
			Pagination.callback = data.callback || null;
		},

		// 添加页数
		Add: function(s, f) {
			for (var i = s; i < f; i++) {
				Pagination.code += '<a>' + i + '</a>';
			}
		},

		// 添加最后一页
		Last: function() {
			Pagination.code += '<i>...</i><a>' + Pagination.size + '</a>';
		},

		// 添加第一页
		First: function() {
			Pagination.code += '<a>1</a><i>...</i>';
		},

		// 创建分页对象
		Click: function() {
			Pagination.page = +this.innerHTML;

			Pagination.Start();
		},

		// 前一页
		Prev: function() {
			Pagination.page--;
			if (Pagination.page < 1) {
				Pagination.page = 1;
			}
			Pagination.Start();
		},

		// 下一页
		Next: function() {
			Pagination.page++;
			if (Pagination.page > Pagination.size) {
				Pagination.page = Pagination.size;
			}
			Pagination.Start();
		},

		// 绑定分页事件
		Bind: function() {
			var a = Pagination.e.getElementsByTagName('a');
			for (var i = 0; i < a.length; i++) {
				if (+a[i].innerHTML === Pagination.page) a[i].className = 'current';
				a[i].addEventListener('click', Pagination.Click, false);
			}
		},

		// 输出分页
		Finish: function() {
			Pagination.e.innerHTML = Pagination.code;
			Pagination.code = '';
			if(Pagination.callback) Pagination.callback(Pagination.page);
			Pagination.Bind();
		},

		// 查找分页类型
		Start: function() {
			if (Pagination.size < Pagination.step * 2 + 6) {
				Pagination.Add(1, Pagination.size + 1);
			}
			else if (Pagination.page < Pagination.step * 2 + 1) {
				Pagination.Add(1, Pagination.step * 2 + 4);
				Pagination.Last();
			}
			else if (Pagination.page > Pagination.size - Pagination.step * 2) {
				Pagination.First();
				Pagination.Add(Pagination.size - Pagination.step * 2 - 2, Pagination.size + 1);
			}
			else {
				Pagination.First();
				Pagination.Add(Pagination.page - Pagination.step, Pagination.page + Pagination.step + 1);
				Pagination.Last();
			}
			Pagination.Finish();
		},

		// 绑定分页
		Buttons: function(e) {
			var nav = e.getElementsByTagName('a');
			nav[0].addEventListener('click', Pagination.Prev, false);
			nav[1].addEventListener('click', Pagination.Next, false);
		},

		// 创建模板
		Create: function(e) {

			var html = [
				'<a>&#9668;</a>', // 上一页
				'<span></span>',  // 中间页
				'<a>&#9658;</a>'  // 下一页
			];

			e.innerHTML = html.join('');
			Pagination.e = e.getElementsByTagName('span')[0];
			Pagination.Buttons(e);
		},

		// 初始化分页
		Init: function(e, data) {
			if(data.size==0) return;
			Pagination.Extend(data);
			Pagination.Create(e);
			Pagination.Start();
		}
	};


	var pageSize = 7;

	// http://xxx/pages/?q=11111
	// http://xxx/categories/#life
	// http://xxx/tags/#html5
	document.addEventListener("DOMContentLoaded", function ()
	{
		var _path = window.location.href;
		if(_path.indexOf("pages")!=-1)  // 全部分页
		{
			$.getJSON("../lists.json", function (data)
			{
				var q = decodeURIComponent(getQueryString("q"));
				if(q!=null && q!=""){

					var query = JsonQuery(data);

					try {
						data = query.where({'title.$li': eval("/" + q + "/i")}).exec();
					}catch(e){}

					var _nav = "搜索详情 > {0}".format(q);
					$(".main-m3-h1").html(_nav);

					if(data.length ==0) {
						$("#showPages").html("很遗憾,没有找到结果...");
						return false;
					}
				}
				var _size = Math.ceil(Object.keys(data).length/pageSize);
				Pagination.Init(document.getElementById("pagination"),
				{
					size: _size, // 页面大小
					page: 1,  // 默认选中分页
					step: 3,  // 前后省略页码
					callback: function(num){
						showPages("pages",data,num);
					}
				});
			});
		}
	}, false);

	function showPages(type,data,num){

		var count_sup = num * pageSize; // 循环上界每次增加count

		var delta = (num - 1) * pageSize;	  // 局部计数器

		var tmpl = [];

		$.each(data,function(i,d){
			if(i>= delta & i< count_sup) {
				tmpl.push('<div class="contents">');
				tmpl.push('	<div class="g-3-img"><a href="' + d.url + '"><img src="' + d.image + '" width="200" height="150" /></a></div>');
				tmpl.push('	<div class="g-3-box">');
				tmpl.push('		<h1 class="main-m3-h1"><a href="' + d.url + '">' + d.title + '</a></h1>');
				tmpl.push('		<div class="mini-icon">');
				tmpl.push('			<span>');
				tmpl.push('				<i class="fa fa-user"></i>');
				tmpl.push('				张嘉杰.原创');
				tmpl.push('			</span>');
				tmpl.push('			<span>');
				tmpl.push('				<i class="fa fa-calendar"></i>');
				tmpl.push('				' + d.date + '');
				tmpl.push('			</span>');
				tmpl.push('			<span>');
				tmpl.push('				<i class="fa fa-folder-open"></i>');
				tmpl.push('				<a href="/categories.html#' + d.category + '">' + d.category + '</a>');
				tmpl.push('			</span>');
//				tmpl.push('			<span>');
//				tmpl.push('				<i class="fa fa-comments"></i>');
//				tmpl.push('			  <span class="ds-thread-count" data-thread-key="' + d.id + '" ></span>');
//				tmpl.push('			</span>');
				tmpl.push('	  </div>');
				tmpl.push('		<div class="g-3-cont">');
				tmpl.push(d.content);
				tmpl.push('		</div>');
				tmpl.push('	</div>');
				tmpl.push('</div>');
			}
		});

		$("#showPages").html(tmpl.join(""));

		tmpl = [];
	}

})();


$("pre").addClass("prettyprint");
prettyPrint();

$(".point-time").each(function(){
	var x = 5;
	var y = 0;
	var rand = parseInt(Math.random() * (x - y + 1) + y);
	$(this).addClass("point"+rand);
});