
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
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
    // http://xxx/categories/#life
    // http://xxx/tags/#html5
    document.addEventListener("DOMContentLoaded", function ()
    {
        var _path = window.location.href;
        if(_path.indexOf("pages")!=-1)  // 全部分页
        {
            $.getJSON("../lists.json", function (data)
            {
                var q = getQueryString("q");
                if(q!=null && q!=""){
                    $(".main-m3-h1").html("搜索详情 > " + encodeURIComponent(q));
                    var query = JsonQuery(data);
                    data = query.where({'title.$li': eval("/" + q + "/i")}).exec();
                    if(data.length ==0) $("#showPages").html("没有找到结果... :(");
                }
                var pageSize = Math.round(Object.keys(data).length/7);
                Pagination.Init(document.getElementById("pagination"),
                {
                    size: pageSize, // 页面大小
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

        var count = 7;  // 初始文章数

        var count_sup = num * count; // 循环上界每次增加count

        var delta = (num - 1) * count;      // 局部计数器

        var tmpl = [];

        $.each(data,function(i,d){
            if(i>= delta & i< count_sup) {
                tmpl.push('<div class="contents">');
                tmpl.push('    <div class="g-3-img"><a href="' + d.url + '"><img src="' + d.image + '" width="200" height="150" /></a></div>');
                tmpl.push('    <div class="g-3-box">');
                tmpl.push('        <h1 class="main-m3-h1"><a href="' + d.url + '">' + d.title + '</a></h1>');
                tmpl.push('        <div class="mini-icon">');
                tmpl.push('            <span>');
                tmpl.push('                <i class="fa fa-user"></i>');
                tmpl.push('                张嘉杰.原创');
                tmpl.push('            </span>');
                tmpl.push('            <span>');
                tmpl.push('               <i class="fa fa-calendar"></i>');
                tmpl.push('               ' + d.date + '');
                tmpl.push('           </span>');
                tmpl.push('           <span>');
                tmpl.push('               <i class="fa fa-folder-open"></i>');
                tmpl.push('               <a href="/categories.html#' + d.category + '">' + d.category + '</a>');
                tmpl.push('           </span>');
//                tmpl.push('           <span>');
//                tmpl.push('               <i class="fa fa-comments"></i>');
//                tmpl.push('              <span class="ds-thread-count" data-thread-key="' + d.id + '" ></span>');
//                tmpl.push('           </span>');
                tmpl.push('      </div>');
                tmpl.push('        <div class="g-3-cont">');
                tmpl.push(d.content);
                tmpl.push('        </div>');
                tmpl.push('   </div>');
                tmpl.push('</div>');
            }
        });

        $("#showPages").html(tmpl.join(""));

        tmpl = [];
    }

})();


(function(){

    var Search = {

        entries : null,

        htmlEscape : function(s){
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
        },

        findEntries : function(q){
            var matches = [];
            var rq = new RegExp(q, 'im');
            for (var i = 0; i < entries.length; i++) {
                var entry = entries[i];
                var title = $(entry.getElementsByTagName('title')[0]).text();
                var link = $(entry.getElementsByTagName('link')[0]).attr('href');
                var content = $(entry.getElementsByTagName('content')[0]).text();
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

            $('div.main > div:eq(0)').html(html);
        },

        Init : function(){
            $('#search-form').submit(function() {
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
        }

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