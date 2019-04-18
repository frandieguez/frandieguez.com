---
id: 991
title: 'Sending patches through mail with "git send-mail"'
date: 2011-11-06T20:20:49+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=991
permalink: /blog/2011/11/sending-patches-to-your-coworkers-through-mail-with-git-send-mail/
dsq_thread_id:
  - "653731548"
categories:
  - Sofware Development
tags:
  - code versioning
  - email
  - format-patch
  - git
  - send-email
---
<img class="alignright" title="email-git" alt="" src="/assets/email-git.png" width="151" height="149" align="right" />

If you want to send code patches to your coworkers you don't need to do strange things with different tools. [Git](http://www.mabishu.com/blog/2008/06/04/control-de-versiones-con-git-i/ "Git") has all the neccesary tools for handling this in a pretty way. The idea is generate a patch from git and send to your coworker via email. After received the message they can import those messages directly into git. Let's see how all this works.

### Generating the patches

Git has the tool [git format-patch](http://www.kernel.org/pub/software/scm/git/docs/git-format-patch.html) for autogenerate the patches for a revision range.  For example, for generating patches from all the commits diverged from the origin branch you can issue at your terminal:

```bash
$ git format-patch origin
```

This will produce a series of numbered files in the current directory, one for each commit in the current branch but not in origin/HEAD. You can specify commit hashes or even commit hash ranges:

```bash
$ git format-patch 844f1c9ab34302ccb92b00cb02c5afbb8e799ad9..888624fc2c6dd50588d9cd33511048168309972c
```
The previous command will generate a patch file with the name of the commit:

```
0001-Updated-Spanish-and-Galician-translations.patch
```

You can then import these into your mail client and send them by hand. However, if you have a lot to send at once, you may prefer to use the [git send-email](http://www.kernel.org/pub/software/scm/git/docs/git-send-email.html) script to automate the process.

```
$ git send-email *.patch 0001-Updated-Spanish-and-Galician-translations.patch
The following files are 8bit, but do not declare a Content-Transfer-Encoding. 0001-Updated-Spanish-and-Galician-translations.patch Which 8bit encoding should I declare [UTF-8]? Who should the emails appear to be from? [Fran Diéguez <example@example.com>] Emails will be sent from: Fran Diéguez <example@exampel.com> Who should the emails be sent to? test@mabishu.com Message-ID to be used as In-Reply-To for the first email? [...]
```
After a couple of questions about who to send, who sends the email... your patch files will be automatically sended to the destination.

#### Threaded emails

By default git uses the deep threading format, which looks somewhat like this:

```
foobar patch 0
+-foobar patch 1
  +-foobar patch 2
  | +-foobar patch 3
  |   +-foobar patch 4
  |   | +-foobar patch 5
  |   +-comment on patch 3
  +-comment on patch 1
```

This is very unconformatalbe, specially for very big patch series. That’s why for v1.7.0 the default format would be the shallow one:

```
foobar patch 0 (usually a summary/overview)
+-foobar patch 1
| +-comment on patch 1
+-foobar patch 2
+-foobar patch 3
| +-comment on patch 3
+-foobar patch 4
+-foobar patch 5
```

So, if you want to change the format to the last one, all you have to do is: `git config --global sendemail.chainreplyto false` Ask in your mailing list first to determine how they prefer such patches be handled.

### Importing patches into your project

For the other hand Git also provides a tool called [git am](http://www.kernel.org/pub/software/scm/git/docs/git-am.html) (am stands for "apply mailbox"). With this tool you can import such emailed series of patches. Just save all of the patch-containing messages, in order, into a single mailbox file, say "patches.mbox", then run

```bash
$ git am -3 patches.mbox
```

Git will apply each patch in order; if any conflicts are found, it will stop, and you can manually fix the conflicts and resolve the merge. (The "-3" option tells git to perform a merge; if you would prefer it just to abort and leave your tree and index untouched, you may omit that option.) Once the index is updated with the results of the conflict resolution, instead of creating a new commit, just run

```bash
$ git am --resolved
```

and git will create the commit for you and continue applying the remaining patches from the mailbox. The final result will be a series of commits, one for each patch in the original mailbox, with authorship and commit log message taken from the message containing each patch.
