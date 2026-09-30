---
id: 276
title: Configuración desatendida de servers con Capistrano
description: "De un Debian recién instalado a una máquina con Apache, MySQL, SSH endurecido e iptables, sin tocar el teclado del servidor. Capistrano no es sólo para desplegar aplicaciones."
publishDate: 2008-12-26T17:39:20+00:00
author: Fran Dieguez
layout: post
published: false
draft: true
lang: "es"
tags: ["capistrano", "debian", "sysadmin", "automatizacion"]
categories:
  - Uncategorized
---
Soy vago, lo reconozco, y por eso hago lo máximo por trabajar lo mínimo en una tarea repetitiva y ciertas veces cansina. En esta ocasión voy a enseñar el modo de convertir un server con Debian pelado en una máquina con Apache, MySQL, SSH e iptables sin llegar a tocar el teclado del servidor.

La herramienta es Capistrano. Casi todo el mundo la conoce como «eso con lo que se despliegan aplicaciones Rails», pero en el fondo no es más que una forma cómoda de ejecutar órdenes por SSH en una o varias máquinas a la vez. Que lo que ejecutes sea un `git pull` o un `apt-get install` le da exactamente igual.

## Por qué molestarse

Montar un servidor a mano se hace en media hora. El problema no es la primera vez: es la tercera, cuando ya no te acuerdas de si en el anterior habías desactivado el login de root o sólo lo pensaste.

Un servidor configurado a mano es un servidor que nadie puede reproducir, ni siquiera tú. Y el día que se muere, la única documentación de cómo estaba montado es el propio servidor muerto.

## Lo mínimo

```bash
$ gem install capistrano
$ capify .
```

Eso deja un `Capfile` y un `config/deploy.rb`. Para lo que nos ocupa, el `deploy.rb` se queda casi vacío:

```ruby
set :application, "servidor-nuevo"
set :user, "root"
set :use_sudo, false

role :servers, "192.168.1.50"

# Sin esto Capistrano intenta hacer cosas de despliegue que aquí no tocan.
set :scm, :none
set :deploy_via, :copy
```

Y las tareas en un fichero aparte, porque esto va a crecer:

```ruby
# config/tasks/bootstrap.rb
namespace :bootstrap do

  desc "Actualiza el sistema base"
  task :update, :roles => :servers do
    run "apt-get update"
    run "DEBIAN_FRONTEND=noninteractive apt-get -y upgrade"
  end

  desc "Instala Apache y PHP"
  task :apache, :roles => :servers do
    run "DEBIAN_FRONTEND=noninteractive apt-get -y install apache2 libapache2-mod-php5 php5-mysql"
    run "a2enmod rewrite"
    run "/etc/init.d/apache2 restart"
  end

end
```

El `DEBIAN_FRONTEND=noninteractive` es la pieza que hace que todo esto funcione. Sin él, `apt-get` abre un diálogo de configuración en mitad de la instalación y la tarea se queda colgada esperando una respuesta que nadie va a dar, porque no hay nadie delante.

## MySQL y la contraseña que no se puede teclear

MySQL es el caso donde eso se ve más claro: durante la instalación pregunta por la contraseña de root. Con `debconf-set-selections` se le responde antes de que pregunte:

```ruby
desc "Instala MySQL sin preguntar nada"
task :mysql, :roles => :servers do
  password = Capistrano::CLI.password_prompt("Contraseña de root de MySQL: ")

  run "echo 'mysql-server-5.0 mysql-server/root_password password #{password}' | debconf-set-selections"
  run "echo 'mysql-server-5.0 mysql-server/root_password_again password #{password}' | debconf-set-selections"
  run "DEBIAN_FRONTEND=noninteractive apt-get -y install mysql-server"
end
```

`Capistrano::CLI.password_prompt` pide la contraseña por terminal sin mostrarla y sin que quede en el historial. La alternativa —ponerla en el fichero— acaba en el repositorio, y de ahí no sale nunca más.

## SSH: la parte que de verdad importa

