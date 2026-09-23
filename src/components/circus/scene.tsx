'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import { Tent } from './tent'
import { Stage } from './stage'
import { Seating } from './seating'
import { LightingRig } from './lighting-rig'
import { Performers } from './performers'
import { AerialDecor } from './aerial-decor'
import { Hotspots } from './hotspots'
import { HOTSPOTS, DEFAULT_CAMERA } from '@/lib/circus-data'

function CameraRig({
  activeId,
  controls,
}: {
  activeId: string | null
  controls: React.RefObject<OrbitControlsImpl | null>
}) {
  const { camera } = useThree()
  const desiredPos = useRef(new THREE.Vector3(...DEFAULT_CAMERA.position))
  const desiredTarget = useRef(new THREE.Vector3(...DEFAULT_CAMERA.target))
  const transitioning = useRef(false)

  useEffect(() => {
    const spot = HOTSPOTS.find((h) => h.id === activeId)
    if (spot) {
      desiredPos.current.set(spot.camera.position[0], spot.camera.position[1], spot.camera.position[2])
      desiredTarget.current.set(spot.camera.target[0], spot.camera.target[1], spot.camera.target[2])
    } else {
      desiredPos.current.set(DEFAULT_CAMERA.position[0], DEFAULT_CAMERA.position[1], DEFAULT_CAMERA.position[2])
      desiredTarget.current.set(DEFAULT_CAMERA.target[0], DEFAULT_CAMERA.target[1], DEFAULT_CAMERA.target[2])
    }
    transitioning.current = true
  }, [activeId])

  useFrame((_, delta) => {
    if (!transitioning.current || !controls.current) return
    const lerp = 1 - Math.pow(0.001, delta)
    camera.position.lerp(desiredPos.current, lerp)
    controls.current.target.lerp(desiredTarget.current, lerp)
    controls.current.update()
    if (
      camera.position.distanceTo(desiredPos.current) < 0.15 &&
      controls.current.target.distanceTo(desiredTarget.current) < 0.15
    ) {
      transitioning.current = false
    }
  })

  return null
}

export function Scene({
  activeId,
  onSelect,
}: {
  activeId: string | null
  onSelect: (id: string) => void
}) {
  const controls = useRef<OrbitControlsImpl>(null)

  return (
    <>
      <color attach="background" args={['#2a1512']} />
      <fog attach="fog" args={['#2a1512', 55, 140]} />

      {/* Ambient / fill — low and reddish so the seating reads dim and warm
          while the stage spotlight stays the clear focal point. */}
      <ambientLight intensity={0.42} color="#8a3826" />
      <hemisphereLight
        intensity={0.5}
        color="#c56338"
        groundColor="#2a1109"
      />

      {/* Dim red wash over the seating bowl */}
      <pointLight position={[0, 14, 20]} intensity={38} color="#c2431f" distance={65} decay={1.6} />
      {/* Warm apex glow */}
      <pointLight position={[0, 22, 0]} intensity={52} color="#ff9d4d" distance={75} decay={1.5} />

      {/* Main warm spotlight concentrated on the stage */}
      <spotLight
        position={[0, 20, 4]}
        target-position={[0, 1, 0]}
        angle={0.52}
        penumbra={0.75}
        intensity={620}
        color="#ffedcf"
        distance={50}
        decay={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
      />

      {/* Magenta / purple accent spotlights raking across the ring */}
      <spotLight
        position={[-8, 16, 6]}
        target-position={[-4.6, 2, 1]}
        angle={0.35}
        penumbra={0.7}
        intensity={340}
        color="#c46bff"
        distance={40}
        decay={1.5}
      />
      <spotLight
        position={[8, 16, 6]}
        target-position={[3.8, 1.5, 2]}
        angle={0.35}
        penumbra={0.7}
        intensity={340}
        color="#ff5ea8"
        distance={40}
        decay={1.5}
      />
      {/* Cool blue accent raking from the back */}
      <spotLight
        position={[0, 17, -6]}
        target-position={[0, 1, -1]}
        angle={0.4}
        penumbra={0.75}
        intensity={280}
        color="#5aa0ff"
        distance={42}
        decay={1.5}
      />
      {/* Aerial highlight */}
      <spotLight
        position={[0, 22, 8]}
        target-position={[0, 9, -1]}
        angle={0.4}
        penumbra={0.8}
        intensity={260}
        color="#ffe6b0"
        distance={45}
        decay={1.4}
      />

      <Tent />
      <Stage />
      <Seating />
      <LightingRig />
      <Performers />
      <AerialDecor />
      <Hotspots activeId={activeId} onSelect={onSelect} />

      <OrbitControls
        ref={controls}
        target={DEFAULT_CAMERA.target}
        enablePan
        enableDamping
        dampingFactor={0.08}
        minDistance={4}
        maxDistance={50}
        maxPolarAngle={Math.PI * 0.6}
      />
      <CameraRig activeId={activeId} controls={controls} />
    </>
  )
}
