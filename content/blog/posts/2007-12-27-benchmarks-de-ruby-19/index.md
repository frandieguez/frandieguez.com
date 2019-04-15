---
id: 232
title: Benchmarks de Ruby 1.9
date: 2007-12-27T11:20:41+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/index.php/2007/12/27/benchmarks-de-ruby-19/
permalink: /blog/2007/12/benchmarks-de-ruby-19/
dsq_thread_id:
  - "672421657"
categories:
  - Uncategorized
tags:
  - benchmark
  - pruebas
  - rendimiento
  - Ruby
  - ruby 1.9
---
Recientemente ha salido Ruby on Rails versión 2 que todavía estoy estudiando para llevar a cabo un review. Pero ahora mismo voy a mostrar unos pequeños benchmarks de Ruby 1.9, versión recién salida del horno, y que por lo que parece los se va acercando a lenguajes más "enterprise".

Pero vayamos al meollo de la cuestión, inicialmente había pensado en crearme alguna función que cargue el sistema de procesos pero como soy un Vago Bueno™, he deducido que el Makefile del intérprete de Ruby tenía que tener algún sistema de benchmark.

Descargaremos <a title="Nueva versión de Ruby 1.9.0" href="http://www.ruby-lang.org/es/news/2007/12/25/ruby-1-9-0-ya-esta-disponible/">la nueva versión 1.9.0</a> y compilaremos como siempre `./configure && make && make test && make install`. Así que lanzaremos lo siguiente:

```
make benchmark
```

Esta tarea detectará tu versión anterior y ejecutará un elevado número de pruebas comparando la versión recién compilada con la antigua, he aquí un ejemplo que se lleva a cabo.

```ruby
vm1_rescue

i=0
while i&lt;30000000 # while loop 1
  i+=1
  begin
  rescue
  end
end

ruby 1.8.6 (2007-09-24) [universal-darwin9.0]    11.3471548557281
ruby 1.9.0 (2007-12-25 revision 14709) [i686-darwin9.1.0]    1.78452610969543
```

La mejora es evidente, también es verdad que en algunos casos la mejora no es tan sustancial y en otras contadas ocasiones incluso empeora la anterior marca de tiempo. Si queréis ver el reporte completo de mis pruebas os dejo aquí el archivo <a title="Benchmarks de Ruby 1.9" href="http://mabishu.com/temp/wordpress/wp-content/uploads/2007/12/benchmark-ruby19.txt">Benchmarks de Ruby 1.9</a>

Para aquel que esta más interesado en hacer benchmarks de sus scripts, es bueno utilizar <a title="Clase Benchmark de Ruby" href="http://ruby-doc.org/stdlib/libdoc/benchmark/rdoc/index.html">la clase Benchmark</a>, que da muchísimas facilidades para llevar a cabo pruebas de forma muy rápida.

Ahora solo falta que el amado/odiado ActionPack de Ruby on Rails soporte MultiThreading para que volemos. Aunque me está gustando el proyecto <a title="Merb: framework de desarrollo basado en rails multithread" href="http://merb.rubyforge.org/files/README.html">Merb</a>, que a costa de perder alguna mágia este si que es multithread y ya no corre... vuela.

Por cierto que si estás interesado en benchmarks más generales y más fidedignos <a title="RubyChan.de - Benchmarks de Ruby 1.9" href="http://rubychan.de/share/yarv_speedups.html">pasate por esta review</a>.