---
layout: column_1_2
title:  "javascript进阶.游戏.斜45度地图人物战斗（一）"
description: "javascript game map 斜45度地图人物战斗 八方向"
keywords: javascript,game,map,斜45度地图人物战斗,八方向
origin: 张嘉杰.原创
date:   2014-11-21
category: javascript
tags: javascript game animation
---
说到人物移动的过程，简单说就是：点击屏幕人物移动到相应的地方，这里涉及到`坐标转换`、`躲避障碍`、`动画循环`。今儿我继续在45度地图点击寻路之后，加入人物移动，和人物到达目的地后自动执行函数。  
<!--more-->

好了大家先来看一下，鼠标点击屏幕，小球移动到相应的坐标，`八方向`动画函数的实现过程。先来个截图。

![fighting]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}-0.png)  

> 移动的小球

`css`部分

{% highlight css %}

* { font-size: 9pt; margin: 0;padding: 0;}
body { cursor:url('../red.cur'),auto; }

/* 背景层 */
#underlay {position: absolute;background: url(../images/bg/bg1.png) no-repeat;width: 1340px;height: 670px;left: 0;top: 0;}
.d3 {position: absolute;background: url(../images/tile2.png) no-repeat -192px -64px;width: 64px;height: 32px;line-height: 32px;text-align: center;z-index: 0;}
.d1 {position: absolute;background: url(../images/tile2.png) no-repeat -192px -128px;width: 64px;height: 32px;line-height: 32px;text-align: center;z-index: 0;}
.d2 {position: absolute;background-image: url(../images/tile.gif);width: 64px;height: 32px;line-height: 32px;text-align: center;z-index: 0;}

/* 主角人物 */
.role { width:285px;height:200px;position:absolute; }
/* 媚灵狐 */
.mlh_z0{ background:url(../images/role/battlers/mlh_0.png); }
.mlh_z1{ background:url(../images/role/battlers/mlh_1.png); }
.mlh_z2{ background:url(../images/role/battlers/mlh_2.png); }
.mlh_z3{ background:url(../images/role/battlers/mlh_3.png); }

...此处省略图片样式（同上）

{% endhighlight %}

`html`部分

{% highlight html %}

<!-- 背景层 -->
<div id="underlay"></div>
<!-- 人物层 -->
<div id="people"></div>
<!-- 调试层 -->
<div id="debug" class="o2" ></div>
<!-- 背景音乐 -->
<div id="bgmic"></div>

{% endhighlight %}

`javascript`部分

{% highlight javascript %}

