---
id: 272
title: 'Configuración de PHP 5 en Nginx (Nginx III)'
date: 2008-11-20T19:04:28+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/?p=134
permalink: /blog/2008/11/configuracin-de-php-5-en-nginx-nginx-iii/
dsq_thread_id:
  - "657362008"
categories:
  - Uncategorized
---
<a href="http://mabishu.com/blog/wp-content/uploads/2008/05/nginx-black-logo.jpg"><img class="alignright alignnone size-medium wp-image-133 sinborde" style="float: right;" title="Nginx Server" src="http://mabishu.com/blog/wp-content/uploads/2008/05/nginx-black-logo.jpg" alt="" width="277" height="92" /></a>Continuamos con el periplo de configurar Nginx siguiente con <a title="Web Server optimizado con Nginx" href="http://www.mabishu.com/blog/2008/05/07/servidor-optimizado-con-nginx-y-memcached" target="_blank">las dos</a> <a title="Configuración de VirtualHosts en Nginx" href="http://www.mabishu.com/blog/2008/05/08/configuracion-de-virtualhosts-en-nginx-con-php-5-nginx-ii">anteriores entradas</a>.
Ahora lo que trataremos es de ejecutar nuestras apps o scripts escritos en PHP 5. Let's go.
<h3>Instalación de PHP</h3>
La instalación de PHP no tiene mucha ciencia en GNU/Linux:
<pre>$ sudo apt-get install php5-cli php5-cgi php5-mysql
$ php -v
PHP 5.2.0-8+etch9 (cli) (built: Dec 29 2007 14:49:25)
Copyright (c) 1997-2006 The PHP Group
Zend Engine v2.2.0, Copyright (c) 1998-2006 Zend Technologies</pre>
<h3>Instalación de FastCGI</h3>
Ya que nginx no cuenta con módulo integrado de php, precisamente porque no encuadra en su arquitectura, la ejecución del código PHP lo vamos a hacer a través de FastCGI. Para eso  utilizaremos la implementación que viene con lighttpd. Básicamente lo que haremos será compilar lighttpd, para luego copiar simplemente el spawn-fcgi
<pre>wget http://www.lighttpd.net/download/lighttpd-1.4.18.tar.gz
gunzip lighttpd-1.4.18.tar.gz
tar xvf lighttpd-1.4.18.tar
cd lighttpd-1.4.18/
./configure
make
sudo cp src/spawn-fcgi /usr/bin/spawn-fcgi</pre>
Ahora tendremos que crear un ejecutable:
<pre lang="php">#!/bin/sh
/usr/bin/spawn-fcgi -a 127.0.0.1 -p 9000 -u www-data -f /usr/bin/php5-cgi</pre>
Y su script de control
<pre lang="php">#!/bin/bash
PHP_SCRIPT=/usr/bin/php-fastcgi
RETVAL=0
case "$1" in
    start)
      $PHP_SCRIPT
      RETVAL=$?
  ;;
    stop)
      killall -9 php5-cgi
      RETVAL=$?
  ;;
    restart)
      killall -9 php5-cgi
      $PHP_SCRIPT
      RETVAL=$?
  ;;
    *)
      echo "Usage: php-fastcgi {start|stop|restart}"
      exit 1
  ;;
esac
exit $RETVAL</pre>
al que arreglamos sus permisos y lo hacemos ejecutar al inicio del sistema:
<pre>sudo chmod 755 /etc/init.d/php-fastcgi
sudo chmod 755 /usr/bin/php-fastcgi
sudo /usr/sbin/update-rc.d -f php-fastcgi defaults</pre>
y escribir una serie de parámetros que necesita el spawn para hacer que todo funcione correcto en la comunicación con nginx insertando el siguiente bloque de configuración en
<pre lang="shell">/etc/nginx/fastcgi.conf</pre>
<pre lang="php">fastcgi_param  QUERY_STRING       $query_string;
fastcgi_param  REQUEST_METHOD     $request_method;
fastcgi_param  CONTENT_TYPE       $content_type;
fastcgi_param  CONTENT_LENGTH     $content_length;

fastcgi_param  SCRIPT_NAME        $fastcgi_script_name;
fastcgi_param  REQUEST_URI        $request_uri;
fastcgi_param  DOCUMENT_URI       $document_uri;
fastcgi_param  DOCUMENT_ROOT      $document_root;
fastcgi_param  SERVER_PROTOCOL    $server_protocol;

fastcgi_param  GATEWAY_INTERFACE  CGI/1.1;
fastcgi_param  SERVER_SOFTWARE    nginx;

fastcgi_param  REMOTE_ADDR        $remote_addr;
fastcgi_param  REMOTE_PORT        $remote_port;
fastcgi_param  SERVER_ADDR        $server_addr;
fastcgi_param  SERVER_PORT        $server_port;
fastcgi_param  SERVER_NAME        $server_name;

# PHP only, required if PHP was built with --enable-force-cgi-redirect
fastcgi_param  REDIRECT_STATUS    200;</pre>
bastaría añadir la configuración a nuestro virtual host para tener soporte por fin y finalmente de php
<pre lang="php">location ~ \.php$ {
  fastcgi_pass   127.0.0.1:9000;
  fastcgi_index  index.php;
  fastcgi_param  SCRIPT_FILENAME  /var/www/blog.codefront.net$fastcgi_script_name;
  include        /etc/nginx/fastcgi.conf;
}</pre>
Espero os haya sido productivo.