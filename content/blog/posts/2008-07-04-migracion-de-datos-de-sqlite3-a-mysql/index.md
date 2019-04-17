---
id: 259
title: 'Migracion de SQLite a MySQL'
date: 2008-07-04T11:30:54+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/?p=146
path: /blog/2008/07/migracion-de-datos-de-sqlite3-a-mysql/
dsq_thread_id:
  - "653706599"
categories:
  - Uncategorized
tags:
  - bases de datos
  - migracion
  - mysql
  - sqlite3
---
Es algo común que estés desarrollando contra un gestor de bases de datos de "juguete" como puede ser sqlite3 y en un momento dado querer pasar a uno "de verdad" para probar cuanto rendimiento tiene tu app.

En este caso y como reza el título explico como hacer la migración de sqlite3 a MySQL, que resulta bastante trivial.

* Se hace un dump de la bbdd que queremos

<pre lang="bash">sqlite3 BasedeDatosaExportar .dump .quit >fichero-dump.sql</pre>

* Ahora toca adaptarla a la sintaxis expecial de MySQL

<ol>
	<li>Reemplazar " (comillas dobles) por ` (acento grave)</li>
	<li>Elimina "<em>BEGIN TRANSACTION;</em>" "<em>COMMIT;</em>", y las líneas "<em>sqlite_sequence</em>"</li>
	<li>Substituye "<em>autoincrement</em>" con "<em>auto_increment</em>"</li>
</ol>

* Y el fichero ya está listo para importar en MySQL.

Facil y bonito oye.
