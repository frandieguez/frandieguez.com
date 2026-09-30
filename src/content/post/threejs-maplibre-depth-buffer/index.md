---
title: "Rendering Three.js on Top of MapLibre Without Breaking the Depth Buffer"
description: "Two renderers, one WebGL context, one depth buffer. The custom layer that hands Three.js a frame, the GL state Three.js quietly takes with it, and why your building disappears behind a wall it is standing in front of."
publishDate: 2026-10-20
lang: "en-GB"
tags: ["threejs", "maplibre", "webgl", "3d"]
seriesId: indoor-3d-web
orderInSeries: 1
draft: true
---
Both MapLibre and Three.js are written on the assumption that they own the WebGL context. Neither is wrong to assume it — it is the only sane default for a renderer — and the entire difficulty of putting a Three.js scene inside a MapLibre map comes from the two of them being right at the same time.

The symptom that brings people here is always the same. The mesh renders, it is in roughly the right place, and it is either in front of everything including the buildings it should be behind, or it vanishes the moment you tilt the camera. That is the depth buffer, and it is being handed back and forth between two libraries that have different opinions about what is in it.

## The custom layer

MapLibre's extension point is a plain object with three methods. It is not a class you extend, which is easy to miss.

```js
const overlay = {
  id: "indoor-3d",
  type: "custom",
  renderingMode: "3d",

  onAdd(map, gl) {
    this.map = map;
    this.camera = new THREE.Camera();
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true,
    });

    // MapLibre owns the frame. Three.js must not clear it.
    this.renderer.autoClear = false;
  },

  render(gl, args) {
    // ...
  },
};

map.addLayer(overlay);
```

Two lines in there do most of the work.

`renderingMode: "3d"` is what puts the layer in MapLibre's 3D pass, where the depth buffer is live. Without it the layer is drawn in the 2D pass with depth testing effectively off, and your mesh floats on top of the world no matter what you do afterwards.

`autoClear = false` stops Three.js wiping the colour and depth buffers before it draws. Leave it on and every frame Three.js erases the map that MapLibre has just finished rendering — you get your mesh on a blank background, which at least fails obviously.

Note also that the renderer is constructed with MapLibre's canvas *and* MapLibre's context. Passing only the canvas makes Three.js create a second context on an element that already has one, and you get `null` back with no useful error.

## The camera is not a camera

This is the part that looks wrong and is correct.

Normally you would set up a `PerspectiveCamera` and give it a position and a target. Here you do not, because MapLibre has already decided where the camera is and hands you the resulting matrix every frame. All Three.js has to do is use it.

```js
render(gl, args) {
  const m = new THREE.Matrix4().fromArray(args.defaultProjectionData.mainMatrix);
  this.camera.projectionMatrix = m.multiply(this.worldTransform);

  this.renderer.resetState();
  this.renderer.render(this.scene, this.camera);
  this.map.triggerRepaint();
}
```

A bare `THREE.Camera` with its `projectionMatrix` overwritten. No field of view, no near and far planes, no `lookAt`. Everything about the view already lives in that matrix, and anything you set on the camera yourself will either be ignored or will fight it.

`this.worldTransform` is what places your scene in the world, and it is the other half of the problem — MapLibre's matrix expects Mercator coordinates, while your model is in metres around the origin. That transform is involved enough to be the next post in this series; for now it is a translation to the Mercator position of your building, a scale by the Mercator units per metre at that latitude, and a rotation to get from Three.js's Y-up to MapLibre's Z-up.

`triggerRepaint()` at the end asks MapLibre for another frame. Without it the map renders on interaction only, and any animation in your scene freezes the instant the user stops dragging.

## The state Three.js takes with it

Here is the actual subject of this post.

`WebGLRenderer` keeps a shadow copy of the GL state so it can skip redundant driver calls — a real and significant optimisation, and the thing that breaks everything here. When MapLibre changes GL state directly, Three.js's copy is stale, and it will happily skip a call it believes is unnecessary.

`renderer.resetState()` discards that cache and forces Three.js to re-set everything it cares about. Call it every frame, before `render`. It is one line and it is the difference between a scene that works and a scene that works only when nothing else is on screen.

The reverse direction matters too, and MapLibre is less forgiving about it than you would hope. Three.js leaves the context configured for Three.js: a bound framebuffer, its own blend equation, possibly `SCISSOR_TEST` enabled, and `depthMask` wherever its last material left it. MapLibre's next layer inherits all of that.

The two that cause visible damage:

```js
render(gl, args) {
  // ... render as above

  // Hand the context back in a state MapLibre recognises.
  gl.depthMask(true);
  gl.disable(gl.SCISSOR_TEST);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}
```

A `depthMask` left `false` by a transparent material means MapLibre's subsequent layers write no depth at all, and the symptom appears in a layer you did not touch — which is why this takes an afternoon to find rather than a minute.

## The depth buffer itself

Now the failure in the title.

MapLibre does not use the full `[0, 1]` depth range. It partitions it, reserving bands for its own passes, and it sets `gl.depthRange` accordingly before drawing. If your Three.js content writes depth values computed against the full range, it is being compared against MapLibre's geometry on a different scale — and the result is a mesh that is correctly positioned in X and Y and wrong in Z, relative to buildings, in a way that changes as you tilt.

The fix is to draw within the same range MapLibre is using rather than to fight it:

```js
onAdd(map, gl) {
  // ...
  this.renderer.autoClear = false;
  this.renderer.autoClearDepth = false;
}
```

and, in `render`, before drawing:

```js
gl.depthFunc(gl.LEQUAL);
```

`LEQUAL` rather than `LESS` matters when your geometry is coplanar with something MapLibre drew — a floor plan sitting exactly on the ground plane is the common case indoors, and with `LESS` it z-fights against the basemap in a way that looks like a rendering bug in the data.

:::caution
Do not call `renderer.clearDepth()`. It is the obvious-looking fix when your mesh is hidden by a building, it makes the symptom go away, and what it actually does is discard MapLibre's depth information for the whole frame. Your mesh now draws in front of everything, permanently, including the geometry it should be behind. It converts "sometimes wrong" into "always wrong" and looks like progress.
:::

## Transparency, briefly

Depth and transparency interact badly, and indoors almost everything is transparent — walls at 30% so you can see the room behind, floor highlights, selection volumes.

Transparent surfaces must not write depth, or each one occludes the ones behind it:

```js
const material = new THREE.MeshBasicMaterial({
  color: 0x4a90d9,
  transparent: true,
  opacity: 0.35,
  depthWrite: false,
  side: THREE.DoubleSide,
});
```

`depthWrite: false` is what lets you see through a stack of them. `DoubleSide` is because a wall viewed from inside the room is being seen from its back face, and the default `FrontSide` makes it disappear exactly when you walk through it.

And then restore `depthMask(true)` before handing the context back, per the previous section. `depthWrite: false` on the last material drawn is one of the two ways to leave the mask off, and the one people hit.

## Where this leaves you

A layer that renders, a camera driven entirely by MapLibre, and a depth buffer both libraries agree on. That is enough to put a building in a map and have it occlude correctly when you orbit around it.

What it is not yet is correct in *position* — everything above assumes `this.worldTransform` exists and is right, and that transform is where the Mercator maths lives: the latitude-dependent scale, the axis swap, and the precision problem that appears when you place a 50-metre building using coordinates expressed in a unit where the whole planet is 1.

That is the next post.
