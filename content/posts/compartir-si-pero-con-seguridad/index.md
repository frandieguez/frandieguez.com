---
id: 155
title: 'Compartir sí, pero con seguridad'
date: 2007-07-01T18:26:24+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/2007/07/01/compartir-si-pero-con-seguridad/
permalink: /blog/2007/07/compartir-si-pero-con-seguridad/
dsq_thread_id:
  - "664594500"
categories:
  - Uncategorized
---
<p class="subhd">Siempre que utilizas una red heterogénea y quieres compartir recursos entre los distintos sistemas, y cuando es el caso en que coexisten sistemas GNU/Linux con Windows la mejor forma es utilizando <a title="Samba - compartiendo recursos con Windows" href="http://us3.samba.org/samba/">Samba</a>. Y una de las formas más comodas para tener un recurso en local es utilizando sambafs y montarlo en algun directorio local. Bueno pero, ¿como puedo montar mi directorio remoto en Linux?</p>
<p class="subhd">Es muy fácil. primero tenemos que instalar samba y smbfs los cuales nos permitiran acceder y ofrecer recursos en red con sistemas Windows, montandolos en local en el segundo caso.</p>
<p class="subhd">El primer paso es crear el punto de montaje, p. ej.:</p>

```mkdir /media/samba```

A continuación, con samba podemos montar en el directorio haciendo algo como esto

```bash
mount -t smbfs -o username=[TU NOMBRE USUARIO],ip=[IP],workgroup=[grupo] \
//[EQUIPO QUE LO COMPARTE]/[RECURSO COMPARTIDO] [RUTA de MONTAJE]
```

Lógicamente tienes que substituir [TU NOMBRE USUARIO] por el nombre de usuario de la maquina remota que lo comparte,  [ip] por la ip del equipo que lo comparte y por último la cadena [grupo] con el grupo que la comparte.

Por ejemplo para montar en /media/samba el recurso compartido Incoming del equipo fry del dominio DOMINIO se hace así:

```bash
mount -t smbfs -o username=miusuario,ip=10.0.0.10,workgroup=DOMINIO \
//fry/Incoming /media/samba
```

Para desmontar el directorio, escribe:

```umount /mnt/myhome```

Y si eres uno de los mios, personas paranoicas con la seguridad aunque sea en local, es posible crear un tunel ssh con mi montaje samba.Lo siguiente hace lo que he dicho, lo cual aumenta la seguridad de una forma radical.

```bash
ssh -f -N -L 9900:fry:139 miusuario@fry
```

```bash
mount -t smbfs -o username=miusuario,port=9900 \
//localhost/miusuario /punto.de.montaje.local
```

El segundo comando necesita que lo ejecutes como root (via sudo u otros). Serás preguntado por una contraseña que será  la contraseña del usuario remoto. Por supuesto tienes que substituir miusuario con tu nombre de usuario remoto, punto.de.montaje.local con tu punto de montaje local Linux, y fry con tu servidor de ficheros remoto. Puedes utilizar un puerto local distinto al 9900.
