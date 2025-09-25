---
id: 167
title: 'Script de corrección de CHARSETS utf-8 mal exportados'
description: 'Script de corrección de CHARSETS utf-8 mal exportados'
publishDate: 2007-07-23T22:32:10+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/2007/07/23/script-de-correccion-de-charsets-utf-8-mal-exportados/
permalink: /blog/2007/07/script-de-correccion-de-charsets-utf-8-mal-exportados/
dsq_thread_id:
  - "655370743"
categories:
  - Uncategorized
tags:
  - bases de datos
  - bash
  - exportado
  - script
  - utf-8
---
Estuve esta tarde trabajando en la migración de la web de <a href="http://www.glug.es" title="Grupo de Usuarios de Linux da Galiza">www.glug.es</a> a Drupal 5, desde un Drupal 4.6, vamos todo un reto. He tenido una serie de complicaciones al exportar la base de datos ya que tiene un charset latin1_swedish_ci y un collate latin1 pero que no hay manera de que me lo exporte bien por lo que los acentos, las ñ y todo car&aacute;cter que no estea en ASCII lo pilla mal, por lo que como soy un vago, pero un Vago Bueno™, me puse manos a la obra y me he currado un cutre script en bash que me convierte la gran base de datos de la web citada. Aquí os lo dejo para regocijo del personal:
```bash
#!/bin/bash
cp $1 $(basename $1 .sql)."orig.sql";
echo "";
echo "Script de corrección de CHARSETS utf-8 mal exportados";
echo "         ---- Creado por Fran Diéguez ---";
echo "               --- Versión 0.1 ---";

echo "Vocais Acentuadas...";
    echo "	- Efectuando substitución de &aacute;";
        sed "s/Ã¡/&aacute;/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
        sed "s/ã¡/&aacute;/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substitución de é";
        sed "s/Ã©/é/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1
        sed "s/ã©/é/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substitución de í";
        sed "s/Ã­/í/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
        sed "s/ã­/í/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
        sed "s/ÃƒÂ­/í/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substitución de ó";
        sed "s/Ã³/ó/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1
        sed "s/ã³/ó/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substitución de ó";
        sed "s/Ã“/ó/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
        sed "s/ã“/ó/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substitución de ú;";
        sed "s/Ãº/ú;/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
        sed "s/ãº/ú;/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
echo "Vocais acentuadas maiú;sculas...";
    echo "	- Efectuando substitución de &aacute;";
        sed "s/Ã/&aacute;/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
        sed "s/Ã/&aacute;/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substitución de é";
        sed "s/Ã‰/é/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substitución de í";
        sed "s/Ã/í/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substitución de ó";
        sed "s/Ã“/ó/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substitución de ú;";
        sed "s/Ãš/ú;/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
echo "Vocais Especiais...";
    echo "	- Efectuando substitución de à";
        sed "s/Ã /à/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substitución de õ";
        sed "s/Ãµ/õ/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substitución de ü";
        sed "s/Ã¼/ü/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
        sed "s/ã¼/ü/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substitución de ê";
        sed "s/Ãª/ê/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substitución de ô";
        sed "s/Ã´/ô/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substitución de õ";
        sed "s/Ãµ/õ/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substitución de ç";
        sed "s/Ã§/ç/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
echo "Letras especiais...";
    echo "	- Efectuando substitución de ñ";
        sed "s/Ã±/ñ/g" $1 > temp.sql;
        sed "s/ã±/ñ/g" $1 > temp.sql;

        &aacute;±
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substitución de º";
        sed "s/Âº/º/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substitución de ª";
        sed "s/Âº/º/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substitución de z";
        sed "s/ã§/z/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
        ã§
echo "Signos de puntuación..."
    echo "	- Efectuando substitución de ¡";
        sed "s/Â¡/¡/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substitución de ¿";
        sed "s/Â¿/¿/g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substitución de <espacio>";
        sed "s/Â / /g" $1 > temp.sql;
        rm $1;
        mv temp.sql; $1;
echo "Todavía faltan algú;ns car&aacute;cteres - sigo no traballo...";
echo "Para m&aacute;is información vai a www.mabishu.com";
```
