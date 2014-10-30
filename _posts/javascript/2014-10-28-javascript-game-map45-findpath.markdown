---
layout: column_1_2
title:  "javascript进阶.游戏.斜45度地图寻路"
description: "javascript game map 斜45度地图寻路"
keywords: javascript,game,map,斜45度地图寻路
origin: 张嘉杰.原创
date:   2014-10-28
category: javascript
tags: javascript game 算法 Astar
---
提到`A*算法`，简单讲就是：如何让游戏中的角色快速“绕过障碍物”找出通往目标点的路径。今儿打算用`html+javascript`在斜45度地图上加上寻路效果。  
<!--more-->

不熟悉的朋友可以去看看 [Amit's A* Pages]、[A* Pathfinding for Beginners] 这两篇文章。

> 路径算法（估价算法）

![曼哈顿算法]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-0.png)
![几何算法]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-1.png)
![对角算法]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-2.png)  

{% highlight html %}


{% endhighlight %}

> 实现过程

`css`部分

{% highlight css %}

* { font-size: 9pt }
#viewport > div {
    position: absolute;
    background-image: url(http://www.jcore.cn/resources/images/2014/10/24/javascript-game-map45-0.png);
    width: 64px;
    height: 32px;
    line-height: 32px;
    text-align: center;
}

.d1 { background-position: -0px -0px; }
.d2 { background-position: -64px -0px; }
.d3 { background-position: -128px -0px; }
.d4 { background-position: -192px -0px; }
.d5 { background-position: -256px -0px; }
.d6 { background-position: -0px -32px; }
.d7 { background-position: -64px -32px; }
.d8 { background-position: -128px -32px; }
.d9 { background-position: -192px -32px; }
.d10 { background-position: -256px -32px; }
.d11 { background-position: -0px -64px; }
.d12 { background-position: -64px -64px; }
.d13 { background-position: -128px -64px; }
.d14 { background-position: -192px -64px; }
.d15 { background-position: -256px -64px; }
.d16 { background-position: -0px -96px; }
.d17 { background-position: -64px -96px; }
.d18 { background-position: -128px -96px; }
.d19 { background-position: -192px -96px; }
.d20 { background-position: -256px -96px; }
.d21 { background-position: -0px -128px; }
.d22 { background-position: -64px -128px; }
.d23 { background-position: -128px -128px; }
.d24 { background-position: -192px -128px; }
.d25 { background-position: -256px -128px; }
	
{% endhighlight %}

`html`部分

{% highlight html %}

	<div id="show" ></div>
	<div id="viewport" ></div>

{% endhighlight %}

`javascript`部分

{% highlight javascript %}

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

/**
 * A*算法路径查找函数
 * @param Grid  网格矩阵，二维数组
 * @param Start 阵列起点 [x, y]
 * @param Goal  阵列起点 [x, y]
 * @param Find  距离算法函数 "Diagonal" | "DiagonalFree" * | "Euclidean" | "EuclideanFree" * | "Manhattan"
 *              默认 Manhattan 函数
 * @returns     返回两点之间最优路径数组
 */
