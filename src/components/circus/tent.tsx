'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { createStripeTexture } from './textures'

const RADIUS = 30
const WALL_HEIGHT = 8
const ROOF_HEIGHT = 16

export function Tent() {
  const wallTexture = useMemo(
    () => createStripeTexture('#8f1a22', '#e8dcc4', 2, 34),
    [],
  )

  const roofTexture = useMemo(
    () => createStripeTexture('#c8202a', '#f6ecd6', 1, 24),
    [],
  )

  // String-light bulb positions running along the dome ribs.
  const stringLights = useMemo(() => {
    const bulbs: [number, number, number][] = []
    const ribs = 16
    const perRib = 7
    for (let r = 0; r < ribs; r++) {
      const phi = (r / ribs) * Math.PI * 2
      for (let s = 1; s <= perRib; s++) {
        const t = s / (perRib + 1)
        const theta = t * (Math.PI / 2)
        const rad = (RADIUS - 0.3) * Math.sin(theta)
        const y = WALL_HEIGHT + ROOF_HEIGHT * Math.cos(theta)
        bulbs.push([Math.cos(phi) * rad, y, Math.sin(phi) * rad])
      }
    }
    return bulbs
  }, [])

  // Decorative scalloped pennants around the wall/roof junction.
  const pennants = useMemo(() => {
    const items: { angle: number }[] = []
    const count = 48
    for (let i = 0; i < count; i++) {
      items.push({ angle: (i / count) * Math.PI * 2 })
    }
    return items
  }, [])

  return (
    <group>
      {/* Ground / arena floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[RADIUS, 64]} />
        <meshStandardMaterial color="#3a2418" roughness={0.95} />
      </mesh>

      {/* Sawdust ring around the stage */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <ringGeometry args={[8.2, 12, 64]} />
        <meshStandardMaterial color="#6b4a2b" roughness={1} />
      </mesh>

      {/* Tent walls (seen from inside) */}
      <mesh position={[0, WALL_HEIGHT / 2, 0]}>
        <cylinderGeometry
          args={[RADIUS, RADIUS, WALL_HEIGHT, 64, 1, true]}
        />
        <meshStandardMaterial
          map={wallTexture}
          side={THREE.BackSide}
          roughness={0.85}
        />
      </mesh>

      {/* Domed red / cream striped roof curving from the wall up to the apex */}
      <mesh position={[0, WALL_HEIGHT, 0]} scale={[1, ROOF_HEIGHT / RADIUS, 1]}>
        <sphereGeometry
          args={[RADIUS, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2]}
        />
        <meshStandardMaterial
          map={roofTexture}
          emissive="#7a1a10"
          emissiveIntensity={0.4}
          side={THREE.BackSide}
          roughness={0.85}
        />
      </mesh>

      {/* String lights running along the dome ribs */}
      {stringLights.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.14, 8, 8]} />
          <meshStandardMaterial
            color="#fff3cf"
            emissive="#ffcf6b"
            emissiveIntensity={2.6}
          />
        </mesh>
      ))}

      {/* Scalloped pennant trim */}
      <group position={[0, WALL_HEIGHT - 0.2, 0]}>
        {pennants.map(({ angle }, i) => {
          const x = Math.cos(angle) * (RADIUS - 0.4)
          const z = Math.sin(angle) * (RADIUS - 0.4)
          return (
            <mesh
              key={i}
              position={[x, 0, z]}
              rotation={[Math.PI, -angle + Math.PI / 2, 0]}
            >
              <coneGeometry args={[0.45, 1.1, 4]} />
              <meshStandardMaterial
                color={i % 2 === 0 ? '#e8b93a' : '#c62828'}
                roughness={0.6}
              />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}
