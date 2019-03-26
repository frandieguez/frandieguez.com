---
id: 916
title: Migrate Subversion repository to Git without loosing data
date: 2011-01-13T23:35:43+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=916
permalink: /blog/2011/01/migrate-subversion-repository-to-git-without-loosing-data/
dsq_thread_id:
  - "654577183"
categories:
  - System Administration
tags:
  - git
  - migrate
  - subverstion
---
<img class="alignright" src="/assets/2011/01/git-pony-svn-ogre.png" alt="" width="320" height="154" />

In our company we migrated all our SVN repositories to Git, as the migration is not straight forward I wrote down it and made available for all of you. Some tips are taken from documentation and others from <a href="http://stackoverflow.com/">other websites</a>.

So, let's go!<!--more-->
<h3>1.- Get the name of all Subversion commiters</h3>
Subversion just lists the username for each commit. Git’s commits have much richer data, the commit author needs to have a name and email listed. By default the git-svn tool will just list the SVN username in both the author and email fields. But with a little bit of work, you can create a list of all SVN users and what their corresponding Git name and emails are. This list can be used by git-svn to transform plain svn usernames into proper Git committers.
<pre>svn checkout
svn log -q | awk -F '|' '/^r/ {sub("^ ", "", $2); sub(" $", "", $2); print $2" = "$2" &lt;"$2"&gt;"}' | sort -u &gt; authors-transform.txt</pre>
That will retrieve all the log messages, pluck out the usernames, eliminate any duplicate usernames, sort the usernames and place them into a “authors-transform.txt” file. Now you must edit each line in the file. For example, convert:
<pre>svn_user = svn_user</pre>
into this:
<pre>svn_user = Git Username &lt;git_username_mail@example.com&gt;</pre>
<h3>2.- Clone your svn repo with git-svn</h3>
<pre>git svn clone  --no-metadata -A authors-transform.txt --stdlayout ~/git-repo-temp</pre>
This will do the standard git-svn transformation (using the authors-transform.txt file you created in step 1) and place the git repository in the “~/temp” folder inside your home directory. This will transform your svn tags and branches into proper git tags and branches.
<h3>3.- Convert svn-ignores to .gitignore</h3>
This step for me is very importan, in my apps there is a lot of temporary files (cache, logs, compiled files, and so on...) that I don't want to get disturbing me in every commit. So to migrate all the svn-ignores into Git we must issue the next:
<pre>cd ~/git-repo-temp
git svn show-ignore &gt; .gitignore
git add .gitignore
git commit -m 'Convert svn:ignore properties to .gitignore.'</pre>
<h3>4.- Clean up svn branches and tags</h3>
git-svn makes all of Subversions tags into very-short branches in Git of the form “tags/name”. You’ll want to convert all those branches into actual Git tags using:
<pre>git for-each-ref --format='%(refname)' refs/heads/tags |
cut -d / -f 4 |
while read ref
do
  git tag "$ref" "refs/heads/tags/$ref";
  git branch -D "tags/$ref";
done</pre>
<h3>5.- Optimize your repo</h3>
This is not a very important step but it could safe you a lot of space and repository inconsitences. It is just a step to ensure your final git repository.
<pre>git gc
git fsck</pre>
<h3>6.- Clean SVN sections from Git</h3>
If you want to forget SVN for all your life, you must clean all the references to SVN repositories in your git repository. So, to clean all this references just issue the next:
<pre>git config --remove-section svn
git config --remove-section svn-remote.svn
rm -rf .git/svn .git/{logs/,}refs/remotes/svn/</pre>
<h3>7.- Convert this repo into bare</h3>
You must convert a complete git repository into a bare git repository, that one that doesn't have a working tree, is as simple as:
<pre>for i in `ls -A .`; do
  if [ $i != ".git" ];
    then rm -rf $i;
  fi;
done;
mv .git/* .;
rm -rf .git;
git config --bool core.bare true</pre>
<h3>8.- Copy it to a public server</h3>
All is done so you can copy this repository to a "public" repository, so you and your coworkers can pull from them.
<pre>scp -r ~/temp user@server:/path/into/your/server.git</pre>
<h3>9.- Clone your new git repo</h3>
<pre>git clone protocol://user@server:/path/into/your/server.git</pre>
And you have finished the migration
