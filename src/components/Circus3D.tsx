import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { Button } from "@/src/components/ui/button";
import { circusAudio } from "@/src/utils/audio";
import { useLanguage } from "@/src/context/LanguageContext";
import { CIRCUS_3D_URL } from "@/src/lib/constants";
import rapXiec3dCoverImg from "@/src/assets/images/rap_xiec_3d_cover.jpg";
import confetti from "canvas-confetti";
import { 
  ArrowLeft, 
  RotateCw, 
  Camera, 
  Sparkles, 
  Lightbulb, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Layers, 
  Volume2,
  ExternalLink,
  Sliders,
  RotateCcw
} from "lucide-react";

interface Circus3DProps {
  onBack: () => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const Circus3D: React.FC<Circus3DProps> = ({
  onBack,
  onUnlockBadge,
}) => {
  const { isEn } = useLanguage();
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState<'overview' | 'audience' | 'center' | 'wire'>('overview');
  const [lightScheme, setLightScheme] = useState<'gold' | 'carnival' | 'magic'>('gold');
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  // References to hold Three.js objects across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const lightsRef = useRef<{
    spotlight1: THREE.SpotLight;
    spotlight2: THREE.SpotLight;
    ambientLight: THREE.AmbientLight;
  } | null>(null);
  const animatedGroupRef = useRef<THREE.Group | null>(null);
  const trapezeRef = useRef<THREE.Group | null>(null);
  const trapezeArtistRef = useRef<THREE.Group | null>(null);
  const somersaultArtistRef = useRef<THREE.Group | null>(null);
  const tightropeArtistRef = useRef<THREE.Group | null>(null);
  const jugglerArtistRef = useRef<THREE.Group | null>(null);
  const jugglerRingsRef = useRef<THREE.Mesh[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const rotationAngleRef = useRef({ x: 0.3, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x1a0606); // Deep circus tent twilight burgundy
    scene.fog = new THREE.FogExp2(0x1a0606, 0.015);

    // 2. Camera setup
    const width = container.clientWidth || 800;
    const height = 480;
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 22, 38);
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xfff3d4, 0.7);
    scene.add(ambientLight);

    const spotlight1 = new THREE.SpotLight(0xffdd66, 4.0);
    spotlight1.position.set(12, 35, 12);
    spotlight1.angle = Math.PI / 6;
    spotlight1.penumbra = 0.6;
    spotlight1.castShadow = true;
    scene.add(spotlight1);

    const spotlight2 = new THREE.SpotLight(0xff3344, 3.0);
    spotlight2.position.set(-12, 35, -12);
    spotlight2.angle = Math.PI / 6;
    spotlight2.penumbra = 0.6;
    scene.add(spotlight2);

    lightsRef.current = { spotlight1, spotlight2, ambientLight };

