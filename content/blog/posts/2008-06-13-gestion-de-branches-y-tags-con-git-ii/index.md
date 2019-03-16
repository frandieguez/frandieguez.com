---
id: 256
title: Gestión de Branches y Tags con Git (II)
date: 2008-06-13T17:05:25+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/2008/06/13/gestion-de-branches-y-tags-con-git-ii
permalink: /blog/2008/06/gestion-de-branches-y-tags-con-git-ii/
dsq_thread_id:
  - "654261830"
categories:
  - Uncategorized
tags:
  - Control de versiones
  - git
---
Continuo la serie de articulos sobre Git, echa un vistazo a la anterior entrega donde hablamos de creción de <a title="Control de versiones con Git (I) | Mabishu" href="http://www.mabishu.com/blog/2008/06/04/control-de-versiones-con-git-i">repositorios y una pequeña introducción</a>. En esta ocasión indagaré un poco más en el ciclo de vida de nuestro software donde mostraré como crear branches, tags y como Git gestiona todo esto de manera increíble y es realmente lo que lo hace, bajo mi punto de vista, el mejor SCM que he probado.
<h2>Internalidades de Git</h2>
<img class="sinborde alignleft" src="http://www.mabishu.com/wp-content/uploads/2008/07/esquema-del-arbol-de-repositorio-de-git.jpg" alt="Esquema del arbol de repositorio de Git" width="190" height="256" align="left" />Git internamente gestiona los distintos commits en forma de arbol, donde cada "hoja", que el llama blob son los distintos archivos en un instante determinado y los "nodos", que llama tree son los distintos directorios. Siguiendo este esquema la gestión del repositorio se simplifica mucho.
En el esquema anterior podemos ver como se pueden diferenciar 2 arboles de objetos y nodos distintos, el primero que referenciamos mediante un tag (con una rama descendente única y que contiene dos directorios y un archivo), y el segundo sería exactamente el mismo arbol anterior pero añadiendole un nuevo archivo. Además el segundo es la copia actual en nuestro directorio de trabajo.
<h2>Creación de Tags</h2>
Entonces y deduciendo un poco la creación de tags en Git es inmediata, basta crear un "puntero" que nos apunte, valga la redundancia, a el commit deseado.
<pre>$git-tag -a nombre-tag -m "Creación de Tag nombre-tag"</pre>
Si no proporcionas el parámetro -m, simplemente se abrirá tu editor $EDITOR y podrás proporcionar una descripción a el tag en cuestión.
Se pueden hacer múltiples acciones sobre un tag, en el caso anterior se crea un tag sin firmar con GPG pero podemos hacerlo firmado (con el parametro -s) para la posterior identificación de su creador. Para llevar a cabo el firmado se usa el parámetro signingkey de nuestro .gitconfig
<pre lang="bash">[user]
    signingkey =</pre>
También podemos eliminar un tag con el parámetro -d, y demás. <a title="git-tag(1)" href="http://www.kernel.org/pub/software/scm/git/docs/git-tag.html">git-tag(1)</a>
Por lo tanto la creación de Tags como hemos visto es sencilla y directa, y lo más importante sin crear copias innecesarias de archivos.

<!--more-->
<h2>Creación de Branches</h2>
<img class="sinborde" src="http://www.mabishu.com/wp-content/uploads/2008/07/branches-en-git.jpg" alt="Branches en Git" width="199" height="172" align="left" />Ahora imaginad el estado del arbol del repositorio de la imagen. En este caso hay dos commits de los cuales hemos omitido toda la estructura. El segundo commit es nuestra copia de trabajo actual y realmente podemos tratar como el branch "master". En este caso y para crear un nuevo branch lo que hacemos es crear un nuevo puntero (que no un commit nuevo) a el último commit, como muestro en el siguiente gráfico, a partir de ese momento los nuevos commits que hagamos se van a hacer sobre ese branch. Por lo tanto para crear un nuevo branch y hacerlo nuestra copia lo que haremos es ejecutar lo siguiente:
<pre>$ git branch master &lt;nuevo-branch&gt;  #creamos el branch a partir de master</pre>
<pre>$ git checkout &lt;nuevo-branch&gt;
# hacemos que ese branch sea nuestra copia en nuestro directorio de trabajo</pre>
<img class="sinborde" src="http://www.mabishu.com/wp-content/uploads/2008/06/branch-en-git-3.jpg" alt="Branch en Git 3" width="265" height="197" align="left" />En este gráfico por fin vemos que hemos creado un nuevo commit y se ha creado bajo nuestro branch y no sobre master. Si luego queremos retomar el branch master no tenemos más que hacer un checkout como en el ejemplo anterior y ya sería nuestra copia.

En la próxima entrega hablaré de como podemos hacer de distintas formas merges de los branches, y de como Git de nuevo nos facilita la tarea.