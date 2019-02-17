---
id: 163
title: El arte del criquet
date: 2007-07-17T22:38:54+00:00
author: Fran Diéguez
layout: post
published: true
guid: http://www.mabishu.com/blog/2007/07/17/el-arte-del-criquet/
permalink: /blog/2007/07/el-arte-del-criquet/
dsq_thread_id:
  - "677483668"
categories:
  - Uncategorized
---
<pre lang="php">&lt;?php while ( $bateador_eliminado != TRUE) {
    while ($numero_de_overs &lt; X) {
      while ($numero_de_bolas &lt;= 6 ) {
        $batea = lanzador_lanza_bola();
        switch ($bate) {
          case 'Batea bien y manda la bola al quinto carallo':
            bateador_corre();
            break;
          case 'batea mal y alguien del otro equipo la pilla':
            joderse_y_aguantarse();
            break;
          case 'batea y algguien pilla la bola sin que bote':
            bateador_eliminado =  TRUE;
            joderse_y_aguantarse();
            break;
          case 'el lanzador le pega a los palitos':
            bateador_eliminado = TRUE;
            joderse_y_aguantarse();
            break;
        }
        numero_de_bolas++;
      }
      numero_de_overs++;
    }
  }
?&gt;</pre>