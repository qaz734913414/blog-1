---
layout: column_1_2
title:  "话.线程池实现原理"
description: "线程池实现原理"
keywords: java,线程池,线程池实现原理
origin: 张嘉杰.原创
date:   2015-04-09
category: java
tags: java thread
---
今儿同事问了一个关于多线程的问题。一般的线程，在调用其`start()`方法之后，会自动开始执行相应的逻辑，如果之后再次调用`start()`，会怎么样？是否可以？？？
<!--more-->
每个线程其实是有多个状态的，刚刚创建之后，其处于`NEW`状态，在执行完相应的`run()`逻辑之后，其处理`TERMINATED`状态。如果多次调用这个`start()`方法，是否可以让逻辑执行多次呢？
答案肯定是不行的（一个线程执行完自己的任务之后就被销毁了），所以多次执行`start()`必然不靠谱，应该会报错。同事又问到：那`jdk`线程池又是如何重用的呢？

> `jdk`内部的`ThreadPoolExecutor`的实现

线程池内部相当于在跑一个`while`循环，在不断的从阻塞队列里拿`task`，之后调用`task.run()`，此时相应`Runnable`的`run`方法就会被执行，执行完以后继续去拿，如此反复，
整个线程其实一直没有执行完成，所以，其状态也不会变成`TERMINATED`，就此实现了线程的重用。

java.util.concurrent.ThreadPoolExecutor
{% highlight java %}
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

这个`ThreadPoolExecutor`内部的`Worker`即之前创建出来的线程，在这里不断的获取`task`，其`runTask`方法如下：
{% highlight java %}
/**
 * Runs a single task between before/after methods.
 */
private void runTask(Runnable task) {
    final ReentrantLock runLock = this.runLock;
    runLock.lock();
    try {
        /*
         * Ensure that unless pool is stopping, this thread
         * does not have its interrupt set. This requires a
         * double-check of state in case the interrupt was
         * cleared concurrently with a shutdownNow -- if so,
         * the interrupt is re-enabled.
         */
        if (runState < STOP &&
            Thread.interrupted() &&
            runState >= STOP)
            thread.interrupt();
        /*
         * Track execution state to ensure that afterExecute
         * is called only if task completed or threw
         * exception. Otherwise, the caught runtime exception
         * will have been thrown by afterExecute itself, in
         * which case we don't want to call it again.
         */
        boolean ran = false;
        beforeExecute(thread, task);
        try {
            task.run();
            ran = true;
            afterExecute(task, null);
            ++completedTasks;
        } catch (RuntimeException ex) {
            if (!ran)
                afterExecute(task, ex);
            throw ex;
        }
    } finally {
        runLock.unlock();
    }
}
{% endhighlight %}

注意`task.run()`这句，即总结的，调用`Runnable`的`run`方法。

用一个小例子来分析下整个线程池的执行任务的过程：
{% highlight java %}
public class ThreadPoolTest {
    public static void main(String[] args) {
        ExecutorService exec = Executors.newFixedThreadPool(1); //设置固定线程池大小为1
        List<Runnable> list = new ArrayList<Runnable>();
        for(int i=0;i<5;i++) list.add(new MyRunnable());
        for(int i=0;i<5;i++) exec.execute(list.get(i));
    }
}
class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("..."); //可以在此加断点DEUBG
    }
}
{% endhighlight %}

此时，`exec`会不断的向线程池中添加任务。
{% highlight java %}
/**
 * Executes the given task sometime in the future.  The task
 * may execute in a new thread or in an existing pooled thread.
 *
 * If the task cannot be submitted for execution, either because this
 * executor has been shutdown or because its capacity has been reached,
 * the task is handled by the current <tt>RejectedExecutionHandler</tt>.
 *
 * @param command the task to execute
 * @throws RejectedExecutionException at discretion of
 * <tt>RejectedExecutionHandler</tt>, if task cannot be accepted
 * for execution
 * @throws NullPointerException if command is null
 */
