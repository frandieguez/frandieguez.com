---
id: 278
title: Procesado de documentos XML con Ruby (I)
date: 2009-06-26T11:25:43+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/?p=215
permalink: /blog/2009/06/procesado-de-documentos-xml-con-ruby-i/
dsq_thread_id:
  - "654660152"
categories:
  - Uncategorized
---
Uno de los problemas al lidiar con documentos XML es el análisis de los mismos y la representación del resultado en nuestros programas. Actualmente hai dos formas de análisis de esquemas: el análisis en árbol (tree parsing) y el análisis de flujos (stream parsing). En este artículo tratare el primer caso utilizando una de las librerías estándar de <a href="http://www.ruby-lang.org/es/">Ruby</a> llamada <a href="http://www.germane-software.com/software/rexml/">REXML</a>.
Un analizador en árbol lee el documento XML completo y represente su árbol en memoria.

La forma más sencilla de convertir un documento XML en un árbol no prodría ser más fácil.
<pre lang="ruby">require "rexml/document"
include REXML

doc = Document.new("&lt;verdad-verdadera>Ya llega el veranito&lt;/verdad-verdadera>")
print doc.root.name, ": ", doc.root.text, "\n"</pre>
Esto produce:
<pre lang="plain">verdad-verdadera: Ya llega el veranito</pre>
Al llamar Document.new() con este ejemplo estamos convirtiendo una cadena de texto en una instancia de la clase Document, pero el metodo new() acepta parámetros de distintos tipos:
<ul>
	<li>Las instancias de la clase REXML::Document simplemente se copiarán</li>
	<li>Las cadenas que contienen documentos XML se analizarán y serán convertidas en instancias de la clase REXML::Document.</li>
	<li>Las instancias de la clase IO serán leídas y analizadas. Por ejemplo para analizar un fichero llamado ejemplo.xml, deberías llamar a:</li>
</ul>
<pre lang="ruby">Document.new(File.new("ejemplo.xml"))</pre>
Para acceder a los elementos o atributos de un nodo existen un par de funciones que nos va a ser de mucha ayuda:
<ul>
	<li>.elements es una función que nos devuelve un array con los elementos hijo que contiene un nodo. por lo que podemos iterar sobre ellos.</li>
</ul>
<pre lang="ruby">document.root.elements.each do |hijo|
	puts hijo.text
end</pre>
<ul>
	<li>.attributes es una función que nos devuelve un hash con los atributos y sus valores correspondientes al elemento desde el que se llama.</li>
	<li>.text si el elemento a analizar es un nodo con texto o con texto y más elementos hijos podemos extraer sólo la parte plana con esta función.</li>
</ul>
Hay que tener en cuenta que los índices de los elementos REXML comienzan por 1, y no por 0, por lo que para recoger el primer hijo del elemento raíz deberías llamar a document.root.elements[1] o tambien documento.root[0] (nótese que en este caso si que es 0).

Teneis mucha más documentación en <a href="http://www.ruby-doc.org/core/classes/REXML.html">http://www.ruby-doc.org/core/classes/REXML.html</a>