    // 5. Circus Construction
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);
    animatedGroupRef.current = worldGroup;

    // Arena Floor (Sand ring)
    const ringFloorGeo = new THREE.CircleGeometry(14, 48);
    const ringFloorMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Warm ochre sand
      roughness: 0.9,
    });
    const ringFloor = new THREE.Mesh(ringFloorGeo, ringFloorMat);
    ringFloor.rotation.x = -Math.PI / 2;
    ringFloor.receiveShadow = true;
    worldGroup.add(ringFloor);

    // Outer Velvet Curb (Border barrier)
    const curbGeo = new THREE.TorusGeometry(14.2, 0.55, 16, 64);
    const curbMat = new THREE.MeshStandardMaterial({
      color: 0x991b1b, // Crimson velvet
      roughness: 0.5,
    });
    const curb = new THREE.Mesh(curbGeo, curbMat);
    curb.rotation.x = -Math.PI / 2;
    curb.position.y = 0.3;
    worldGroup.add(curb);

    // Gold studs along the curb
    const studGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const studMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.2,
    });
    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const stud = new THREE.Mesh(studGeo, studMat);
      stud.position.set(Math.cos(angle) * 14.2, 0.6, Math.sin(angle) * 14.2);
      worldGroup.add(stud);
    }

    // Pedestals
    const pedestalGeo = new THREE.CylinderGeometry(1.6, 2.0, 1.2, 16);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0xb91c1c,
      roughness: 0.4,
    });
    const centerPedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    centerPedestal.position.set(0, 0.6, 0);
    centerPedestal.castShadow = true;
    worldGroup.add(centerPedestal);

    // Big Top Tent Canopy Cone
    const tentTopGeo = new THREE.ConeGeometry(24, 18, 32, 1, true);
    const tentTopMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      side: THREE.DoubleSide,
      roughness: 0.7,
    });
    const tentTop = new THREE.Mesh(tentTopGeo, tentTopMat);
    tentTop.position.set(0, 24, 0);
    worldGroup.add(tentTop);

    // Tent Stripes (Yellow Contrasting alternating panels)
    for (let i = 0; i < 16; i += 2) {
      const stripeGeo = new THREE.ConeGeometry(24.05, 18, 2, 1, true, (i / 16) * Math.PI * 2, (1 / 16) * Math.PI * 2);
      const stripeMat = new THREE.MeshStandardMaterial({
        color: 0xfde047,
        side: THREE.DoubleSide,
        roughness: 0.7,
      });
      const stripeMesh = new THREE.Mesh(stripeGeo, stripeMat);
      stripeMesh.position.set(0, 24, 0);
      worldGroup.add(stripeMesh);
    }

    // Central Tent Mast / Pole
    const poleGeo = new THREE.CylinderGeometry(0.35, 0.35, 34, 12);
    const poleMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.7,
      roughness: 0.3,
    });
    const centerPole = new THREE.Mesh(poleGeo, poleMat);
    centerPole.position.set(0, 17, 0);
    worldGroup.add(centerPole);

    // Golden Vietnam Star on Mast Peak
    const starShape = new THREE.Shape();
    const points = 5;
    const outerRadius = 1.4;
    const innerRadius = 0.6;
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius;
      if (i === 0) starShape.moveTo(x, y);
      else starShape.lineTo(x, y);
    }
    const starGeo = new THREE.ShapeGeometry(starShape);
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.1,
      side: THREE.DoubleSide,
    });
    const starMesh = new THREE.Mesh(starGeo, starMat);
    starMesh.position.set(0, 33.5, 0);
    worldGroup.add(starMesh);

    // High Wire Stretched Across
    const wireGeo = new THREE.CylinderGeometry(0.06, 0.06, 26, 8);
    const wireMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9 });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    wireMesh.position.set(0, 15, 0);
    wireMesh.rotation.z = Math.PI / 2;
    worldGroup.add(wireMesh);

    // Trapeze Swing
    const trapeze = new THREE.Group();
    trapeze.position.set(0, 20, 0);
    const ropeLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 8, 6), wireMat);
    ropeLeft.position.set(-1.8, -4, 0);
    const ropeRight = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 8, 6), wireMat);
    ropeRight.position.set(1.8, -4, 0);
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4.2, 8), poleMat);
    bar.rotation.z = Math.PI / 2;
    bar.position.set(0, -8, 0);
    trapeze.add(ropeLeft, ropeRight, bar);

    // ==========================================
    // 🎭 3D PERFORMING CIRCUS ARTISTS (NGHỆ SĨ XIẾC)
    // ==========================================
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xffd1b3, roughness: 0.5 });
    const costumeRedMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3, metalness: 0.2 });
    const costumeGoldMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.7, roughness: 0.2 });
    const costumeBlueMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.4 });
    const costumeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.8 });

    // 1. 🌟 NGHỆ SĨ ĐU BAY (Trapeze Aerial Flyer - Treo mình lộn ngược trên thanh đu)
    const trapezeArtist = new THREE.Group();
    trapezeArtist.position.set(0, -8.1, 0);

    // Legs hooked over the trapeze bar
    const legGeo = new THREE.CylinderGeometry(0.16, 0.12, 1.6, 8);
    const leftThigh = new THREE.Mesh(legGeo, costumeGoldMat);
    leftThigh.position.set(-0.55, 0.6, 0.2);
    leftThigh.rotation.x = Math.PI / 3;
    const rightThigh = new THREE.Mesh(legGeo, costumeGoldMat);
    rightThigh.position.set(0.55, 0.6, 0.2);
    rightThigh.rotation.x = Math.PI / 3;

    // Torso hanging down
    const torsoGeo = new THREE.CylinderGeometry(0.42, 0.32, 2.0, 10);
    const trapezeTorso = new THREE.Mesh(torsoGeo, costumeRedMat);
    trapezeTorso.position.set(0, -1.0, 0);

    // Head
    const headGeo = new THREE.SphereGeometry(0.38, 12, 12);
    const trapezeHead = new THREE.Mesh(headGeo, skinMat);
    trapezeHead.position.set(0, -2.4, 0);
    const trapezeHair = new THREE.Mesh(new THREE.SphereGeometry(0.4, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2), hairMat);
    trapezeHair.position.set(0, -2.4, 0);
    trapezeHair.rotation.x = Math.PI;

    // Arms outstretched gracefully downwards in the air
    const armGeo = new THREE.CylinderGeometry(0.12, 0.09, 1.7, 8);
    const leftArm = new THREE.Mesh(armGeo, skinMat);
    leftArm.position.set(-0.85, -1.5, 0);
    leftArm.rotation.z = -0.55;
    const rightArm = new THREE.Mesh(armGeo, skinMat);
    rightArm.position.set(0.85, -1.5, 0);
    rightArm.rotation.z = 0.55;

    trapezeArtist.add(leftThigh, rightThigh, trapezeTorso, trapezeHead, trapezeHair, leftArm, rightArm);
    trapeze.add(trapezeArtist);
    trapezeArtistRef.current = trapezeArtist;

    worldGroup.add(trapeze);
    trapezeRef.current = trapeze;

    // 2. 🤸 NGHỆ SĨ NHÀO LỘN TRUNG TÂM (Central Somersault Acrobats)
    const somersaultGroup = new THREE.Group();
    somersaultGroup.position.set(0, 1.8, 0);

    // Acrobatic Performer
    const tumbler = new THREE.Group();
    const tTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.3, 1.8, 10), costumeGoldMat);
    const tHead = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), skinMat);
    tHead.position.set(0, 1.25, 0);
    const tHair = new THREE.Mesh(new THREE.SphereGeometry(0.37, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2), hairMat);
    tHair.position.set(0, 1.3, 0);

    const tLeftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.08, 1.4, 8), costumeRedMat);
    tLeftArm.position.set(-0.65, 0.5, 0);
    tLeftArm.rotation.z = 0.7;
    const tRightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.08, 1.4, 8), costumeRedMat);
    tRightArm.position.set(0.65, 0.5, 0);
    tRightArm.rotation.z = -0.7;

    const tLeftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.1, 1.6, 8), costumeWhiteMat);
    tLeftLeg.position.set(-0.35, -1.2, 0);
    const tRightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.1, 1.6, 8), costumeWhiteMat);
    tRightLeg.position.set(0.35, -1.2, 0);

    tumbler.add(tTorso, tHead, tHair, tLeftArm, tRightArm, tLeftLeg, tRightLeg);
    somersaultGroup.add(tumbler);
    worldGroup.add(somersaultGroup);
    somersaultArtistRef.current = somersaultGroup;

    // 3. ⚖️ NGHỆ SĨ ĐI TRÊN DÂY CAO (Tightrope High-Wire Walker with Balancing Pole)
    const tightropeWalker = new THREE.Group();
    tightropeWalker.position.set(0, 15.05, 0);

    const trTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.26, 1.7, 10), costumeBlueMat);
    trTorso.position.set(0, 1.8, 0);
    const trHead = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), skinMat);
    trHead.position.set(0, 2.9, 0);

    // Tightrope Legs balancing on wire
    const trLegL = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 1.6, 8), costumeWhiteMat);
    trLegL.position.set(-0.15, 0.8, 0.3);
    trLegL.rotation.x = -0.15;
    const trLegR = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 1.6, 8), costumeWhiteMat);
    trLegR.position.set(0.15, 0.8, -0.3);
    trLegR.rotation.x = 0.15;

    // Long Balancing Pole across tightrope
    const balancePoleGeo = new THREE.CylinderGeometry(0.06, 0.06, 11, 8);
    const balancePoleMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
    const balancePole = new THREE.Mesh(balancePoleGeo, balancePoleMat);
    balancePole.rotation.z = Math.PI / 2;
    balancePole.position.set(0, 2.0, 0);

    tightropeWalker.add(trTorso, trHead, trLegL, trLegR, balancePole);
    worldGroup.add(tightropeWalker);
    tightropeArtistRef.current = tightropeWalker;

    // 4. 🤹 NGHỆ SĨ TUNG HỨNG VÒNG SÁNG (Stage Ring Juggler)
    const jugglerGroup = new THREE.Group();
    jugglerGroup.position.set(-5.5, 0.3, 3.5);

    const jTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.28, 1.7, 10), costumeRedMat);
    jTorso.position.set(0, 1.7, 0);
    const jHead = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), skinMat);
    jHead.position.set(0, 2.8, 0);
    const jHat = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.45, 0.6, 10), costumeBlueMat);
    jHat.position.set(0, 3.2, 0);

    const jLegL = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.09, 1.5, 8), costumeWhiteMat);
    jLegL.position.set(-0.25, 0.75, 0);
    const jLegR = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.09, 1.5, 8), costumeWhiteMat);
    jLegR.position.set(0.25, 0.75, 0);

    const jArmL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 1.3, 8), skinMat);
    jArmL.position.set(-0.55, 1.9, 0.5);
    jArmL.rotation.x = -Math.PI / 4;
    const jArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 1.3, 8), skinMat);
    jArmR.position.set(0.55, 1.9, 0.5);
    jArmR.rotation.x = -Math.PI / 4;

    jugglerGroup.add(jTorso, jHead, jHat, jLegL, jLegR, jArmL, jArmR);

    // Glowing Juggling Torus Rings
    const ringGeo = new THREE.TorusGeometry(0.35, 0.07, 8, 24);
    const ringColors = [0xfacc15, 0xef4444, 0x3b82f6, 0x10b981];
    const rings: THREE.Mesh[] = [];
    for (let k = 0; k < 4; k++) {
      const ringM = new THREE.Mesh(ringGeo, new THREE.MeshStandardMaterial({
        color: ringColors[k],
        emissive: ringColors[k],
        emissiveIntensity: 0.6,
        roughness: 0.2
      }));
      ringM.rotation.x = Math.PI / 3;
      ringM.position.set(0, 3.2 + k * 0.8, 0.5);
      jugglerGroup.add(ringM);
      rings.push(ringM);
    }
    jugglerRingsRef.current = rings;
    worldGroup.add(jugglerGroup);
    jugglerArtistRef.current = jugglerGroup;

    // Audience Benches Amphitheater Rings
    for (let r = 17; r <= 23; r += 2) {
      const benchRingGeo = new THREE.TorusGeometry(r, 0.45, 8, 48, Math.PI * 1.7);
      const benchMat = new THREE.MeshStandardMaterial({
        color: 0x78350f, // Wooden benches
        roughness: 0.8,
      });
      const benchRing = new THREE.Mesh(benchRingGeo, benchMat);
      benchRing.rotation.x = -Math.PI / 2;
      benchRing.position.y = (r - 16) * 0.9;
      worldGroup.add(benchRing);
    }

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // 1. 🪢 Trapeze Swing & Flyer Aerial Dynamics
      if (trapezeRef.current) {
        const swingAngle = Math.sin(elapsedTime * 2.0) * 0.45;
        trapezeRef.current.rotation.z = swingAngle;
        
        // Flyer body gently bends with G-force at the peaks of the swing
        if (trapezeArtistRef.current) {
          trapezeArtistRef.current.rotation.z = Math.sin(elapsedTime * 2.0 + 0.3) * 0.2;
          trapezeArtistRef.current.rotation.x = Math.cos(elapsedTime * 4.0) * 0.15;
        }
      }

      // 2. 🤸 Central Acrobatic Somersaults & Gymnastics Jump
      if (somersaultArtistRef.current) {
        // High vertical spring jumps up from pedestal
        const jumpPhase = (elapsedTime * 2.5) % Math.PI;
        const jumpHeight = Math.abs(Math.sin(jumpPhase)) * 3.8;
        somersaultArtistRef.current.position.y = 1.8 + jumpHeight;

        // Dynamic forward somersault flip in mid-air
        somersaultArtistRef.current.rotation.x = elapsedTime * 4.8;
        // Subtle celebratory pirouette spin
        somersaultArtistRef.current.rotation.y = Math.sin(elapsedTime * 2.0) * 0.6;
      }

      // 3. ⚖️ High-Wire Tightrope Walker Walking & Balancing
      if (tightropeArtistRef.current) {
        // Pacing back and forth across high wire (-8 to +8)
        const walkPos = Math.sin(elapsedTime * 0.7) * 7.5;
        tightropeArtistRef.current.position.x = walkPos;

        // Small rhythmic step bobbing
        tightropeArtistRef.current.position.y = 15.05 + Math.abs(Math.sin(elapsedTime * 4.0)) * 0.18;

        // Realistic balancing pole counter-wobble
        const wobble = Math.sin(elapsedTime * 3.2) * 0.18;
        tightropeArtistRef.current.rotation.z = wobble;
        // Facing direction of motion
        tightropeArtistRef.current.rotation.y = Math.cos(elapsedTime * 0.7) >= 0 ? 0 : Math.PI;
      }

      // 4. 🤹 Juggler Ring Cascade Trajectories
      if (jugglerArtistRef.current && jugglerRingsRef.current.length > 0) {
        // Slight upper body sway
        jugglerArtistRef.current.rotation.y = Math.sin(elapsedTime * 2.5) * 0.2;

        jugglerRingsRef.current.forEach((ring, idx) => {
          const ringSpeed = 4.2;
          const phase = elapsedTime * ringSpeed + (idx * Math.PI) / 2;
          const arcX = Math.cos(phase) * 1.35;
          const arcY = Math.abs(Math.sin(phase)) * 2.2 + 2.8;
          ring.position.x = arcX;
          ring.position.y = arcY;
          ring.rotation.z += 0.08;
          ring.rotation.x = Math.PI / 3 + Math.sin(phase) * 0.2;
        });
      }

      // Rotate golden star
      starMesh.rotation.y = elapsedTime * 1.5;

      // Rotate spotlights in sweeping arcs
      spotlight1.position.x = Math.sin(elapsedTime * 0.8) * 14;
      spotlight1.position.z = Math.cos(elapsedTime * 0.8) * 14;
      spotlight1.target.position.set(Math.sin(elapsedTime * 1.2) * 4, 0, Math.cos(elapsedTime * 1.2) * 4);
      spotlight1.target.updateMatrixWorld();

      spotlight2.position.x = Math.cos(elapsedTime * 0.6) * -14;
      spotlight2.position.z = Math.sin(elapsedTime * 0.6) * -14;

      // Auto rotation when enabled and not dragging
      if (isRotating && !isDraggingRef.current && animatedGroupRef.current) {
        animatedGroupRef.current.rotation.y += 0.004;
      }

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Mouse / Touch Dragging Controls for Orbiting
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMousePosRef.current = { x: clientX, y: clientY };
      if (!hasInteracted) {
        setHasInteracted(true);
        onUnlockBadge('circus-3d-explorer');
      }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current || !animatedGroupRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMousePosRef.current.x;
      const deltaY = clientY - prevMousePosRef.current.y;

      animatedGroupRef.current.rotation.y += deltaX * 0.008;

      if (cameraRef.current) {
        cameraRef.current.position.y = Math.max(8, Math.min(45, cameraRef.current.position.y - deltaY * 0.08));
        cameraRef.current.lookAt(0, 5, 0);
      }

      prevMousePosRef.current = { x: clientX, y: clientY };
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    dom.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // Resize handling
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0] || !cameraRef.current || !rendererRef.current) return;
      const newWidth = entries[0].contentRect.width;
      const newHeight = 480;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    });
    resizeObserver.observe(container);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      dom.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      dom.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      renderer.dispose();
    };
  }, []);

  // Preset Camera Angles
  const setCameraView = (view: 'overview' | 'audience' | 'center' | 'wire') => {
    setActiveView(view);
    circusAudio.playBambooStep();
    if (!cameraRef.current) return;

    if (view === 'overview') {
      cameraRef.current.position.set(0, 24, 38);
      cameraRef.current.lookAt(0, 4, 0);
    } else if (view === 'audience') {
      cameraRef.current.position.set(0, 8, 22);
      cameraRef.current.lookAt(0, 3, 0);
    } else if (view === 'center') {
      cameraRef.current.position.set(0, 3, 7);
      cameraRef.current.lookAt(0, 2, 0);
    } else if (view === 'wire') {
      cameraRef.current.position.set(12, 17, 12);
      cameraRef.current.lookAt(0, 14, 0);
    }
  };

  // Switch Lighting Themes
  const switchLightScheme = (scheme: 'gold' | 'carnival' | 'magic') => {
    setLightScheme(scheme);
    circusAudio.playMagicChime();
    if (!lightsRef.current) return;

    if (scheme === 'gold') {
      lightsRef.current.spotlight1.color.setHex(0xffdd66);
      lightsRef.current.spotlight2.color.setHex(0xffaa22);
      lightsRef.current.ambientLight.color.setHex(0xfff3d4);
    } else if (scheme === 'carnival') {
      lightsRef.current.spotlight1.color.setHex(0x10b981); // emerald green
      lightsRef.current.spotlight2.color.setHex(0xec4899); // hot pink
      lightsRef.current.ambientLight.color.setHex(0xfef08a);
    } else if (scheme === 'magic') {
      lightsRef.current.spotlight1.color.setHex(0x38bdf8); // sky cyan
      lightsRef.current.spotlight2.color.setHex(0xa855f7); // purple
      lightsRef.current.ambientLight.color.setHex(0xc7d2fe);
    }
  };

  const trigger3DConfetti = () => {
    circusAudio.playFanfare();
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#dc2626', '#facc15', '#3b82f6', '#10b981', '#ffffff'],
    });
  };

  // Framing & positioning controls for the cover banner
  const [isAdjustingCover, setIsAdjustingCover] = useState(false);
  const [coverOffsetY, setCoverOffsetY] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('circus_3d_cover_offset_y');
      if (saved) return Number(saved);
    }
    return 50;
  });
  const [coverZoom, setCoverZoom] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('circus_3d_cover_zoom');
      if (saved) return Number(saved);
    }
    return 100;
  });

  const handleUpdateCoverOffsetY = (val: number) => {
    setCoverOffsetY(val);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('circus_3d_cover_offset_y', String(val));
      } catch {}
    }
  };

  const handleUpdateCoverZoom = (val: number) => {
    setCoverZoom(val);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('circus_3d_cover_zoom', String(val));
      } catch {}
    }
  };

  const handleResetCoverPosition = () => {
    circusAudio.playBambooStep();
    setCoverOffsetY(50);
    setCoverZoom(100);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('circus_3d_cover_offset_y');
        localStorage.removeItem('circus_3d_cover_zoom');
      } catch {}
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12 select-none">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-1.5 bg-white shadow-xs cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          <span>{isEn ? "Back to Main Stage" : "Về Sân Khấu Chính"}</span>
        </Button>

        <div className="flex items-center gap-2">
          <Link
            to={CIRCUS_3D_URL}
            onClick={() => onUnlockBadge('circus-3d-explorer')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-circus text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md border border-amber-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title={isEn ? "Enter 3D Circus" : "Mở Rạp Xiếc 3D"}
          >
            <ExternalLink className="size-3.5" />
            <span>{isEn ? "Enter 3D Circus" : "Vào Rạp Xiếc 3D"}</span>
          </Link>

          <Button
            variant="gold"
            size="sm"
            onClick={trigger3DConfetti}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="size-3.5" />
            <span>{isEn ? "Stage Confetti" : "Pháo Hoa Sân Khấu 3D"}</span>
          </Button>
        </div>
      </div>

      {/* Cover Photo Banner: Rạp Xiếc 3D with Framing Controls */}
      <div className="space-y-2">
        <div className="relative w-full h-44 sm:h-56 md:h-64 rounded-3xl overflow-hidden border-2 border-amber-400 shadow-xl shrink-0 group select-none">
          <img
            src={rapXiec3dCoverImg}
            alt="Không Gian Rạp Xiếc 3D"
            style={{
              objectPosition: `center ${coverOffsetY}%`,
              transform: `scale(${coverZoom / 100})`,
            }}
            className="w-full h-full object-cover transition-transform duration-200"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25" />

          {/* Action button on top left: Toggle frame adjustment controls */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                circusAudio.playBambooStep();
                setIsAdjustingCover((prev) => !prev);
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer backdrop-blur-md ${
                isAdjustingCover
                  ? "bg-amber-400 text-neutral-950 ring-2 ring-amber-300"
                  : "bg-black/70 hover:bg-black/90 text-amber-200 hover:text-white border border-white/20"
              }`}
              title={isEn ? "Adjust Cover Frame Position & Zoom" : "Căn chỉnh vị trí & kích cỡ khung ảnh bìa"}
            >
              <Sliders className="size-3.5 text-amber-400" />
              <span>{isEn ? (isAdjustingCover ? "Done Adjusting" : "Adjust Frame") : (isAdjustingCover ? "Xong Căn Chỉnh" : "Căn Chỉnh Khung Ảnh")}</span>
            </button>
          </div>

          <div className="absolute bottom-4 left-5 sm:left-7 right-5 sm:right-7 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
            <div className="space-y-1.5 max-w-xl">
              <h2 className="font-circus text-xl sm:text-3xl text-amber-300 drop-shadow-md leading-tight">
                {isEn ? "3D CIRCUS ARENA & PERFORMANCE STAGE" : "KHÔNG GIAN RẠP XIẾC 3D ĐA CHIỀU"}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-200 line-clamp-2 drop-shadow-sm font-light">
                {isEn
                  ? "Experience the grand circus dome, circular sand arena, floating sea creatures, and vibrant lighting from every angle."
                  : "Trải nghiệm rạp xiếc mái vòm hoành tráng, đấu trường cát trung tâm và hiệu ứng ánh sáng huyền ảo 360 độ từ mọi góc nhìn."}
              </p>
            </div>

            <Link
              to={CIRCUS_3D_URL}
              onClick={() => {
                circusAudio.playFanfare();
                onUnlockBadge('circus-3d-explorer');
              }}
              className="shrink-0 flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-red-950 font-circus font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer border border-amber-200"
            >
              <span>{isEn ? "Enter Dedicated 3D Arena" : "Mở Không Gian 3D Toàn Cảnh"}</span>
              <ExternalLink className="size-4" />
            </Link>
          </div>
        </div>

        {/* Panel căn chỉnh khung ảnh bìa khi người dùng bật chế độ chỉnh sửa */}
        {isAdjustingCover && (
          <div className="bg-amber-50/95 border-2 border-amber-400/80 rounded-2xl p-4 sm:p-5 shadow-lg space-y-4 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="size-4 text-red-700" />
                <h4 className="font-circus text-sm sm:text-base text-amber-950">
                  {isEn ? "Cover Photo Framing & Position Controls" : "Bảng Căn Chỉnh Khung Ảnh Bìa"}
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetCoverPosition}
                  className="px-3 py-1 text-xs font-semibold rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 cursor-pointer shadow-2xs flex items-center gap-1"
                >
                  <RotateCcw className="size-3" />
                  <span>{isEn ? "Reset" : "Mặc định"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdjustingCover(false)}
                  className="px-3 py-1 text-xs font-bold rounded-lg bg-red-700 text-white hover:bg-red-800 cursor-pointer shadow-2xs"
                >
                  {isEn ? "Close" : "Đóng"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-bold text-neutral-800">
                  <span>{isEn ? "Vertical Position (Up / Down):" : "Vị trí dọc (Kéo lên / Kéo xuống):"}</span>
                  <span className="text-red-700 font-mono">{coverOffsetY}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={coverOffsetY}
                  onChange={(e) => handleUpdateCoverOffsetY(Number(e.target.value))}
                  className="w-full accent-red-700 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500">
                  <span>{isEn ? "Top (0%)" : "Đầu ảnh (0%)"}</span>
                  <span>{isEn ? "Center (50%)" : "Chính giữa (50%)"}</span>
                  <span>{isEn ? "Bottom (100%)" : "Đáy ảnh (100%)"}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-bold text-neutral-800">
                  <span>{isEn ? "Zoom / Scale:" : "Thu phóng ảnh (Zoom):"}</span>
                  <span className="text-red-700 font-mono">{coverZoom}%</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="160"
                  value={coverZoom}
                  onChange={(e) => handleUpdateCoverZoom(Number(e.target.value))}
                  className="w-full accent-red-700 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-500">
                  <span>100% ({isEn ? "Fit" : "Vừa khung"})</span>
                  <span>130%</span>
                  <span>160% ({isEn ? "Zoom In" : "Phóng to"})</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main 3D Canvas Box */}
      <div className="relative w-full rounded-3xl overflow-hidden border-4 border-amber-400 bg-neutral-950 shadow-2xl">
        {/* Interactive 3D WebGL Container */}
        <div 
          ref={mountRef} 
          className="w-full h-[520px] cursor-grab active:cursor-grabbing touch-none"
        />

        {/* Floating Top Badge overlay - Clickable Link */}
        <Link
          to={CIRCUS_3D_URL}
          onClick={() => onUnlockBadge('circus-3d-explorer')}
          title={isEn ? "Click to enter 3D Circus" : "Bấm để vào Rạp Xiếc 3D"}
          className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/75 hover:bg-black/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/30 hover:border-amber-400 text-white text-xs hover:text-amber-300 transition-all cursor-pointer shadow-lg group"
        >
          <span className="animate-pulse size-2 rounded-full bg-emerald-400"></span>
          <span className="font-bold">
            {isEn ? "3D Circus Arena • 360° Orbit" : "Mô Hình Rạp Xiếc 3D • Xoay 360°"}
          </span>
          <ExternalLink className="size-3 text-amber-300 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
        </Link>

        {/* Floating Hint */}
        <div className="absolute top-4 right-4 pointer-events-none hidden sm:flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-amber-300 text-xs font-medium">
          <Compass className="size-3.5" />
          <span>{isEn ? "Drag mouse / swipe to rotate view" : "Kéo chuột / vuốt tay để xoay góc nhìn tự do"}</span>
        </div>

        {/* Bottom Floating Control Bar */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/75 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-white text-xs">
          {/* Preset Camera Views */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
            <span className="font-bold text-amber-300 mr-1 flex items-center gap-1">
              <Camera className="size-3.5" />
              <span>{isEn ? "Angle:" : "Góc máy:"}</span>
            </span>
            {[
              { id: 'overview' as const, label: isEn ? 'Overview' : 'Toàn Cảnh' },
              { id: 'audience' as const, label: isEn ? 'Audience' : 'Ghế Khán Giả' },
              { id: 'center' as const, label: isEn ? 'Center Ring' : 'Sân Khấu Tâm' },
              { id: 'wire' as const, label: isEn ? 'High Wire' : 'Dây Bay Cao' },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setCameraView(v.id)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeView === v.id
                    ? 'bg-amber-400 text-red-950 font-bold shadow'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          {/* Lights & Stage Rotation Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Spotlight theme switch */}
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
              <Lightbulb className="size-3.5 text-amber-400 ml-1" />
              <button
                onClick={() => switchLightScheme('gold')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold cursor-pointer ${
                  lightScheme === 'gold' ? 'bg-amber-400 text-black' : 'text-neutral-300'
                }`}
              >
                {isEn ? "Gold" : "Vàng"}
              </button>
              <button
                onClick={() => switchLightScheme('carnival')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold cursor-pointer ${
                  lightScheme === 'carnival' ? 'bg-pink-500 text-white' : 'text-neutral-300'
                }`}
              >
                {isEn ? "Carnival" : "Lễ Hội"}
              </button>
              <button
                onClick={() => switchLightScheme('magic')}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold cursor-pointer ${
                  lightScheme === 'magic' ? 'bg-sky-500 text-white' : 'text-neutral-300'
                }`}
              >
                {isEn ? "Magic" : "Huyền Ảo"}
              </button>
            </div>

            {/* Auto Rotate Toggle */}
            <button
              onClick={() => {
                setIsRotating(!isRotating);
                circusAudio.playBambooStep();
              }}
              className={`p-1.5 rounded-xl border flex items-center gap-1 font-medium cursor-pointer ${
                isRotating
                  ? 'bg-emerald-600/80 border-emerald-400 text-white'
                  : 'bg-white/10 border-white/20 text-neutral-300'
              }`}
              title={isRotating ? (isEn ? 'Stop Auto-Rotate' : 'Dừng tự xoay') : (isEn ? 'Start Auto-Rotate' : 'Bật tự xoay')}
            >
              <RotateCw className={`size-3.5 ${isRotating ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline text-[11px]">
                {isRotating ? (isEn ? 'Spinning' : 'Đang Xoay') : (isEn ? 'Paused' : 'Tạm Dừng')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Explanatory Architecture & Live Performers Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl p-3.5 border-2 border-amber-200 shadow-xs">
          <div className="text-amber-700 font-bold text-xs uppercase flex items-center gap-1.5 mb-1">
            <span>{isEn ? "🎪 Octagonal Big Top" : "🎪 Mái Lều Bát Giác"}</span>
          </div>
          <p className="text-neutral-600 text-xs leading-relaxed">
            {isEn
              ? "Iconic red-and-gold striped canopy of touring circus tents, topped with a revolving golden star and sweeping colored spotlights."
              : "Mái bạt sọc đỏ vàng biểu tượng của rạp xiếc lưu động, đỉnh gắn ngôi sao vàng xoay tròn và đèn rọi sân khấu đa sắc."}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border-2 border-amber-200 shadow-xs">
          <div className="text-red-700 font-bold text-xs uppercase flex items-center gap-1.5 mb-1">
            <span>{isEn ? "🤸 Somersault Acrobats" : "🤸 Nhào Lộn Bục Trung Tâm"}</span>
          </div>
          <p className="text-neutral-600 text-xs leading-relaxed">
            {isEn
              ? "Dynamic acrobat springing high into mid-air with continuous forward somersaults and aerial gymnastics turns."
              : "Nghệ sĩ xiếc bật nhảy nhào lộn liên tục trên không từ bục trung tâm, phô diễn kỹ năng lộn vòng và xoay tròn điêu luyện."}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border-2 border-amber-200 shadow-xs">
          <div className="text-blue-700 font-bold text-xs uppercase flex items-center gap-1.5 mb-1">
            <span>{isEn ? "⚖️ High-Wire Tightrope" : "⚖️ Đi Dây Căng Thăng Bằng"}</span>
          </div>
          <p className="text-neutral-600 text-xs leading-relaxed">
            {isEn
              ? "Tightrope walker paced at 15 meters altitude with a long golden balancing pole wobbling rhythmically across the arena."
              : "Nghệ sĩ đi thong thả trên sợi dây thép ở độ cao 15m với cây gậy giữ thăng bằng nhịp nhàng qua lại giữa không trung."}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-3.5 border-2 border-amber-200 shadow-xs">
          <div className="text-amber-800 font-bold text-xs uppercase flex items-center gap-1.5 mb-1">
            <span>{isEn ? "🪢 Flying Trapeze & Rings" : "🪢 Đu Bay & Tung Hứng Vòng"}</span>
          </div>
          <p className="text-neutral-600 text-xs leading-relaxed">
            {isEn
              ? "Aerial flyer hanging inverted as the trapeze swings wide overhead, while the ringmaster juggles glowing neon rings below."
              : "Diễn viên đu bay treo mình lộn ngược đung đưa trên cao, phối hợp cùng nghệ sĩ tung hứng các vòng sáng phát quang bên dưới."}
          </p>
        </div>
      </div>
    </div>
  );
};
