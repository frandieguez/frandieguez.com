---
id: 787
title: Restore files and dirs from previous commits in Git
date: 2010-08-10T19:20:02+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=787
permalink: /blog/2010/08/restore-files-and-dir-from-previous-commits-in-git/
dsq_thread_id:
  - "654324905"
categories:
  - Sofware Development
tags:
  - dirs
  - files
  - git
  - restore
---
<img class="alignright" style="max-width: 300px;" title="Mistake done at gnome-system-tools with icons directory deleted" alt="" src="/assets/2010/08/Captura-de-pantalla-gitg-gnome-system-tools-master-1.png" />

When I met git, I fall in love in the moment. You can read any apointments I wrote previously <a title="Control de versiones con GIT I" href="http://www.mabishu.com/blog/2008/06/04/control-de-versiones-con-git-i/">here</a>, and <a title="Control de versiones con GIT II" href="http://www.mabishu.com/blog/2008/06/13/gestion-de-branches-y-tags-con-git-ii/">here</a> (in spanish) but today I'll explain how to restore files and directories from previous commits that it was deleted by a mistake or intentionally in the past.

It’s quite easy to <a href="http://gitready.com/intermediate/2009/03/16/rolling-back-changes-with-revert.html">revert</a> or <a href="http://gitready.com/beginner/2009/01/11/reverting-files.html">reset</a> a single file from history, but what about pulling an entire directory out of the history?

The solution is simple:

<code>git checkout ID_of_commit -- /path/to/dir</code>

This will restore the directory from the given “commit with ID” in the <code>/path/to/dir</code>.

But, let me show you a mistake I made in a commit into the gnome-system-tools repository:

