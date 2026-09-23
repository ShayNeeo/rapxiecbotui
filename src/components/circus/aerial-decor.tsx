'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/** A single swinging trapeze bar hung from the ceiling by two ropes. */
function Trapeze({
  position,
  drop,
  phase,
  width = 1.4,
}: {
  position: [number, number, number]
  drop: number
  phase: number
  width?: number
}) {
  const swing = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (swing.current) {
      swing.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.8 + phase) * 0.32
    }
  })
  return (
    <group position={position}>
      <group ref={swing}>
        {/* Ropes */}
        <mesh position={[-width / 2, -drop / 2, 0]}>
          <cylinderGeometry args={[0.03, 0.03, drop, 6]} />
          <meshStandardMaterial color="#d8c48a" roughness={0.8} />
        </mesh>
        <mesh position={[width / 2, -drop / 2, 0]}>
          <cylinderGeometry args={[0.03, 0.03, drop, 6]} />
          <meshStandardMaterial color="#d8c48a" roughness={0.8} />
        </mesh>
        {/* Bar */}
        <mesh position={[0, -drop, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, width, 12]} />
          <meshStandardMaterial color="#e8b93a" metalness={0.5} roughness={0.35} />
        </mesh>
      </group>
    </group>
  )
}

/** Central overhead light, kept compact after removing the large rings. */
function CentralLightCluster() {
  return (
    <group position={[0, 18.5, 0]}>
      {/* Support rod */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 3, 8]} />
        <meshStandardMaterial color="#7d7d85" metalness={0.6} />
      </mesh>
      {/* Central stage light remains, without the three large floating yellow rings. */}
      <pointLight intensity={40} color="#ffddaa" distance={38} decay={1.6} />
    </group>
  )
}

/** Volumetric-looking cone beam from a rig fixture down to the stage. */
function StageBeam({
  x,
  z,
  color = '#fff2d6',
  botR = 6.5,
  opacity = 0.045,
}: {
  x: number
  z: number
  color?: string
  botR?: number
  opacity?: number
}) {
  const top = 16
  const bottom = 0.7
  const height = top - bottom
  return (
    <mesh position={[x, (top + bottom) / 2, z]}>
      <cylinderGeometry args={[0.3, botR, height, 32, 1, true]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

/** A tilted volumetric beam cone from a ceiling fixture down to the stage. */
function Beam({
  from,
  to,
  color,
  topR = 0.25,
  botR = 1.7,
  opacity = 0.085,
}: {
  from: [number, number, number]
  to: [number, number, number]
  color: string
  topR?: number
  botR?: number
  opacity?: number
}) {
  const { position, quaternion, height } = useMemo(() => {
    const a = new THREE.Vector3(...from)
    const b = new THREE.Vector3(...to)
    const dir = new THREE.Vector3().subVectors(a, b)
    const h = dir.length()
    const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5)
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.clone().normalize(),
    )
    return {
      position: mid.toArray() as [number, number, number],
      quaternion: q,
      height: h,
    }
  }, [from, to])
  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[topR, botR, height, 24, 1, true]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

export function AerialDecor() {
  return (
    <group>
      <CentralLightCluster />
      <Trapeze position={[-1.8, 13, 0]} drop={2.6} phase={0} />
      <Trapeze position={[2.2, 13.5, -0.5]} drop={3.2} phase={1.6} />
      {/* A single broad warm beam fanning out over the whole stage */}
      <StageBeam x={0} z={0.5} color="#fff2d6" />
      {/* Colored beams raking diagonally from the ceiling onto center stage */}
      <Beam from={[-10, 15, 7]} to={[-1.6, 1, 1.5]} color="#a24bff" />
      <Beam from={[10, 15, 7]} to={[1.6, 1, 1.5]} color="#ff5ea8" />
      <Beam from={[-9, 15, -4]} to={[-1.2, 1, -1]} color="#4d7bff" />
      <Beam from={[9, 15, -4]} to={[1.2, 1, -1]} color="#b56bff" />
      <Beam from={[0, 16, 11]} to={[0, 1, 2.5]} color="#ff79c6" />
      <Beam from={[0, 16, -8]} to={[0, 1, -1.5]} color="#5aa0ff" />
    </group>
  )
}
