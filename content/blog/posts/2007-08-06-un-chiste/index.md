---
id: 171
title: Un Chiste
date: 2007-08-06T10:27:51+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/2007/08/06/un-chiste/
permalink: /blog/2007/08/un-chiste/
dsq_thread_id:
  - "654483129"
categories:
  - Uncategorized
---
¿ Cómo matarías a un elefante amarillo ?
<pre lang="C++">void Elephant::Kill() {
	YellowElephantsExterminatorGun gun;
	if(color == YELLOW) {
		gun.shoot(this);
	} else if(color == GREEN) {
		paint(YELLOW);
		gun.shoot(this);
	}
	this-&gt;~Elephant();
}</pre>
