'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Vec = [number, number, number]

interface FigureProps {
  skin?: string
  suit?: string
  accent?: string
  leftArm?: Vec
  rightArm?: Vec
  leftLeg?: Vec
  rightLeg?: Vec
  hat?: boolean
  verticalStripes?: boolean
}

/** A stylized humanoid built from capsules and spheres. Feet at local y = 0. */
function Figure({
  skin = '#e8b48c',
  suit = '#c62d33',
  accent = '#e8b93a',
  leftArm = [0, 0, 0.25],
  rightArm = [0, 0, -0.25],
  leftLeg = [0, 0, 0],
  rightLeg = [0, 0, 0],
  hat = false,
  verticalStripes = false,
}: FigureProps) {
  return (
    <group>
      {/* Legs */}
      <group position={[-0.14, 0.95, 0]} rotation={leftLeg}>
        <mesh position={[0, -0.45, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.7, 4, 8]} />
          <meshStandardMaterial color={suit} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.92, 0.08]} castShadow>
          <boxGeometry args={[0.16, 0.1, 0.3]} />
          <meshStandardMaterial color="#1c1c1f" />
        </mesh>
      </group>
      <group position={[0.14, 0.95, 0]} rotation={rightLeg}>
        <mesh position={[0, -0.45, 0]} castShadow>
          <capsuleGeometry args={[0.12, 0.7, 4, 8]} />
          <meshStandardMaterial color={suit} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.92, 0.08]} castShadow>
          <boxGeometry args={[0.16, 0.1, 0.3]} />
          <meshStandardMaterial color="#1c1c1f" />
        </mesh>
      </group>

      {/* Torso */}
      <mesh position={[0, 1.4, 0]} castShadow>
        <capsuleGeometry args={[0.24, 0.6, 6, 12]} />
        <meshStandardMaterial color={suit} roughness={0.6} />
      </mesh>
      {verticalStripes && (
        <mesh position={[0, 1.42, 0.245]}>
          <boxGeometry args={[0.13, 0.58, 0.012]} />
          <meshStandardMaterial color="#f4f1e6" roughness={0.7} />
        </mesh>
      )}
      {/* Belt / accent */}
      <mesh position={[0, 1.12, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.12, 12]} />
        <meshStandardMaterial color={accent} metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Arms (pivot at shoulder) */}
      <group position={[-0.32, 1.6, 0]} rotation={leftArm}>
        <mesh position={[0, -0.32, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.55, 4, 8]} />
          <meshStandardMaterial color={suit} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.66, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color={skin} roughness={0.5} />
        </mesh>
      </group>
      <group position={[0.32, 1.6, 0]} rotation={rightArm}>
        <mesh position={[0, -0.32, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.55, 4, 8]} />
          <meshStandardMaterial color={suit} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.66, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color={skin} roughness={0.5} />
        </mesh>
      </group>

      {/* Neck + head */}
      <mesh position={[0, 1.82, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.12, 8]} />
        <meshStandardMaterial color={skin} />
      </mesh>
      <mesh position={[0, 2.02, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color={skin} roughness={0.5} />
      </mesh>
      {hat && (
        <group position={[0, 2.24, 0]}>
          <mesh>
            <cylinderGeometry args={[0.26, 0.26, 0.04, 16]} />
            <meshStandardMaterial color={accent} />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <coneGeometry args={[0.16, 0.28, 16]} />
            <meshStandardMaterial color={suit} />
          </mesh>
        </group>
      )}
    </group>
  )
}

/** Center: juggler tossing colorful balls in a cascade. */
function Juggler({ position }: { position: Vec }) {
  const performer = useRef<THREE.Group>(null)
  const ballRefs = useRef<(THREE.Mesh | null)[]>([])
  const colors = ['#d6323b', '#e8b93a', '#2e8b74', '#f4ead3', '#3a6ea5']
  const span = 0.55
  const archH = 1.1
  const handY = 1.7

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (performer.current) {
      performer.current.position.y = Math.sin(t * 1.5) * 0.06
      performer.current.rotation.z = Math.sin(t * 1.1) * 0.025
    }
    const n = colors.length
    ballRefs.current.forEach((ball, i) => {
      if (!ball) return
      const p = (t * 0.55 + i / n) % 1
      const dir = i % 2 === 0 ? 1 : -1
      ball.position.x = THREE.MathUtils.lerp(-span, span, p) * dir
      ball.position.y = handY + 4 * archH * p * (1 - p)
      ball.position.z = 0.3
    })
  })

  return (
    <group position={position} ref={performer}>
      <Figure
        suit="#DA251D"
        accent="#f4f1e6"
        hat
        verticalStripes
        leftArm={[-0.5, 0, 0.7]}
        rightArm={[-0.5, 0, -0.7]}
      />
      {colors.map((c, i) => (
        <mesh
          key={i}
          ref={(el) => {
            ballRefs.current[i] = el
          }}
          castShadow
        >
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color={c} roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

/** Left: performer balancing on a large ball, arms out, gentle sway. */
function BallBalancer({ position }: { position: Vec }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.4) * 0.08
    }
  })
  return (
    <group position={position} ref={ref}>
      <Figure
        suit="#DA251D"
        accent="#FFCD00"
        leftArm={[0, 0, 1.5]}
        rightArm={[0, 0, -1.5]}
        leftLeg={[0.1, 0, 0.15]}
        rightLeg={[0.1, 0, -0.15]}
      />
    </group>
  )
}

