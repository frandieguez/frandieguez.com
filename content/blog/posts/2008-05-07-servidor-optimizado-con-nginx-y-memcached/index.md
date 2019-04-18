---
id: 251
title: Web Server optimizado con Nginx (Nginx I)
date: 2008-05-07T19:58:40+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/?p=129
permalink: /blog/2008/05/servidor-optimizado-con-nginx-y-memcached/
dsq_thread_id:
  - "654568633"
categories:
  - System Administration
  - Web
tags:
  - debian
  - Linux
  - nginx
  - servidor
  - web server
---
<div class="aligncenter">

[![](/assets/nginx-black-logo.jpg "Nginx Server")](/assets/nginx-black-logo.jpg)
</div>

Este post inicia una serie de post sobre [Nginx](http://wiki.codemongers.com/NginxEs "Wiki de Nginx en Español"),
instalación, configuración y optimización todo fruto de el trasteo, la
búsqueda de la máxima optimización, en parte impulsada por la
limitación de recursos en general de el servidor en el que tengo
alojada este humilde site. En mi incursión en optimizar tanto el
rendimiento como el consumo de memoria en mi servidor casero he estado
probando [Nginx](http://wiki.codemongers.com/NginxEs "Wiki de Nginx en Español"). Despues de muchas pruebas y de escuchar en la red que era el mejor servidor.

Pero vayamos y echemos un ojo a todo de esta maravilla rusa.
[Nginx](http://wiki.codemongers.com/NginxEs "Wiki de Nginx en Español")
("engine x") es un servidor HTTP y proxy inverso de alto rendimiento, y
un servidor proxy para IMAP/POP3/SMTP. Nginx fue desarrollado por Igor
Sysoev para Rambler.ru, el segundo sitio web más visitado de Rusia,
donde ha estado, y sigue, funcionando en producción más de dos años y
medio. Igor ha lanzado el código fuente bajo una licencia estilo BSD.
Nginx es conocido por su estabilidad, gran conjunto de características,
configuración simple, y bajo consumo de recursos. Nginx en estos
momentos está haciendo mucho ruído precisamente porque para el caso de
montar servidores web es muy rápido, sino el mejor, sirviendo estáticos,
esto sumado a la posibilidad de configurar servidores proxy web
inversos, nos permite tener un servidor con un rendimiento increíble y
lo más importante y lo que más me impactó, en sólo 4 mben runtime.

Nginx es usualmente utilizado como reemplazo de apache que gestiona muchas conexiones concurrentes, como servidor proxy de balanceo de carga, como servidor proxy de mail, entre otros. Dejemonos de alabanzas y procedamos a la instalación del mismo. En el momento que escribo tanto [Debian Testing como Sid](http://wiki.codemongers.com/InstallingFromDebianRepositories?highlight=\(debian\) "Installation Nginx on Deban Testing and Unstable") tienen unas versiones desfasadas  tiene nginx en su repositorio pero es una versión algo desfasada, 0.4.13, por lo que vamos a compilar e instalar la última versión.
Antes de nada instalaremos unas cuantas dependencias:

```bash
sudo aptitude install libpcre3 libpcre3-dev libpcrecpp0 libssl-dev zlib1g-dev
```

Hecho esto, ahora procedemos a recoger los fuentes, compilar y configurar.

Por defecto nginx se instala en /usr/local/nginx, aunque es un buen sitio, esto significa que el binario principal de nginx se podrá encontrar en /usr/local/nginx/sbin/nginx, la cual no es un lugar común del path por defecto en *nix.

```bash
wget http://sysoev.ru/nginx/nginx-0.6.30.tar.gz
tar xvzf nginx-0.6.30.tar.gz
...
cd nginx-0.6.30/
# hay muchas mas opciones, <a title="Opciones de Configuración de Compilación de Nginx" href="http://wiki.codemongers.com/NginxInstallOptions">Configuring Options</a>
./configure --sbin-path=/usr/local/sbin --with-http_ssl_module
```

```bash
make
...
sudo make install
```
con esto ya tenemos instalado nuestro servidor y se puede testear. Aunque vamos a  hacer que nginx sea nuestro servidor por defecto y crear un script de control en /etc/init.d/nginx con el que podremos reiniciar, iniciar, detener y hacer que cargue la configuración
```bash
sudo vim /etc/init.d/nginx
```

```bash
#! /bin/sh

### BEGIN INIT INFO
# Provides:          nginx
# Required-Start:    $all
# Required-Stop:     $all
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts the nginx web server
# Description:       starts nginx using start-stop-daemon
### END INIT INFO

PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
DAEMON=/usr/local/sbin/nginx
NAME=nginx
DESC=nginx

test -x $DAEMON || exit 0

# Include nginx defaults if available
if [ -f /etc/default/nginx ] ; then
        . /etc/default/nginx
fi

set -e

case "$1" in
  start)
        echo -n "Starting $DESC: "
        start-stop-daemon --start --quiet --pidfile /usr/local/nginx/logs/nginx.pid \
                --exec $DAEMON -- $DAEMON_OPTS
        echo "$NAME."
        ;;
  stop)
        echo -n "Stopping $DESC: "
        start-stop-daemon --stop --quiet --pidfile /usr/local/nginx/logs/nginx.pid \
                --exec $DAEMON
        echo "$NAME."
        ;;
  restart|force-reload)
        echo -n "Restarting $DESC: "
        start-stop-daemon --stop --quiet --pidfile \
                /usr/local/nginx/logs/nginx.pid --exec $DAEMON
        sleep 1
        start-stop-daemon --start --quiet --pidfile \
                /usr/local/nginx/logs/nginx.pid --exec $DAEMON -- $DAEMON_OPTS
        echo "$NAME."
        ;;
  reload)
      echo -n "Reloading $DESC configuration: "
      start-stop-daemon --stop --signal HUP --quiet
          --pidfile /usr/local/nginx/logs/nginx.pid \
          --exec $DAEMON
      echo "$NAME."
      ;;
  *)
        N=/etc/init.d/$NAME
        echo "Usage: $N {start|stop|restart|force-reload}" >&amp;2
        exit 1
        ;;
esac

exit 0
```
Le damos permisos de ejecución al script anterior y hacemos que arranque con el sistema por defecto en todos los runlevels:
```shell
sudo chmod +x /etc/init.d/nginx
```

```shell
sudo /usr/sbin/update-rc.d -f nginx defaults
```

```shell
Adding system startup for /etc/init.d/nginx ...
   /etc/rc0.d/K20nginx -> ../init.d/nginx
   /etc/rc1.d/K20nginx -> ../init.d/nginx
   /etc/rc6.d/K20nginx -> ../init.d/nginx
   /etc/rc2.d/S20nginx -> ../init.d/nginx
   /etc/rc3.d/S20nginx -> ../init.d/nginx
   /etc/rc4.d/S20nginx -> ../init.d/nginx
   /etc/rc5.d/S20nginx -> ../init.d/nginx
```

Con esto ya tendremos nginx totalmente integrado en nuestro server Debian. El siguiente post hablaré de configurar virtualhosts y configurar php