function Game(ops){

    // 私有变量
    var debug = ops.debug || false, // 调试模式
        mapMatrix = ops.map || [ [ 0, 0, 0],[ 0, 0, 0],[ 0, 0, 0]], // 游戏地图
        tileWidth = ops.tileWidth || 64, // 格子图片宽
        tileHeight = ops.tileHeight || 32, // 格子图片高
        viewTileNumX = mapMatrix.length, // 地图X轴格子数量
        viewTileNumY = mapMatrix[0].length, // 地图Y轴格子数量
        viewWidth = viewTileNumX * tileWidth, // 地图实际宽（格子宽*X轴格子数量）
        viewHeight = viewTileNumY * tileHeight, // 地图实际高（格子高*Y轴格子数量）
        viewOffsetX = viewWidth / 2 - tileWidth / 2, // 修正地图显示x区域
        viewOffsetY = 0, // 默认地图显示y区域
        npcs = [], // 打斗角色数组
        roles = []; // 主角色数组

    /**
     * NPC设置
     * @param xy 默认角色出现的x、y轴
     * @param roleAbbreviation 角色简写
     * @param chongwu 宠物对象
     */
    this.npc = function(xy,roleAbbreviation,petAbbreviation){
        var _npc_x = xy.x,
            _npc_y = xy.y,
            _pix_npc = tileToPix(_npc_x, _npc_y),
            _pix_pet = tileToPix(_npc_x + 3, _npc_y);

        npcs.push( {
            npc : { // npc 对象
                name : roleAbbreviation,
                stop : { // 停止动画
                    x : _pix_npc.x - 110, // 修正npc人物实际X坐标
                    y : _pix_npc.y - 130  // 修正npc人物实际Y坐标
                },
                run  : { // 跑动动画
                    x : _pix_npc.x -  68, // 修正npc人物实际X坐标
                    y : _pix_npc.y - 145  // 修正npc人物实际Y坐标
                }
            },
            pet  : { // 宠物对象
                name : petAbbreviation,
                stop : { // 停止动画
                    x : _pix_pet.x - 130, // 修正宠物实际X坐标
                    y : _pix_pet.y - 130  // 修正宠物实际Y坐标
                },
                run  : { // 跑动动画
                    x : _pix_pet.x -  68, // 修正宠物实际X坐标
                    y : _pix_pet.y - 145  // 修正宠物实际Y坐标
                }
            }

        } );

    }

    /**
     * 角色设置
     * @param xy 默认角色出现的x、y轴
     * @param roleAbbreviation 角色简写
     * @param chongwu 宠物对象
     */
    this.role = function(xy,roleAbbreviation,petAbbreviation){
        var _role_x = xy.x,
            _role_y = xy.y,
            _pix_role = tileToPix(_role_x, _role_y),
            _pix_pet = tileToPix(_role_x - 3, _role_y);

        roles.push( {
            role : { // 角色对象
                name : roleAbbreviation,
                stop : { // 停止动画
                    x : _pix_role.x - 110, // 修正角色人物实际X坐标
                    y : _pix_role.y - 130  // 修正角色人物实际Y坐标
                },
                run  : { // 跑动动画
                    x : _pix_role.x -  68, // 修正角色人物实际X坐标
                    y : _pix_role.y - 145  // 修正角色人物实际Y坐标
                },
                size : { w:280, h:200, frames:4 } // 帧数宽、高、帧个数
            },
            pet  : { // 宠物对象
                name : petAbbreviation,
                stop : { // 停止动画
                    x : _pix_pet.x - 100, // 修正宠物实际X坐标
                    y : _pix_pet.y - 130  // 修正宠物实际Y坐标
                },
                run  : { // 跑动动画
                    x : _pix_pet.x -  68, // 修正宠物实际X坐标
                    y : _pix_pet.y - 145  // 修正宠物实际Y坐标
                },
                size : { w:280, h:200, frames:4 } // 帧数宽、高、帧个数
            }

        } );

    }

    /**
     * 初始化游戏
     */
    this.init = function(){

        var tilesHTML = init45Map(), // 初始化地图
            rulesHTML = initRules(), // 初始化角色
            npcsHTML  = initNpcs();  // 初始化Npc

        initHTML(rulesHTML + npcsHTML,"people"); // 显示格子
        initHTML(tilesHTML,"debug"); // 显示格子

        initAnimation();

    }

    // 私有化函数 ----------

    function initHTML(outHTML,dom){
        var _debug = document.getElementById(dom);
        _debug.innerHTML = outHTML;
    }

    // 初始化地图函数
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

    // 初始化角色函数
    function initRules(){

        var _html = [];

        for(var n in roles) { // 遍历角色对象集合
            var o = roles[n],
                role = o.role,
                rolestop = role.stop,
                pet = o.pet,
                petstop = pet.stop;
            _html.push('<div id="role{0}" class="role z3 {1}_z0" style="left:{2}px;top:{3}px;"></div>'.format(n, role.name, rolestop.x, rolestop.y));

            if (pet.name) { // 角色宠物
                _html.push('<div id="pet{0}" class="pet z3 {1}_z0" style="left:{2}px;top:{3}px;"></div>'.format(n, pet.name, petstop.x, petstop.y));
            }
        }
        return _html.join("");
    }

    // 初始化战斗npc函数
    function initNpcs(){

        var _html = [];

        for(var n in npcs){ // 遍历npc对象集合
            var o = npcs[n],
                npc = o.npc,
                npcstop = npc.stop,
                pet = o.pet,
                petstop = pet.stop;
            _html.push( '<div id="npc{0}" class="npc z3 {1}_z0" style="left:{2}px;top:{3}px;"></div>'.format(n, npc.name, npcstop.x, npcstop.y) );

            if (pet.name) { // 角色宠物
                _html.push('<div id="pet{0}" class="pet z3 {1}_z0" style="left:{2}px;top:{3}px;"></div>'.format(n, pet.name, petstop.x, petstop.y));
            }
        }
        return _html.join("");
    }

    // 45度地图坐标转屏幕坐标
    function tileToPix(tx, ty){

        var x = (viewOffsetX + (tx - ty) * tileWidth / 2);
        var y = (viewOffsetY + (tx + ty) * tileHeight / 2);

        return { x: x, y: y };
    }

    // 禁止动画
    function initAnimation(){

        var _dom = document.getElementById("people").children;
        for(var n=0;n<_dom.length;n++){
            (function(dom){
                var n = 0,
                    thread = new Thread(function(){
                                dom.style.backgroundPosition = (n++ % 4)*280 + "px 0px"; // 偏移值
                             },250,-1,"t1");

                thread.start(); // 启动无限循环线程

            })(_dom[n]);
        }
    }

    // 模拟线程函数
    function Thread(_task, _delay, _times){
        this.runFlag = false; // 执行标识
        this.busyFlag = false; // 恢复标识
        this.taskArgs = Array.prototype.slice.call(arguments, 3);

        if (_times != undefined) {
            this.times = _times;
        } else {
            this.times = 1;
        }

        var _point = this;

        this.timerID = -1; // 定时器内部标识

        // 开始函数
        this.start = function(){
            if (this.runFlag == false) {
                this.timerID = window.setInterval(_point.run, _delay);
                this.runFlag = true;
            }
        }

        // 执行函数
        this.run = function(){
            if (_point.busyFlag)
                return;
            if (_point.times == -1)// 无限循环
            {
                _task(_point.taskArgs);
            } else {
                if (_point.times > 0) {
                    _task(_point.taskArgs);
                    _point.times -= 1;
                    if (_point.times == 0) {
                        window.clearInterval(this.timerID);
                    }
                }
            }
        }

        // 休眠函数
        this.sleep = function(){
            this.busyFlag = true;
        }

        // 恢复函数
        this.resume = function(){
            this.busyFlag = false;
        }

        // 终止函数
        this.abort = function(){
            window.clearInterval(this.timerID);
        }
    }

}

{% endhighlight %}

-----------------------

<a class="button" href="/resources/demo{{ page.url}}.html" target="_blank">查看DEMO</a>

-----------------------

### OK，今儿先到这儿了。:) 

-----------------------
