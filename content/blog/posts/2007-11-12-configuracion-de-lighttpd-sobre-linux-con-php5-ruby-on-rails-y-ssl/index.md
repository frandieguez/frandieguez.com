---
id: 219
title: Configuración de Lighttpd sobre Linux con PHP5, Ruby on Rails y SSL
date: 2007-11-12T23:02:03+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/index.php/2007/11/12/configuracion-de-lighttpd-sobre-linux-con-php5-ruby-on-rails-y-ssl/
permalink: /blog/2007/11/configuracion-de-lighttpd-sobre-linux-con-php5-ruby-on-rails-y-ssl/
dsq_thread_id:
  - "671201181"
categories:
  - Web
tags:
  - lighttpd
  - Linux
  - php5
  - rails
  - ssl
---
Recientemente he migrado mi server casero de Apache a Lighttpd, con la eterna promesa de la reducción consumo de recursos, sobre todo para deploys de múltiples aplicaciones en Rails. No se si es una panacea, pero aquí voy a relatar los puntos más algidos sobre la configuración de un server de estas características, así como mis valoraciones iniciales e intermedias.

Primer comentar que mi principal objetivo era conseguir una configuración lo más simplificada y menos estresante de cara a minimizar el tiempo de configuracion. Lighttpd es inmediato en GNU/Linux, y con pocos pasos tenemos un server para desarrollo muy bueno.

Vamos allá.<!--more-->
## Instalación
Partimos de una Debian estable en la que ya había corriendo, como digo, un apache 2.0 del que últimamente no estaba muy contento ya que, mi server está muy limitado en recursos de memoria. Recientemente he encontrado un módulo de 64 Mb más, por lo que el server se quedaría con 200 mb de memoria física, que para un server casero no está nada mal.

Pues como siempre se instala un server y despues de limpiar la configuración anterior de apache en command line:

```
sudo aptitude install lighttpd openssl mysql php5-cgi
```

Instalo php5-cgi para utilizar el módulo fastcgi del lighty. Listo ya esta nuestro server instalado.
## Configuración
Aquí configuraremos el soporte de PHP y Ruby para despues configurar nuestros virtual hosting, de forma muy simple, y el soporte para SSL.

El php5 ya lo tenemos instalado de antes, por lo que no voy a explicar como se hace, pero la decisión de instalar PHP5 es simple, ahora no hay soporte para PHP4 y además la versión PHP5 tiene muchisimas mejoras respecto a su antecesor. Si alguno de vosotros prefiere PHP4 la instalación es muy parecida a esta y resulta trivial.
Editamos el archivo /etc/lighttpd/lighttpd.conf y añadimos el soporte para fastcgi
```server.modules = (
            "mod_access",
            "mod_alias",
            "mod_accesslog",
            "mod_fastcgi",
[....]
```

Ahora configuraremos el módulo fastcgi en el archivo /etc/lighttpd/conf-available/10-fastcgi.conf

```
fastcgi.server = ( ".php" =>
 ((
 	"bin-path" => "/usr/bin/php5-cgi", # ruta al wrapper php5-cgi, php4-cgi
 	"socket" => "/tmp/php.socket",     # ruta al socket de php
 	"max-procs" => 2,				   # numero máximo de procesos
 	"idle-timeout" => 20,
 	"bin-environment" => (
 		"PHP_FCGI_CHILDREN" => "4",
 		"PHP_FCGI_MAX_REQUESTS" => "10000"
 	),
 	"bin-copy-environment" => (
 		"PATH", "SHELL", "USER"
 	),
 	"broken-scriptfilename" => "enable"
 ))
```

y ahora la configuración para aplicaciones rails

```
".fcgi" =>
	( "dominio.com" =>
	  (
      "socket" => "/tmp/rails-new.socket",
      "bin-path" => "/var/www/rails_app/public/dispatch.fcgi", #ruta al dispatcher rails
      "bin-environment" => ( "RAILS_ENV" => "production" )
    )
	)
)
```

Reiniciamos el server

```bash
/etc/init.d/lighttpd restart
```

Y ya tenemos un lighty con php5

Ahora podemos configurar distintos hosting de forma muy muy simple, y además muy intuitiva, así como de distintos subdominios. Editamos el archivo /etc/lighttpd/lighttpd.conf y añadimos según convenga:

```
$HTTP["host"] == "subdominio.dominio.com" { server.document-root = "/var/www/subdominio.dominio.com/" }
$HTTP["host"] == "sub.dominio.com" { server.document-root = "/var/www/dominio.com/subdominio" }
$HTTP["host"] == "dominio2.es" { server.document-root = "/var/www/dominio2.es/" }
```

Como veis la configuración es inmediata.

## SSL

Activaremos aquí el soporte para cifrado de la conexión para que ciertas zonas de nuestro server tengan más seguridad, aquí teneis un <a title="Manual configuración y generación de certificados SSL en Lighttpd" href="http://www.varlogarthas.net/blog/2007/03/installing-a-godaddy-ssl-certi.html">manual más extenso de generación de certificados para lighttpd</a>
```
$SERVER["socket"] == "dominio.com:443" {
	ssl.engine = "enable"
	ssl.pemfile = "/etc/lighttpd/dominio.com/dominio.com.pem" #certificado del servidor
	ssl.ca-file = "/etc/lighttpd/dominio.com/CA_issuing.crt" #certificado intermedio
	server.name = "dominio.com"
	server.document-root = "/home/lighttpd/dominio.com/https" # path del servidor
	server.errorlog = "/var/log/lighttpd/dominio.com/serror.log"
	accesslog.filename = "/var/log/lighttpd/dominio.com/saccess.log"
}
```

Reiniciamos el server
```
/etc/init.d/lighttpd restart
```
Y si nada ha fallado tenemos nuestro lighttpd totalmente funcional.

## Recursos y Valoración
Mi valoración inicial es que el lighttpd, de primeras es mucho más fácil de administrar (bajo mi punto de vista), lógicamente bajo el recorte de funcionalidades respecto a apache, la configuración si se lee resulta muy intuitiva y con solo leerla aprendes la forma de configuración.
En cuanto al consumo de recursos, en mi server sin iniciar ningún servidor de aplicaciones, en este caso mongrel, el consumo de memoria se redujo un 30%, es decir

## Mas información
Podeis encontrar más información en la página <a title="Página oficial del servidor lighttpd" href="www.lighttpd.net">www.lighttpd.net</a>