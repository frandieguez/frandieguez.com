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
1. Utiliza los parámetros de [PDO](http://us2.php.net/manual/en/ref.pdo.php) o [mysql_real_escape_string](http://ar2.php.net/mysql_real_escape_string) sobre valores SQL para evitar la inyección del SQL.

2. Utiliza <a href="http://us2.php.net/manual/es/function.htmlspecialchars.php" target="_blank">htmlspecialchars</a>/<a href="http://us2.php.net/manual/es/function.htmlentities.php" target="_blank">htmlentities</a>/<a href="http://us2.php.net/manual/es/function.strip-tags.php" target="_blank">strip_tags</a> para escapar HTML y Javascript así evitaras ataques XSS.
3. Utiliza sesiones y asegura los sockets para prevenir que roben la sesión además almacena un símbolo especial md5 ej: <a href="http://us2.php.net/manual/en/function.md5.php" target="_blank">md5</a>(uniqueid(rand(),time)) en la sesión y comprobarla con un campo oculto en método POST y así prevenir que otro usuario ingrese.
Ejemplo:
```php
if ($_SESSION [’seguridadMd5′] == $_POST[’campoculto’]) {
  // Sesión segura
}
```

4. Usa
[escapeshellarg](http://us2.php.net/manual/es/function.escapeshellarg.php)/[escapeshellcmd](http://us2.php.net/manual/es/function.escapeshellcmd.php)
cuando llames comandos exec para así evitar injección de comandos.

5. Quita los linebreaks (BR, P y BLOCKQUOTE tags) de headers entrantes para prevenir la terminación y la inyección de códigos. Fixed PHP > 5.1

6. Utiliza comprobación md5 en valores y sessionid serializados para validar su integridad.

7. Utiliza el === para verificar valores de entrada (identidad de datos y de tipos). Utiliza está configuración,

8. Cambia algunos valores de configuracion de php
```php
ini_set(”display_errors”, false);
ini_set(”log_errors”, true);
ini_set(”error_log”, ”ruta/php.log”);
ini_set(”session.save_path”, ”ruta/www”); // o “mm” session module o store en sqllite db
```
9. Cambia algunos valores de php.ini
```ini
php.ini expose_php=off
php.ini register_globals=off
Apache servertokens=prod
```

10. Para cambios de sesión usa [session_regenerate_id](http://ar2.php.net/manual/es/function.session-regenerate-id.php).

11. Usa [secure sockets SSL](http://us2.php.net/manual/en/ref.openssl.php) para trasacciones comerciales.
