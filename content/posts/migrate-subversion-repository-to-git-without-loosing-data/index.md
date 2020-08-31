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

<img class="alignright" src="./git-pony-svn-ogre.png" alt="" width="320" height="154" />

In our company we migrated all our SVN repositories to Git, as the
migration is not straight forward I wrote down it and made available for
all of you. Some tips are taken from documentation and others from
[other websites](http://stackoverflow.com/). So, let's go\!

### 1.- Get the name of all Subversion commiters

Subversion just lists the username for each commit. Git’s commits have
much richer data, the commit author needs to have a name and email
listed. By default the git-svn tool will just list the SVN username in
both the author and email fields. But with a little bit of work, you can
create a list of all SVN users and what their corresponding Git name and
emails are. This list can be used by git-svn to transform plain svn
usernames into proper Git committers.

```bash
svn checkout
svn log -q | awk -F '|' '/^r/ {sub("^ ", "", $2); sub(" $", "", $2); print $2" = "$2" <"$2">"}' | \
 sort -u > authors-transform.txt
```

That will retrieve all the log messages, pluck out the usernames,
eliminate any duplicate usernames, sort the usernames and place them
into a “authors-transform.txt” file. Now you must edit each line in the
file. For example, convert:
```
svn_user = svn_user
```
into this:

```
svn_user = Git Username <git_username_mail@example.com>
```

### 2.- Clone your svn repo with git-svn

```
git svn clone  --no-metadata -A authors-transform.txt --stdlayout ~/git-repo-temp
```

This will do the standard git-svn transformation (using the
authors-transform.txt file you created in step 1) and place the git
repository in the “\~/temp” folder inside your home directory. This will
transform your svn tags and branches into proper git tags and branches.

### 3.- Convert svn-ignores to .gitignore

This step for me is very importan, in my apps there is a lot of
temporary files (cache, logs, compiled files, and so on...) that I don't
want to get disturbing me in every commit. So to migrate all the
svn-ignores into Git we must issue the next:

```
cd ~/git-repo-temp
git svn show-ignore > .gitignore
git add .gitignore
git commit -m 'Convert svn:ignore properties to .gitignore.'
```

### 4.- Clean up svn branches and tags

git-svn makes all of Subversions tags into very-short branches in Git of
the form “tags/name”. You’ll want to convert all those branches into
actual Git tags using:

```bash
git for-each-ref --format='%(refname)' refs/heads/tags |
cut -d / -f 4 |
while read ref
do
  git tag "$ref" "refs/heads/tags/$ref";
  git branch -D "tags/$ref";
done
```

### 5.- Optimize your repo

This is not a very important step but it could safe you a lot of space
and repository inconsitences. It is just a step to ensure your final git
repository.

```
git gc
git fsck
```

### 6.- Clean SVN sections from Git

If you want to forget SVN for all your life, you must clean all the
references to SVN repositories in your git repository. So, to clean all
this references just issue the next:

```
git config --remove-section sv
```
