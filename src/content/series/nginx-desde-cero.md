---
id: nginx-desde-cero
title: "Nginx desde cero"
description: "Montar Nginx como servidor web en 2008: primero sirviendo estáticos con memcached delante, después VirtualHosts, y por último PHP 5 por FastCGI."
lang: "es"
---

Cuando escribí esto, Nginx todavía era la alternativa rara: Apache estaba en todas
partes y la documentación en español no existía. La serie va de menos a más, y cada
entrega asume la anterior montada y funcionando.

Empieza por el servidor sirviendo ficheros estáticos con memcached delante, sigue
por alojar varios sitios en la misma máquina con VirtualHosts, y termina enchufando
PHP 5 por FastCGI para servir aplicaciones.