public void execute(Runnable command) {
    if (command == null) throw new NullPointerException();
    if (poolSize >= corePoolSize || !addIfUnderCorePoolSize(command)) {
        if (runState == RUNNING && workQueue.offer(command)) {
            if (runState != RUNNING || poolSize == 0)
                ensureQueuedTaskHandled(command);
        } else if (!addIfUnderMaximumPoolSize(command)) {
            reject(command); // is shutdown or saturated
        }
    }
}
{% endhighlight %}

看到这个`Runnable`什么时候执行，是新创建线程执行，还是复用之前的线程，甚至是否需要拒绝请求。
当前的线程池`newFixedThreadPool(1)`是个固定大小的池，此时`poolSize == corePoolSize`，
所以此时的创建新线程的逻辑会返回`false`。
{% highlight java %}
/**
 * Creates and starts a new thread running firstTask as its first
 * task, only if fewer than corePoolSize threads are running
 * and the pool is not shut down.
 * @param firstTask the task the new thread should run first (or
 * null if none)
 * @return true if successful
 */
private boolean addIfUnderCorePoolSize(Runnable firstTask) {
    Thread t = null;
    final ReentrantLock mainLock = this.mainLock;
    mainLock.lock();
    try {
        if (poolSize < corePoolSize && runState == RUNNING)
            t = addThread(firstTask);
    } finally {
        mainLock.unlock();
    }
    if (t == null)
        return false;
    t.start();
    return true;
}
{% endhighlight %}

所以，当前的`command`就被放入阻塞队列中`workQueue.offer(command)`，`runTask`中的`task`则是通过以下方法提到的：
{% highlight java %}
Runnable getTask() {
    for (;;) {
        try {
            int state = runState;
            if (state > SHUTDOWN)
                return null;
            Runnable r;
            if (state == SHUTDOWN)  // Help drain queue
                r = workQueue.poll();
            else if (poolSize > corePoolSize || allowCoreThreadTimeOut)
                r = workQueue.poll(keepAliveTime, TimeUnit.NANOSECONDS);
            else
                r = workQueue.take();
            if (r != null)
                return r;
            if (workerCanExit()) {
                if (runState >= SHUTDOWN) // Wake up others
                    interruptIdleWorkers();
                return null;
            }
            // Else retry
        } catch (InterruptedException ie) {
            // On interruption, re-check runState
        }
    }
}
{% endhighlight %}

此处是明显的生产者-消费者模式，其中生产者是`Client`，在外部不断的提交待执行的任务，消费者则是线程池内的线程，
这两者之间通过阻塞队列`workQueue`建立起了连接，一个生产，一个执行待执行的任务的`run`方法将其消费。
这时，线程中的线程是连续执行任务，还是会结束，在新任务出现时创建新的`Worker`线程，是由所使用的线程池类型决定的，例如：
{% highlight java %}
ExecutorService exec = Executors.new Executors.newFixedThreadPool(2); //设置固定线程池大小为2
{% endhighlight %}

线程池的固定线程数为2，其执行过程中是调用阻塞队列的`take`方法，此时如果队列中没有任务，是会一直阻塞。
而如果使用`CachedTharedPool`，则会执行阻塞队列的`poll`方法，根据定义的超时时间进行等待。
`Worker`在执行时，是执行阻塞队列的`take`方法还是`poll`方法，取决于`timed`是否为`true`，如下：
{% highlight java %}
boolean timed = allowCoreThreadTimeOut || wc > corePoolSize;
.....
.....
.....
  try {
      Runnable r = timed ?
          workQueue.poll(keepAliveTime, TimeUnit.NANOSECONDS) :
          workQueue.take();
      if (r != null)
          return r;
      timedOut = true;
  } catch (InterruptedException retry) {
      timedOut = false;
  }
{% endhighlight %}

在使用`CachedThreaPool`时，由于共`corePoolSize`为0，所以每次执行时`timed`为`true`，此时执行阻塞队列的`poll`方法，`keepAliveTime=60000000000`
后续返回时，此时由于队列中没有任务，所以`timedOut=true`，所以，在后续执行时
{% highlight java %}
if ((wc > maximumPoolSize || (timed && timedOut)) && (wc > 1 || workQueue.isEmpty())) {
    if (compareAndDecrementWorkerCount(c))
        return null;
    continue;
}
{% endhighlight %}
此处会return null。


### OK，今儿就先到这儿了 :)

-----------------------