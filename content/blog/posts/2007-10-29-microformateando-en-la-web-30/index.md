---
id: 213
title: Microformateando en la web 3.0
date: 2007-10-29T18:44:09+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/index.php/2007/10/29/microformateando-en-la-web-30/
permalink: /blog/2007/10/microformateando-en-la-web-30/
dsq_thread_id:
  - "677020991"
categories:
  - Web
tags:
  - microformatos
  - usabilidad
  - web 3.0
---
<img class="alignright" style="text-align: center;" alt="Micrormatos" src="http://www.mabishu.com/wp-content/uploads/2007/10/wiki.png" width="120" height="127" />

No teníamos con suficiente con la revolución 2.0 que nos ha acercado la web más al escritorio, con aplicaciones mucho más amigables y accesibles, e infinitamente más sociables, véase <a title="microformats" href="http://microformats.org/">Facebook</a>, <a title="Bienvenido a Flickr: Intercambio de fotos" href="http://flickr.com/">flickr</a>, <a title="Google Maps" href="http://maps.google.com/">Google Maps</a>; lo que ya está llamando a las puertas la web 3.
<h2>¿Pero que es esto de la web 3.0?</h2>
Básicamente es la web que tenemos añadiéndole una capa de información semántica. Para mortales: hoy día la web es una gran maraña de papeles, enlaces e información sin ordenar, para buscar algo en ella directamente tendrías que recurir al gran hermano, o apañartelas por otros medios. La web 3.0 viene a poner un poco de orden mediante la categorización de los contenidos, de forma que cuando un buscador explore un site sepa exactamente que tema está tratando y clasificarlo en consecuencia.
<h2>¿Que me soluciona?</h2>
"Soluciona" todos los problemas de semántica en una página web, esto es, el propósito de cada párrafo o imagen, o si un bloque es un dirección, un evento, or wherever you what.
<h2>Vale, ¿y como funciona?¿Necesito un nuevo lenguaje?</h2>
Aquí es donde entran los <a title="microformats" href="http://microformats.org/">microformatos</a>. Tranquilo no son nada de otro mundo. ¿Sabes HTML? Entonces sabes Microformatos.

Los microformatos son pedazos de código HTML con las etiquetas usuales a las que se les aplica un tipo de clases (class="") especiales. La gente de microformats.org trabaja colaborativamente para encontrar la forma más optima de etiquetar los diferentes bloques. Entre los consensos que podemos encontrar hCalendar (para definir eventos), hCard (para definir nuestra tarjeta) y muchos más.
<h2>¿Pero si es código HTML para que me sirve a mí?</h2>
A ti no mucho pero imagina las posibilidades que tiene si creas complementos para Firefox que lean esos datos y te los muestren... imagina a los distintos web spiders y navegadores y en como les ayudaría a extraer información de forma automática para utilizar en otras aplicaciones.

Por ejemplo aquí teneis mi tarjeta definida con hCard:
<pre lang="html">&lt;div id="hcard-Fran-Diéguez" class="vcard"&gt;
    &lt;a class="url fn" href="http://www.mabishu.com/blog"&gt;Fran Diéguez&lt;/a&gt;
    &lt;a class="email" href="mailto:fran.dieguez [at] glug [punto] es"&gt;fran.dieguez [at] glug [punto] es&lt;/a&gt;
    &lt;div class="adr"&gt;
        &lt;span class="locality"&gt;Caldas de Reis&lt;/span&gt;
        &lt;span class="region"&gt;Pontevedra&lt;/span&gt;
        &lt;span class="country-name"&gt;Spain&lt;/span&gt;
    &lt;/div&gt;
    &lt;a class="url" href="aim:goim?screenname=pakodieguez"&gt;AIM&lt;/a&gt;
&lt;/div&gt;</pre>
Si quereis más información sobre estos métodos de tageo de bloques HTML pasaros por <a title="Main Page-es - Microformats" href="http://microformats.org/wiki/Main_Page-es">aquí</a> o descargaros esta <a title="pocket-cheat-sheet - Microformats" href="http://microformats.org/wiki/pocketcheatsheet">cheatsheet</a>

&nbsp;