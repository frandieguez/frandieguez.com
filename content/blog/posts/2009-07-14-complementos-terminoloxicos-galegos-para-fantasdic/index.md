---
id: 286
title: Complementos terminolóxicos galegos para Fantasdic
date: 2009-07-14T18:59:43+00:00
author: Fran Diéguez
excerpt: |
  O aplicativo Fantasdic  é un aplicativo de diccionario que permite buscar palabras dende moitas e diversas fontes. Destinado principalmente ao escritorio de GNOME, pero tamén pode traballar en outras plataformas, incluso en Windows. Fantasdic é software libre e programado na linguaxe de programación Ruby.

  A principal vantaxa que presenta é o sistema de complementos, o que permite de forma sinxela extender o programa para que poida "consumir" datos dende as fontes que desexemos. O único necesario é programar o complemento axeitado.

  Podedes obter a tradución ao galego dende: http://l10n.gnome.org/vertimus/fantasdic/master/po/gl

  Aquí explicarei como instalar os dous complementos que programei para estender o aplicativo e así permitir que poida consumir datos dende http://open-tran.eu e máis do Corpus de Mancomun (www.mancomun.org).
layout: post
published: true
guid: http://www.mabishu.com/blog/?p=242
permalink: /blog/2009/07/complementos-terminoloxicos-galegos-para-fantasdic/
dsq_thread_id:
  - "655370812"
categories:
  - Uncategorized
tags:
  - fantasdic
  - recursos
  - Ruby
  - teminología
---
O aplicativo <a href="http://www.gnome.org/projects/fantasdic">Fantasdic</a> é un aplicativo de diccionario que permite buscar palabras dende moitas e diversas fontes. Destinado principalmente ao escritorio de GNOME, pero tamén pode traballar en outras plataformas, incluso en Windows. Fantasdic é software libre e programado na linguaxe de programación Ruby.
<p style="text-align: left;">A principal vantaxa que presenta é o sistema de complementos, o que permite de forma sinxela extender o programa para que poida “consumir” datos dende as fontes que desexemos. O único necesario é programar o complemento axeitado.</p>
<p style="text-align: left;">Podedes obter a tradución ao galego dende: <a href="http://l10n.gnome.org/vertimus/fantasdic/master/po/gl">http://l10n.gnome.org/vertimus/fantasdic/master/po/gl</a></p>
<p style="text-align: left;">Aquí explicarei como instalar os dous complementos que programei para estender o aplicativo e así permitir que poida consumir datos dende <a href="http://open-tran.eu">http://open-tran.eu</a> e máis do <a href="http://corpus.mancomun.org">Corpus de Mancomun</a> (<a href="www.mancomun.org">www.mancomun.org</a>).</p>
<p style="text-align: left;"></p>

<h4 style="text-align: left;">Instalación de plugins</h4>
<p style="text-align: left;">Iniciar unha vez o fantasdic para que cree o cartafol de configuración do usuario e pechalo.</p>
<p style="text-align: left;">Copiar os seguintes ficheiros .rb no cartafol ~/.fantasdic/sources.</p>
<p style="text-align: left;"><a href="http://www.mabishu.com/blog/wp-content/uploads/2009/07/corpus_mancomun.rb">corpus_mancomun</a>.rb – Complemento para consulta do corpus de corpus.mancomun.org
<a href="http://www.mabishu.com/blog/wp-content/uploads/2009/07/open_tran.rb">open_tran</a> – Complemento para consulta de Open-Tran.eu</p>
<p style="text-align: left;"><img class="size-full wp-image-243 alignnone" title="Fantasdic-0" alt="Fantasdic-0" src="/assets/2009/07/Fantasdic-0.png" width="542" height="384" align="center" /></p>
<p style="text-align: left;">Iniciar o Fantasdic.</p>

<h4 style="text-align: left;">Configuración da orixe</h4>
<p style="text-align: left;">Ir ao menú Editar->Preferencias.</p>
<img class="size-full wp-image-244 alignnone" title="Fantasdic-1" alt="Fantasdic-1" src="/assets/2009/07/Fantasdic-1.png" width="434" height="394" align="center" />
<p style="text-align: left;">Pulsar no botón Engadir no separador Dicionarios.</p>
<p style="text-align: left;"><img class="size-full wp-image-245 alignnone" title="Fantasdic-2" alt="Fantasdic-2" src="/assets/2009/07/Fantasdic-2.png" width="354" height="354" /></p>
<p style="text-align: left;">Abrese un diálogo para meter unha orixe. Seleccionamos en orixe o “Corpus Mancomun” e inserimos un nome para poder diferencialo do resto (p.ex. “Manc. en->gl”),</p>
<p style="text-align: left;"><img class="size-full wp-image-246 alignnone" title="Fantasdic-3" alt="Fantasdic-3" src="/assets/2009/07/Fantasdic-3.png" width="355" height="460" /></p>
<p style="text-align: left;">Vamos ao separador “Bases de datos”, e activamos a que queremos (seleccionamos unha e damoslle ao botón Baixar).</p>
<p style="text-align: left;"><img class="size-full wp-image-247 alignnone" title="Fantasdic-4" alt="Fantasdic-4" src="/assets/2009/07/Fantasdic-4.png" width="336" height="436" />
Xa esta!</p>

<h4 style="text-align: left;">Consultas</h4>
<p style="text-align: left;">Agora para facer consultas seleccionamos no despregábel da dereita a orixe que queiramos e inserimos o termo a buscar.</p>
<p style="text-align: left;"><img class="size-full wp-image-248 alignnone" title="Fantasdic-5" alt="Fantasdic-5" src="/assets/2009/07/Fantasdic-5.png" width="453" height="427" /></p>
