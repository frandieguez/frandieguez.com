---
id: 199
title: Cocinando el kernel Linux para Macbook Core 2 Duo
description: Cocinando el kernel Linux para Macbook Core 2 Duo
publishDate: 2007-09-22T19:53:15+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/index.php/2007/09/22/cocinando-el-kernel-linux-para-macbook-core-2-duo/
permalink: /blog/2007/09/cocinando-el-kernel-linux-para-macbook-core-2-duo/
dsq_thread_id:
  - "653706395"
categories:
  - Uncategorized
tags:
  - compilaciÃ³n
  - core 2 duo
  - kernel
  - Linux
  - macbook
---

<div class="alignright">

![Kernel linux tux](./korg10yr.gif)
</div>

Hoy toca compilar, aquí relato como compilar el kernel Linux para que todo en nuestra Mac funcione a la perfección.

Antes de nada decir que tengo un Macbook Core 2 Duo, es decir con un Intel con dos núcleos a 1 Gb cada uno y que tiene un lenguaje interno de 64 bits, tarjeta wireless Atheros 802.11n, y tarjeta Intel 945GM.

Haremos funcionar desde el TouchPad con soporte para taps y scroll, hasta el modo suspend, pasando por el ahorro de energía de los procesadores, el mapeo de teclas del teclado (incluída la tecla fn), el Firewire, la tarjeta wireless atheros, y la aceleración 3D.

El método que utilizo yo es para Debian y derivados (siii... Ubuntu está aquí) y al final del artículo incluyo el .deb para los señores vagos así como el .config necesario para configurar vuestro kernel, pero para este último teneis que aplicar los parches del kernel de <a href="http://www.mactel-linux.org"> Mactel-linux.org</a>

Vamos por pasos:
- Primero miraremos que hardware tenemos, para ello tiraremos de un
```bash
$ lspci -nn
00:00.0 Host bridge [0600]: Intel Corporation Mobile 945GM/PM/GMS/940GML and 945GT Express Memory Controller Hub [8086:27a0] (rev 03)
00:02.0 VGA compatible controller [0300]: Intel Corporation Mobile 945GM/GMS/940GML Express Integrated Graphics Controller [8086:27a2] (rev 03)
00:02.1 Display controller [0380]: Intel Corporation Mobile 945GM/GMS/940GML Express Integrated Graphics Controller [8086:27a6] (rev 03)
00:07.0 Performance counters [1101]: Intel Corporation Unknown device [8086:27a3] (rev 03)
00:1b.0 Audio device [0403]: Intel Corporation 82801G (ICH7 Family) High Definition Audio Controller [8086:27d8] (rev 02)
00:1c.0 PCI bridge [0604]: Intel Corporation 82801G (ICH7 Family) PCI Express Port 1 [8086:27d0] (rev 02)
00:1c.1 PCI bridge [0604]: Intel Corporation 82801G (ICH7 Family) PCI Express Port 2 [8086:27d2] (rev 02)
00:1d.0 USB Controller [0c03]: Intel Corporation 82801G (ICH7 Family) USB UHCI #1 [8086:27c8] (rev 02)
00:1d.1 USB Controller [0c03]: Intel Corporation 82801G (ICH7 Family) USB UHCI #2 [8086:27c9] (rev 02)
00:1d.2 USB Controller [0c03]: Intel Corporation 82801G (ICH7 Family) USB UHCI #3 [8086:27ca] (rev 02)
00:1d.3 USB Controller [0c03]: Intel Corporation 82801G (ICH7 Family) USB UHCI #4 [8086:27cb] (rev 02)
00:1d.7 USB Controller [0c03]: Intel Corporation 82801G (ICH7 Family) USB2 EHCI Controller [8086:27cc] (rev 02)
00:1e.0 PCI bridge [0604]: Intel Corporation 82801 Mobile PCI Bridge [8086:2448] (rev e2)
00:1f.0 ISA bridge [0601]: Intel Corporation 82801GBM (ICH7-M) LPC Interface Bridge [8086:27b9] (rev 02)
00:1f.1 IDE interface [0101]: Intel Corporation 82801G (ICH7 Family) IDE Controller [8086:27df] (rev 02)
00:1f.2 IDE interface [0101]: Intel Corporation 82801GBM/GHM (ICH7 Family) Serial ATA Storage Controller IDE [8086:27c4] (rev 02)
00:1f.3 SMBus [0c05]: Intel Corporation 82801G (ICH7 Family) SMBus Controller [8086:27da] (rev 02)
01:00.0 Ethernet controller [0200]: Marvell Technology Group Ltd. 88E8053 PCI-E Gigabit Ethernet Controller [11ab:4362] (rev 22)
02:00.0 Network controller [0280]: Atheros Communications, Inc. Unknown device [168c:0024] (rev 01)
03:03.0 FireWire (IEEE 1394) [0c00]: Agere Systems FW323 [11c1:5811] (rev 61)
```
Con este comando sabremos todo el hardware que tenemos en nuestro sistema y para analizándolo un poco tendremos la suerte de observar que TODO ESTA SOPORTADO salvo la tarjeta inalámbrica Atheros, aunque tiene solución.
Una vez hayamos tenido todo el hardware identificado empezaremos a recolectar el software que necesitamos:

