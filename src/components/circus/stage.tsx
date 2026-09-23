'use client'

import { useMemo } from 'react'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import {
  createCurtainTexture,
  createVerticalGradientTexture,
  createStripeTexture,
} from './textures'

function Prop({
  children,
  position,
}: {
  children: React.ReactNode
  position: [number, number, number]
}) {
  return <group position={position}>{children}</group>
}

/** Flat five-pointed star facing +Z, used on the door valance and banner crest. */
function StarShape({
  position,
  rotation = [0, 0, 0],
  size = 0.4,
  color = '#d6323b',
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  size?: number
  color?: string
}) {
  const geo = useMemo(() => {
    const shape = new THREE.Shape()
    const spikes = 5
    const outer = size
    const inner = size * 0.45
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outer : inner
      const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2
      const x = Math.cos(a) * r
      const y = Math.sin(a) * r
      if (i === 0) shape.moveTo(x, y)
      else shape.lineTo(x, y)
    }
    shape.closePath()
    return new THREE.ShapeGeometry(shape)
  }, [size])

  return (
    <mesh position={position} rotation={rotation} geometry={geo}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.35}
        side={THREE.DoubleSide}
        roughness={0.5}
      />
    </mesh>
  )
}

const BANNER_TITLE = 'RẠP XIẾC BỎ TÚI'

/**
 * Banner title rendered letter-by-letter along the ribbon's parabolic sag so
 * the text visually sits ON the curved banner surface. Uses a single bold,
 * rounded font (Baloo 2) with full Vietnamese glyph coverage so every letter
 * — including diacritics — matches.
 */
function CurvedBannerText({ texture }: { texture: THREE.Texture }) {
  const layout = useMemo(() => {
    const chars = Array.from(BANNER_TITLE)
    const half = 9.5 // matches the ribbon half-width / bulb border
    const dip = 1.1 // matches makeBannerGeometry sag
    const step = 1.0 // world units of horizontal advance per weight unit
    const weightOf = (c: string) => (c === ' ' ? 0.5 : c === 'I' ? 0.55 : 1)
    const weights = chars.map(weightOf)
    const total = weights.reduce((a, b) => a + b, 0)
    let acc = 0
    return chars.map((ch, i) => {
      const center = acc + weights[i] / 2
      acc += weights[i]
      const x = (center - total / 2) * step
      // Follow the ribbon centerline and its local slope.
      const y = -dip * (1 - (x / half) ** 2)
      const rz = Math.atan((2 * dip * x) / half ** 2)
      return { ch, x, y, rz, key: i }
    })
  }, [])

  return (
    <group>
      {layout.map(({ ch, x, y, rz, key }) =>
        ch === ' ' ? null : (
          <Text
            key={key}
            font="/fonts/Baloo2-Bold.ttf"
            position={[x, y, 0.07]}
            rotation={[0, 0, rz]}
            fontSize={1.5}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.05}
            outlineColor="#8f1620"
          >
            {ch}
            <meshBasicMaterial map={texture} toneMapped={false} />
          </Text>
        ),
      )}
    </group>
  )
}

/** Wavy swallowtail banner ribbon that sags gently in the middle. */
function makeBannerGeometry(w: number, h: number, dip: number, notch: number) {
  const half = w / 2
  const seg = 48
  const yc = (x: number) => -dip * (1 - (x / half) ** 2)
  const shape = new THREE.Shape()
  for (let i = 0; i <= seg; i++) {
    const x = -half + (i / seg) * w
    const y = yc(x) + h / 2
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  // Right swallowtail (fishtail) end
  shape.lineTo(half - notch, yc(half))
  shape.lineTo(half, yc(half) - h / 2)
  for (let i = seg; i >= 0; i--) {
    const x = -half + (i / seg) * w
    shape.lineTo(x, yc(x) - h / 2)
  }
  // Left swallowtail end
  shape.lineTo(-half + notch, yc(-half))
  shape.closePath()
  const geo = new THREE.ShapeGeometry(shape)
  // Normalize UVs to the bounding box so a vertical gradient maps across the
  // whole ribbon (ShapeGeometry otherwise uses raw XY coords as UVs).
  geo.computeBoundingBox()
  const bb = geo.boundingBox!
  const sx = bb.max.x - bb.min.x
  const sy = bb.max.y - bb.min.y
  const pos = geo.attributes.position
  const uv = new Float32Array(pos.count * 2)
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getX(i) - bb.min.x) / sx
    uv[i * 2 + 1] = (pos.getY(i) - bb.min.y) / sy
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  return geo
}

