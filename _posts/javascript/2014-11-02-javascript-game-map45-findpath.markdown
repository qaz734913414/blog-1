---
layout: column_1_2
title:  "javascript进阶.游戏.斜45度地图寻路（二）"
description: "javascript game map 斜45度地图寻路（二）"
keywords: javascript,game,map,斜45度地图寻路
origin: 张嘉杰.原创
date:   2014-11-02
category: javascript
tags: javascript game 算法 Astar
---
45度地图寻路已经实现了，今儿我继续在45度地图上加上点击事件寻路效果，主要涉及到坐标转换的体系。ps：另外我顺便美化了一下界面、和代码结构。  
<!--more-->

> 实现过程

`css`部分

{% highlight css %}

/*
 * 背景层    -- z-index:0
 * 障碍层	-- z-index:2 4
 * 移动路径	-- z-index:3
 */
* { font-size: 9pt; margin: 0;padding: 0;}
body { cursor:url('red.cur'),auto; }
.z0 { z-index: 0; }
.z1 { z-index: 1; }
.z2 { z-index: 2; }
.z3 { z-index: 3; }
.z4 { z-index: 4; }
.z5 { z-index: 5; }

.o2 { opacity: .2; }
.o3 { opacity: .3; }
.o4 { opacity: .4; }
.o6 { opacity: .6; }

/* 背景层 */
#underlay {position: absolute;background: url(bg.png) no-repeat;width: 1340px;height: 670px;left: 0;top: 0;}
.d3 {position: absolute;background: url(tile.png) no-repeat -192px -64px;width: 64px;height: 32px;line-height: 32px;text-align: center;z-index: 0;}
.d1 {position: absolute;background: url(tile.png) no-repeat -192px -128px;width: 64px;height: 32px;line-height: 32px;text-align: center;z-index: 0;}
.d2 {position: absolute;background-image: url(tile.gif);width: 64px;height: 32px;line-height: 32px;text-align: center;z-index: 0;}

/* 障碍层 */
.obstacle1 { position: absolute;background-image: url(block/3.png);width: 280px;height: 110px;left: 550px;top: 190px; }
.obstacle2 { position: absolute;background-image: url(block/4.png);width: 210px;height: 150px;left: 460px;top: 300px; }
.obstacle3 { position: absolute;background-image: url(block/5.png);width: 121px;height: 60px;left: 1010px;top: 290px; }
.obstacle4 { position: absolute;background-image: url(block/6.png);width: 120px;height: 120px;left: 775px;top: 365px; }
	
{% endhighlight %}

`html`部分

{% highlight html %}

<!-- 背景层 -->
<div id="underlay"></div>
<!-- 障碍层 -->
<div id="block">
    <div class="obstacle1 z2" ></div>
    <div class="obstacle1 z4 o4" ></div>
    <div class="obstacle2 z2" ></div>
    <div class="obstacle2 z4 o4" ></div>
    <div class="obstacle3 z2" ></div>
    <div class="obstacle4 z2" ></div>
    <div class="obstacle4 z4 o4" ></div>
</div>
<!-- 调试层 -->
<div id="debug" class="o2" ></div>

{% endhighlight %}

`javascript`部分（寻路部分没有变化）

{% highlight javascript %}

