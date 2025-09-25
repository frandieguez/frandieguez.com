---
id: 965
title: Setup a remote git repository using http with push support and digest auth
description: Setup a remote git repository using http with push support and digest auth
publishDate: 2011-02-09T20:38:57+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=965
permalink: /blog/2011/02/setup-a-remote-git-repository-using-http-with-push-support-and-digest-auth/
dsq_thread_id:
  - "653725484"
categories:
  - System Administration
tags:
  - digest
  - git
  - http
  - push
---
<div class="aligncenter">

![Git over http](./git_over_http.png)
</div>

And here is another post about my daily job with git, this time talking about how to setting up a remote git repository with digest authentication and support for pushing changes using http protocol.
There is a lot of options to setup a git repository: git-daemon, gitosis, ssh, and more.

*   The more secure way is to use ssh protocol but it needs to create user accounts for each user you want to allow to pull and push changes from the remote repository.
*   For the other hand git-daemon is the faster way that allows to publish a public repository but if you needs to restrict access for some users (allow/disallow push/pull or view one entire repository) this won't be your best choice.

Now I will write all the steps to setup a remote git repository that uses http protocol.

### Setup the http server, this time with Apache2

All you have to do is install a vanilla Apache 2 web server and enable WebDAV support on it.

    # apt-get install apache2
    # a2enmod dav_fs
    # a2enmod dav
    # /etc/init.d/apache2 restart

Now in your virtualhost configuration you should insert the next snippet. Just change it to fit your repository and passwd file location.

    <Location /my-new-repo.git>
           DAV on
           AuthType Basic
           AuthName "Git"
           AuthUserFile /etc/apache2/passwd.git
           Require valid-user
    </Location>

If you want to allow certain users to interact with this repository you should create a passwd file containing their username and password.

    htpasswd -c /path/to/the/file/passwd.git <username-to-add>

Restart the web server and you will have all done in the server side.

    # /etc/init.d/apache2 restart

### Upload the code to the repository

If you have a repository created in your computer now you have to upload it to the server, but before that you must change it a little bit. The faster way to do this is by clonning your local repository into a new _bare_ copy.

    git clone /path/to/your/local/repository my-new-repo.git --bare

You should update the server before upload it (dont forget the _\--bare_ parameter, without this you can't push changes in the future):

    cd my-new-repo.git
    git --bare update-server-info

And the last change. You have to tell git that after each push into the repository it must execute git update-server-info over it to sync all the data uploaded inside the index.

    mv hooks/post-update.sample hooks/post-update
    chmod a+x hooks/post-update

Finally you can upload this new _bare_ copy to the server

### Setup the client

To allow git to use digest auth you have to use your _~/.netrc_ file, inside it you have to write your auth parameters:

    machine your.server.com
    login your-username
    password your-password

But take care that only you can read it.

    chmod 600 ~/.netrc

Now you can setup your local copy to push changes to your new remote git repository:

    $ git-config remote.upload.url http://<your.server.com>/my-new-repo.git/
    $ git push upload master

This pushes branch 'master' (which is assumed to be the branch you want to export) to repository called 'upload', which we previously defined with git-config.
