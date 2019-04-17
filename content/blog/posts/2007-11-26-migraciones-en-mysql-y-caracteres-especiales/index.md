---
id: 223
title: Migraciones en MySQL y caracteres especiales
date: 2007-11-26T15:20:34+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/index.php/2007/11/26/migraciones-en-mysql-y-caracteres-especiales/
permalink: /blog/2007/11/migraciones-en-mysql-y-caracteres-especiales/
dsq_thread_id:
  - ""
categories:
  - Web
tags:
  - caracteres especiales
  - migraciones
  - mysql
---
Muchas veces cuando estás trabajando con aplicaciones web o standalone que trabajan contra Bases de datos te ves en la necesidad de hacer un volcado de tu BD para hacer un backup o para migrar la aplicación. El problema es que en Mysql y con columnas con tipos de datos text o varchar que continen datos con caracteres especiales como á, ó, ç o ñ, letras acentuadas, etc. al hacer el volcado descubres que aparecen simbolos extraños. Por ejemplo

```
'paseos'
```
resulta en un

```
âpaseosâ
```
en la base de datos y que escribe al renderizarlo un feo

```
€™paseosâ€™
```
Esto se supone que es un problema popular cuando se está moviendo de MySQL 4.0 a 4.1 o posteriores, pero también aparece cuando estás moviendo los datos de una base de datos a otra en la misma instalación de MySQL. El mover de una instalación 4.1 a otra 4.1 también da como resultado "los caracteres locos". Y para más INRI, me ha tocado en alguna ocasión hacer backups de bases de datos críticas en MySQL 5 con los mismos resultados.


La mayoría de las soluciones encontradas en la red acaban en un complicado "find y replace" para eliminar estos problemas de caracteres. Desafortunadamente, esto no es solo una solución con la que esté muy de acuerdo. Aúnque también haya <a title="Script de corrección de CHARSETS utf-8 mal exportados" href="/blog/2007/07/23/script-de-correccion-de-charsets-utf-8-mal-exportados/">escrito un script para solucionarlo</a>. Despues de encontrar muchos procedimientos con los que he trabajado, este es el que mejor trabaja para mi.
Como yo lo entiendo, el problema viene de el echo de que mysqldump utiliza utf8 como codificación de caracteres mientras, algunas veces no, las tablas mysql están por defecto en codificación latin1. Vamos a poner una base de datos de ejemplo ejemplo_db con tablas con columnas varchar y text. Si hay caracteres especiales almacentados realmente están en codificación UTF-8, que trabajan genial mientras que no se mueve la base de datos a otro server.
Que sucede cuando ejecutas el comando:

```
mysqldump -u mysql_usuario -p ejemplo_db > dump_ejemplo_db.sql
```

esta instrucción ejecuta mysqldump que recoge las tablas codificadas en latin1 (conteniendo caracteres utf8) y las traduce a la codificación utf8 (por lo que los caracteres utf8 ya no serán los mismos que se supone que tienen que ser) antes de escribirlos en un archivo en el disco. En teoría, importando los datos en mysql debería trabajar desde mysql 4.1 y superiores ya que tienen soporte para utf8, pero desafortunadamente, la doble codificación de estos caracteres revuelve todo y tienen un buen churro de caracteres. Cuando ejecutas lo siguiente:

```
mysql -u mysql_usuario -p nueva_db &lt; dump_ejemplo_db.sql
```

mysql lee los datos (que están en utf8) y los convierte en su codificación de caracteres. Los caracteres especiales que son mal interpretados por mysqldump y codificados son ahora decodificados en caracteres mal interpretados y tienes una buena ristra de simbolos.
Hay dos formas de tratar con este trabajo. La primera es tratarla en el nivel de columnas de tablas individuales y la otra es tratarla en el nivel en el que trabaja el dump.

## Arreglando una columna

Con esta solución, solo tienes que llevar a cabo un mysqldump como lo haces normalmente y luego importarlo como normalmente haces. Los caracteres especiales por el medio. Realmente no estan por el medio, simplemente parece que están. Realmente, tus datos están probablemente perfectamente formateados en utf8 pero en una columna que está en latin1. Por lo que simplemente necesitamos es cambiar cada columna de latin1 a utf8 sin alterar los datos. Desafortunadamente, solo puedes hacer un ALTER TABLE que cambia la codificación de caracteres por lo que mysql convertirá los datos de latin1 a utf8 (incluyendo los caracteres especiales) y acabarás con un conjunto de caracteres diferente. Solo necesitamos cambiar el tipo sin correr la conversion. Para hacer cambiamos varchar a binary y los text a blob. Los cambios no hacen una conversión o recodificación. Luego cambiamos de nuevo de varchar a text con la codificación correcta.

Para una columna varchar(255) llamada "nombre_columna" en la tabla llamada "tabla_ejemplo":

```
ALTER TABLE tabla_ejemplo MODIFY nombre_columna BINARY(255);
ALTER TABLE tabla_ejemplo MODIFY nombre_columna VARCHAR(255) CHARACTER SET utf8;
```

Para una columna llamada "nombre_columna_text" en la tabla llamada "tabla_ejemplo":

```
ALTER TABLE tabla_ejemplo MODIFY nombre_columna_text BLOB;
ALTER TABLE tabla_ejemplo MODIFY nombre_columna_name TEXT CHARACTER SET utf8;
```

Los datos de la taba deberían estár ahora bien interpretados. Si no es así, tienes un problema que yo no he experimentado.

### Arreglando el problema al importar

Si tienes muchas columnas y prefieres arreglarlas mientras se está importando, una solución que funciona la *mayoría de las veces* es llevar a cabo un mysqldump forzándolo a guardar los datos en latin1. Luego al importar engañamos a mysql a pensar que los datos están en utf8.
Para una base de datos llamada bd_ejemplo (como por ejemplo la que sigue):

```
mysqldump -u mysql_username -p --default-character-set=latin1 example_db > bd_ejemplo.mysql
```

Ahora abre el fichero de backup y editalo. Debe haber una linea que sea como esta:

```
/*!40101 SET NAMES latin1 */;
```

Cambiala de latin1 a utf8:

```
/*!40101 SET NAMES utf8 */;
```

Ahora, importa el fichero en mysql:

```
mysql -u mysql_username -p nueva_db &lt; bd_ejemplo.mysql
```

En la mayoría de los casos todo se importará correctamente. En algunos casos extremos, los datos decodificados resultarán en el mismo texto como otra pieza de datos decodificados y esto puede resultar en un conflicot si esto ocurre en registros que deben tener entradas únicas. En este caso, necesitarás recodificar manualmente empleando la primera solución.

Hay una solución muy popular en la red que llama a utilizar mysql con `--default-charset-set=latin1` e importarlo con mysql `--default-character-set=utf8` pero ciertamente no me ha funcionado. Esto posiblemente funcione si borras los SET NAMES latin1 del fichero backup, pero si haces esto debes cambiarlo a utf8.
