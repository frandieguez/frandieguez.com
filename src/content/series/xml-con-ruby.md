---
id: xml-con-ruby
title: "Procesado de XML con Ruby"
description: "Analizar documentos XML en Ruby: la diferencia entre tree parsing y stream parsing, cuándo conviene cada uno, y cómo se escriben ambos."
lang: "es"
---

Dos formas de leer un XML que no compiten entre sí: cargar el árbol entero en
memoria y recorrerlo, o procesarlo como flujo y reaccionar a los eventos según
pasan.

La primera parte explica la diferencia y cuándo conviene cada una — que casi
siempre se decide por el tamaño del documento, no por gusto. La segunda baja al
código.