function AStar(Grid, Start, Goal, Find) {

    // 初始化寻路函数，设置路径算法
    function AStar() {
        switch (Find) {
            case "Diagonal" :
            case "Euclidean" :
                Find = DiagonalSuccessors;
                break;
            case "DiagonalFree" :
            case "EuclideanFree" :
                Find = DiagonalSuccessors$;
                break;
            default :
                Find = function() {};
                break;
        };
    };

    // 返回布尔值
    function $Grid(x, y) {
        return Grid[y][x] === 0;
    };

    // 节点函数, 返回一个新节点对象
    function Node(Parent, Point) {
        return {
            Parent : Parent,
            value : Point.x + (Point.y * cols),
            x : Point.x,
            y : Point.y,
            f : 0,
            g : 0
        };
    };

    // 路径函数, 执行算法查询
    function Path() {

        var $Start = Node(null, { x : Start[0], y : Start[1] }), // 开始坐标
            $Goal = Node(null, { x : Goal[0], y : Goal[1] }), // 结束坐标
            AStar = new Array(limit), // 最大矩阵因子
            Open = [$Start], Closed = [], result = [], // 打开、关闭、结果数组
            $Successors, $Node, $Path, // 节点临时变量
            length, max, min, i, j; // 整形变量

        while (length = Open.length) {
            max = limit; // 最大矩阵因子
            min = -1; // 默认最小因子
            for (i = 0; i < length; i++) {
                if (Open[i].f < max) {
                    max = Open[i].f;
                    min = i;
                }
            };
            $Node = Open.splice(min, 1)[0]; // 节点
            if ($Node.value === $Goal.value) { // 开始节点和结束节点相等时
                $Path = Closed[Closed.push($Node) - 1]; // 最优结束路径
                do {
                    result.push([$Path.x, $Path.y]); // 从结束节点往初始节点压入栈

                } while ($Path = $Path.Parent); // 按照路径的父节点，遍历最优路径
                AStar = Closed = Open = []; // 清空相关临时数组
                result.reverse(); // 逆转数组从起点开始
            } else {
                $Successors = Successors($Node.x, $Node.y); // 当前节点的周边因子
                for (i = 0, j = $Successors.length; i < j; i++) {
                    $Path = Node($Node, $Successors[i]); // 可用的相邻矩阵因子路径
                    if (!AStar[$Path.value]) { // 判断路径是否存在
                        $Path.g = $Node.g + Distance($Successors[i], $Node);
                        $Path.f = $Path.g + Distance($Successors[i], $Goal);
                        Open.push($Path); // 可用路径压入栈
                        AStar[$Path.value] = true; // 为存在路径加上标识
                    };
                };
                Closed.push($Node); // 节点压入结束栈
            };
        };
        return result; // 返回可用结果集
    };

    // 寻找可用的相邻矩阵单元格函数

    // 返回所有可用的上、下、左、右周边因子
    //	----------
    //	|	0	 |
    //	|0	P	1|
    //	|	0	 |
    //	----------
    // 上面将返回P周围的每个点，排除[x:2, y:1]
    function Successors(x, y) {
        var N = y - 1, S = y + 1, E = x + 1, W = x - 1, $N = N > -1
                && $Grid(x, N), $S = S < rows && $Grid(x, S), $E = E < cols
                && $Grid(E, y), $W = W > -1 && $Grid(W, y), result = [];
        if ($N) result.push({ x : x, y : N });
        if ($E) result.push({ x : E, y : y });
        if ($S) result.push({ x : x, y : S });
        if ($W) result.push({ x : W, y : y });

        Find($N, $S, $E, $W, N, S, E, W, result);
        return result;
    };

    // 返回所有可用的上、下、左、右周边因子
    //	----------
    //	|0	0	0|
    //	|1	P	0|
    //	|0	1	0|
    //	----------
    // 上面将返回P周围的每个点，排除[x:0, y:2]
    function DiagonalSuccessors($N, $S, $E, $W, N, S, E, W, result) {
        if ($N) {
            if ($E && $Grid(E, N)) result.push({ x : E, y : N });
            if ($W && $Grid(W, N)) result.push({ x : W, y : N });
        };
        if ($S) {
            if ($E && $Grid(E, S)) result.push({ x : E, y : S });
            if ($W && $Grid(W, S)) result.push({ x : W, y : S });
        };
    };

    // 返回所有可用的上、下、左、右周边因子
    //	----------
    //	|0	0	0|
    //	|1	P	0|
    //	|0	1	0|
    //	----------
    // 上面将返回P周围的每个点，排除[x:0, y:2]
    function DiagonalSuccessors$($N, $S, $E, $W, N, S, E, W, result) {
        $N = N > -1;
        $S = S < rows;
        $E = E < cols;
        $W = W > -1;
        if ($E) {
            if ($N && $Grid(E, N)) result.push({ x : E, y : N });
            if ($S && $Grid(E, S)) result.push({ x : E, y : S });
        };
        if ($W) {
            if ($N && $Grid(W, N)) result.push({ x : W, y : N });
            if ($S && $Grid(W, S)) result.push({ x : W, y : S });
        };
    };

    // 距离函数，算出两点之间的最优距离
    function Diagonal(Point, Goal) { // 对角算法，对角线移动
        return max(abs(Point.x - Goal.x), abs(Point.y - Goal.y));
    };
    function Euclidean(Point, Goal) { // 几何算法（勾股定理），对角线移动
        // (AC = sqrt(AB^2 + BC^2))
        // AB = x2 - x1 ， BC = y2 - y1
        // AC [x3, y3]
        return sqrt(pow(Point.x - Goal.x, 2) + pow(Point.y - Goal.y, 2));
    };
    function Manhattan(Point, Goal) { // 曼哈顿算法，直线移动
        return abs(Point.x - Goal.x) + abs(Point.y - Goal.y);
    };

    // 私有变量
    var
        // Math相关变量
        abs = Math.abs, max = Math.max, pow = Math.pow, sqrt = Math.sqrt,
        // 矩阵变量
        cols = Grid[0].length, // 矩阵宽
        rows = Grid.length, // 矩阵高
        limit = cols * rows, // 最大范围

        // 提供可用算法，返回两点之间的距离
        Distance = {
            Diagonal        : Diagonal,
            DiagonalFree    : Diagonal,
            Euclidean       : Euclidean,
            EuclideanFree   : Euclidean,
            Manhattan       : Manhattan
        }[Find] || Manhattan; // 默认曼哈顿算法，直线移动

    return Path(AStar());
};


