---
id: 178
title: Graficas estilo keynote con Ruby
date: 2007-08-09T21:13:31+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/?p=51
permalink: /blog/2007/08/graficas-estilo-keynote-con-ruby/
dsq_thread_id:
  - "654483064"
categories:
  - Uncategorized
tags:
  - grafica
  - gruff
  - imagemagick
  - Ruby
---
Vamos a probar la gema Gruff <a title="Gruff Graphs para Ruby" href="http://nubyonrails.com/pages/gruff">Graphs para Ruby</a> (<a title="Ejemplos de uso de Graphs para Ruby" href="http://geoffreygrosenbach.com/projects/show/5">algunos ejemplos</a>) una gema que he descubierto hace poco que nos simplifica muchísimo la creación de gráficas (con un toque de estilo keynote para presentaciones). Para ello debemos tener la librería RMagick, necesaria para que Gruff funcione, y gem, para poder instalar librerías de Ruby al vuelo. Let's Go!
<pre>sudo aptitude install ruby rubygems librmagick-ruby
//para los que lleguen tarde</pre>
Ahora gracias a la magnífica gem instalamos gruff, aceptando dependencias.
<pre>sudo gem install gruff</pre>
Ahora podemos hacer nuestro script en Ruby para que de forma muy fácil nos cree la grafica como queramos:
<pre lang="ruby">#!/usr/bin/ruby

require 'rubygems'
require 'gruff'

g = Gruff::Line.new
g.title = "Estudio poblacional del sexo"

g.data("Casados", [24, 25, 15])
g.data("Divorciados", [17.5, 17, 22.5])
g.data("Solteros", [5, 6.5, 9.5])

g.labels = {0 =&gt; '2003', 1 =&gt; '2004', 2 =&gt; '2005'}

g.write('sexo-edad.png')</pre>
y aquí está nuestra gran keynote:

<a title="Grafica echa con Gruff en Ruby" href="http://www.mabishu.comwp-content/uploads/2007/08/sexo-edad.png"></a>

<a title="Grafica echa con Gruff en Ruby" href="http://www.mabishu.comwp-content/uploads/2007/08/sexo-edad.png"><img src="http://www.mabishu.com/wp-content/uploads/2007/11/sexo-edad.png" alt="Grafica echa con Gruff en Ruby" width="480" height="360" /></a>