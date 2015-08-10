if(top.location!==self.location){top.location.href=self.location.href; }

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

    // http://xxx/pages/?q=11111
    // http://xxx/mood/
    // http://xxx/coding/
    document.addEventListener("DOMContentLoaded", function ()
    {
        /* 获取数据函数 */
        function getDate(callback){
            $.getJSON("../lists.json", callback);
        }
        /* 过滤数据函数 */
        function filterData(data, expression){
            var query = JsonQuery(data);
            try {
                data = query.where(expression).exec();
            }catch(e){}
            return data;
        }
        /* 数据分页 */
        function findDataPage(data, type, pageSize){
            var _pageSize = pageSize || 7; // 默认分页7条数据
            var _type = type || 1;
            var _size = Math.ceil(Object.keys(data).length/_pageSize);
            Pagination.Init(document.getElementById("pagination"),
                {
                    size: _size, // 页面大小
                    page: 1,  // 默认选中分页
                    step: 3,  // 前后省略页码
                    callback: function(num){
                        showPages(data,num,_pageSize,_type);
                    }
                });
        }

        var _path = window.location.href;
        
        var _coding = ['html5', 'javascript'];
        var _linux = ['linux', 'architect'];

        if(_path.indexOf("essay")!=-1){ // 美文随笔
            getDate(function (data){
                var _expression = {'category.$eq': 'essay' },
                    data = filterData(data, _expression);
                $(".main-m3-h1").html("美文随笔");
                findDataPage(data,2,3);
            });
        }
        if(_path.indexOf("mood")!=-1){ // 天马行空
            getDate(function (data){
				_coding[3] = "essay";
                var _expression = {'category.$ni': _coding.concat(_linux) },
                    data = filterData(data, _expression);
                $(".main-m3-h1").html("天马行空");
                findDataPage(data);
            });
        }
        if(_path.indexOf("coding")!=-1){ // 代码如诗
            getDate(function (data){
                var _expression = {'category.$in': _coding },
                    data = filterData(data, _expression);
                $(".main-m3-h1").html("代码如诗");
                findDataPage(data);
            });
        }
        if(_path.indexOf("architect")!=-1){ // 代码如诗
            getDate(function (data){
                var _expression = {'category.$in': _linux },
                    data = filterData(data, _expression);
                $(".main-m3-h1").html("架构之美");
                findDataPage(data);
            });
        }
        
        
        

        if(_path.indexOf("pages")!=-1) { // 全部分页
            getDate(function (data){
                var q = getQueryString("q");
                if(q!=null && q!=""){
                    q = decodeURIComponent(q);
                    data = filterData(data, {'title.$li': eval("/" + q + "/i")});
                    var _nav = "搜索详情 > {0}".format(q);
                    $(".main-m3-h1").html(_nav);
                    if(data.length ==0) {
                        $("#showPages").html("很遗憾,没有找到和“{0}”相关结果...".format(q));
                        return false;
                    }
                }
                findDataPage(data);
            });

        }

    }, false);

    // 显示分页列表模式 type 1 小图模式 2 大图列表模式
    function showPages(data,num,pageSize,type){

        var count_sup = num * pageSize; // 循环上界每次增加count

        var delta = (num - 1) * pageSize;	  // 局部计数器

        var tmpl = [];

        switch (type) {
            case 1:
                $.each(data,function(i,d){
                    if(i>= delta & i< count_sup) {
                        tmpl.push('<div class="contents cl">');
                        tmpl.push('	<div class="g-3-img"><a href="' + d.url + '"><img src="' + d.image + '" width="200" height="150" /></a></div>');
                        tmpl.push('	<div class="g-3-box">');
                        tmpl.push('		<h1 class="main-m3-h1"><a href="' + d.url + '">' + d.title + '</a></h1>');
                        tmpl.push('		<div class="mini-icon">');
                        tmpl.push('			<span>');
                        tmpl.push('				<i class="fa fa-user"></i>');
                        tmpl.push('				' + d.origin + '');
                        tmpl.push('			</span>');
                        tmpl.push('			<span>');
                        tmpl.push('				<i class="fa fa-calendar"></i>');
                        tmpl.push('				' + d.date + '');
                        tmpl.push('			</span>');
                        tmpl.push('			<span>');
                        tmpl.push('				<i class="fa fa-folder-open"></i>');
                        tmpl.push('				<a href="/category/#' + d.category + '">' + d.category + '</a>');
                        tmpl.push('			</span>');
//						tmpl.push('			<span>');
//						tmpl.push('				<i class="fa fa-comments"></i>');
//						tmpl.push('			  <span class="ds-thread-count" data-thread-key="' + d.id + '" ></span>');
//						tmpl.push('			</span>');
                        tmpl.push('	    </div>');
                        tmpl.push('		<div class="g-3-cont">');
                        tmpl.push('		' + d.content);
                        tmpl.push('		</div>');
                        tmpl.push('	</div>');
                        tmpl.push('</div>');
                    }
                });
                break;
            case 2:
                $.each(data,function(i,d){
                    if(i>= delta & i< count_sup) {
                        tmpl.push('<div class="contents cl">');
                        tmpl.push('    <div class="g-3-img pics-show"><a href="' + d.url + '" title="'+d.title+'"><img src="' + d.image + '" width="630" height="230"></a></div>');
                        tmpl.push('        <div class="g-3-box">');
                        tmpl.push('            <div class="g-3-cont">');
                        tmpl.push('                <p>');
                        tmpl.push('                    '+d.content);
                        tmpl.push('		                <div class="mini-icon">');
                        tmpl.push('			                <span>');
                        tmpl.push('				                <i class="fa fa-user"></i>');
                        tmpl.push('				                ' + d.origin + '');
                        tmpl.push('			                </span>');
                        tmpl.push('			                <span>');
                        tmpl.push('				                <i class="fa fa-calendar"></i>');
                        tmpl.push('				                ' + d.date + '');
                        tmpl.push('			                </span>');
                        tmpl.push('			                <span>');
                        tmpl.push('				                <i class="fa fa-folder-open"></i>');
                        tmpl.push('				                <a href="/category/#' + d.category + '">' + d.category + '</a>');
                        tmpl.push('			                </span>');
                        tmpl.push('	                    </div>');
                        tmpl.push('                </p>');
                        tmpl.push('            </div>');
                        tmpl.push('        </div>');
                        tmpl.push('    </div>');
                        tmpl.push('</div>');
                    }
                });
                break;
        }



        $("#showPages").html(tmpl.join(""));

        tmpl = [];
    }

})();


$("pre").addClass("prettyprint");
prettyPrint();

$("div.fJqueryba").hover(function(){
    $(this).find("h2").addClass("Highlight");
},function(){
    $(this).find("h2").removeClass("Highlight");
})

$('.pos-nav').click(function(){
    $('.nav').toggle(600);
})