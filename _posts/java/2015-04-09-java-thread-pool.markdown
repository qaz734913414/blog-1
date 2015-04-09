---
layout: column_1_2
title:  "话.线程池实现原理"
description: "线程池实现原理"
keywords: java,线程池,线程池实现原理
origin: 张嘉杰.原创
date:   2015-03-16
category: java
tags: java thread
---
今儿同事问了一个关于多线程的问题。一般的线程，在调用其`start()`方法之后，会自动开始执行相应的逻辑，如果之后再次调用`start()`，会怎么样？是否可以？？？
<!--more-->
每个线程其实是有多个状态的，刚刚创建之后，其处于NEW状态，在执行完相应的`run()`逻辑之后，其处理TERMINATED状态。如果多次调用这个`start()`方法，是否可以让逻辑执行多次呢？
答案肯定是不行的（一个线程执行完自己的任务之后就被销毁了），所以多次执行`start()`必然不靠谱，应该会报错。同事又问到：那`jdk`线程池又是如何重用的呢？

> 

> `jdk`内部的`ThreadPoolExecutor`的实现

线程池内部相当于在跑一个`while`循环，在不断的从阻塞队列里拿`task`，之后调用`task.run()`，此时相应`Runnable`的`run`方法就会被执行，执行完以后继续去拿，如此反复，
整个线程其实一直没有执行完成，所以，其状态也不会变成`TERMINATED`，就此实现了线程的重用。

java.util.concurrent.ThreadPoolExecutor
{% highlight html %}
/**
 * Main run loop
 */
public void run() {
    try {
        Runnable task = firstTask;
        firstTask = null;
        while (task != null || (task = getTask()) != null) {
            runTask(task);
            task = null;
        }
    } finally {
        workerDone(this);
    }
}
{% endhighlight %}

### OK，今儿就先到这儿了 :)

-----------------------