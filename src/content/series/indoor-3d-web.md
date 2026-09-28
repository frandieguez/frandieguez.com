---
id: indoor-3d-web
title: "Indoor 3D on the Web"
description: "Rendering interactive indoor maps in the browser with MapLibre and Three.js — the depth buffer, the camera maths, and the performance budget that makes it work on a phone."
featured: true
---

Three.js and MapLibre each assume they own the WebGL context. Putting them in the
same canvas, with a shared depth buffer and two cameras that have to agree on
where the world is, is where most of the real work lives.

This series documents that setup end to end: the custom layer that hands Three.js
a frame without breaking MapLibre's render loop, the projection maths for keeping
the two cameras synchronised, and the budget that keeps an indoor map at 60fps on
hardware nobody writes benchmarks for.
