---
id: 254
title: SQL Injection, PHP y Bases de Datos
date: 2008-05-22T11:14:11+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/2008/05/22/sql-injection-php-y-bases-de-datos
permalink: /blog/2008/05/sql-injection-php-y-bases-de-datos/
dsq_thread_id:
  - "653757069"
categories:
  - Uncategorized
tags:
  - PHP
  - seguridad
  - sql injection
---
SQL Injection, la temida dir&iacute;an algunos y la verdad es que si no tienes cuidado al programar suelen ser verdaderos quebraderos de cabeza, que ciertamente despues de retomar c&oacute;digo es un tanto dificil de depurar si no sabes lo que ha sucedido.
Aqu&iacute; voy a relatar modos de tratar ataques SQL Injection, que har&aacute;n nuestras apps m&aacute;s seguras y a nosotros est&aacute;r m&aacute;s tranquilos.
Las SQL Injections son consultas sql que son generadas por scripts/programas que concatenan entradas del usuario con consultas a bases de datos, y ah&iacute; es donde est&aacute; el problema ya que no toda la entrada que proporciona el usuario es segura.
Por ejemplo consideremos la siguiente instrucci&oacute;n:
<pre lang="SQL">SELECT * FROM users WHERE user = 'Pepito'</pre>
Si quieres en este momento recoger una fila de la base de datos con informaci&oacute;n del usuario insertada debes reemplazar "Pepito" con la cadena proporcionada por el usuario.
En PHP se v&eacute; tal que as&iacute;:
<pre lang="SQL">SELECT * FROM users WHERE user = '$_GET[nombreUsuario]'</pre>
El problema es simple: si el usuario inserta una cadena formateada especialmente como el nombre de usuario  el puede modificar tu consulta para ejecutar lo que el desee.

Por ejemplo si inserta esto:
<pre lang="PHP">';DROP TABLE users;--</pre>
Ahora la consulta se ver&aacute; as&iacute;:
<pre lang="SQL">SELECT * FROM users WHERE user = '';DROP TABLE users;--'</pre>
Hay varias formas con las que alguien puede atacar nuestra base de datos mediante sql injection. Las m&aacute;s rudimentarias son escapar los caracteres ', pero no siempre funcionan correctamente ya que hay otras formas de alterar la consulta. Echemos un vistazo a esto.

Hay una solucion muy simple a este problema. No concatenes texto proporcionado por el usuario en una consulta, vinculalo. La mayor&iacute;a de las bases de datos soportan bindings, mysql es una de ellas, postgresql, oracle y la lista crece. La idea es simple: proporcionas un marcador en tu consulta que ser&aacute; reemplazado con la variable actual, por lo que no es posible ninguna modificaci&oacute;n posible.

Nuestra anterior consulta se puede escribir tal que as&iacute;:
Mysql (en php con la extensi&oacute;n mysqli)
<pre lang="SQL">SELECT * FROM users WHERE user = ?</pre>
Oracle
<pre lang="SQL">SELECT * FROM users WHERE user = :user</pre>
Ejemplo de la extensi&oacute;n mysqli PHP (para m&aacute;s informaci&oacute;n lee la funci&oacute;n de mysqli_stmt bind_param
<pre lang="php">/* recoger los datos del usuario */
$nombreUsuario = $_GET['nombreUsuario'];
/* preparar la consulta */
$stmt = $mysqli-&gt;prepare('SELECT * FROM users WHERE user = ?');
/* vincular el valor */
$stmt-&gt;bind_param('s', $nombreUsuario);
/* ejecutar la declaraci&oacute;n preparada */
$stmt-&gt;execute();

$stmt-&gt;bind_result($name, $surname);
/* recoger los datos de usuario*/
while ($stmt-&gt;fetch())
{
  //imprimir los datos del usuario
  echo $nombre, ' =&gt;  ', $apellido , "\n";
}
/* cerrar la operaci&oacute;n */
$stmt-&gt;close();</pre>
Ejemplo con la extensi&oacute;n PHP PDO (para m&aacute;s informaci&oacute;n lee la funci&oacute;n prepare de PDO
<pre lang="php">/* recoger los datos del usuario */
$nombreUsuario = $_GET['nombreUsuario'];
/* preparar la consulta */
$sth = $dbh-&gt;prepare('SELECT * FROM users WHERE user = ?');
/* vincultar y ejecutar la consulta */
$sth-&gt;execute($userName);
$row = $sth-&gt;fetchAll();</pre>
Por lo tanto es muy facil para nosotros evitar la reescritura evitando que concatenar los datos proporcionados por el usuario con nuestra consulta, pero hay escenarios donde debes generar una consulta con los datos del usuario, no solo enviando una consulta. Por ejemplo, quieres mostrar diferentes tipos de libros basados en lo que inserta el usuario. El usuario puede elegir ver libros de ciencia ficci&oacute;n, literatura o libros de cocina.

Podr&iacute;as estar tentado a escribir algo como esto:
<pre lang="SLQ">SELECT * FROM $_GET[categoriaLibro]</pre>
¿Pero, que pasa si el usuario quiere modificar tu script e inserta 'users' como una categor&iacute;a? En ese caso podr&aacute; ver el contenido de la tabla de usuarios. La soluci&oacute;n para este problema es comprobar la categor&iacute;a proporcionada por el usuario en vez de la cadena directamente.

En php deber&iacute;as hacer algo como esto:
<pre lang="php">switch ($_GET['bookCategory'])
{
        case 'sf_books':
                $table = 'sf_books';
                break;
        case 'literature_books':
                $table = 'literature_books';
                break;
        default:
                $table = 'cooking_books';
}
$query = "SELECT * FROM $table";</pre>
Si escribes tu script de esta forma, cuando el usuario inserte 'users' como una categor&iacute;a, el ver&aacute; los libros de cocina, o puedes elegir mostrar un error, esa es tu elecci&oacute;n.
Para resumir este post, quiero decir que deber&iacute;as utilizar el binding de variables cuando quieras enviar datos a la base de datos que proporciona el usuario. Y si formas tus consultas seg&uacute;n la entrada de usuario, simpre compara lo que inserta con algun valor predefinido y usa el valor por defecto.
<strong>Nunca concatenes entrada de usuario en tus consultas, sin excepciones</strong>