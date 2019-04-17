---
id: 255
title: Control de versiones con Git (I)
date: 2008-06-04T16:27:51+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/2008/06/07/control-de-versiones-con-git-i
permalink: /blog/2008/06/control-de-versiones-con-git-i/
dsq_thread_id:
  - "654675898"
categories:
  - Uncategorized
tags:
  - Control de versiones
  - git
---
En el ciclo de vida de un producto software siempre se debe contar con herramientas que nos faciliten la ayuda a los desarrolladores, y en ese sentido los sistemas de control de versiones, como Subversion, CVS o Mercurial, son de utilización obligatoria aunque desarrolle sólo una persona.

En este post relataré mi experiencia con un sistema de control de versiones que lleva ya algun tiempo haciendo ruido en internet y que ciertamente, adelanto ahora mismo, supone un paso adelante en los sistemas de control de versiones y en particular en su gestión de branches.

Yo venía utilizando Subversion y como todos veía muy pobre su sistema de gestión de tags y branches y el intercambio entre ellos, obligandote a mantener varias copias de todo un proyecto para cada branch y para tag.
<a title="Git - version control system" href="http://git.or.cz/">Git</a> a diferencia de otros SCMs permite commits locales y remotos, no hace falta conexión permanente con un repositorio central, porque simplemente ese repositorio no existe, en cambio la funcionalidad del mismo se distribuye en distintos equipos sin una jerarquía especial.

<a href="http://mabishu.com/wp-content/uploads/2008/07/github.png"><img class="size-medium wp-image-153 alignright" title="github" alt="" src="http://mabishu.com/wp-content/uploads/2008/07/github.png" width="154" height="49" /></a>Si bien no existe un servidor central, si tenemos la posibilidad de definir varios repositorios remotos desde los cuales sincronizar todos los commits entre distintas personas, para tal ejemplo tenemos github.com que ofrece servicio gratuito para proyectos de fuente abierta o servicios de pago para repositorios privados.
<h3>Uso de Git</h3>
El primer paso despues de instalar Git es configurarlo para identificarnos, para eso con un simple
<pre>$ git config --global user.name "Tu nombre"
$ git config --global user.email "direccion@dominio.tld"</pre>
configuramos nuestro nombre. Para ver más parametros de configuración pasaros por aquí <a title="git-config(1)" href="http://www.kernel.org/pub/software/scm/git/docs/git-config.html">git-config(1)</a>.

Para configurar un poco el comportamiento de git y sus diferentes acciones podeis editar el archivo general ~/.gitconfig que teneis en vuestro directorio home:
<pre lang="bash">[user]
    name = James Bowes
    email = MY_EMAIL

[alias]
    ci = commit -a
    co = checkout
    st = status -a
    praise = blame

[apply]
    whitespace = strip

[diff]
    color = auto
    rename = copy

[pager]
    color = true

[status]
    color = auto</pre>
Para la creación de un repositorio git simlemente tenemos que ejecutar en consola el siguiente comando dentro de la carpeta que queremos controlar:
<pre lang="bash">$mkdir repositorio; cd repositorio;
$ git init</pre>


A continuación podemos editar o generar los archivos dentro de dicho directorio que luego añadiremos al repositorio:
<pre>$ touch fichero.example
$ git status
# On branch master
#
# Initial commit
#
# Untracked files:
#   (use "git add ..." to include in what will be committed)
#
#	fichero.txt
nothing added to commit but untracked files present (use "git add" to track)</pre>
Como vemos el sistema se da cuenta que no tiene traceado el archivo que acabamos de crear, por lo que el estado nos notifica dicho evento. En este momento podemos hacer distintos eventos, eliminarlo (git rm fichero.example), añadirlo:
<pre>$git add fichero.txt
$git status
# On branch master
#
# Initial commit
#
# Changes to be committed:
#   (use "git rm --cached &lt; file >..." to unstage)
#
#	new file: fichero.txt
#
$git rm</pre>
o ignorarlo que es una de las features que más me han gustado de Git, para eso se edita el archivo .gitignore dentro del directorio para especificar eso, por ejemplo para aplicaciones rails se puede especificar lo siguiente:
<pre lang="bash">log/*.log # para los ficheros de log
tmp/**/* # para los ficheros temporales
config/*.yml # para los ficheros de configuración
db/*.sqlite3 # para los ficheros de base de datos temporales
**/*/.* # archivos temporales editores</pre>
Gracias a este fichero habilitamos unos filtros que necesitan pasar todos y cada uno de los archivos y directorios que se quieran que sean gestionados por Git.
<h3>Quiero commitear!</h3>
Llegados a este punto queremos hacer un commit al repositorio local, para eso simplemente se ejecuta:
<pre>$ git commit</pre>
Podemos evitarnos el tener que hacer el "git add &lt; elemento >" para eso el commit podemos hacerlo así:
<pre>$ $git commit -a
Created initial commit 5a5b3af: initial import
0 files changed, 0 insertions(+), 0 deletions(-)
create mode 100644 fichero.txt</pre>
Hecho esto, se ha creado un commit con un número de identificación que es un hash y que es siempre distinto. Despues de proporcionar un mensaje identificativo del commit, el commit estará hecho.
Pero este commit es local, esto es, no se hace el commit a un repositorio externo, y esta es otra de las funcionalidades que diferencian a git del resto, ya que tienes control de versiones local.

Para hacer commits a un repositorio remoto hay que generar una copia de nuestro repositorio pero de una forma especial:
<pre>~ $git clone --bare repo/ repo.git
Initialized empty Git repository in /Users/fran/repo.git/</pre>
Con esto tenemos un directorio nuevo donde tenemos solo los objetos del repositorio y no la copia directa de cada archivo del repositorio. Este copia bare lo subimos a nuestro servidor externo:
<pre>scp repo.git ssh://user@server:/path/al/repo/</pre>
A partir de este momento si queremos hacer y recibir commits en el repositorio externo, para eso tendremos que añadirlo a la configuración:
<pre>$git remote add origin ssh://user@server:/path/al/repo.git</pre>
para posteriormente hacer pulls o pushes cuando queramos actualizar nuestra copia local con la remota en el primer caso y actualizar el server remoto en el segundo caso:
<pre>$git push #(empujar) enviar el branch actual local al server remoto
$git pull #(tirar) sincronizar nuestra branch actual con los cambios del server remoto</pre>
