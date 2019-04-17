---
id: 274
title: Búsqueda avanzada de archivos con find, locate y grep
date: 2008-12-08T16:44:47+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/?p=185
permalink: /blog/2008/12/busqueda-avanzada-de-archivos-con-find-locate-y-grep/
dsq_thread_id:
  - "653991029"
categories:
  - Uncategorized
tags:
  - console
  - find
  - grep
  - Linux
  - locate
  - terminal
  - unix
---
Todos los que trabajamos asiduamente con un terminal no podemos evitar en algún momento lidiar con la tarea de búsqueda de archivos por nombre o incluso por contenido, incluso podemos querer ejecutar comandos con los resultados obtenidos.

Utilizaremos estos dos comandos: find, locate, grep.
<h3>Find</h3>
Busca en un directorio seleccionado segun unos modificadores proporcionados entre los que podemos destacar
<ul>
	<li><strong>-iregex</strong> para buscar con una expresión regular sin tener en cuenta las mayusculas/minúsculas</li>
	<li><strong>-regex</strong> para buscar con unha expresión regular teniendo en cuenta las mayusculas/minúsculas</li>
	<li><strong>-name</strong> para buscar segun un nombre dado se puede proporcionar una expresión regular</li>
	<li><strong>-empty</strong> para buscar ficheros vacíos</li>
	<li><strong>-user</strong> para buscar arquivos que pertenecen a un usuario determinado</li>
	<li><strong>-group</strong> para buscar arquivos que pertenecen a un grupo de sistema determinado</li>
	<li><strong>-atime -mtime etc.</strong> utiliza el tiempo de modificación, acceso, creación... de los archivos</li>
	<li><strong>-executable</strong> <strong> </strong>para buscar archivos con el flag de ejecutable</li>
	<li><strong>-type [letra]</strong> para buscar archivos [letra]=f , directorio [letra]=d, enlaces simbólicos [letra]=l, ficheros socket [letra]=s</li>
</ul>
además también proporciona modificadores de acción, esto es, modificadores que le dicen al comando que hacer con los resultados
<ul>
	<li>-print imprime el nombre de archivo completo en la salida estándar</li>
	<li>-exec {} ejecuta el comando seleccionado en {}</li>
	<li>-delete borra el archivo</li>
</ul>
Ejemplos prácticos:
find . -exec grep "www.athabasca" '{}' \; -print
#busca la cadena "www.athabasca" dentro del contenido de los archivos del directorio actual y los imprime
<pre lang="bash">find . -name "rc.conf" -exec chmod o+r '{}' \;
#le cambia el modo a o+r a los archivos con nombre rc.conf en el directorio actual</pre>
<pre lang="bash">find . -perm -g+w,u+w ! -perm -o+w
#busca los archivos que son escribibles por el propietario o su grupo, pero no el resto</pre>
<h3>Locate</h3>
Locate supone un salto en el rendimiento respecto al comando find siempre y cuando busquemos los archivos por su nombre. La razón del rendimiento de locate es que utiliza un índice de nombres de archivos normalmente ubicado en <strong>/var/lib/mlocate/mlocate.db</strong>. Normalmente tódolos los sistemas UNIX tienen una tarea de cron que actualiza dicha base de datos, aún así si queremos actualizarla manualmente podemos ejecutar el comando <strong>updatedb</strong>.

Podemos destacar varios modificadores de dicho comando:
<ul>
	<li><strong>--limit </strong>limita el número de resultados</li>
	<li><strong>--count </strong>imprime el número de resultados en vez de los resultados mismos.</li>
	<li><strong>--regex </strong>busca en la base de datos según una expresión regular</li>
</ul>
<p style="text-align: center;">En la siguiente imagen podemos ver la diferencia de rendimiento entre find y locate, encontrado <a title="Quick Tipos find files linux file system" href="http://www.secguru.com/article/quick_tips_find_files_linux_file_system">aquí</a>:
<a href="/assets/2008/12/findlocatecomparisonke7.png"><img class="size-medium wp-image-186 aligncenter" title="findlocatecomparisonke7" alt="Find locate comparison performance" src="/assets/2008/12/findlocatecomparisonke7.png" /></a></p>

<h3>Grep</h3>
Muy utilizado comando sobre todo utilizando tuberías ( | ), se utilza principalmente para buscar ficheros según el contenido de los mismos. La mejor forma de observar su comportamiento es mediante ejemplos:
<pre lang="bash">grep 'string' *.txt
#busca la cadena "string" en todos los archivos .txt
grep 'main(' *.c
#busca la cadena "main(" enn todos los archivos .c
grep -i 'ultra' *.conf
#busca la cadena ultra (sin tener en cuenta mayusculas/minúsculas) en los ficheros .conf
grep -iR 'ultra' *.conf
#busca la cadena ultra (sin tener en cuenta mayusculas/minúsculas) en los
  ficheros .conf en el directorio actual y subdirectorios del mismo</pre>
Y ahora unos truquillos:
<pre lang="bash">$ grep --color=auto -iR 'getChar();' *.c
#resalta los resultados para ver mejor el texto</pre>
<pre lang="bash">$ grep --color=auto -iRnH 'getChar();' *.c
#muestra el nombre de archivo y número de línea donde se encontró la cadena</pre>
Y ahora combinando find y grep:
<pre lang="bash">$ find . -name "*.c" -print | xargs grep "main("
#busca en tódos los ficheros .c la cadena "main)"</pre>
Como acabamos de ver tenemos diversas posibilidadades, que luego de estudiarnos un poco la sintaxis de los comandos nos harán abandonar las lentas y a veces podo intuitivas GUIs.