/** Right: performer on a unicycle, gentle rocking. */
function Unicyclist({ position }: { position: Vec }) {
  const group = useRef<THREE.Group>(null)
  const wheel = useRef<THREE.Mesh>(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (group.current) group.current.rotation.z = Math.sin(t * 1.1) * 0.06
    if (wheel.current) wheel.current.rotation.z = t * 1.5
  })
  return (
    <group position={position} ref={group}>
      {/* Wheel */}
      <mesh ref={wheel} position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.6, 0.09, 12, 32]} />
        <meshStandardMaterial color="#1c1c1f" roughness={0.6} />
      </mesh>
      {/* Fork + seat post */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.9, 8]} />
        <meshStandardMaterial color="#7d7d85" metalness={0.6} />
      </mesh>
      <mesh position={[0, 1.55, 0]}>
        <boxGeometry args={[0.4, 0.1, 0.25]} />
        <meshStandardMaterial color="#7a1f24" />
      </mesh>
      {/* Rider seated on the post */}
      <group position={[0, 0.5, 0]}>
        <Figure
          suit="#DA251D"
          accent="#FFCD00"
          hat
          leftArm={[0, 0, 1.2]}
          rightArm={[0, 0, -1.2]}
          leftLeg={[-1.1, 0, 0.2]}
          rightLeg={[-1.1, 0, -0.2]}
        />
      </group>
    </group>
  )
}

/** Aerial performer hanging from a swinging silk or hoop. */
function AerialPerformer({
  anchor,
  drop,
  phase,
  variant,
  suit,
}: {
  anchor: Vec
  drop: number
  phase: number
  variant: 'hoop' | 'silk'
  suit: string
}) {
  const swing = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (swing.current) {
      const t = state.clock.elapsedTime
      swing.current.rotation.x = Math.sin(t * 0.9 + phase) * 0.28
      swing.current.rotation.z = Math.sin(t * 0.65 + phase) * 0.08
    }
  })
  return (
    <group position={anchor}>
      <group ref={swing}>
        {variant === 'silk' ? (
          <>
            <mesh position={[-0.12, -drop / 2, 0]}>
              <boxGeometry args={[0.06, drop, 0.02]} />
              <meshStandardMaterial color="#DA251D" roughness={0.8} />
            </mesh>
            <mesh position={[0.12, -drop / 2, 0]}>
              <boxGeometry args={[0.06, drop, 0.02]} />
              <meshStandardMaterial color="#DA251D" roughness={0.8} />
            </mesh>
          </>
        ) : (
          <>
            {/* Rope */}
            <mesh position={[0, -drop / 2, 0]}>
              <cylinderGeometry args={[0.02, 0.02, drop, 6]} />
              <meshStandardMaterial color="#c9a24b" />
            </mesh>
            {/* Hoop (lyra) */}
            <mesh position={[0, -drop, 0]} castShadow>
              <torusGeometry args={[0.5, 0.04, 10, 32]} />
              <meshStandardMaterial color="#FFCD00" metalness={0.5} roughness={0.3} />
            </mesh>
          </>
        )}
        {/* Performer hanging below, rotated to hang from arms */}
        <group
          position={[0, variant === 'hoop' ? -drop - 0.94 : -drop - 0.94, 0]}
          rotation={[0, 0, 0]}
          scale={0.95}
        >
          <Figure
            suit={suit}
            accent="#FFCD00"
            leftArm={[Math.PI, 0, 0.2]}
            rightArm={[Math.PI, 0, -0.2]}
            leftLeg={[0.1, 0, 0.2]}
            rightLeg={[0.1, 0, -0.2]}
          />
        </group>
      </group>
    </group>
  )
}

export function Performers() {
  const aerials = useMemo(
    () =>
      [
        { anchor: [0, 12, -1] as Vec, drop: 3, phase: 0, variant: 'silk' as const, suit: '#DA251D' },
        { anchor: [-3.5, 12, 1.5] as Vec, drop: 4, phase: 1.2, variant: 'silk' as const, suit: '#FFCD00' },
        { anchor: [3.5, 12, 1] as Vec, drop: 3.5, phase: 2.4, variant: 'silk' as const, suit: '#DA251D' },
      ],
    [],
  )

  return (
    <group>
      <Juggler position={[0, 0.66, 2]} />
      <BallBalancer position={[-4.6, 2.1, 1]} />
      <Unicyclist position={[3.8, 0.66, 2]} />
      {aerials.map((a, i) => (
        <AerialPerformer key={i} {...a} />
      ))}
    </group>
  )
}