const PENNANT_COLORS = ['#d6323b', '#f2c94a', '#2e8b8b', '#f4ecd8', '#e0691f']

function BambooPole({ rotation = 0 }: { rotation?: number }) {
  return (
    <group rotation={[0, 0, rotation]}>
      <mesh castShadow position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.13, 0.16, 4.4, 12]} />
        <meshStandardMaterial color="#6f9f45" roughness={0.85} />
      </mesh>
      {[0.55, 1.55, 2.55, 3.55].map((y) => (
        <mesh key={y} castShadow position={[0, y, 0]}>
          <torusGeometry args={[0.145, 0.045, 8, 16]} />
          <meshStandardMaterial color="#8d8143" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function ConicalHat() {
  return (
    <group rotation={[0.08, 0, -0.08]}>
      <mesh castShadow position={[0, 0.7, 0]}>
        <coneGeometry args={[0.85, 0.85, 32]} />
        <meshStandardMaterial color="#d8bd78" roughness={0.95} />
      </mesh>
      <mesh castShadow position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.67, 0.055, 8, 32]} />
        <meshStandardMaterial color="#a9894d" roughness={0.9} />
      </mesh>
    </group>
  )
}

export function Stage() {
  const curtainTexture = useMemo(() => createCurtainTexture(), [])
  const signGradient = useMemo(() => createVerticalGradientTexture(), [])
  const drumTexture = useMemo(
    () => createStripeTexture('#d21f27', '#f4ecd8', 2, 14),
    [],
  )
  const skirtTexture = useMemo(
    () => createStripeTexture('#c31f28', '#f4ecd8', 1, 48),
    [],
  )
  const tentIconTexture = useMemo(
    () => createStripeTexture('#d21f27', '#f6ecd6', 1, 6),
    [],
  )
  const bannerGold = useMemo(() => makeBannerGeometry(19, 3.0, 1.1, 1.5), [])
  const bannerRed = useMemo(() => makeBannerGeometry(19.9, 3.6, 1.15, 1.7), [])

  // Rich vertical gold gradient (bright shine on top → deep gold below).
  const goldGradient = useMemo(() => {
    const t = createVerticalGradientTexture([
      [0, '#fff6cf'],
      [0.4, '#f4cd55'],
      [0.72, '#e0a92e'],
      [1, '#b47c22'],
    ])
    t.flipY = true // put the bright stop along the banner's top edge
    t.needsUpdate = true
    return t
  }, [])

  // A single downward-pointing pennant triangle shared by the bunting string.
  const pennantGeo = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-0.6, 0)
    s.lineTo(0.6, 0)
    s.lineTo(0, -1.05)
    s.closePath()
    return new THREE.ShapeGeometry(s)
  }, [])

  // Pennant anchor points strung across the top edge, following the sag.
  const pennants = useMemo(() => {
    const N = 15
    const half = 9.5
    return Array.from({ length: N }, (_, i) => {
      const x = -8.7 + (i / (N - 1)) * 17.4
      const yc = -1.1 * (1 - (x / half) ** 2)
      return { x, y: yc + 2.25 }
    })
  }, [])

  // Draped theater wing curtain (cánh gà): a tall panel rippled into vertical
  // pleats so the fabric reads with folds and depth. Gathered slightly narrower
  // toward the floor like a real hanging drape.
  const wingCurtainGeo = useMemo(() => {
    const w = 2.7
    const h = 7.4
    const wSeg = 60
    const hSeg = 24
    const pleats = 6
    const geo = new THREE.PlaneGeometry(w, h, wSeg, hSeg)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const v = (y + h / 2) / h // 0 (floor) .. 1 (top)
      const u = (x + w / 2) / w // 0 .. 1
      // Pleat depth grows a little toward the floor where fabric pools.
      const amp = 0.22 + (1 - v) * 0.12
      const z = Math.sin(u * Math.PI * pleats) * amp
      pos.setZ(i, z)
      // Gently taper the panel inward at the very bottom for a hung look.
      const taper = 1 - Math.pow(1 - v, 3) * 0.12
      pos.setX(i, x * taper)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <group>
      {/* Red & white striped stage skirt */}
      <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[8, 8.4, 0.6, 64]} />
        <meshStandardMaterial map={skirtTexture} roughness={0.7} />
      </mesh>

      {/* Warm cream / ivory performance floor */}
      <mesh position={[0, 0.62, 0]} receiveShadow>
        <cylinderGeometry args={[7.9, 7.9, 0.08, 64]} />
        <meshStandardMaterial color="#e2cfa0" roughness={0.78} />
      </mesh>

      {/* Red rim ring around the floor edge */}
      <mesh position={[0, 0.67, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7.4, 7.95, 64]} />
        <meshStandardMaterial
          color="#b31f28"
          roughness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* --- Props arranged across the white ring, matching the reference --- */}

      {/* Red & white striped drum podium (center) */}
      <Prop position={[0, 0.66, 2.4]}>
        <mesh position={[0, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.95, 0.95, 1.1, 32]} />
          <meshStandardMaterial map={drumTexture} roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.12, 0]}>
          <cylinderGeometry args={[1.0, 1.0, 0.12, 32]} />
          <meshStandardMaterial color="#e8b93a" metalness={0.3} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.02, 0]}>
          <cylinderGeometry args={[1.0, 1.0, 0.12, 32]} />
          <meshStandardMaterial color="#e8b93a" metalness={0.3} roughness={0.4} />
        </mesh>
      </Prop>

      {/* Four enlarged drums evenly divided outside the stage edge */}
      {[
        { x: -4.55, z: 4.2, scale: 1.14 },
        { x: -3.35, z: 4.55, scale: 1.08 },
        { x: 3.35, z: 4.55, scale: 1.08 },
        { x: 4.55, z: 4.2, scale: 1.14 },
      ].map((drum, i) => (
        <Prop key={`center-drum-${i}`} position={[drum.x, 0.66, drum.z]}>
          <group scale={drum.scale}>
            <mesh position={[0, 0.62, 0]} castShadow>
              <cylinderGeometry args={[0.58, 0.66, 1.05, 24]} />
              <meshStandardMaterial color={i % 2 ? '#ef5b55' : '#f04a43'} roughness={0.62} />
            </mesh>
            <mesh position={[0, 1.16, 0]} castShadow>
              <cylinderGeometry args={[0.6, 0.6, 0.1, 24]} />
              <meshStandardMaterial color="#ffd45a" metalness={0.42} roughness={0.28} />
            </mesh>
            <mesh position={[0, 0.08, 0]}>
              <cylinderGeometry args={[0.61, 0.61, 0.08, 24]} />
              <meshStandardMaterial color="#ffd45a" metalness={0.42} roughness={0.28} />
            </mesh>
          </group>
        </Prop>
      ))}

      {/* Short green club resting on the floor (left-center) */}
      <Prop position={[-0.9, 0.66, 3.1]}>
        <mesh position={[0, 0.42, 0]} rotation={[0, 0, 0.15]} castShadow>
          <capsuleGeometry args={[0.13, 0.52, 6, 12]} />
          <meshStandardMaterial color="#3aa66b" roughness={0.4} />
        </mesh>
      </Prop>

      {/* --- Backdrop velvet curtain --- */}
      <mesh position={[0, 4.8, -6.5]}>
        <cylinderGeometry
          args={[9.5, 9.5, 9.6, 64, 1, true, Math.PI * 0.65, Math.PI * 0.7]}
        />
        <meshStandardMaterial
          map={curtainTexture}
          color="#8f1620"
          side={THREE.DoubleSide}
          roughness={0.9}
        />
      </mesh>

      {/* Curtain valance top */}
      <mesh position={[0, 9.8, -6.5]}>
        <cylinderGeometry
          args={[9.7, 9.7, 1.3, 64, 1, true, Math.PI * 0.65, Math.PI * 0.7]}
        />
        <meshStandardMaterial
          color="#e8b93a"
          side={THREE.DoubleSide}
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>

  {/* Vietnamese-themed stage decorations near both front edges */}
  {[
    { x: -6.2, z: -4.8, tilt: -0.16 },
    { x: -5.0, z: -3.8, tilt: 0.12 },
    { x: -4.0, z: -5.2, tilt: -0.08 },
    { x: 4.0, z: -5.2, tilt: 0.08 },
    { x: 5.0, z: -3.8, tilt: -0.12 },
    { x: 6.2, z: -4.8, tilt: 0.16 },
    { x: 5.4, z: -5.8, tilt: -0.06 },
  ].map((tree) => (
    <group key={`${tree.x}-${tree.z}`} position={[tree.x, 0.62, tree.z]}>
      <mesh castShadow position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.42, 0.54, 0.44, 20]} />
        <meshStandardMaterial color="#7c5a32" roughness={0.95} />
      </mesh>
      <BambooPole rotation={tree.tilt} />
    </group>
  ))}
  {[
    [-3.2, -6.4, -0.18],
    [-2.2, -6.7, 0.16],
    [2.2, -6.7, -0.16],
    [3.2, -6.4, 0.18],
  ].map(([x, z, tilt], index) => (
    <group key={`hat-${index}`} position={[x, 0.92, z]} rotation={[0, 0.2, tilt]}>
      <ConicalHat />
    </group>
  ))}

  {/* --- Performers' entrance: gold-framed doorway with a star valance --- */}
  <group position={[0, 0.62, -7.0]}>
        {/* Draped red velvet wing curtains (cánh gà) framing both sides of the
            doorway. Set behind the gold frame and angled so their outer edges
            recede, layering over the dark tent wall for a sense of depth. */}
        {[-1, 1].map((dir) => (
          <mesh
            key={`wing-${dir}`}
            geometry={wingCurtainGeo}
            position={[dir * 3.05, 3.7, -0.35]}
            rotation={[0, dir * 0.5, 0]}
            castShadow
          >
            <meshStandardMaterial
              map={curtainTexture}
              color="#7d1119"
              emissive="#2c060a"
              emissiveIntensity={0.35}
              roughness={0.92}
              metalness={0.04}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}

        {/* Dark doorway opening */}
        <mesh position={[0, 3.0, 0]}>
          <planeGeometry args={[3.0, 6.0]} />
          <meshStandardMaterial
            color="#1a0b08"
            emissive="#2a1109"
            emissiveIntensity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Short red curtain draped inside the top of the doorway */}
        <mesh position={[0, 4.7, 0.06]}>
          <planeGeometry args={[3.0, 1.7]} />
          <meshStandardMaterial
            map={curtainTexture}
            color="#8f1620"
            side={THREE.DoubleSide}
            roughness={0.9}
          />
        </mesh>

        {/* Parted red drapes gathered to each side of the opening */}
        {[-1, 1].map((dir, i) => (
          <mesh key={i} position={[dir * 1.02, 2.7, 0.12]}>
            <cylinderGeometry
              args={[0.42, 0.58, 5.2, 14, 1, true, Math.PI * 0.5, Math.PI]}
            />
            <meshStandardMaterial
              map={curtainTexture}
              color="#8f1620"
              side={THREE.DoubleSide}
              roughness={0.9}
            />
          </mesh>
        ))}

        {/* Vietnamese national flag mounted on the dark wall above the doorway */}
        <group position={[0, 5.35, 0.5]}>
          <mesh>
            <planeGeometry args={[3.2, 1.9]} />
            <meshStandardMaterial color="#DA251D" roughness={0.8} side={THREE.DoubleSide} />
          </mesh>
          <StarShape position={[0, 0, 0.02]} rotation={[0, 0, Math.PI]} size={0.72} color="#FFCD00" />
        </group>

        {/* Gold frame: two side posts + lintel */}
        {[-1.65, 1.65].map((x, i) => (
          <mesh key={i} position={[x, 3.0, 0.1]}>
            <boxGeometry args={[0.32, 6.2, 0.32]} />
            <meshStandardMaterial
              color="#e8b93a"
              metalness={0.5}
              roughness={0.35}
              emissive="#8a6a1a"
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}
        <mesh position={[0, 6.15, 0.1]}>
          <boxGeometry args={[3.7, 0.4, 0.32]} />
          <meshStandardMaterial
            color="#e8b93a"
            metalness={0.5}
            roughness={0.35}
            emissive="#8a6a1a"
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Gold valance with a red star crowning the doorway */}
        <mesh position={[0, 6.75, 0.12]}>
          <boxGeometry args={[3.9, 0.7, 0.22]} />
          <meshStandardMaterial
            color="#f0c94a"
            metalness={0.4}
            roughness={0.4}
            emissive="#b58a1e"
            emissiveIntensity={0.4}
          />
        </mesh>
        <StarShape position={[0, 6.75, 0.28]} size={0.42} color="#d6323b" />
      </group>

      {/* Glowing marquee sign — raised above the seating and enlarged */}
      <group position={[0, 11.9, -6.1]} scale={1.14}>
        {/* Dedicated light to brighten the sign */}
        <pointLight
          position={[0, 0, 4]}
          intensity={62}
          color="#ffe9b0"
          distance={26}
          decay={1.6}
        />
        {/* Subtle warm glow behind the sign so it reads as the centerpiece */}
        <pointLight
          position={[0, 0.5, -1]}
          intensity={20}
          color="#ffbf5a"
          distance={16}
          decay={1.8}
        />
        {/* Wavy swallowtail ribbon banner: red border behind a gold face */}
        <mesh geometry={bannerRed} position={[0, 0, -0.22]}>
          <meshStandardMaterial
            color="#b31f28"
            emissive="#5a1013"
            emissiveIntensity={0.45}
            side={THREE.DoubleSide}
            roughness={0.7}
          />
        </mesh>
        <mesh geometry={bannerGold} position={[0, 0, -0.12]}>
          <meshStandardMaterial
            map={goldGradient}
            color="#ffffff"
            emissive="#c78f22"
            emissiveIntensity={0.4}
            metalness={0.55}
            roughness={0.28}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Small red circus-tent icon centered above the banner */}
        <group position={[0, 2.4, 0.1]}>
          <mesh>
            <coneGeometry args={[1.5, 1.9, 20]} />
            <meshStandardMaterial map={tentIconTexture} roughness={0.7} />
          </mesh>
          {/* Dark doorway */}
          <mesh position={[0, -0.75, 1.45]}>
            <planeGeometry args={[0.5, 0.7]} />
            <meshStandardMaterial color="#2a0d10" side={THREE.DoubleSide} />
          </mesh>
          {/* Flag pole + pennant on top */}
          <mesh position={[0, 1.2, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.7, 6]} />
            <meshStandardMaterial color="#c9a24a" metalness={0.4} />
          </mesh>
          <mesh position={[0.28, 1.4, 0]}>
            <planeGeometry args={[0.5, 0.26]} />
            <meshStandardMaterial color="#d6323b" side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Suspension ropes angling up to the rig on both sides */}
        {[-1, 1].map((dir, i) => (
          <mesh
            key={i}
            position={[dir * 8.4, 2.6, 0]}
            rotation={[0, 0, dir * 0.5]}
          >
            <cylinderGeometry args={[0.05, 0.05, 4.2, 6]} />
            <meshStandardMaterial color="#e8dcc4" roughness={0.85} />
          </mesh>
        ))}

        {/* Bulb border following the wavy top & bottom edges */}
        {Array.from({ length: 38 }).map((_, i) => {
          const half = 9.5
          const x = -9.1 + (i / 37) * 18.2
          const yc = -1.1 * (1 - (x / half) ** 2)
          return (
            <group key={i}>
              <mesh position={[x, yc + 1.65, 0.15]}>
                <sphereGeometry args={[0.13, 12, 12]} />
                <meshStandardMaterial
                  color="#fff6d6"
                  emissive="#ffd873"
                  emissiveIntensity={3.2}
                />
              </mesh>
              <mesh position={[x, yc - 1.65, 0.15]}>
                <sphereGeometry args={[0.13, 12, 12]} />
                <meshStandardMaterial
                  color="#fff6d6"
                  emissive="#ffd873"
                  emissiveIntensity={3.2}
                />
              </mesh>
            </group>
          )
        })}

        {/* String of triangular pennant flags strung across the top edge */}
        {pennants.slice(0, -1).map((p, i) => {
          const q = pennants[i + 1]
          const mx = (p.x + q.x) / 2
          const my = (p.y + q.y) / 2
          const dx = q.x - p.x
          const dy = q.y - p.y
          return (
            <mesh
              key={`str-${i}`}
              position={[mx, my, 0.12]}
              rotation={[0, 0, Math.atan2(dy, dx)]}
            >
              <boxGeometry args={[Math.hypot(dx, dy), 0.05, 0.05]} />
              <meshStandardMaterial color="#4a2b12" roughness={0.85} />
            </mesh>
          )
        })}
        {pennants.map((p, i) => (
          <mesh
            key={`pen-${i}`}
            geometry={pennantGeo}
            position={[p.x, p.y, 0.1]}
          >
            <meshStandardMaterial
              color={PENNANT_COLORS[i % PENNANT_COLORS.length]}
              emissive={PENNANT_COLORS[i % PENNANT_COLORS.length]}
              emissiveIntensity={0.22}
              roughness={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}

        <CurvedBannerText texture={signGradient} />
      </group>

      {/* Decorative gold hoops hanging on ropes, flanking the backdrop */}
      {[-1, 1].map((dir, i) => (
        <group key={i} position={[dir * 5.8, 0, -4.4]}>
          <mesh position={[0, 9.2, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 4.4, 6]} />
            <meshStandardMaterial color="#e8dcc4" roughness={0.85} />
          </mesh>
          <mesh position={[0, 6.1, 0]}>
            <torusGeometry args={[1.0, 0.08, 12, 40]} />
            <meshStandardMaterial
              color="#e8b93a"
              metalness={0.5}
              roughness={0.35}
              emissive="#8a6a1a"
              emissiveIntensity={0.25}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}
