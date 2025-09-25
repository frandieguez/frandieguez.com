---
id: 204
title: Wireless Atheros del MacBook en GNU/Linux
description: Wireless Atheros del MacBook en GNU/Linux
publishDate: 2007-09-30T18:49:48+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/index.php/2007/09/30/wireless-atheros-del-macbook-en-gnulinux/
permalink: /blog/2007/09/wireless-atheros-del-macbook-en-gnulinux/
dsq_thread_id:
  - "655370756"
categories:
  - System Administration
tags:
  - atheros
  - Linux
  - madwifi
  - wireless
---
<div class="alignright">

![](./madwifi-logo-20070907.png)
</div>

Aquí está la segunda entrega de instalación de nuestro sistema operativo favorito, GNU/Linux. Como amante del software libre no me canso de recomendar este sistema, y en el tiempo que llevo los problemas que se presentan siempre son recursivos:
<ul>
	<li><strong>instalación de software,</strong> llegados a un punto de práctica suficiente se solventa con un ./configure, make, make install para el caso de los tarball y un dpkg -i para los archivos deb, en el caso de los paquetes de debian.</li>
	<li><strong>configuración de hardware, </strong>este es el tema más peliagudo que le veo a GNU/Linux, la gente inexperta se desespera al tener una máquina que no funciona del todo.</li>
</ul>
Siguiendo la temática del último punto hoy instalaremos la tarjeta inalámbrica con chipset Atheros del Macbook de la segunda hornada (Core 2 Duo). Al principio era mucho, mucho más complicado, de hecho no hace más de 6 meses todavía no había soporte teniendo que tirar de una llave usb para tener conectividad sin cables. Hoy día no solo tenemos soporte para esta tarjeta que se identifica en nuestro sistema facendo un

```shell
$ lspci -vvxxx
02:00.0 Network controller: Atheros Communications, Inc.
AR5418 802.11a/b/g/n Wireless PCI Express Adapter (rev 01)
Control: I/O+ Mem+ BusMaster+ SpecCycle- MemWINV-
VGASnoop- ParErr- Stepping- SERR- FastB2B-
Status: Cap+ 66MHz- UDF- FastB2B- ParErr- DEVSEL=fast >TAbort- SERR-
00: 8c 16 24 00 07 00 10 00 01 00 80 02 40 00 00 00
10: 04 00 10 50 00 00 00 00 00 00 00 00 00 00 00 00
20: 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00
30: 00 00 00 00 40 00 00 00 00 00 00 00 0b 01 00 00
```

sino que tenemos soporte para cifrado de los datos en modos WEP y WPA, aunque algún inconveniente tenía que tener, la señal de recepción se va a ver disminuída.

Pero dejémonos de literatura e instalemos los drivers de la tarjeta:

**¿Que requerimos?**
1. Lógicamente necesitamos nuestro MacBook Core 2 Duo para llevar a cabo la instalación del driver.</li>
2. Una distribución Linux funcional, yo lo estoy haciendo sobre una Debian, pero este manual también funcionaría para una Ubuntu, Fedora, Slack, o cualquier otro sabor que os apetezca de GNU/Linux. Yo personalmente recomiendo Debian para los que entiendan un poco de GNU/Linux, o Ubuntu para los que no tengan tanta idea.
3. El driver que lo descargaremos desde el mismo repositorio de los señores de <a title="Driver para tarjetas Atheros en GNU/Linux" href="http://www.madwifi.org">madwifi.org</a>. El siguiente comando ejecutado en una consola descargará el driver en la carpeta madwifi

```shell
svn checkout http://svn.madwifi.org/madwifi/trunk madwifi
```

**¿Como instalamos?**

Muy fácil, vamos por pasos para los newbies totales:
1. Entramos en el directorio donde hemos descargado los fuentes anteriores
```
cd madwifi
```
- procederemos a la instalación para lo cual necesitaremos las herramientas de compilación:
```
sudo aptitude install build-essential
```
- y haremos la instalación propiamente dicha
```
make &amp;&amp;  sudo make install
```
- activamos la tarjeta en el kernel.
```
sudo modprobe ath_pci
```
- y ya tenemos nuestra tarjeta funcionando, no sobraría instalar las utilidades wireless, para poder explorar redes y demás, e incluso si utilizais algún entorno de ventanas utilizaríamos el network-manager que es una interfaz de configuración de tarjetas alámbricas e inalámbricas para dummies.

UPDATE: si todavía sigues sin ver tu tarjeta con un ifconfig lo más probable es que no se hayan cargado los módulos del kernel (tranquilo ahora lo explico). Digamos que el módulo en este caso es un driver y para que se carge cada vez que inicias el ordenador bastaría incluir al final del archivo /etc/modules la siguiente linea:

```
ath_pci
```

Algunas veces (incluso a mí) al descargar el módulo desde el repositorio svn no me ha funcionado y siempre lo he solventado bajandolo desde [Madwifi-ng														](http://snapshots.madwifi.org/madwifi-ng/) y eligiendo una snapshot de hace unos días. Esto es infalible.
