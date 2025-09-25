---
id: 150
title: Trucos con SSH
description: Trucos con SSH
publishDate: 2007-06-26T01:58:37+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/index.php/2007/06/26/trucos-con-ssh/
permalink: /blog/2007/06/trucos-con-ssh/
dsq_thread_id:
  - "664399149"
categories:
  - Uncategorized
---
Si vives y trabajas entre diferentes servidores remotos, probablemente estes accediendo mediante SSH y autenticando mediante llaves RSA. Pero cuando el número de servidores crece, los nombres de host y usuarios respectivos también se incrementa, por lo que no estaría mal un sistema que recordara esos parametros.

Quizás no supieras que en tu carpeta  $HOME/.ssh/ puedes configurar algunos atajos para tus servidores habituales. Es tan fácil como crear un fichero ‘config’ en $HOME/.ssh/ y añadir esto:
```bash
Host mabi
HostName mabishu.com
User nombre_de_usuario
```

A partir de entonces, puedes usar el atajo ’mabi’ para acceder al servidor mabishu.com usando SSH:
```ssh sn```
y no tendrás que andar recordando el nombre de host y el nombre de usuario.

También funciona con SCP:
```scp mi_fichero.png mabi:www/img```
y para ejecutar comandos remotos:
```ssh mabi ls www/img```
(que te dará un listado de todos los ficheros remotos en www/img)

Si tienes más de un servidor “favorito” (estoy pensando en mi desván donde tengo 4 equipos y su colección de máquinas con nombres atómicos) la cosa es tan fácil como separar cada host en el fichero por una línea en blanco:

```Host w1
HostName worker1
User nombre_de_usuario

Host w2
HostName worker2
User nombre_de_usuario
```

Yo no es que tenga muchas máquinas... Lo que pasa es que como dijo aquel: “Good Programmers Are Lazy And Dumb”. Trabajar menos, en mi opinión, es una obligación moral de todo el que use ordenadores ;)