<!--more-->I send a translation for a GNOME app in Galician and (I don't know how) accidentally, I deleted the directory icons. For make this more complicated there were a lot of commits ahead of my commit. In the previous image the highlighted commit is where I deleted the directory.

If you issue at you terminal within the app directory:
<pre><code>
➜  gnome-system-tools git:(master) git reflog
cc9cead HEAD@{0}: commit: Restore deleted icons directory, deleted by a mistake.
77f6382 HEAD@{1}: pull : Fast-forward
a01e094 HEAD@{2}: a01e094fa09fceaaf86a78d668a5e431338050bf: updating HEAD
b833072 HEAD@{3}: b8330723f6efb8ecf1e07cb01b17d524a6748a38: updating HEAD
e6808e5 HEAD@{4}: pull : Fast-forward
b833072 HEAD@{5}: b8330723f6efb8ecf1e07cb01b17d524a6748a38: updating HEAD
e6808e5 HEAD@{6}: pull : Fast-forward
fa069b2 HEAD@{7}: commit: Added gl to DOC_LINGUAS into Makefile.am for services and time documentation
5cc13f5 HEAD@{8}: commit: Updated galician translations, and added galician translations for time and services documentation
2915e6e HEAD@{9}: pull : Fast-forward
b833072 HEAD@{10}: commit: Updated Galician translations  &lt;------ this is the commit
a01e094 HEAD@{11}: pull : Fast-forward
</code></pre>
you'll see the ID that points to that commit. So applying the ^ modifier to the damned ID I can obtain the previous commit ID, this one has the icons directory and now is when the magic comes in:
<pre><code>
➜  gnome-system-tools git:(master) git checkout b833072^ -- icons/
➜  gnome-system-tools git:(master) ✗ git status
# On branch master
# Changes to be committed:
#   (use "git reset HEAD ..." to unstage)
#
#	new file:   icons/16x16/Makefile.am
#	new file:   icons/16x16/apps/Makefile.am
#	new file:   icons/16x16/apps/time-admin.png
#	new file:   icons/16x16/apps/time-admin.svg
#	new file:   icons/22x22/Makefile.am
#	new file:   icons/22x22/apps/Makefile.am
#	new file:   icons/22x22/apps/time-admin.png
#	new file:   icons/22x22/apps/time-admin.svg
#	new file:   icons/24x24/Makefile.am
#	new file:   icons/24x24/apps/Makefile.am
#	new file:   icons/24x24/apps/time-admin.png
#	new file:   icons/32x32/Makefile.am
#	new file:   icons/32x32/apps/Makefile.am
#	new file:   icons/32x32/apps/time-admin.png
#	new file:   icons/32x32/apps/time-admin.svg
#	new file:   icons/48x48/Makefile.am
#	new file:   icons/48x48/apps/Makefile.am
#	new file:   icons/48x48/apps/time-admin.png
#	new file:   icons/48x48/devices/Makefile.am
#	new file:   icons/48x48/devices/irda.png
#	new file:   icons/48x48/devices/plip.png
#	new file:   icons/ChangeLog
#	new file:   icons/Makefile.am
#	new file:   icons/scalable/Makefile.am
#	new file:   icons/scalable/apps/Makefile.am
#	new file:   icons/scalable/apps/time-admin.svg
#
</code></pre>
I add the icons directory to the repository
<pre><code>
➜  gnome-system-tools git:(master) ✗ git add icons
</code></pre>
<pre><code>
➜  gnome-system-tools git:(master) ✗ git status
# On branch master
# Changes to be committed:
#   (use "git reset HEAD ..." to unstage)
#
#	new file:   icons/16x16/Makefile.am
#	new file:   icons/16x16/apps/Makefile.am
#	new file:   icons/16x16/apps/time-admin.png
#	new file:   icons/16x16/apps/time-admin.svg
#	new file:   icons/22x22/Makefile.am
#	new file:   icons/22x22/apps/Makefile.am
#	new file:   icons/22x22/apps/time-admin.png
#	new file:   icons/22x22/apps/time-admin.svg
#	new file:   icons/24x24/Makefile.am
#	new file:   icons/24x24/apps/Makefile.am
#	new file:   icons/24x24/apps/time-admin.png
#	new file:   icons/32x32/Makefile.am
#	new file:   icons/32x32/apps/Makefile.am
#	new file:   icons/32x32/apps/time-admin.png
#	new file:   icons/32x32/apps/time-admin.svg
#	new file:   icons/48x48/Makefile.am
#	new file:   icons/48x48/apps/Makefile.am
#	new file:   icons/48x48/apps/time-admin.png
#	new file:   icons/48x48/devices/Makefile.am
#	new file:   icons/48x48/devices/irda.png
#	new file:   icons/48x48/devices/plip.png
#	new file:   icons/ChangeLog
#	new file:   icons/Makefile.am
#	new file:   icons/scalable/Makefile.am
#	new file:   icons/scalable/apps/Makefile.am
#	new file:   icons/scalable/apps/time-admin.svg
#
</code></pre>
And I send it to my index and after that I make it public in the central repository:
<pre><code>
➜  gnome-system-tools git:(master) ✗ git commit -m "Restore deleted icons directory, deleted by a mistake.
dquote&gt; This should fix the failed builds"
[master cc9cead] Restore deleted icons directory, deleted by a mistake. This should fix the failed builds
 26 files changed, 2723 insertions(+), 0 deletions(-)
 create mode 100644 icons/16x16/Makefile.am
 create mode 100644 icons/16x16/apps/Makefile.am
 create mode 100644 icons/16x16/apps/time-admin.png
 create mode 100644 icons/16x16/apps/time-admin.svg
 create mode 100644 icons/22x22/Makefile.am
 create mode 100644 icons/22x22/apps/Makefile.am
 create mode 100644 icons/22x22/apps/time-admin.png
 create mode 100644 icons/22x22/apps/time-admin.svg
 create mode 100644 icons/24x24/Makefile.am
 create mode 100644 icons/24x24/apps/Makefile.am
 create mode 100644 icons/24x24/apps/time-admin.png
 create mode 100644 icons/32x32/Makefile.am
 create mode 100644 icons/32x32/apps/Makefile.am
 create mode 100644 icons/32x32/apps/time-admin.png
 create mode 100644 icons/32x32/apps/time-admin.svg
 create mode 100644 icons/48x48/Makefile.am
 create mode 100644 icons/48x48/apps/Makefile.am
 create mode 100644 icons/48x48/apps/time-admin.png
 create mode 100644 icons/48x48/devices/Makefile.am
 create mode 100644 icons/48x48/devices/irda.png
 create mode 100644 icons/48x48/devices/plip.png
 create mode 100644 icons/ChangeLog
 create mode 100644 icons/Makefile.am
 create mode 100644 icons/scalable/Makefile.am
 create mode 100644 icons/scalable/apps/Makefile.am
 create mode 100644 icons/scalable/apps/time-admin.svg
</code></pre>
<pre><code>
➜  gnome-system-tools git:(master) git push
Counting objects: 39, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (28/28), done.
Writing objects: 100% (38/38), 32.73 KiB, done.
Total 38 (delta 10), reused 33 (delta 9)
To ssh://frandieguez@git.gnome.org/git/gnome-system-tools
   77f6382..cc9cead  master -&gt; master</code></pre>
I hope this helps you! Happy playing with git