function Game(map){

    this.mapMatrix = map; //地图
    this.mapTileWidth  = 64; // 格子图片宽
    this.mapTileHeight = 32; // 格子图片高

    // 45度函数
    this.init45Map = function(callbackFun){
        var tilePool = []; // 格子数量
        tileWidth  = this.mapTileWidth,  // 格子图片宽
        tileHeight = this.mapTileHeight, // 格子图片高
        mapMatrix  = this.mapMatrix, // 数组地图
        viewportTileWidth = mapMatrix.length,  // 地图宽数量
        viewportTileHeight = mapMatrix[0].length, // 地图高数量
        viewportWidth = viewportTileWidth * tileWidth;    // 地图实际宽
        viewportHeight = viewportTileHeight * tileHeight, // 地图实际高
        viewportOffsetX = viewportWidth / 2 - tileWidth / 2; // 修正地图显示x区域
        viewportOffsetY = 0; // 默认地图显示y区域

        for (var i = 0; i < viewportTileHeight; i++) {
            for (var j = 0; j < viewportTileWidth; j++) {
                var tx = j, // x坐标
                    ty = i, // y坐标
                    tl = (viewportOffsetX + (tx - ty) * tileWidth / 2),  // 左距离
                    tr = (viewportOffsetY + (tx + ty) * tileHeight / 2), // 右距离
                    d = (parseInt(mapMatrix[ty][tx]) == 1) ? 17 : 18;
                    tml = '<div class="d{0}" id="t_{1}_{2}" style="display: block; left: {3}px; top: {4}px;">[{5},{6}]</div>'
                          .format(d,tx,ty,tl,tr,tx,ty); // 替换模板
                tilePool.push( tml ); // 加入数组
            }
        }
        if(callbackFun) callbackFun(tilePool.join(""));
    }

    this.findPath = function(startPoint,endPoint,callbackFun){

        var bench = (new Date()).getTime(),
            result = AStar(this.mapMatrix, startPoint, endPoint, "DiagonalFree"),//Manhattan,Diagonal,DiagonalFree,Euclidean,EuclideanFree
            endTime = (new Date()).getTime() - bench;

        var showTml = "寻路消耗时间：{0}ms<br />路径节点长度：{1}".format(endTime,result.length);
        if(callbackFun) callbackFun({ prompt : showTml, result : result });
    }

}


var matrix = [ // 0可行区域 1障碍
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
    [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
]

var game = new Game(matrix);
game.init45Map(function(maps){
    var viewport = document.getElementById("viewport");
    viewport.style.width = viewportWidth + "px"; // 设置显示区域宽
    viewport.style.height = viewportHeight + "px"; // 设置显示区域高
    viewport.innerHTML = maps;
});

var startPoint = [0, 0], // 开始坐标
    endPoint   = [5, 6]; // 结束坐标
game.findPath(startPoint,endPoint,function(data){
    document.getElementById("show").innerHTML = data.prompt;
    var result = data.result;
    for(var i = 0; i<result.length; i++){ // 遍历路径节点
        (function(i){
            var xy = result[i];
            var dom = document.getElementById("t_{0}_{1}".format(xy[0],xy[1])); // 查找对应节点
            var timer = null;
            timer = setTimeout(function () { // 延时更改样式
                dom.className = "d14";
                clearTimeout(timer); // 清空定时器
            }, i * 100);
        })(i);
    }
});
	
{% endhighlight %}	

-----------------------

<a class="button" href="/resources/demo{{ page.url}}.html" target="_blank">查看DEMO</a>

-----------------------

### 由于近期比较忙更新会相对缓慢。OK，今儿先到这儿了。:)

-----------------------

[A* Pathfinding for Beginners]:  http://www.gamedev.net/page/resources/_/technical/artificial-intelligence/a-pathfinding-for-beginners-r2003
[Amit's A* Pages]: http://www-cs-students.stanford.edu/~amitp/gameprog.html#Paths
