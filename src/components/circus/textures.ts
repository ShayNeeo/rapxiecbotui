import * as THREE from 'three'

/**
 * Creates a repeating vertical two-color stripe canvas texture.
 * Used for the tent roof and walls (red / cream circus stripes).
 */
export function createStripeTexture(
  colorA = '#b0202a',
  colorB = '#f4ead3',
  stripes = 2,
  repeat = 24,
) {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const bandWidth = size / (stripes * 2)
  for (let i = 0; i < stripes * 2; i++) {
    ctx.fillStyle = i % 2 === 0 ? colorA : colorB
    ctx.fillRect(i * bandWidth, 0, bandWidth, size)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(repeat, 1)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

/**
 * Vertical ombre gradient (top -> bottom) used to tint the marquee text.
 * Defaults to a warm yellow -> orange -> red circus ombre.
 */
export function createVerticalGradientTexture(
  stops: [number, string][] = [
    [0, '#ffe14d'],
    [0.5, '#ff8a1e'],
    [1, '#e01a22'],
  ],
) {
  const w = 8
  const h = 256
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  const g = ctx.createLinearGradient(0, 0, 0, h)
  for (const [offset, color] of stops) g.addColorStop(offset, color)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  // Troika text UVs increase upward, so flip so yellow lands on top.
  tex.flipY = false
  return tex
}

/**
 * Semi-transparent safety-net texture: a fine rope grid on a clear background.
 */
export function createNetTexture(cell = 16, line = 2, color = '#f4ead3') {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, size, size)
  ctx.strokeStyle = color
  ctx.lineWidth = line
  ctx.globalAlpha = 0.85
  for (let x = 0; x <= size; x += cell) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, size)
    ctx.stroke()
  }
  for (let y = 0; y <= size; y += cell) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(size, y)
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(10, 10)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/**
 * Soft vertical fabric-fold gradient used for the velvet curtain.
 */
export function createCurtainTexture(base = '#7a0f16', highlight = '#a8232c') {
  const w = 512
  const h = 128
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  const folds = 28
  const foldW = w / folds
  for (let i = 0; i < folds; i++) {
    const g = ctx.createLinearGradient(i * foldW, 0, (i + 1) * foldW, 0)
    g.addColorStop(0, base)
    g.addColorStop(0.5, highlight)
    g.addColorStop(1, base)
    ctx.fillStyle = g
    ctx.fillRect(i * foldW, 0, foldW, h)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = THREE.RepeatWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}
