---
id: 1565
title: Setting up Hubot with a gTalk account for fun
date: 2013-05-11T01:57:20+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=1565
permalink: /blog/2013/05/setting-up-hubot-with-a-gtalk-account-for-fun/
dsq_thread_id:
  - "1279274272"
categories:
  - Uncategorized
---
This article should be called like something like "Be happy: put a robot in your life", deep down in order to represent better what I will explain here I've changed the title to a more technical point of view.

Since I've started to work in <a href="http://www.openhost.es">Openhost</a> I always thought that for creating a good product our developers (and me between them) should have a great atmosphere, in order to do that I would rather have a pleasant workflow than a strict one. So I'm a firmly believer of <a href="http://en.wikipedia.org/wiki/Gamification">Gamification of work</a>. We  were using Jenkins for doing Continuous integration and quickly integrated the <a href="https://wiki.jenkins-ci.org/display/JENKINS/The+Continuous+Integration+Game+plugin">Jenkins Continuous Integration Game</a>, a tool which allowed us to create contests for improving our code base without even thinking about it, just thinking on getting a high rate in the contests. But, this is something to another post.

As we are continuously telecommuting, we use groupware chats as our main way of communication. This week I came across to something called <a href="http://hubot.github.com/">Hubot</a>, it's some sort of chat bot with incredible <a href="http://theprogrammingbutler.com/blog/archives/2011/10/28/hubot-scripts-explained/">scriptable capabilities</a>. In a brief description, it is a program that can connect to your groupware chat and it can accept orders, run them in the server and get some response to them in return.

### Installation

The installation of Hubot is quite simple. As Hubot is based in node.js, you have to install it in your system. After that you can create your custom bot from the prebuilt template.

```
sudo apt-get install nodejs
git clone git://github.com/github/hubot.git &amp;&amp; cd hubot
hubot --create ../your-bot-folder
cd ../your-bot-folder/ &amp;&amp; npm install
```

You can start playing with hubot by running the next command and send it orders:

```
$ ./bin/hubot
[...]
Hubot > hubot help
```

### Connecting Hubot to Gtalk chatrooms

By default Hubot has no support to use a Gtalk account, but you can install a custom adapter to do it by adding the proper dependency to the packages.json file:

```
"dependencies": {
    [...]
    "hubot-xmpp": ">= 0.0.1",
    [...]
  },
```

You might ask why am I using the XMPP adapter when I can just use the hubot-gtalk adapter. The reason is because I didn't find a way to connect hubot to a groupware chat by using the gtalk adapter. Given that XMPP and Gtalk are the same, but XMPP is more generic, you can connect to your Gtalk account by using this adapter with a little more configuration.

Talking about configurations, Hubot uses environment variables to get its configurations. So if you want hubot to use a Gtalk connection you must export those variables by filling the gaps of the next example right before running your bot:

```
export HUBOT_XMPP_USERNAME="your.account@gmailcom"
export HUBOT_XMPP_PASSWORD="your-gtalk-password"
export HUBOT_XMPP_ROOMS="your.groupware@chat.room.address"
export HUBOT_XMPP_HOST="talk.google.com"
export HUBOT_XMPP_PORT="5222"```
After that you can start the Hubot bot by issuing the next command:
```./bin/hubot -a xmpp -n bender
```

### Extending Hubot

As I said before, Hubot has a quite good extendability by what's called scripts. Scripts are commonly written in CoffeScript, a hipervitaminate subset language that complies to JavaScript, and there a lot of scripts already available in the Net™. They do a lot of things, from answering questions like Bender, from Futurama, to echoing quotes from Star Wars, Homer Simpsons, or it can do something more useful like translating strings by using Google Translate, linking to Google Hangouts, shorting links with bit.ly, and something a little more serious like interacting with the Jira or Jenkins APIs. Check the links from below to find all of them:
* <a href="hubot-script-catalog.herokuapp.com"><span style="line-height: 19px;">hubot-script-catalog.herokuapp.com</span></a>
* <a href="https://github.com/github/hubot-scripts/tree/master/src/scripts">github.com/github/hubot-scripts</a>

### Here is our bender bot

<a href="/assets/2013/05/Captura-de-pantalla-de-2013-05-09-184137.png"><img class="alignnone size-full wp-image-1566" alt="Captura de pantalla de 2013-05-09 18:41:37" src="/assets/2013/05/Captura-de-pantalla-de-2013-05-09-184137.png" width="721" height="569" /></a>

### Future findings

I'm trying to find a cheap node.js hosting for running this bot. I'll try to explain soon what my findings are.
