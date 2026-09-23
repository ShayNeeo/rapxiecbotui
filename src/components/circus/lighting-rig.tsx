'use client'

import { useMemo } from 'react'

const RIG_RADIUS = 7
const RIG_HEIGHT = 16.5

export function LightingRig() {
  const fixtures = useMemo(() => {
    const count = 10
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      return {
        angle,
        x: Math.cos(angle) * RIG_RADIUS,
        z: Math.sin(angle) * RIG_RADIUS,
        warm: i % 2 === 0,
      }
    })
  }, [])

  const speakers = useMemo(
    () => [Math.PI * 0.35, Math.PI * 0.85, Math.PI * 1.35, Math.PI * 1.85],
    [],
  )

  return (
    <group position={[0, RIG_HEIGHT, 0]}>
      {/* Truss ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[RIG_RADIUS, 0.18, 10, 96]} />
        <meshStandardMaterial color="#7d7d85" metalness={0.8} roughness={0.35} />
      </mesh>
      {/* Cross braces */}
      {[0, Math.PI / 2].map((r, i) => (
        <mesh key={i} rotation={[0, r, 0]}>
          <boxGeometry args={[RIG_RADIUS * 2, 0.12, 0.12]} />
          <meshStandardMaterial color="#6a6a70" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}

      {/* Spotlight fixtures pointing down */}
      {fixtures.map((f, i) => (
        <group key={i} position={[f.x, -0.3, f.z]}>
          <mesh>
            <cylinderGeometry args={[0.22, 0.3, 0.5, 12]} />
            <meshStandardMaterial color="#1c1c1f" metalness={0.5} roughness={0.5} />
          </mesh>
          {/* Glowing lens */}
          <mesh position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.22, 0.22, 0.05, 12]} />
            <meshStandardMaterial
              color={f.warm ? '#ffd27a' : '#fff2d6'}
              emissive={f.warm ? '#ffb347' : '#fff0cc'}
              emissiveIntensity={2.5}
            />
          </mesh>
        </group>
      ))}

      {/* Hanging speakers */}
      {speakers.map((angle, i) => (
        <group
          key={i}
          position={[
            Math.cos(angle) * (RIG_RADIUS - 1.5),
            -1,
            Math.sin(angle) * (RIG_RADIUS - 1.5),
          ]}
          rotation={[0, -angle, 0]}
        >
          <mesh>
            <boxGeometry args={[0.9, 1.3, 0.7]} />
            <meshStandardMaterial color="#141416" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.25, 0.36]}>
            <circleGeometry args={[0.28, 20]} />
            <meshStandardMaterial color="#2a2a2e" />
          </mesh>
          <mesh position={[0, -0.3, 0.36]}>
            <circleGeometry args={[0.16, 20]} />
            <meshStandardMaterial color="#2a2a2e" />
          </mesh>
        </group>
      ))}
    </group>
  )
}
