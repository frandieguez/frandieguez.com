---
id: 632
title: Speed up Google Analytics js by caching it locally
date: 2010-06-03T09:18:51+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/?p=632
permalink: /blog/2010/06/speed-up-google-analytics-js-by-caching-it-locally/
dsq_thread_id:
  - "654414208"
categories:
  - Web
tags:
  - caching
  - google analytics
  - hack
  - javascript
  - Linux
---
<img class="size-full wp-image-640 alignright" style="margin-left: 10px;" title="Google Analytics screenshot" alt="" src="/assets/2010/06/rect2818.png" width="431" height="206" align="right" />

The big problem of use Google Analytics is that you have to get its javascript to get to work statistics. For me this causes that my sites takes a lot of time to end the load. For this reason I always recommend put the GAnalytics code at the bottom of the page, but for me this is not enought.

One solution to this is to cache the external javascript locally but what if the external javascript changes? Here I go to explain how to store GAnalytics javascript locally and peridiocally check that is the lastest version.
<!--more-->
Paste this code at the bottom of your website:
<pre><code>&lt;script src="http://domain/path/to/your/javascripts/ga.js" type="text/javascript"&gt;&lt;/script&gt;
&lt;script type="text/javascript"&gt;
var pageTracker = _gat._getTracker("PASTE YOUR GANALYTICS CODE HERE");
pageTracker._initData();pageTracker._trackPageview();
&lt;/script&gt;
</code></pre>
Now you're site is ready to use your cached file but we have to get that file so to do this I use the next script. Its downloads the ga.js file and place it on the desired place, just modify it to your requirements:
<pre><code>#!/bin/sh
# DIRECTORY WHERE to SAVE ga.js
INSTALL_IN=/path/to/public/directory/of/your/site/and/path/to/your/javascripts/

# GANALITYCS REMOTE FILE
GOOGLE_GA_URL=http://www.google-analytics.com/ga.js

# USER-AGENT
UA="Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.3) Gecko/20070309 Firefox/2.0.0.3"

# DOWNLOAD THE FILE
curl --header "Pragma:" -f -s -A "${UA}" -m 1800 --retry 15 --retry-delay 15 --max-redirs 8 -O $GOOGLE_GA_URL -o $INSTALL_IN/ga.js

# GIVE FILE CORRECT PERMISSIONS
chmod 644 $INSTALL_IN/ga.js

exit 0;</code></pre>
But what if Google updates that script and we don’t take notice of this? This will cause statistics loss so we have to do a workaround to fetch every day that javascript file using crontab. Just type "crontab -e" and insert the next snippet:
<pre><code>@daily /path/to/the/script/google-analytics-update.sh &gt;/dev/null 2&gt;&amp;1</code></pre>
