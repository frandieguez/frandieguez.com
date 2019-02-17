---
id: 167
title: 'Script de corrección de CHARSETS utf-8 mal exportados'
date: 2007-07-23T22:32:10+00:00
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
Estuve esta tarde trabajando en la migraci&oacute;n de la web de <a href="http://www.glug.es" title="Grupo de Usuarios de Linux da Galiza">www.glug.es</a> a Drupal 5, desde un Drupal 4.6, vamos todo un reto. He tenido una serie de complicaciones al exportar la base de datos ya que tiene un charset latin1_swedish_ci y un collate latin1 pero que no hay manera de que me lo exporte bien por lo que los acentos, las ñ y todo car&aacute;cter que no estea en ASCII lo pilla mal, por lo que como soy un vago, pero un Vago Bueno™, me puse manos a la obra y me he currado un cutre script en bash que me convierte la gran base de datos de la web citada. Aqu&iacute; os lo dejo para regocijo del personal:
<pre lang="bash">#!/bin/bash
cp $1 $(basename $1 .sql)."orig.sql";
echo "";
echo "Script de correcci&oacute;n de CHARSETS utf-8 mal exportados";
echo "         ---- Creado por Fran Di&eacute;guez ---";
echo "               --- Versi&oacute;n 0.1 ---";

echo "Vocais Acentuadas...";
    echo "	- Efectuando substituci&oacute;n de &aacute;";
        sed "s/Ã¡/&aacute;/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
        sed "s/ã¡/&aacute;/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substituci&oacute;n de &eacute;";
        sed "s/Ã©/&eacute;/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1
        sed "s/ã©/&eacute;/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substituci&oacute;n de &iacute;";
        sed "s/Ã­/&iacute;/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
        sed "s/ã­/&iacute;/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
        sed "s/ÃƒÂ­/&iacute;/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substituci&oacute;n de &oacute;";
        sed "s/Ã³/&oacute;/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1
        sed "s/ã³/&oacute;/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substituci&oacute;n de &oacute;";
        sed "s/Ã“/&oacute;/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
        sed "s/ã“/&oacute;/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substituci&oacute;n de &uacute;";
        sed "s/Ãº/&uacute;/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
        sed "s/ãº/&uacute;/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
echo "Vocais acentuadas mai&uacute;sculas...";
    echo "	- Efectuando substituci&oacute;n de &aacute;";
        sed "s/Ã/&aacute;/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
        sed "s/Ã/&aacute;/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substituci&oacute;n de &eacute;";
        sed "s/Ã‰/&eacute;/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substituci&oacute;n de &iacute;";
        sed "s/Ã/&iacute;/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substituci&oacute;n de &oacute;";
        sed "s/Ã“/&oacute;/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substituci&oacute;n de &uacute;";
        sed "s/Ãš/&uacute;/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
echo "Vocais Especiais...";
    echo "	- Efectuando substituci&oacute;n de à";
        sed "s/Ã /à/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substituci&oacute;n de õ";
        sed "s/Ãµ/õ/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substituci&oacute;n de ü";
        sed "s/Ã¼/ü/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
        sed "s/ã¼/ü/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substituci&oacute;n de ê";
        sed "s/Ãª/ê/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substituci&oacute;n de ô";
        sed "s/Ã´/ô/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substituci&oacute;n de õ";
        sed "s/Ãµ/õ/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substituci&oacute;n de ç";
        sed "s/Ã§/ç/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
echo "Letras especiais...";
    echo "	- Efectuando substituci&oacute;n de ñ";
        sed "s/Ã±/ñ/g" $1 &gt; temp.sql;
        sed "s/ã±/ñ/g" $1 &gt; temp.sql;

        &aacute;±
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substituci&oacute;n de º";
        sed "s/Âº/º/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substituci&oacute;n de ª";
        sed "s/Âº/º/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substituci&oacute;n de z";
        sed "s/ã§/z/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
        ã§
echo "Signos de puntuaci&oacute;n..."
    echo "	- Efectuando substituci&oacute;n de ¡";
        sed "s/Â¡/¡/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substituci&oacute;n de ¿";
        sed "s/Â¿/¿/g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
    echo "	- Efectuando substituci&oacute;n de <espacio>";
        sed "s/Â / /g" $1 &gt; temp.sql;
        rm $1;
        mv temp.sql; $1;
echo "Todav&iacute;a faltan alg&uacute;ns car&aacute;cteres - sigo no traballo...";
echo "Para m&aacute;is informaci&oacute;n vai a www.mabishu.com";
</espacio></pre>