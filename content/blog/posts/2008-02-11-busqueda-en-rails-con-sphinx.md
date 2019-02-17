---
id: 245
title: Búsqueda en Rails con Sphinx
date: 2008-02-11T17:20:45+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/index.php/2008/02/11/busqueda-en-rails-con-sphinx/
permalink: /blog/2008/02/busqueda-en-rails-con-sphinx/
dsq_thread_id:
  - "655863285"
categories:
  - Web
tags:
  - busqueda
  - Programación
  - rails
  - Ruby
  - ruby on rails
  - sphinx
---
Cuando lo que quieres es maximizar el rendimiento de tu aplicación en consultas y búsquedas en una base de datos con millones registros normalmente utilizar el <strong>indexador</strong> y <strong>buscador</strong> de MySql no es la mejor opción.

Desde hace poco se mueve por la red Sphinx, pero la verdad es que está pegando muy fuerte, digamos que es el nginx del mundo de la búsqueda (rápido y ruso) según Evan Weaver.
Sphinx se divide de 2 componentes:
<ul>
	<li><strong>Indexador:</strong> es la parte que procesa toda la información recogida por un crawler y genera uno o varios índices.</li>
	<li><strong>Buscador:</strong> componente que consulta el índice y recupera la información resultante<!--more--></li>
</ul>
<h3>Instalación</h3>
Para instalarlo en GNU/Linux o en cualquier sabor de *nix necesitamos compilar desde las fuentes par eso hacemos:
<pre>$ wget http://www.sphinxsearch.com/downloads/sphinx-0.9.7.tar.gz
$ tar xvzf sphinx-0.9.7.tar.gz
$ cd sphinx-0.9.7
$ ./configure --with-mysql-includes=/opt/local/include/mysql5/mysql/
--with-mysql-libs=/opt/local/lib/mysql5/mysql/
$ make
$ sudo make install</pre>
Lógicamente los parámetros --with-mysql-includes y --with-mysql-libs tendrás que poner los tuyos propios. En el primer caso serán los ficheros cabecera que nos conectan con mysql y en el segundo será la ruta a las librerías de mysql.
En este tutorial estoy configurando para MySql pero también se puede hacer para PostgreSQL.
<h3>Ligándolo con Rails</h3>
Inicialmente voy a utilizar el plugin UltraSphinx de Evan que está genial para emprezar con un sphinx.conf auto-generado. Despues indexamos el contenido entero de lo que nos interese.

El ruido que está haciendo en la red es porque es tremendamente rápido, por ejemplo para una base de datos con una tabla con 1.5 millones de registros el chaval lo hace en solo unos pocos minutos. La rapidez de búsqueda es tambien muuy rápida. Desforturnadamente he tenido problemas con mi aplicación Rails con el plugin UltraSphinx instalado - algunos errores muy extraños sucedieron.

Habiendo probado varios plugins para Sphinx me decanté por probar <a title="Acts as sphinx plugin gem" href="http://www.datanoise.com/articles/2007/3/23/acts_as_sphinx-plugin">acts_as_sphinx</a>. Despues de algunas modificaciones en el fichero sphinx.conf (y volver a reindexar) la búsqueda estaba trabajando y mucho más importante, también sobre mi aplicación Rails. Una opción alternativa es Sphincter pero tiene una documentación limitada.
<h3>Indexando y flipando</h3>
Ahora sobre nuestra aplicación Rails corremos:
<pre>$ rake sphinx:index
$ rake sphinx:start</pre>
Indexando en mi MacBook…
<pre>$ time rake sphinx:index
using config file 'sphinx.conf'...
indexing index 'items'...
collected 1455733 docs, 1255.2 MB
sorted 182.4 Mhits, 100.0% done
total 1455733 docs, 1255246639 bytes
total 438.695 sec, 2861316.50 bytes/sec, 3318.32 docs/sec
real    7m25.307s
user    4m28.963s
sys     0m17.578s</pre>
<h3>Y ahora sobre rails</h3>
Vasmos a probar con el plugin <em>acts_as_sphinx</em> via consola (ruby script/console) el término ‘Rails’, ordenando por fecha de publicación.
<pre>&gt;&gt; search = Item.find_with_sphinx 'Rails',
           :sphinx =&gt; {
                       :sort_mode =&gt; [:attr_desc, 'pub_date'], :page =&gt; 1
            },
            :order =&gt; 'items.pub_date DESC'; 0
=&gt; 0
&gt;&gt; search.total
=&gt; 1000
&gt;&gt; search.total_found
=&gt; 73717
&gt;&gt; search.time
=&gt; "0.000"</pre>
Esto es, un índice de 943Mb de almenos 1.5 millones de elementos. Nótese que los resultados de la búsqueda se limitaron a 1000 en el fichero de configuración sphinx.conf.

En el controlador de Rails, la búsqueda se hace a través de:
<code>@items = Item.find_with_sphinx(params[:query],
:sphinx =&gt; {:sort_mode =&gt; [:attr_desc, 'pub_date'], :limit =&gt; 50, :page =&gt; (params[:page] || 1)},
:order =&gt; 'items.pub_date DESC')</code>
<h3>Actualizando el índice de Sphinx</h3>
Como para cada casi toda taréa en Rails, existe una tarea de _rake_ para actualizar el índice de Sphinx que puede ser llamado mediante una entrada en cron, frente a las actualizaciones en 'vivo'.
El comando rotate nos permite reindexar el índice mientras el demonio de Sphinx está corriendo, forzando el reinicio una vez se haya completado
<pre lang="shell">$ rake sphinx:rotate</pre>