- Kernel: en los momentos que escribo el último kernel estable liberado es el 2.6.22 pero aunque lo he probado todavía está muy verde como para que soporte todo el hardware por lo que cogeré el anterior, 2.6.21.7 .Por lo que lo descargaremos desde <a title="Kernel.org" href="http://www.kernel.org">www.kernel.org</a>. Lo descomprimiremos en /usr/src y crearemos un enlace simbólico hacia la carpeta descomprimida que llamaremos /usr/src/linux
- Parches: ya que queremos que todo el hardware estea soportado al 100% utilizaremos los parches que nos brindan la gente de <a title="Mactel Linux" href="http://www.mactel-linux.org">www.mactel-linux.org</a>: para lo cual utilizaremos un:
```bash
svn co https://svn.sourceforge.net/svnroot/mactel-linux/trunk mactel-linux
```
Lo siguiente será aplicar los parches de mactel a nuestro kernel. Entramos en la carpeta mactel-linux/kernel/mactel-patches-2.6.21 y ejecutaremos ```# ./apply /usr/src/linux``` y ya tenemos nuestro kernel optimizado para nuestro equipo.
- Uno de los archivos que nos hará falta para cocinar el kernel es el archivo .config que es un archivo que almacena una especie de receta de como debe cocinar el ordenador nuestro kernel. Podeis configurarlo vosotros mismos haciendo un ```make menuconfig``` o podeis utilizar <a title="Archivo .config para compilación de kernel Linux en Macbook c2d" href="./config1.txt">el mio</a>. El cual solo habría que copiar en /usr/src/linux y listo.Tened cuidado con mi archivo ya que yo solo le he metido soporte para particiones ext3, así como de HFS+, FAT y NTFS, pero nada de reiserfs, xfs o jfs. Si no sabes lo que son estas cosillas posiblemente no tengas que tocar nada ya que la mayoría de las distribuciones toman como formato por defecto el ext3. Además si utilizas kvm también he incluído como módulo el kvm especial para este procesador Intel

- Bien, tenemos todos los ingredientes preparados para cocinar, vayamos al fogón. Entramos en la carpeta /usr/src/linux y hacemos un
```bash
fakeroot make-kpkg --initrd kernel_linux
```
- Ahora toca esperar, a mi en la Mac me tarda sobre unos 4 minutillos pero todo depende desde donde lo compileis, recuerdo hace tiempo donde compilar un kernel tardaba más de 30 minutos, que nostalgia y que cafelotes me tomaba.
- Si todo acaba bien tendreis generado u paquete .deb que contiene el nuevo kernel optimizado para las MacBooks C2D de 64 bits, y que a la hora de instalarlo generará el initramfs y lo pondrá como kernel por defecto al inicial el sistema.
- Ahora solo bastaría instalarlo en el equipo que querais con un</li>

Pero si os sentís un poco vagos hoy podeis coger <a href="/blog/uploads/2007/09/linux-image-26217-mactel-macbook-c2d-v11.deb"><em><strong>mi paquete generado del kernel</strong></em></a> que solo tendréis que instalar con el último comando

```bash
dpkg -i nombre_del_archivo_del_kernel.deb
```

En la siguiente entrega hablaré de como generar el modulo del kernel para que funcione la tarjeta inalámbrica gracias al driver de <a href="http://www.madwifi.org">MadWifi</a>
