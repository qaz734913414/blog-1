---
layout: column_1_2
title:  "关于.Mac升级10.11 EI Captain的坑"
description: "关于.Mac升级10.11 EI Captain的坑"
keywords: mac,OSX,升级
origin: 张嘉杰.原创
date:   2016-09-10
category: life
tags: mac OSX
---

周六由于需要调试、编写部分App的相关的应用，迫不得已升级到了最新的`Mac OS 10.11 EI Captain`，升级了`Xcode7`、`keynote`等等，当然更新的糟糕后果就是好多软件都无法使用了，然后一下午的时间就全浪费在安装和恢复软件上面，更新就得踩各种坑呐。

<!--more-->

![EI Captain]({{ "/resources/images" | prepend: site.staticurl }}{{ page.url }}.png)

升级完系统，打开了QQ，发现QQ变成英文的了，然后下面是填坑的过程

> 开始填坑

1. 准备卸载QQ（发现无法卸载）
{% highlight bash %}

root:~ zjj$ brew cask uninstall qq
Error: qq is not installed

{% endhighlight %}

2. 查看安装软件列表（没有发现问题）
{% highlight bash %}

root:~ zjj$ brew cask list
1password	dockertoolbox	launchrocket	staruml		vlc
alfred		eclipse-jee	licecap		sublime-text	vmware-fusion
atom		electron	livereload	textmate	webstorm
baidumusic	evernote	qq		totalterminal
calibre		google-chrome	rdm		utorrent
docker		jd-gui		robomongo	virtualbox

{% endhighlight %}

3. 更新Homebrew（发现了权限的问题）
{% highlight bash %}

root:~ zjj$ brew update
Error: The /usr/local directory is not writable.
Even if this directory was writable when you installed Homebrew, other
software may change permissions on this directory. For example, upgrading
to OS X El Capitan has been known to do this. Some versions of the
"InstantOn" component of Airfoil or running Cocktail cleanup/optimizations
are known to do this as well.
You should probably change the ownership and permissions of /usr/local
back to your user account.
  sudo chown -R $(whoami):admin /usr/local

{% endhighlight %}

4. 按照提示执行
{% highlight bash %}

root:~ zjj$ sudo chown -R $(whoami):admin /usr/local

{% endhighlight %}

5. 继续更新Homebrew（发现软件安装目录变了，提示关联新目录）
{% highlight bash %}

root:~ zjj$ brew update
xcrun: error: active developer path ("/Applications/Xcode6-Beta.app/Contents/Developer") does not exist, use `xcode-select --switch path/to/Xcode.app` to specify the Xcode that you wish to use for command line developer tools (or see `man xcode-select`)
Error: Failure while executing: git status --untracked-files=all --porcelain 2>/dev/null 

{% endhighlight %}

6. 查看当前软件的默认目录
{% highlight bash %}

root:~ zjj$ xcode-select -p
/Applications/Xcode6-Beta.app/Contents/Developer

{% endhighlight %}

7. 进入目录发现提示失败（Xcode6-Beta.app目录居然不见了）
{% highlight bash %}

root:~ zjj$ cd /Applications/Xcode6-Beta.app/Contents/Developer
-bash: cd: /Applications/Xcode6-Beta.app/Contents/Developer: No such file or directory
{% endhighlight %}

8. 重新找到软件安装目录
{% highlight bash %}

root:~ zjj$ ls /Applications/Xcode.app/Contents/Developer/
Applications	Library		Platforms	Tools
Documentation	Makefiles	Toolchains	usr

{% endhighlight %}

9. 重新关联目录
{% highlight bash %}

root:~ zjj$ sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer/

{% endhighlight %}

10. 再次更新Homebrew（已经可以更新了）
{% highlight bash %}

root:~ zjj$ brew update
To restore the stashed changes to /usr/local run:
  `cd /usr/local && git stash pop`
Updated Homebrew from 1247af2 to eb4538c.
Updated 3 taps (caskroom/cask, homebrew/nginx, phinze/cask).

{% endhighlight %}

11. 继续卸载qq（发现问题依旧啊，找不到默认的Caskroom目录了）
{% highlight bash %}

root:~ zjj$ brew cask uninstall qq
Uninstalling brew-cask... (4 files, 7.9K)
Warning: The default Caskroom location has moved to /usr/local/Caskroom.

Please migrate your Casks to the new location and delete /opt/homebrew-cask/Caskroom,
or if you would like to keep your Caskroom at /opt/homebrew-cask/Caskroom, add the
following to your HOMEBREW_CASK_OPTS:

  --caskroom=/opt/homebrew-cask/Caskroom

For more details on each of those options, see https://github.com/caskroom/homebrew-cask/issues/21913.
Error: qq is not installed

{% endhighlight %}

12. 备份brew cask软件目录 
{% highlight bash %}

root:~ zjj$ mv /opt/homebrew-cask/Caskroom /usr/local/

{% endhighlight %}

13. 重新关联更新下载软件（漫长的等待...）
{% highlight bash %}

root:~ zjj$ brew cask install --force $(brew cask list)

{% endhighlight %}

14. 中途出现错误（去除部分源、关联、清空Homebrew）
{% highlight bash %}

brew uninstall --force brew-cask; 
brew untap phinze/cask; 
brew untap caskroom/cask; 
brew update; 
brew cleanup; 
brew cask cleanup

{% endhighlight %} 


到这里问题基本都已经解决了，因为所有的软件基本都是通过`Homebrew`安装的，所以接下来就都还是挺顺畅的。。。

### 今天就先到这儿吧。。：）

---------------------------------------

相关参考文章地址：

xcode-select active developer directory error - <http://stackoverflow.com/questions/17980759/xcode-select-active-developer-directory-error>  
Can't install gems on OS X “El Capitan” - <http://stackoverflow.com/questions/31972968/cant-install-gems-on-os-x-el-capitan>
