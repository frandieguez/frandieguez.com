---
id: 269
title: Acceso rápido a la documentación de tus gemas de Ruby
date: 2008-08-07T00:36:57+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/?p=161
permalink: /blog/2008/08/acceso-rapido-a-la-documentacion-de-tus-gemas-de-ruby/
dsq_thread_id:
  - "657457423"
categories:
  - Uncategorized
tags:
  - completado
  - funciones
  - gem
  - Programación
  - Ruby
  - terminal
  - zsh
---
Durante una de mis sesiones de lectura de blogs me encontré que <a title="Acceso rápido a la Documentación de tus gemas" href="http://www.lacoctelera.com/porras/post/2008/07/11/rapido-acceso-la-documentacion-las-gemas-instaladas">en el de Sergio Gil</a>, programador en <a title="The Cocktail: consultora de experiencia de usuario y diseño de interacción" href="http://www.the-cocktail.com/">The Cocktail</a>, había escrito como tener acceso directo a las gemas mediante un script de Bash que además autocompleta.

La verdad es que es muy cómodo, y no tienes que recurrir a el conocido `gem server`, el cual tiene que levantar un servidor webrick para acceder a toda la documentación. Con este hack no se consumen recursos adicionales y exprimir todavía más nuestro equipo para otras tareas.

El único problema que tiene el post de Sergio es que es dedicado a bash, y hace algún tiempo que proceso amor por <a title="Z Shell" href="http://www.zsh.org/">zsh</a>, por lo que he hecho la modificación para que rule en la misma.

Simplemente copiad el siguiente código en vuestro ~/.zshrc y ya teneis el comnado gemdoc con autocompletado.
<pre lang="bash">export GEMDIR=`gem env gemdir`
gemdoc() {
open $GEMDIR/doc/`ls -FG $GEMDIR/doc | grep $1 | sort | tail -1`/rdoc/index.html
}
_gemdocomplete() {
compctl -/ -W $GEMDIR/doc gemdoc
return 0
}
_gemdocomplete</pre>
Por lo tanto solo habría que escribir en terminal
<code>gemdoc </code>
y se autocompletan los nombres de las gemas con sus respectivas versiones, si no proporcionas la version se cogerá la última versión.
<a href="http://mabishu.com/blog/wp-content/uploads/2008/08/captura-firefox-gems.gif"><img class="alignnone sinborde size-medium wp-image-168" title="captura-firefox-gems" src="http://mabishu.com/blog/wp-content/uploads/2008/08/captura-firefox-gems.gif" alt="" width="100%" /></a>