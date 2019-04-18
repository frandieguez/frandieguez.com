---
id: 274
title: Búsqueda avanzada de archivos con find, locate y grep
date: 2008-12-08T16:44:47+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/?p=185
permalink: /blog/2008/12/busqueda-avanzada-de-archivos-con-find-locate-y-grep/
dsq_thread_id:
  - "653991029"
categories:
  - System Administration
tags:
  - console
  - find
  - grep
  - Linux
  - locate
  - terminal
  - unix
---
Todos los que trabajamos asiduamente con un terminal no podemos evitar
en algún momento lidiar con la tarea de búsqueda de archivos por nombre
o incluso por contenido, incluso podemos querer ejecutar comandos con
los resultados obtenidos. Utilizaremos estos dos comandos: find, locate,
grep.

### Find

Busca en un directorio seleccionado segun unos modificadores
proporcionados entre los que podemos destacar

  - **-iregex** para buscar con una expresión regular sin tener en
    cuenta las mayusculas/minúsculas
  - **-regex** para buscar con unha expresión regular teniendo en cuenta
    las mayusculas/minúsculas
  - **-name** para buscar segun un nombre dado se puede proporcionar una
    expresión regular
  - **-empty** para buscar ficheros vacíos
  - **-user** para buscar arquivos que pertenecen a un usuario
    determinado
  - **-group** para buscar arquivos que pertenecen a un grupo de sistema
    determinado
  - **-atime -mtime etc.** utiliza el tiempo de modificación, acceso,
    creación... de los archivos
  - **-executable** **** para buscar archivos con el flag de ejecutable
  - **-type \[letra\]** para buscar archivos \[letra\]=f , directorio
    \[letra\]=d, enlaces simbólicos \[letra\]=l, ficheros socket
    \[letra\]=s

además también proporciona modificadores de acción, esto es, modificadores que le dicen al comando que hacer con los resultados

  - \-print imprime el nombre de archivo completo en la salida estándar
  - \-exec {} ejecuta el comando seleccionado en {}
  - \-delete borra el archivo

Ejemplos prácticos: find . -exec grep "www.athabasca" '{}' \\; -print \#busca la cadena "www.athabasca" dentro del contenido de los archivos del directorio actual y los imprime

```shell
    find . -name "rc.conf" -exec chmod o+r '{}' \;
    #le cambia el modo a o+r a los archivos con nombre rc.conf en el directorio actual

    find . -perm -g+w,u+w ! -perm -o+w
    #busca los archivos que son escribibles por el propietario o su grupo, pero no el resto
```
### Locate

Locate supone un salto en el rendimiento respecto al comando find siempre y cuando busquemos los archivos por su nombre. La razón del rendimiento de locate es que utiliza un índice de nombres de archivos normalmente ubicado en **/var/lib/mlocate/mlocate.db**. Normalmente tódolos los sistemas UNIX tienen una tarea de cron que actualiza dicha base de datos, aún así si queremos actualizarla manualmente podemos ejecutar el comando **updatedb**. Podemos destacar varios modificadores de dicho comando:
- **--limit** limita el número de resultados
- **--count** imprime el número de resultados en vez de los resultados mismos.
- **--regex** busca en
la base de datos según una expresión regular

En la siguiente imagen podemos ver la diferencia de rendimiento entre
find y locate, encontrado
[aquí](http://www.secguru.com/article/quick_tips_find_files_linux_file_system "Quick Tipos find files linux file system"):
<div class="aligncenter">

![Find locate comparison
performance](./findlocatecomparisonke7.png
"findlocatecomparisonke7")
</div>

### Grep

Muy utilizado comando sobre todo utilizando tuberías ( | ), se utilza principalmente para buscar ficheros según el contenido de los mismos. La mejor forma de observar su comportamiento es mediante ejemplos:

```shell
grep 'string' *.txt
#busca la cadena "string" en todos los archivos .txt
grep 'main(' *.c
#busca la cadena "main(" enn todos los archivos .c
grep -i 'ultra' *.conf
#busca la cadena ultra (sin tener en cuenta mayusculas/minúsculas) en los ficheros .conf
grep -iR 'ultra' *.conf
#busca la cadena ultra (sin tener en cuenta mayusculas/minúsculas) en los
  ficheros .conf en el directorio actual y subdirectorios del mismo
```

Y ahora unos truquillos:

```shell
$ grep --color=auto -iR 'getChar();' *.c
#resalta los resultados para ver mejor el texto

$ grep --color=auto -iRnH 'getChar();' *.c
#muestra el nombre de archivo y número de línea donde se encontró la cadena
```

Y ahora combinando find y grep:

```
$ find . -name "*.c" -print | xargs grep "main("
# busca en tódos los ficheros .c la cadena "main)"
```

Como acabamos de ver tenemos diversas posibilidadades, que luego de estudiarnos un poco la sintaxis de los comandos nos harán abandonar las lentas y a veces podo intuitivas GUIs.
