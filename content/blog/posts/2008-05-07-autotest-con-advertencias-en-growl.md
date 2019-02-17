---
id: 250
title: Autotest con advertencias en Growl
date: 2008-05-07T03:15:02+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/?p=130
permalink: /blog/2008/05/autotest-con-advertencias-en-growl/
dsq_thread_id:
  - "653780943"
categories:
  - Uncategorized
tags:
  - autotest
  - growl
  - mac os
  - rails
  - Ruby
  - testing
---
He buscado en la red un m&eacute;todo para "enganchar" la utilidad de testeo Autotest en Ruby y el sistema de mensajes de sistema Growl en Mac OS X y la verdad es que no me fue muy bien.
Una vez modificado el archivo .autotest en mi $home ya funciona a la perfecci&oacute;n. Relato a continuaci&oacute;n como obtener esta maravilla.
Basta instalar Growl en Mac OS tal que as&iacute;:
<pre>wget http://growl.info/files/Growl-1.1.2.dmg
open Growl-1.1.2.dmg
cd /Volumes/Growl 1.1.2/Extras/growlnotify
less install.sh
sudo ./install.sh
cd
hdiutil detach /Volumes/Growl 1.1.2</pre>
y luego descargarte un par de im&aacute;genes para hacer los mensajes un poco m&aacute;s bonitos
<pre lang="shell">cd ~
wget http://blog.internautdesign.com/files/rails_fail.png
wget http://blog.internautdesign.com/files/rails_ok.png
mkdir -p Pictures/Rails_Growl/
mv rails_fail.png Pictures/Rails_Growl/rails_fail.png
mv rails_ok.png Pictures/Rails_Growl/rails_ok.png</pre>
luego se edita el fichero .autotest que he modificado un poquillo
<pre lang="ruby">require 'autotest/redgreen'
require 'autotest/html_report'
require 'autotest/menu'
module Autotest::Growl

  def self.growl msg, options={}
    salida = "growlnotify -n autotest --image "#{options[:img]}"
                   -p #{options[:pri]} -d #{rand(100)} -m "#{msg}" "Tests" #{options[:sticky]}"
    system salida
  end

  Autotest.add_hook :ran_command do |at|
    results = [at.results].flatten.join("n")
    output = results.slice(/(d+)s+assertions?,s*(d+)s+failures?,s*(d+)s+errors?/)
    failures = $~[3].to_i + $~[2].to_i
    options = (failures > 0)? {:img=>"/Users/#{ENV["USER"]}/Pictures/Rails/fail.png",
                                            :pri => 0, :sticky => "" } :
                                           { :img => "/Users/#{ENV["USER"]}/Pictures/Rails/ok.png",
                                             :pri => 0,:sticky => "" }
    output = output.gsub(/assertions/, "aserciones").gsub(/failures/, "fallos").gsub(/errors/, "errores")
    if output
      growl "#{output}", options
    end
  end
end
</pre>
y listo ya podemos correr test en apps ruby y que se nos notifique en growl
<pre style="text-align: center;"><a href="http://mabishu.com/blog/wp-content/uploads/2008/05/imagen-1.png"><img class="aligncenter size-full wp-image-131" title="Autotest con Growl" src="http://www.mabishu.comwp-content/uploads/2008/05/imagen-11.png" alt="Autotest con Growl" width="344" height="105" /></a></pre>