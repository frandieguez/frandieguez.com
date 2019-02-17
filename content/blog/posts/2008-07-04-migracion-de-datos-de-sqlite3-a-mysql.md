---
id: 259
title: 'millas dobles) por ` (acento grave) &#8211; Elimina &#8220;BEGIN TRANSACTION;&#8221; &#8220;COMMIT;&#8221;, y las líneas &#8220;sqlite_sequence&#8221; &#8211; Substituye &#8220;auto'
date: 2008-07-04T11:30:54+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/?p=146
permalink: /blog/2008/07/migracion-de-datos-de-sqlite3-a-mysql/
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

1. - Se hace un dump de la bbdd que queremos
<pre lang="bash">sqlite3 BasedeDatosaExportar .dump .quit &gt;fichero-dump.sql</pre>
2. - Ahora toca adaptarla a la sintaxis expecial de MySQL
<ul>
	<li>Reemplazar " (comillas dobles) por ` (acento grave)</li>
	<li>Elimina "<em>BEGIN TRANSACTION;</em>" "<em>COMMIT;</em>", y las líneas "<em>sqlite_sequence</em>"</li>
	<li>Substituye "<em>autoincrement</em>" con "<em>auto_increment</em>"</li>
</ul>
3. - Y el fichero ya está listo para importar en MySQL.

Facil y bonito oye.