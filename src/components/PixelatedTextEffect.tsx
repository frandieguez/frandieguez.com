import React, { useEffect, useRef } from "react";

type Props = {
  texts: string[];
  className?: string;
  width?: number;
  height?: number;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  color?: string;
  switchEveryMs?: number;
  morphDurationMs?: number;
  sampleStep?: number;
  leftPaddingPct?: number; // margen izda
};

type Point = { x: number; y: number };
type Particle = {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  delay: number;  // desincroniza inicio
  jx: number;     // pequeño jitter inicial
  jy: number;
};

export default function PixelGlitchText({
  texts,
  className = "",
  width = 900,
  height = 240,
  fontFamily = '"IBM Plex Sans", sans-serif',
  fontSize = 140,
  fontWeight = "300",
  color = "#333",
  switchEveryMs = 2000,
  morphDurationMs = 900,
  sampleStep = 4,
  leftPaddingPct = 0.1,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const idxRef = useRef(0);
  const lastCycleStartRef = useRef(0);
  const morphStartRef = useRef<number | null>(null);
  const fromPtsRef = useRef<Point[]>([]);
  const toPtsRef = useRef<Point[]>([]);
  const partsRef = useRef<Particle[]>([]);

  const ease = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const withCtx = (cb: (ctx: CanvasRenderingContext2D) => void) => {
    const ctx = canvasRef.current!.getContext("2d")!;
    cb(ctx);
  };

  const measureScale = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxW: number
  ) => {
    const w = ctx.measureText(text).width;
    return w > maxW ? maxW / w : 1;
  };

  // Texto limpio (reposo), alineado a la izquierda
  const drawCleanText = (text: string) => {
    withCtx((ctx) => {
      ctx.clearRect(0, 0, width, height);
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = color;

      const scale = measureScale(ctx, text, width * (1 - leftPaddingPct));
      ctx.save();
      const x = width * leftPaddingPct;
      const y = height / 2;
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    });
  };

  // Rasterizado del texto (para generar puntos), también a la izquierda
  const rasterize = (text: string): Point[] => {
    const off = offscreenRef.current!;
    const ctx = off.getContext("2d", { willReadFrequently: true })!;
    ctx.clearRect(0, 0, off.width, off.height);
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = "#fff";

    const scale = measureScale(ctx, text, off.width * (1 - leftPaddingPct));
    ctx.save();
    const x = off.width * leftPaddingPct;
    const y = off.height / 2;
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillText(text, 0, 0);
    ctx.restore();

    const data = ctx.getImageData(0, 0, off.width, off.height).data;
    const points: Point[] = [];
    for (let yy = 0; yy < off.height; yy += sampleStep) {
      for (let xx = 0; xx < off.width; xx += sampleStep) {
        if (data[(yy * off.width + xx) * 4 + 3] > 160) points.push({ x: xx, y: yy });
      }
    }
    return points;
  };

  const shuffle = <T,>(arr: T[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const buildParticles = (fromPts: Point[], toPts: Point[]): Particle[] => {
    const maxN = Math.max(fromPts.length, toPts.length, 1);
    const from = fromPts.slice();
    const to = toPts.slice();
    while (from.length < maxN && fromPts.length)
      from.push(fromPts[(Math.random() * fromPts.length) | 0]);
    while (to.length < maxN && toPts.length)
      to.push(toPts[(Math.random() * toPts.length) | 0]);
    shuffle(from);
    shuffle(to);
    return Array.from({ length: maxN }, (_, i) => {
      const a = from[i % from.length] ?? { x: width / 2, y: height / 2 };
      const b = to[i % to.length] ?? { x: width / 2, y: height / 2 };
      return {
        sx: a.x, sy: a.y,
        tx: b.x, ty: b.y,
        delay: Math.random() * 0.2,
        jx: (Math.random() - 0.5) * 12,
        jy: (Math.random() - 0.5) * 12,
      };
    });
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!offscreenRef.current)
      offscreenRef.current = document.createElement("canvas");

    const canvas = canvasRef.current;
    const off = offscreenRef.current!;
    canvas.width = width;
    canvas.height = height;
    off.width = width;
    off.height = height;

    idxRef.current = 0;
    lastCycleStartRef.current = performance.now();
    morphStartRef.current = null;
    drawCleanText(texts[idxRef.current] ?? "");

    const tick = (now: number) => {
      // Arranca morph tras la pausa
      if (
        morphStartRef.current === null &&
        now - lastCycleStartRef.current >= switchEveryMs
      ) {
        const cur = idxRef.current;
        const next = (cur + 1) % texts.length;
        fromPtsRef.current = rasterize(texts[cur] ?? "");
        toPtsRef.current = rasterize(texts[next] ?? "");
        partsRef.current = buildParticles(fromPtsRef.current, toPtsRef.current);
        morphStartRef.current = now;
      }

      // Morph activo
      if (morphStartRef.current !== null) {
        const t = Math.min(1, (now - morphStartRef.current) / morphDurationMs);
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, width, height);

        const size = Math.max(2, Math.floor(sampleStep / 1.5));
        ctx.fillStyle = color;

        for (let p of partsRef.current) {
          const tt = Math.max(0, Math.min(1, (t - p.delay) / (1 - p.delay)));
          const e = ease(tt);

          // Jitter sólo al principio
          const g = Math.max(0, 1 - t * 5);
          const ox = p.jx * g * (1 - e) * 0.6;
          const oy = p.jy * g * (1 - e) * 0.6;

          const x = p.sx + (p.tx - p.sx) * e + ox;
          const y = p.sy + (p.ty - p.sy) * e + oy;

          ctx.fillRect(x, y, size, size);
        }

        // Fin del morph → texto limpio
        if (t >= 1) {
          idxRef.current = (idxRef.current + 1) % texts.length;
          morphStartRef.current = null;
          lastCycleStartRef.current = now;
          drawCleanText(texts[idxRef.current] ?? "");
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [
    texts.join("|"),
    width, height,
    fontSize, fontFamily, fontWeight,
    color, sampleStep,
    switchEveryMs, morphDurationMs,
    leftPaddingPct,
  ]);

  return (
    <canvas
      className={className}
      ref={canvasRef}
      width={width}
      height={height}
      style={{ width: "100%", height: "100%", display: "block", backgroundColor: "transparent" }}
    />
  );
}