---
id: 226
title: Tips de seguridad en PHP
date: 2007-11-30T14:51:04+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/index.php/2007/11/30/tips-de-seguridad-en-php/
permalink: /blog/2007/11/tips-de-seguridad-en-php/
dsq_thread_id:
  - "654495970"
categories:
  - System Administration
tags:
  - PHP
  - seguridad
  - trucos
---
<ol>
<li>Utiliza los parámetros de <a title="PDO" href="http://us2.php.net/manual/en/ref.pdo.php" target="_blank">PDO</a> o <a href="http://ar2.php.net/mysql_real_escape_string" target="_blank">mysql_real_escape_string</a> sobre valores SQL para evitar la inyección del SQL.</li>
<li>Utiliza <a href="http://us2.php.net/manual/es/function.htmlspecialchars.php" target="_blank">htmlspecialchars</a>/<a href="http://us2.php.net/manual/es/function.htmlentities.php" target="_blank">htmlentities</a>/<a href="http://us2.php.net/manual/es/function.strip-tags.php" target="_blank">strip_tags</a> para escapar HTML y Javascript así evitaras ataques XSS.</li>
<li>3. Utiliza sesiones y asegura los sockets para prevenir que roben la sesión además almacena un símbolo especial md5 ej: <a href="http://us2.php.net/manual/en/function.md5.php" target="_blank">md5</a>(uniqueid(rand(),time)) en la sesión y comprobarla con un campo oculto en método POST y así prevenir que otro usuario ingrese.
Ejemplo:
<pre>if($_SESSION [’seguridadMd5′]==$_POST[’campoculto’]) {
/*Sesión segura*/
}</pre>
</li>
<li>Usa <a href="http://us2.php.net/manual/es/function.escapeshellarg.php" target="_blank">escapeshellarg</a>/<a href="http://us2.php.net/manual/es/function.escapeshellcmd.php" target="_blank">escapeshellcmd</a> cuando llames comandos exec para así evitar injección de comandos.</li>
<li>Quita los linebreaks<span> (BR, P y BLOCKQUOTE tags)</span> de headers entrantes para prevenir la terminación y la inyección de códigos. Fixed &gt;PHP5.1</li>
<li>Utiliza comprobación md5 en valores y sessionid serializados para validar su integridad.</li>
7. Utiliza el === para verificar valores de entrada (identidad de datos y de tipos).
<li>Utiliza está configuración,
<pre lang="php">* ini_set(”display_errors”,false);
* ini_set(”log_errors”,true);
* ini_set(”error_log”,”ruta/php.log”);
* ini_set(”session.save_path”,”ruta/www”); o “mm” session module o store en sqllite db
* php.ini expose_php=off
* php.ini register_globals=off
* Apache servertokens=prod</pre>
</li>
<li>Para cambios de sesión usa <a href="http://ar2.php.net/manual/es/function.session-regenerate-id.php" target="_blank">session_regenerate_id</a>.</li>
<li>Usa <a href="http://us2.php.net/manual/en/ref.openssl.php" target="_blank">secure sockets SSL</a> para trasacciones comerciales.</li>
</ol>