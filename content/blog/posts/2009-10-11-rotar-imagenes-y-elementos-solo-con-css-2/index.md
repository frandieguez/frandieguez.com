---
id: 290
title: Rotar imágenes y elementos solo con CSS
date: 2009-10-11T17:22:24+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/?p=280
permalink: /blog/2009/10/rotar-imagenes-y-elementos-solo-con-css-2/
dsq_thread_id:
  - "653704630"
categories:
  - Web
tags:
  - css
  - html
  - javascript
  - Web
---
Sabías que se pueden rotar imagenes (y cualquier elemento HTML) utilizando solo CSS?
Añade estas clases CSS a tus elementos HTML para rotarlos en pasos de 90 grados.
```css
.rot0 {
  -webkit-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  rotation: 0deg;
  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=0);
}
.rot90 {
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  rotation: 90deg;
  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);
}
.rot180 {
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  rotation: 180deg;
  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=2);
}
.rot270 {
  -webkit-transform: rotate(270deg);
  -moz-transform: rotate(270deg);
  filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=3);
}
```

También puedes establecer el origen de la rotación para Firefox y Safari utilizando lo siguiente:
```css
.rotate-me {
       -moz-transform-origin: 0 0;
       -webkit-transform-origin: 0 0;
}
```

La rotación para Internet Explorer funciona un podo distinto y por lo tanto no hay origen de la rotación. El elemento es simplemente rotado y alineado por su nueva dimensión, en el flujo de la página.

Debajo puedes ver una prueba de rotación de una imagen poniendo los separadores de navegación en la izquierda de la página. Estoy seugor que hay muchas más alicaciones que pueden ser de utilidade, por ejempo: rotar el texto de una feche en un artículo.

<img class="size-full wp-image-283" title="css-rotation-screen-shot" src="/assets/css-rotation-screen-shot.png" alt="Rotación de imagenes con css" width="400" height="323" />

Este es un ejemplo que funciona con navegadores basados en gecko como Safari o Safari Mobile en el iPhone, Firefox 3.5 e Internet Explorer 5.5 y superiores.
