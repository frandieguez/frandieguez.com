---
id: 268
title: Configurar MySQL para rendimiento
date: 2008-08-03T23:43:49+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/2008/08/03/configuracion-de-mysql-para-rendimiento-2/
permalink: /blog/2008/08/configuracion-de-mysql-para-rendimiento-2/
dsq_thread_id:
  - "655863288"
categories:
  - System Administration
tags:
  - bases
  - bases de datos
  - desarrollo
  - mysql
  - rendimiento
  - servidor
---
En el desarrollo de aplicaciones contra bases de datos, la mayoría de
las veces, necesitas unos valores de referencia para saber si las
consultas o instrucciones que está procesando tu aplicación se están
comportando como debiere. También si te toca administrar un servidor de
bd y monitorearlo este post te será de gran ayuda. En este sentido
escribiré algunos de los parámetros que podemos monitorear para el caso
de bases de datos MySQL. Básicamente MySQL nos proporciona una serie de
instrucciones SQL que nos devuelve información de estado y rendimiento
del servidor, para que luego las evaluemos y decidamos que acción
pertinente se lleva a cabo. La instrucción básica que se usa en MySQL es

    SHOW STATUS;

la cual nos devuelve una cantidad importante de estados de variables.
Aquí explico las más importantes.

### threads_connected

Esta variable indica el número total de clientes que tienen una conexión
abierta actualmente con el servidor. Proporciona información en tiempo
real de cuantos clientes están conectados con el servidor. Esto puede
ser de ayuda para analizar el tráfico o decidir cuando es el mejor
instante para reiniciar un servidor.

### created_tmp_disk_tables

Esta variable indica el número de tablas temporales que han sido creadas
en disco frente a hacerlo en memoria. El acceso a tablas en disco
normalmente es más lento que acceder a ellas en memoria. Por tanto las
consultas que usan la sintaxis *CREATE TEMPORARY TABLE* son más lentas
si el valor de la esta variable es superior.

### handler_read_first

Esta variable indica el número de veces que un gestor de tabla hace una
petición de lectura a la primera fila del índice de la tabla. Si MySQL
accede frecuentemente a la primera fila de un índice de tabla, sugiere
que está llevando a cabo un escaneo secuencial al índice completo. Esto
indica que la tabla correspondiente no está correctamente indexada.

### innodb_buffer_pool_wait_free

Esta variable indica el número de veces que MySQL tienen que esperar por
páginas de memoria que tienen que ser purgadas. Si esta variable es
alta, sugiere que el buffer de memoria de MySQL está configurado
incorrectamente de acuerdo con la cantidad de escrituras que el servidor
está llevando a cabo actualmente.

### key_reads

Esta variable indica el número de accesos al sistema de archivos que
lleva a cabo MySQL para recoger índices de bases de datos. La lectura de
índices de bases de datos en el sistema de archivos ralentiza el
rendimiento de las consultas. Si esta variable es alta, indica que la
cache de keys de MySQL's está sobrecargada y debe ser reconfigurada.
### max_used_connections

Esta variable indica el número máximo de conexiones que MySQL ha tenido
que abrir al mismo tiempo desde que el servidor fue reiniciado. Este
valor proporciona un punto de referencia en la ayuda a decidir el número
máximo de conexiones que tu servidor debería soportar. También ayuda al
análisis de tráfico.

### open_tables

Esta variable indica el número de tablas que están actualmente abiertas.
Este valor es el mejor analizador en combinación con el tamaño de la
cache de tablas. Si el valor es bajo y el valor de *table_cache* es
alto, probablemente es bueno reducir el tamaño de caché sin afectar al
rendimiento. Por otra parte, si el valor es alto y cercano al valor de
*table_cache*, puede suponer beneficioso incrementar el tamaño de la
caché de tabla.

### select_full_join

Esta variable indica el número de full joins que MySQL ha tenido que
llevar a cabo para satisfacer las consultas de los clientes. Un valor
alto indica que MySQL está siendo forzado a hacer full joins de tablas
(que tienen un rendimiento intensivo) en lugar de utilizar índices. Esto
sugiere la necesidad de una mayor indexación de las tablas
correspondientes.

### slow_queries

Esta variable indica el número de consultas que han sido más largas de
lo normal. Un alto valor indica que muchas consultas no están siendo
ejecutadas de forma óptima. Un próximo paso necesario sería examinar el
log de consultas lentas e identificar estas para la optimización

### uptime

Esta variable indica el número de segundos desde que el servidor fue
reiniciado. Este valor es útil para analizar el tiempo de actividad del
servidor, así como para generar informes sobre el rendimiento general
del sistema. Un valor bajo de consistencia indica que el servidor se ha
reiniciado con frecuencia, lo que ha provocado frecuentes interrupciones
del servicio al cliente. Con toda esta información el analisis de
rendimiento y estado del servidor MySQL se hace mucho más llevadera.
Espero os sea de ayuda. Tabla extraída y traducida de
[http://blogs.techrepublic.com.com/opensource/?p=56](http://blogs.techrepublic.com.com/opensource/?p=56 "10 MySQL variables that you should monitor | Linux and Open Source | TechRepublic.com").
