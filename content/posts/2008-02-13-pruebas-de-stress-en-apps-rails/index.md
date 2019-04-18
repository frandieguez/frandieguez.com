---
id: 246
title: Pruebas de Stress en Apps Rails
date: 2008-02-13T21:49:36+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/index.php/2008/02/13/pruebas-de-stress-en-apps-rails/
permalink: /blog/2008/02/pruebas-de-stress-en-apps-rails/
dsq_thread_id:
  - "653873385"
categories:
  - System Administration
tags:
  - ab
  - autobench
  - httperf
  - pruebas
  - rendimiento
---
Muchas veces cuando estas en las fases de pruebas, y cuando tu aplicación se supone que va a soportar grandes flujos de peticiones, querrías testear la misma antes de ponerla en producción.

Como es lógico, estas pruebas sería materialmente imposible hacerlas uno mismo, ya que seríamos incapaces manualmente de generar suficientes peticiones como para saber los límites de rendimiento de nuestros proyectos.
Para esto hay utilidades que ya no solo podemos testear aplicaciones con Rails, si no también cualquier aplicación web  escrita en el lenguaje de tu elección.
### Aplicaciones de stress

Entonces, desechada la opción de enviarle un mail a todos tus familiares y conocidos para que prueben la app. Vamos a echar un ojo al mundo del software libre para ver los recursos que nos brinda:

### <a href="http://jakarta.apache.org/jmeter/" title="JMeter">JMeter</a>

JMeter aunque un tanto engorroso de configurar, es un gran aliado. Después de trabajar un poco con el se entiende bastante bien y se llega a aprovechar mucho su uso. Adem&aacute;s permite trabajar como proxy HTTP para capturar las solicitudes y repetirlas
### <a href="http://httpd.apache.org/docs/2.0/programs/ab.html">ab - Apache HTTP server benchmarking tool</a>
ab permite realizar mú;ltiples peticiones GET o POST contra un servidor. Las peticiones las podemos hacer en modo secuencial o, como a nosotros nos interesa en esta ocasión, de modo concurrente, de la misma forma que podemos hacer que las peticiones sean independientes o de forma que esten en la misma sesión.

### <a href="http://www.hpl.hp.com/research/linux/httperf/" title="httperf benchmarking tool">httperf</a>

Este proyecto tiene muchas opciones para "machacar" a los servidores, donde puedes simular "r&aacute;fagas" de "usuarios" conectados de forma concurrente, simula muy bien las sesiones al estilo de los navegadores HTTP actuales.

Adem&aacute;s las estadísticas que reporta son muy completas, donde podemos ver porcentaje de uso de CPU, tiempos de respuesta y muchas m&aacute;s cosas.

### <a href="http://www.xenoclast.org/autobench/" title="Autobench benchmarking tool">Autobench</a>

Esta es una abstracción de httpref, no es m&aacute;s que un script escrito en Perl para automatizar la medición del comportamiento. Es b&aacute;sicamente incrementar el nú;mero de peticiones o nivel de concurrencia conforme pase el tiempo y analizar cambios bruscos en las peticiones.
El nivel de detalle de este llega al punto de crear gr&aacute;ficas, geniales para su mejor lectura.

En todos los casos tienes que buscarte un poco la vida y trabajar un poco el * --help, ya que la documentación es mas bien escasa, yo empezaría por estudiarte la <a href="http://www.w3.org/Protocols/rfc2616/rfc2616.html" title="Especificación de HTTP/1.1">RFC2616 - HTTP/1.1 Specification</a>.

En definitiva, y bajo mi punto de vista Autobench est&aacute; muy bien por la utilidad de las gr&aacute;ficas, y para todo lo dem&aacute;s httperf se comporta muy bien.
