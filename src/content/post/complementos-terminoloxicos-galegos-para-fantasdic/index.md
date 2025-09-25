---
id: 286
title: Complementos terminolóxicos galegos para Fantasdic
description: Complementos terminolóxicos galegos para Fantasdic
publishDate: 2009-07-14T18:59:43+00:00
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
  - Open Source
tags:
  - fantasdic
  - recursos
  - Ruby
  - teminología
---
O aplicativo <a href="http://www.gnome.org/projects/fantasdic">Fantasdic</a> é un aplicativo de diccionario que permite buscar palabras dende moitas e diversas fontes. Destinado principalmente ao escritorio de GNOME, pero tamén pode traballar en outras plataformas, incluso en Windows. Fantasdic é software libre e programado na linguaxe de programación Ruby.

A principal vantaxa que presenta é o sistema de complementos, o que permite de forma sinxela extender o programa para que poida “consumir” datos dende as fontes que desexemos. O único necesario é programar o complemento axeitado.

Podedes obter a tradución ao galego dende: <a href="http://l10n.gnome.org/vertimus/fantasdic/master/po/gl">http://l10n.gnome.org/vertimus/fantasdic/master/po/gl</a>

Aquí explicarei como instalar os dous complementos que programei para estender o aplicativo e así permitir que poida consumir datos dende <a href="http://open-tran.eu">http://open-tran.eu</a> e máis do <a href="http://corpus.mancomun.org">Corpus de Mancomun</a> (<a href="www.mancomun.org">www.mancomun.org</a>).

## Instalación de plugins

Iniciar unha vez o fantasdic para que cree o cartafol de configuración do usuario e pechalo.
Copiar os seguintes ficheiros .rb no cartafol ~/.fantasdic/sources.

- [corpus_mancomun.rb](./corpus_mancomun.rb) – Complemento para consulta do corpus de corpus.mancomun.org
- [open_tran.rb](./open_tran.rb) – Complemento para consulta de Open-Tran.eu

![Fantasdic-0](./Fantasdic-0.png)

Iniciar o Fantasdic.

## Configuración da orixe
Ir ao menú Editar->Preferencias.

![Fantasdic-1](./Fantasdic-1.png)

Pulsar no botón Engadir no separador Dicionarios.

![Fantasdic-2](./Fantasdic-2.png)

Abrese un diálogo para meter unha orixe. Seleccionamos en orixe o “Corpus Mancomun” e inserimos un nome para poder diferencialo do resto (p.ex. “Manc. en->gl”),

![Fantasdic-3](./Fantasdic-3.png)

Vamos á lapela “Bases de datos”, e activamos a que queremos (seleccionamos unha e damoslle ao botón Baixar).

![Fantasdic-4](./Fantasdic-4.png)

Xa esta!

## Consultas
<p style="text-align: left;">Agora para facer consultas seleccionamos no despregábel da dereita a orixe que queiramos e inserimos o termo a buscar.</p>

![Fantasdic-5](./Fantasdic-5.png)