function Game(ops){

    // 私有变量
    var debug = ops.debug || false, // 调试模式
        mapMatrix = ops.map || [ [ 0, 0, 0],[ 0, 0, 0],[ 0, 0, 0]], // 游戏地图
        tileWidth = ops.tileWidth || 64, // 格子图片宽
        tileHeight = ops.tileHeight || 32, // 格子图片高
        startPoint = ops.startPoint || [2, 2], // 默认起点
        aStarType = ops.aStarType || "DiagonalFree", // 默认寻路类型（Manhattan,Diagonal,DiagonalFree,Euclidean,EuclideanFree）
        viewTileNumX = mapMatrix.length, // 地图X轴格子数量
        viewTileNumY = mapMatrix[0].length, // 地图Y轴格子数量
        viewWidth = viewTileNumX * tileWidth, // 地图实际宽（格子宽*X轴格子数量）
        viewHeight = viewTileNumY * tileHeight, // 地图实际高（格子高*Y轴格子数量）
        viewOffsetX = viewWidth / 2 - tileWidth / 2, // 修正地图显示x区域
        viewOffsetY = 0, // 默认地图显示y区域
        moving = false,
        direction = -1;

    /**
     * NPC设置
     * @param xy 默认角色出现的x、y轴
     * @param roleAbbreviation 角色简写
     * @param direction 角色朝向
     */
    this.npc = function(xy,roleAbbreviation,direction){

    }

    /**
     * 角色设置
     * @param xy 默认角色出现的x、y轴
     * @param roleAbbreviation 角色简写
     * @param direction 角色朝向
     */
    this.role = function(xy,roleAbbreviation,_direction){

    }

    /**
     * 初始化游戏
     */
    this.init = function(){

        var tilesHTML =  init45Map(); // 初始化地图
        document.body.onclick = function(e){ // 绑定全局事件
            var _pix = pixToTile(e.pageX, e.pageY); // 屏幕坐标转45度地图坐标
            var _tile = document.getElementById("t_{0}_{1}".format(_pix.x, _pix.y)); // 地图格子节点
            initDebug(tilesHTML); // 显示格子

            if(_pix.x<0 || _pix.x > viewTileNumX - 1 || // 超出边界不处理事件
               _pix.y<0 || _pix.y > viewTileNumY - 1) return false;
            if(debug && (!_tile || _tile && _tile.getAttribute("stop")==1)) return false; // 格子不存在或障碍不可点击
            var endPoint = [_pix.x, _pix.y]; // 结束事件
            console.log(endPoint);
            var resultPath = findPath(startPoint,endPoint); // 返回最优路径
            showPath(resultPath);

        }

        initDebug(tilesHTML); // 显示格子

    }

    // 私有化函数 ----------

    function initDebug(outHTML){
        if(debug){
            var _debug = document.getElementById("debug");
            _debug.innerHTML = outHTML;
        }
    }

    // 45度函数
    function init45Map(){
        var tilePool = []; // 默认格子数量
        for (var i = 0; i < viewTileNumY; i++) {
            for (var j = 0; j < viewTileNumY; j++) {
                var tx = j, // x坐标
                    ty = i, // y坐标
                    tl = (viewOffsetX + (tx - ty) * tileWidth / 2),  // 左距离
                    tr = (viewOffsetY + (tx + ty) * tileHeight / 2), // 右距离
                    st = mapMatrix[ty][tx], //是否障碍
                    d  = (parseInt(st) == 1) ? 1 : 2;
                    tml = '<div id="t_{0}_{1}" stop="{2}" class="d{3}" style="display: block; left: {4}px; top: {5}px;">[{6},{7}]</div>'
                    //tml = '<div id="t_{0}_{1}" stop="{2}" class="d{3}" style="display: block; left: {4}px; top: {5}px;"></div>'
                    .format(tx,ty,st,d,tl,tr,tx,ty); // 替换模板
                tilePool.push( tml ); // 加入数组
            }
        }
        return tilePool.join("");
    }

    // 屏幕坐标转45度地图坐标
    function pixToTile(px, py){

        var viewTileWidth = viewTileNumX / 2,
            viewTileHeight = viewTileNumY / 2;

        var x = Math.floor(px/tileWidth + py/tileHeight - viewTileWidth);
        var y = -(Math.ceil(px/tileWidth - py/tileHeight - viewTileHeight));

        return { x: x, y: y };
    }

    // 寻路函数
    function findPath(startPoint,endPoint,callbackFun){

        var bench = (new Date()).getTime(),
            result = AStar(mapMatrix, startPoint, endPoint, aStarType),
            endTime = (new Date()).getTime() - bench;

        console.log("寻路消耗时间：{0}ms,路径节点长度：{1}".format(endTime/1000,result.length));

        return result;
    }

    // 显示路径
    function showPath(result){
        if(debug)
        {
            for(var i = 0; i<result.length; i++){ // 遍历路径节点
                (function(i){
                    var xy = result[i];
                    var dom = document.getElementById("t_{0}_{1}".format(xy[0],xy[1])); // 查找对应节点
                    var timer = null;
                    timer = setTimeout(function () { // 延时更改样式
                        dom.className = "d3";
                        dom.style.zIndex = 3;
                        clearTimeout(timer); // 清空定时器
                    }, i * 30);
                })(i);
            }
        }
    }

}
	
{% endhighlight %}

-----------------------

<a class="button" href="/resources/demo{{ page.url}}.html" target="_blank">查看DEMO</a>

-----------------------

### OK，今儿先到这儿了。:) 

-----------------------

[A* Pathfinding for Beginners]:  http://www.gamedev.net/page/resources/_/technical/artificial-intelligence/a-pathfinding-for-beginners-r2003
[Amit's A* Pages]: http://www-cs-students.stanford.edu/~amitp/gameprog.html#Paths
