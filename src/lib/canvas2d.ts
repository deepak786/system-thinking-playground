/** Tracks last synced canvas CSS size + DPR so we don't reallocate every frame. */
export type CanvasSizeCache = { w: number; h: number; dpr: number }

export function createCanvasSizeCache(): CanvasSizeCache {
  return { w: 0, h: 0, dpr: 0 }
}

/** Cap device pixel ratio — phones often report 3× which triples fill cost. */
export function canvasDpr(maxDesktop = 2): number {
  const narrow =
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 768px)').matches
  const cap = narrow ? 1.5 : maxDesktop
  return Math.min(window.devicePixelRatio || 1, cap)
}

/**
 * Resize the canvas backing store only when CSS size or DPR changes.
 * Returns drawing context already transformed to CSS pixels.
 */
export function syncCanvasSize(
  canvas: HTMLCanvasElement,
  wrap: HTMLElement,
  cache: CanvasSizeCache,
  options?: { alpha?: boolean },
): { ctx: CanvasRenderingContext2D; w: number; h: number } | null {
  const w = wrap.clientWidth
  const h = wrap.clientHeight
  if (w < 2 || h < 2) return null

  const dpr = canvasDpr()
  if (cache.w !== w || cache.h !== h || cache.dpr !== dpr) {
    cache.w = w
    cache.h = h
    cache.dpr = dpr
    canvas.width = Math.floor(w * dpr)
    canvas.height = Math.floor(h * dpr)
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
  }

  const ctx = canvas.getContext('2d', {
    alpha: options?.alpha ?? true,
  })
  if (!ctx) return null
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return { ctx, w, h }
}

/** Fast circular-looking dot via a square fill (much cheaper than arc). */
export function fillDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  fillStyle: string,
) {
  ctx.fillStyle = fillStyle
  ctx.fillRect(x - r, y - r, r * 2, r * 2)
}

/**
 * Throttle a rAF progress callback to ~30fps React updates.
 * Still calls onFrame(1) at the end.
 */
export function throttleProgress(
  onFrame: (t: number) => void,
  minMs = 33,
): (t: number) => void {
  let last = 0
  let lastT = -1
  return (t: number) => {
    const now = performance.now()
    if (t >= 1 || (t !== lastT && now - last >= minMs)) {
      last = now
      lastT = t
      onFrame(t)
    }
  }
}