Un servidor recién instalado acepta login de root por contraseña, y los bots lo saben. Vale la pena mirar `/var/log/auth.log` de una máquina que lleve un día en internet para entender la prisa.

```ruby
desc "Endurece la configuración de SSH"
task :ssh, :roles => :servers do
  run "sed -i 's/^#\\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config"
  run "sed -i 's/^#\\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config"
  run "sed -i 's/^#\\?PermitEmptyPasswords.*/PermitEmptyPasswords no/' /etc/ssh/sshd_config"
  run "/etc/init.d/ssh reload"
end
```

Aquí hay un orden que **no** se puede equivocar, y es el error que se comete una vez en la vida: si desactivas el login por contraseña antes de haber subido tu clave pública y haber comprobado que funciona, te acabas de dejar fuera de tu propio servidor. Y como esto va por SSH, no hay forma de arreglarlo por SSH.

```ruby
desc "Sube la clave pública (hazlo ANTES de bootstrap:ssh)"
task :authorized_keys, :roles => :servers do
  key = File.read(File.expand_path("~/.ssh/id_rsa.pub"))
  run "mkdir -p ~/.ssh && chmod 700 ~/.ssh"
  put key, "/root/.ssh/authorized_keys", :mode => 0600
end
```

Y el hábito que ahorra disgustos: deja una sesión SSH abierta mientras tocas la configuración. Si algo sale mal, esa sesión sigue viva y te permite deshacerlo. La sesión abierta no la corta un `reload`.

## iptables

```ruby
desc "Reglas básicas de firewall"
task :firewall, :roles => :servers do
  rules = <<-RULES
    *filter
    :INPUT DROP [0:0]
    :FORWARD DROP [0:0]
    :OUTPUT ACCEPT [0:0]
    -A INPUT -i lo -j ACCEPT
    -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
    -A INPUT -p tcp --dport 22 -j ACCEPT
    -A INPUT -p tcp --dport 80 -j ACCEPT
    -A INPUT -p tcp --dport 443 -j ACCEPT
    -A INPUT -p icmp -j ACCEPT
    COMMIT
  RULES

  put rules, "/etc/iptables.rules"
  run "iptables-restore < /etc/iptables.rules"
  put "#!/bin/sh\niptables-restore < /etc/iptables.rules\n", "/etc/network/if-pre-up.d/iptables", :mode => 0755
end
```

Fíjate en que el puerto 22 se acepta **antes** de cualquier otra cosa, y en que la línea de `ESTABLISHED,RELATED` está la primera de todas. Con `INPUT DROP` por defecto y sin esa línea, la respuesta a tus propias conexiones salientes se descarta y el servidor se queda sin poder hacer ni un `apt-get update`.

Y lo de `if-pre-up.d` es lo que hace que las reglas sobrevivan a un reinicio. `iptables-restore` solo se aplica en memoria; sin ese script, el primer reboot te deja la máquina abierta de par en par sin que nada avise.

## Todo junto

```ruby
desc "Servidor completo desde cero"
task :all do
  bootstrap.update
  bootstrap.authorized_keys
  bootstrap.apache
  bootstrap.mysql
  bootstrap.firewall
  bootstrap.ssh        # el último, a propósito
end
```

```bash
$ cap bootstrap:all
```

Unos minutos, y la máquina queda igual que la anterior. Que es el objetivo de todo esto: no ahorrar la media hora, sino que la segunda máquina sea idéntica a la primera sin depender de que yo me acuerde de nada.

## Dónde se queda corto

Capistrano ejecuta órdenes; no describe estados. Si lanzas `bootstrap:apache` dos veces, se ejecuta dos veces — con `apt-get` no pasa nada, con un `sed` sobre un fichero de configuración sí puede pasar.

Eso es exactamente lo que resuelven Puppet y Chef, que en lugar de una lista de órdenes declaran cómo debe quedar la máquina y se encargan de llegar ahí desde donde esté. Para un parque de servidores es el camino.

Para dos o tres máquinas, Capistrano y un fichero de tareas que puedo leer entero en un minuto me siguen pareciendo el equilibrio correcto. Sobre todo porque ya estaba instalado.
