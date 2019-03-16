---
id: 252
title: 'Configuraciónn de VirtualHosts en Nginx (Nginx II)'
date: 2008-05-08T12:13:36+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/?p=132
permalink: /blog/2008/05/configuracion-de-virtualhosts-en-nginx-con-php-5-nginx-ii/
dsq_thread_id:
  - "654696099"
categories:
  - System Administration
  - Web
tags:
  - nginx
  - PHP
  - servidor web
  - virtualhost
  - webserver
---
Echa la compilación de nuestro nginx ahora voy a explicar mas o menos mi sistema para gestionar virtualhosts con nginx. Primero de todo, suelo meter los virtualhosts en /opt en el que crearemos el esqueleto para cada slice.

Configuramos nginx para virtualhosts utilizando ficheros separados para cada uno de ellos:

```mkdir -p /usr/local/nginx/conf/{sites-available,sites-enabled}```

Substituímos con lo siguiente en el fichero /usr/local/nginx/conf/nginx.conf, para que lea todos los ficheros en sites-enabled y de paso lo limpiamos:
<pre lang="php">user www-data;
worker_processes  1; #Nú;mero de workers configurable segú;n necesidades

error_log  /var/log/nginx/error.log;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    access_log  /var/log/nginx/access.log;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;
    tcp_nodelay        on;

    gzip  on;

    include /etc/nginx/sites-enabled/*;

}</pre>
LLegados a este punto ya tenemos nuestro nginx preparado para servir cualquiera de los distintos tipos de servidores que soporta (web, proxy web inverso, mail, balanceo de carga). Como aquí nos centraremos en configurar un servidor web con virtualhosts, sigo relatando las operaciones.


<!--more-->

Como dije suelo poner mis webs en /opt por lo que crearé el "raiz" del servidor con toda su estructura interna
<pre><code>#Creamos carpeta general y la default donde alvergar los est&aacute;ticos por defecto del servidor
mkdir -p /opt/sites/default
#Creamos la estructura interna virtualhost default
mkdir -p /opt/sites/default/{public,private,logs,cgi-bin,backup}</code></pre>
Ahora tenemos que configurar el virtualhost con sus par&aacute;metros y configuracion, he aquí el mio con soporte para php5:
<pre lang="php">server {
	listen 80;
	server_name virtualhost.com;
	rewrite ^/(.*) http://www.virtualhost.com/$1 permanent;
}
server {
    listen       80;
    server_name www.virtualhost.com;
    root /opt/sites/default/;
    #charset koi8-r;

    access_log  /opt/sites/virtualhost.com/logs/default.access.log;
    error_log   /opt/sites/virtualhost.com/logs/default.error.log;
    location / {
    	# autoindex on;
        root   /opt/sites/default/virtualhost;
        index  index.php index.html index.htm;
	# Si el fichero existe sirvelo
        if (-f $request_filename) {
		break;
	}
        # Si el directorio existe, sirvelo
        if (-d $request_filename) {
            break;
        }
    }
    error_page  404              /404.html;
    location = /404.html {
    	root /opt/sites/virtualhost.com/errors;
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
	    root   /opt/sites/virtualhost.com/errors;
    }

    location ~ /\.ht {
        deny  all;
    }
}</pre>
