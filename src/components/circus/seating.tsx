'use client'

import { useMemo, useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'

const TIERS = 7
const START_RADIUS = 12
const TIER_DEPTH = 2.5
const TIER_RISE = 1.9
const SEAT_SPACING = 1.9
const AISLES = [0, Math.PI / 2, Math.PI, Math.PI * 1.5]
const AISLE_HALF = 0.11 // radians: half-width of each aisle gap
// Clear a wide wedge behind the stage so seats never overlap the red
// backdrop curtain / marquee. The backdrop sits toward -Z (angle = -PI/2).
const STAGE_GAP_CENTER = -Math.PI / 2
const STAGE_GAP_HALF = 1.05 // radians (~120° total opening)

type SeatXform = { angle: number; radius: number; y: number; tier: number }

// Warm circus-themed seat palette, assigned by row so the bowl reads varied
// but cohesive (dark teal appears once as an accent, like real stadiums).
const SEAT_COLORS = [
  '#c1272d', // red
  '#e0b429', // mustard yellow
  '#d9691f', // deep orange
  '#7a1f2b', // maroon
  '#c1272d', // red
  '#d9691f', // deep orange
  '#1f5f6b', // dark teal (accent)
]

export function Seating() {
  // Lathe profile: stepped amphitheater bowl cross-section.
  const bowlGeometry = useMemo(() => {
    const points: THREE.Vector2[] = []
    points.push(new THREE.Vector2(START_RADIUS - 0.4, 0))
    for (let i = 0; i < TIERS; i++) {
      const r = START_RADIUS + i * TIER_DEPTH
      const y = i * TIER_RISE
      points.push(new THREE.Vector2(r, y))
      points.push(new THREE.Vector2(r, y + TIER_RISE))
    }
    const geo = new THREE.LatheGeometry(points, 96)
    geo.computeVertexNormals()
    return geo
  }, [])

  // Individual seat placements, skipping the radial aisles and the stage gap.
  const seats = useMemo<SeatXform[]>(() => {
    const arr: SeatXform[] = []
    for (let i = 0; i < TIERS; i++) {
      const radius = START_RADIUS + i * TIER_DEPTH + TIER_DEPTH * 0.45
      const y = i * TIER_RISE + TIER_RISE
      const count = Math.floor((2 * Math.PI * radius) / SEAT_SPACING)
      for (let s = 0; s < count; s++) {
        const angle = (s / count) * Math.PI * 2
        const inAisle = AISLES.some((a) => {
          const d = Math.abs(((angle - a + Math.PI) % (Math.PI * 2)) - Math.PI)
          return d < AISLE_HALF
        })
        if (inAisle) continue
        // Skip the wedge behind the stage.
        const dStage = Math.abs(
          ((angle - STAGE_GAP_CENTER + Math.PI) % (Math.PI * 2)) - Math.PI,
        )
        if (dStage < STAGE_GAP_HALF) continue
        arr.push({ angle, radius, y, tier: i })
      }
    }
    return arr
  }, [])

  // Roughly 60% of the seats are occupied by colorful spectators that echo
  // the bright, festive palette of the performers on stage.
  const spectators = useMemo(() => {
    const shirts = [
      '#e63946', '#f4a261', '#e9c46a', '#2a9d8f', '#4a7bd6',
      '#9b5de5', '#f15bb5', '#43aa8b', '#f9844a', '#f7ede2',
    ]
    const skins = ['#f0c9a0', '#e8b088', '#d99a6c', '#c68642', '#8d5524']
    const hats = ['#d62828', '#f4d35e', '#2a9d8f', '#3a6ea5', '#e76f51', '#ffffff']
    let seed = 1337
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }
    return seats
      .map((s) => ({
        ...s,
        shirt: shirts[Math.floor(rand() * shirts.length)],
        skin: skins[Math.floor(rand() * skins.length)],
        hat: hats[Math.floor(rand() * hats.length)],
        hasHat: rand() > 0.9,
        hairStyle: Math.floor(rand() * 4),
        hair: ['#241812', '#3b2418', '#171717', '#5a321d'][Math.floor(rand() * 4)],
        lean: (rand() - 0.5) * 0.12,
      }))
  }, [seats])

  const baseRef = useRef<THREE.InstancedMesh>(null)
  const cushionRef = useRef<THREE.InstancedMesh>(null)
  const backRef = useRef<THREE.InstancedMesh>(null)
  const armLRef = useRef<THREE.InstancedMesh>(null)
  const armRRef = useRef<THREE.InstancedMesh>(null)
  const bodyRef = useRef<THREE.InstancedMesh>(null)
  const headRef = useRef<THREE.InstancedMesh>(null)
  const hatRef = useRef<THREE.InstancedMesh>(null)
  const hairRef = useRef<THREE.InstancedMesh>(null)
  const ponyRef = useRef<THREE.InstancedMesh>(null)
  const armRef = useRef<THREE.InstancedMesh>(null)
  const legRef = useRef<THREE.InstancedMesh>(null)
  const eyeRef = useRef<THREE.InstancedMesh>(null)
  const mouthRef = useRef<THREE.InstancedMesh>(null)

  // A small downward-opening smile arc shared by every spectator, drawn in its
  // local XY plane so it can be rotated to face inward toward the stage.
  const smileGeometry = useMemo(() => {
    const geo = new THREE.TorusGeometry(0.07, 0.018, 6, 14, Math.PI)
    geo.rotateZ(Math.PI) // flip the arch into a smile
    return geo
  }, [])

  // Solid, gently curved theater-chair backrest shared by every seat.
  // Built in the seat's local axes: X = radial (thickness), Y = up (height),
  // Z = tangential (width along the row). Extruding a thin curved band and
  // re-orienting it keeps the panel solid from every camera angle.
  const backGeometry = useMemo(() => {
    const width = 1.12 // along the row
    const height = 0.98 // vertical
    const thickness = 0.16 // radial depth
    const curve = 0.14 // how far the edges wrap back
    const segs = 14
    const half = width / 2
    const front = (x: number) => curve * (x / half) ** 2

    const shape = new THREE.Shape()
    shape.moveTo(-half, front(-half))
    for (let i = 1; i <= segs; i++) {
      const x = -half + (i / segs) * width
      shape.lineTo(x, front(x))
    }
    for (let i = segs; i >= 0; i--) {
      const x = -half + (i / segs) * width
      shape.lineTo(x, front(x) + thickness)
    }
    shape.closePath()

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: false,
      steps: 1,
    })
    // Extrude axes are X=width, Y=thickness, Z=height. Re-map to the seat's
    // local frame so height runs up (Y) and thickness runs radially (X).
    geo.rotateX(-Math.PI / 2)
    geo.rotateY(-Math.PI / 2)
    geo.center()
    geo.computeVertexNormals()
    return geo
  }, [])

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D()
    const seatCol = new THREE.Color()
    seats.forEach((seat, i) => {
      const { angle, radius, y } = seat
      // Tangential unit vector (points sideways along the row).
      const tx = -Math.sin(angle)
      const tz = Math.cos(angle)

      // Per-seat color from the row palette. The cushion shows the full hue;
      // base, backrest, and armrests use progressively darker shades so each
      // chair stays cohesive.
      const base = SEAT_COLORS[seat.tier % SEAT_COLORS.length]
      cushionRef.current?.setColorAt(i, seatCol.set(base))
      baseRef.current?.setColorAt(i, seatCol.set(base).multiplyScalar(0.5))
      backRef.current?.setColorAt(i, seatCol.set(base).multiplyScalar(0.62))
      armLRef.current?.setColorAt(i, seatCol.set(base).multiplyScalar(0.5))
      armRRef.current?.setColorAt(i, seatCol.set(base).multiplyScalar(0.5))

      // One solid lower base under each chair.
      dummy.position.set(
        Math.cos(angle) * radius,
        y - 0.12,
        Math.sin(angle) * radius,
      )
      dummy.rotation.set(0, -angle, 0)
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      baseRef.current?.setMatrixAt(i, dummy.matrix)

      // Padded seat cushion, centered on the base.
      dummy.position.set(
        Math.cos(angle) * radius,
        y + 0.1,
        Math.sin(angle) * radius,
      )
      dummy.updateMatrix()
      cushionRef.current?.setMatrixAt(i, dummy.matrix)

      // Curved backrest sitting directly behind and touching the cushion's
      // back edge, its top around shoulder/head height.
      dummy.position.set(
        Math.cos(angle) * (radius + 0.5),
        y + 0.72,
        Math.sin(angle) * (radius + 0.5),
      )
      dummy.rotation.set(0, -angle, 0)
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      backRef.current?.setMatrixAt(i, dummy.matrix)

      // Long padded armrest running from the front of the seat into the backrest.
      dummy.position.set(
        Math.cos(angle) * (radius + 0.32) + tx * 0.52,
        y + 0.5,
        Math.sin(angle) * (radius + 0.32) + tz * 0.52,
      )
      dummy.rotation.set(0, -angle, 0)
      dummy.updateMatrix()
      armLRef.current?.setMatrixAt(i, dummy.matrix)

      // Matching long padded armrest on the other side.
      dummy.position.set(
        Math.cos(angle) * (radius + 0.32) - tx * 0.52,
        y + 0.5,
        Math.sin(angle) * (radius + 0.32) - tz * 0.52,
      )
      dummy.rotation.set(0, -angle, 0)
      dummy.updateMatrix()
      armRRef.current?.setMatrixAt(i, dummy.matrix)
    })
    for (const r of [baseRef, cushionRef, backRef, armLRef, armRRef]) {
      if (r.current) {
        r.current.instanceMatrix.needsUpdate = true
        if (r.current.instanceColor) r.current.instanceColor.needsUpdate = true
      }
    }
  }, [seats])

  useLayoutEffect(() => {
    const dummy = new THREE.Object3D()
    const color = new THREE.Color()
    const HIDDEN = new THREE.Matrix4().makeScale(0, 0, 0)
    spectators.forEach((sp, i) => {
      const { angle, radius, y, lean } = sp
      // Sit slightly toward the stage from the cushion center so the backrest
      // stays behind the spectator instead of intersecting their torso.
      const bx = Math.cos(angle) * (radius - 0.22)
      const bz = Math.sin(angle) * (radius - 0.22)

      // Seated torso resting against the backrest.
      dummy.position.set(bx, y + 0.62, bz)
      dummy.rotation.set(lean, -angle, 0)
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      bodyRef.current?.setMatrixAt(i, dummy.matrix)
      bodyRef.current?.setColorAt(i, color.set(sp.shirt))

      // Seated arms resting on the armrests, facing inward toward the stage.
      for (const side of [-1, 1]) {
        const tx = -Math.sin(angle) * side
        const tz = Math.cos(angle) * side
        dummy.position.set(bx + tx * 0.48, y + 0.78, bz + tz * 0.48)
        dummy.rotation.set(0, -angle, side * 0.08)
        dummy.scale.set(0.72, 0.18, 0.18)
        dummy.updateMatrix()
        armRef.current?.setMatrixAt(i * 2 + (side === 1 ? 1 : 0), dummy.matrix)
        armRef.current?.setColorAt(i * 2 + (side === 1 ? 1 : 0), color.set(sp.skin))
      }

      // Relaxed bent legs, tucked beneath the seat.
      for (const side of [-1, 1]) {
        const tx = -Math.sin(angle) * side
        const _tz = Math.cos(angle) * side
        dummy.position.set(bx + tx * 0.22, y + 0.34, bz - Math.sin(angle) * 0.34)
        dummy.rotation.set(0.18, -angle, 0)
        dummy.scale.set(0.2, 0.58, 0.2)
        dummy.updateMatrix()
        legRef.current?.setMatrixAt(i * 2 + (side === 1 ? 1 : 0), dummy.matrix)
        legRef.current?.setColorAt(i * 2 + (side === 1 ? 1 : 0), color.set('#2b2730'))
      }

      // Head.
      dummy.position.set(bx, y + 1.28, bz)
      dummy.rotation.set(0, -angle, 0)
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      headRef.current?.setMatrixAt(i, dummy.matrix)
      headRef.current?.setColorAt(i, color.set(sp.skin))

      // Simple friendly face on the inward-facing side of the head (toward the
      // stage). inward = toward ring center; tangential = sideways along row.
      const hx = bx
      const hy = y + 1.28
      const hz = bz
      const inx = -Math.cos(angle)
      const inz = -Math.sin(angle)
      const txn = -Math.sin(angle)
      const tzn = Math.cos(angle)
      // Two eyes.
      for (const side of [-1, 1]) {
        dummy.position.set(
          hx + inx * 0.185 + txn * 0.075 * side,
          hy + 0.05,
          hz + inz * 0.185 + tzn * 0.075 * side,
        )
        dummy.rotation.set(0, -angle, 0)
        dummy.scale.setScalar(1)
        dummy.updateMatrix()
        eyeRef.current?.setMatrixAt(i * 2 + (side === 1 ? 1 : 0), dummy.matrix)
      }
      // Smile — ring plane oriented so its face points inward toward center.
      dummy.position.set(
        hx + inx * 0.185,
        hy - 0.055,
        hz + inz * 0.185,
      )
      dummy.rotation.set(0, -(angle + Math.PI / 2), 0)
      dummy.scale.setScalar(1)
      dummy.updateMatrix()
      mouthRef.current?.setMatrixAt(i, dummy.matrix)

      // Varied audience hairstyles: short crop, long hair, curly volume, ponytail.
      const hairY = sp.hairStyle === 1 ? y + 1.2 : y + 1.43
      const hairScale = sp.hairStyle === 0
        ? [1.05, 0.55, 1.05]
        : sp.hairStyle === 1
          ? [1.15, 1.5, 1.12]
          : sp.hairStyle === 2
            ? [1.32, 1.15, 1.3]
            : [1.08, 0.75, 1.08]
      dummy.position.set(bx, hairY, bz)
      dummy.rotation.set(0, -angle, 0)
      dummy.scale.set(hairScale[0], hairScale[1], hairScale[2])
      dummy.updateMatrix()
      hairRef.current?.setMatrixAt(i, dummy.matrix)
      hairRef.current?.setColorAt(i, color.set(sp.hair))

      // Ponytail gathered behind the head for style 3.
      if (sp.hairStyle === 3) {
        const px = bx - Math.cos(angle) * 0.22
        const pz = bz - Math.sin(angle) * 0.22
        dummy.position.set(px, y + 1.23, pz)
        dummy.rotation.set(0, -angle, 0)
        dummy.scale.set(0.62, 1.05, 0.62)
        dummy.updateMatrix()
        ponyRef.current?.setMatrixAt(i, dummy.matrix)
      } else {
        ponyRef.current?.setMatrixAt(i, HIDDEN)
      }
      ponyRef.current?.setColorAt(i, color.set(sp.hair))

      // Optional party hat.
      if (sp.hasHat) {
        dummy.position.set(bx, y + 1.55, bz)
        dummy.rotation.set(0, -angle, 0)
        dummy.scale.setScalar(1)
        dummy.updateMatrix()
        hatRef.current?.setMatrixAt(i, dummy.matrix)
      } else {
        hatRef.current?.setMatrixAt(i, HIDDEN)
      }
      hatRef.current?.setColorAt(i, color.set(sp.hat))
    })
    for (const r of [bodyRef, headRef, hatRef, hairRef, ponyRef, armRef, legRef, eyeRef, mouthRef]) {
      if (r.current) {
        r.current.instanceMatrix.needsUpdate = true
        if (r.current.instanceColor) r.current.instanceColor.needsUpdate = true
      }
    }
  }, [spectators])

  // Radial aisle staircases.
  const stairs = useMemo(
    () => [0, 90, 180, 270].map((d) => (d * Math.PI) / 180),
    [],
  )

  // Two railed staircases flanking the stage backdrop, sitting on the edges
  // of the cleared wedge behind the ring.
  const flankStairs = useMemo(
    () => [
      STAGE_GAP_CENTER - STAGE_GAP_HALF + 0.12,
      STAGE_GAP_CENTER + STAGE_GAP_HALF - 0.12,
    ],
    [],
  )
  const stairSlope = Math.atan2(TIER_RISE, TIER_DEPTH)
  const stairRun = TIERS * TIER_DEPTH
  const stairRise = TIERS * TIER_RISE
  const railLen = Math.hypot(stairRun, stairRise)

  return (
    <group>
      {/* Concrete/carpet bowl */}
      <mesh geometry={bowlGeometry} castShadow receiveShadow>
        <meshStandardMaterial
          color="#4a1418"
          side={THREE.DoubleSide}
          roughness={0.95}
        />
      </mesh>

      {/* One solid pedestal/base under every cinema-style chair */}
      <instancedMesh
        ref={baseRef}
        args={[undefined, undefined, seats.length]}
        castShadow
        receiveShadow
        frustumCulled={false}
      >
        <boxGeometry args={[1.3, 0.45, 1.05]} />
        <meshStandardMaterial color="#ffffff" roughness={0.75} />
      </instancedMesh>

      {/* Individual padded seat cushions */}
      <instancedMesh
        ref={cushionRef}
        args={[undefined, undefined, seats.length]}
        castShadow
        receiveShadow
        frustumCulled={false}
      >
        <boxGeometry args={[1.16, 0.3, 0.88]} />
        <meshStandardMaterial color="#ffffff" roughness={0.55} />
      </instancedMesh>

      {/* Individual curved, solid seat backrests */}
      <instancedMesh
        ref={backRef}
        args={[backGeometry, undefined, seats.length]}
        castShadow
        frustumCulled={false}
      >
        <meshStandardMaterial color="#ffffff" roughness={0.7} side={THREE.DoubleSide} />
      </instancedMesh>

      {/* Left armrests */}
      <instancedMesh
        ref={armLRef}
        args={[undefined, undefined, seats.length]}
        castShadow
        frustumCulled={false}
      >
        <boxGeometry args={[0.92, 0.24, 0.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </instancedMesh>

      {/* Right armrests */}
      <instancedMesh
        ref={armRRef}
        args={[undefined, undefined, seats.length]}
        castShadow
        frustumCulled={false}
      >
        <boxGeometry args={[0.92, 0.24, 0.2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </instancedMesh>

      {/* Arms and legs make each spectator read as seated */}
      <instancedMesh ref={armRef} args={[undefined, undefined, spectators.length * 2]} castShadow>
        <capsuleGeometry args={[0.11, 0.42, 5, 8]} />
        <meshStandardMaterial roughness={0.85} />
      </instancedMesh>
      <instancedMesh ref={legRef} args={[undefined, undefined, spectators.length * 2]} castShadow>
        <capsuleGeometry args={[0.13, 0.42, 5, 8]} />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>

      {/* Hair caps and ponytails: varied short, long, curly, and ponytail styles */}
      <instancedMesh ref={hairRef} args={[undefined, undefined, spectators.length]} castShadow>
        <sphereGeometry args={[0.22, 12, 10]} />
        <meshStandardMaterial roughness={0.85} />
      </instancedMesh>
      <instancedMesh ref={ponyRef} args={[undefined, undefined, spectators.length]} castShadow>
        <sphereGeometry args={[0.22, 12, 10]} />
        <meshStandardMaterial roughness={0.85} />
      </instancedMesh>

      {/* Audience silhouettes (rounded torso) */}
      <instancedMesh
        ref={bodyRef}
        args={[undefined, undefined, spectators.length]}
        castShadow
      >
        <capsuleGeometry args={[0.34, 0.5, 6, 12]} />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>

      {/* Audience silhouettes (head) */}
      <instancedMesh
        ref={headRef}
        args={[undefined, undefined, spectators.length]}
        castShadow
      >
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial roughness={0.9} />
      </instancedMesh>

      {/* Friendly faces: dark eyes + a smile, facing the stage */}
      <instancedMesh
        ref={eyeRef}
        args={[undefined, undefined, spectators.length * 2]}
        frustumCulled={false}
      >
        <sphereGeometry args={[0.033, 8, 8]} />
        <meshStandardMaterial color="#241a1e" roughness={0.5} />
      </instancedMesh>
      <instancedMesh
        ref={mouthRef}
        args={[smileGeometry, undefined, spectators.length]}
        frustumCulled={false}
      >
        <meshStandardMaterial color="#3a2226" roughness={0.55} />
      </instancedMesh>

      {/* Aisle staircases: purple/blue steps rising with each tier */}
      {stairs.map((angle, i) => (
        <group key={i} rotation={[0, -angle, 0]}>
          {Array.from({ length: TIERS }).map((_, t) => {
            const r = START_RADIUS + t * TIER_DEPTH + TIER_DEPTH / 2
            const y = t * TIER_RISE + TIER_RISE / 2
            return (
              <mesh
                key={t}
                castShadow
                receiveShadow
                position={[r, y, 0]}
              >
                <boxGeometry args={[TIER_DEPTH, TIER_RISE, 1.7]} />
                <meshStandardMaterial
                  color={t % 2 === 0 ? '#5b4c93' : '#48619f'}
                  roughness={0.72}
                />
              </mesh>
            )
          })}
        </group>
      ))}

      {/* Railed staircases flanking the stage backdrop */}
      {flankStairs.map((angle, i) => (
        <group key={`flank-${i}`} rotation={[0, -angle, 0]}>
          {/* Red steps rising with each tier */}
          {Array.from({ length: TIERS }).map((_, t) => {
            const r = START_RADIUS + t * TIER_DEPTH + TIER_DEPTH / 2
            const y = t * TIER_RISE + TIER_RISE / 2
            return (
              <mesh key={t} castShadow receiveShadow position={[r, y, 0]}>
                <boxGeometry args={[TIER_DEPTH, TIER_RISE, 1.5]} />
                <meshStandardMaterial color="#9e2226" roughness={0.72} />
              </mesh>
            )
          })}

          {/* Silver tubular handrails on both sides of the run */}
          {[-1, 1].map((side) => (
            <group key={side}>
              <mesh
                position={[
                  START_RADIUS + stairRun / 2,
                  stairRise / 2 + 1.15,
                  side * 0.78,
                ]}
                rotation={[0, 0, stairSlope]}
              >
                <cylinderGeometry args={[0.06, 0.06, railLen, 12]} />
                <meshStandardMaterial
                  color="#cfd3d8"
                  metalness={0.85}
                  roughness={0.3}
                />
              </mesh>
              {/* Vertical posts holding the rail at every tier */}
              {Array.from({ length: TIERS + 1 }).map((_, p) => {
                const r = START_RADIUS + p * TIER_DEPTH
                const y = p * TIER_RISE
                return (
                  <mesh
                    key={p}
                    position={[r, y + 0.6, side * 0.78]}
                  >
                    <cylinderGeometry args={[0.05, 0.05, 1.2, 10]} />
                    <meshStandardMaterial
                      color="#b8bcc2"
                      metalness={0.85}
                      roughness={0.35}
                    />
                  </mesh>
                )
              })}
            </group>
          ))}
        </group>
      ))}
    </group>
  )
}
