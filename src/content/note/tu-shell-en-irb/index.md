---
id: 191
title: Tu shell en irb
description: "Un script corto que convierte irb en una shell de sistema, sin perder nada de lo que da Ruby."
publishDate: 2007-09-04T20:26:25+00:00
lang: es
author: Fran Dieguez
layout: post
published: true
guid: http://www.mabishu.com/blog/index.php/2007/09/04/tu-shell-en-irb/
permalink: /blog/2007/09/tu-shell-en-irb/
dsq_thread_id:
  - "981832476"
categories:
  - Programming
tags:
  - ruby
  - coding
---
Con este simple script una vez que estas en la shell de ruby (irb) puedes simular una shell de sistema con todas sus ventajas.
```ruby
alias old_method_missing method_missing
def method_missing(name, *args)
        exname = name.to_s
        found = false
        ENV["PATH"].split(':').each { |path|
		if File.executable?(File.join(path, exname))
                        found = true
			break
		end
	}
	if found
		Process.wait Process.fork { exec(exname, *args) }
	else
		old_method_missing(name, *args)
        end
end
```
