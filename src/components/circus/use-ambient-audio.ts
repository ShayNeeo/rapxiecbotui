'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Procedurally synthesizes a warm circus ambience (crowd murmur + soft
 * musical drone + occasional applause swells) using the Web Audio API.
 * No external audio assets are required.
 */
export function useAmbientAudio() {
  const [enabled, setEnabled] = useState(false)
  const ctxRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<AudioNode[]>([])
  const applauseTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  const teardown = () => {
    if (applauseTimer.current) clearInterval(applauseTimer.current)
    applauseTimer.current = null
    nodesRef.current.forEach((n) => {
      try {
        // @ts-expect-error stop exists on source nodes
        n.stop?.()
        n.disconnect()
      } catch {
        /* noop */
      }
    })
    nodesRef.current = []
    ctxRef.current?.close().catch(() => {})
    ctxRef.current = null
  }

  const buildNoiseBuffer = (ctx: AudioContext, seconds = 2) => {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1
      // brownian-ish noise for a soft crowd murmur
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3.5
    }
    return buffer
  }

  const start = () => {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    const ctx = new AudioCtx()
    ctxRef.current = ctx

    const master = ctx.createGain()
    master.gain.value = 0.0
    master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.5)
    master.connect(ctx.destination)

    // --- Crowd murmur bed ---
    const murmur = ctx.createBufferSource()
    murmur.buffer = buildNoiseBuffer(ctx)
    murmur.loop = true
    const murmurFilter = ctx.createBiquadFilter()
    murmurFilter.type = 'lowpass'
    murmurFilter.frequency.value = 700
    const murmurGain = ctx.createGain()
    murmurGain.gain.value = 0.35
    murmur.connect(murmurFilter).connect(murmurGain).connect(master)
    murmur.start()

    // --- Warm musical drone (two soft detuned oscillators) ---
    const droneGain = ctx.createGain()
    droneGain.gain.value = 0.05
    droneGain.connect(master)
    ;[110, 165].forEach((freq, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.value = freq
      osc.detune.value = i === 0 ? -6 : 6
      osc.connect(droneGain)
      osc.start()
      nodesRef.current.push(osc)
    })

    // --- Occasional applause swell ---
    const applauseBuffer = buildNoiseBuffer(ctx, 1)
    const doApplause = () => {
      if (!ctxRef.current) return
      const src = ctx.createBufferSource()
      src.buffer = applauseBuffer
      const hp = ctx.createBiquadFilter()
      hp.type = 'highpass'
      hp.frequency.value = 1500
      const g = ctx.createGain()
      const now = ctx.currentTime
      g.gain.setValueAtTime(0, now)
      g.gain.linearRampToValueAtTime(0.25, now + 0.4)
      g.gain.linearRampToValueAtTime(0, now + 2.5)
      src.connect(hp).connect(g).connect(master)
      src.start()
      src.stop(now + 2.6)
    }
    applauseTimer.current = setInterval(doApplause, 14000)
    setTimeout(doApplause, 2500)

    nodesRef.current.push(murmur, master)
  }

  const toggle = () => {
    setEnabled((prev) => {
      const next = !prev
      if (next) start()
      else teardown()
      return next
    })
  }

  useEffect(() => teardown, [])

  return { enabled, toggle }
}
