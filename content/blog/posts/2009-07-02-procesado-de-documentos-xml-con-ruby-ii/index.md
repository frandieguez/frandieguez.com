---
id: 279
title: Procesado de documentos XML con Ruby (II)
date: 2009-07-02T10:10:10+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/?p=232
permalink: /blog/2009/07/procesado-de-documentos-xml-con-ruby-ii/
dsq_thread_id:
  - "657940118"
categories:
  - Uncategorized
---
Continuamos con el procesado de documentos XML con Ruby pero esta vez vamos a utilizar otro parser proporcionado en REXML.

La plase StreamParser delega la gestión de nodos en un XML a una clase definida por el usuario, la clase non será más que un Listener que implementa unas funciones predefinidas. Otra de las ventajas que ofrece StreamParser es que no hace falta cargar el flujo XML de forma íntegra en memoria, haciéndolo especialmente aconsejable para tratamientos de flujos XML muy grandes o para entornos con pocos recursos, el análisis de este flujo se hace de forma progresiva. La desventaja principal es que tenemos que asegurarnos que el flujo XML de entrada es válido ya que StreamParser no lo gestiona, en caso contrario el Listener no funcionará correctamente.

Con un poco de metaprogramación podemos analizar como funciona un parser de flujos XML, para ello aprovechamos la método method_missing que es llamado cada vez que un método no está definido dentro de un módulo o clase, de esta forma podemos hacer lo siguiente:
<pre lang="ruby">require "net/http"
require "rexml/document"
include REXML

class NovasListener
  def method_missing(method_id, *args)
    puts "El método #{method_id.id2name} fue llamado"
  end
end

Document.parse_stream(
  Net::HTTP.get("www.mabishu.com", "/blog/feed/rss/"),
  NovasListener.new
)</pre>

Esto produce algo como:
<pre lang="ruby">El método xmldecl fue llamado
El método comment fue llamado
El método text fue llamado
El método tag_start fue llamado
El método text fue llamado
[...]</pre>
Como se puede ver lo que hace el parser es llamar a funciones que deberían estar definidas en nuestra clase Listener:
<ul>
	<li>text(contenido): para crear un handler de contenido text</li>
	<li>tag_start(nombre_tag, atributos) : para detectar el inicio de un elemento con nombre nombre_tag y atributos</li>
	<li>tag_end(nombre_tag : para detectar el fin de un elemento con nombre nombre_tag</li>
	<li>...</li>
</ul>
Luego con la clase Listener podemos gestionar los datos de forma gradual. Esta clase es de mucha ayuda para consumir servicios web que impliquen descargar un XML muy grande y a la hora de minimizar tanto el tiempo como los recursos de computación de procesado del mismo.

Espero en breve escribir una entrada que ejemplifique de forma concreta el comportamiento de este parser.
