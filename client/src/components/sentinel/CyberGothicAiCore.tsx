'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

export type AiCoreState = 'idle' | 'processing' | 'scanning' | 'threat';

interface CyberGothicAiCoreProps {
  state?: AiCoreState;
  className?: string;
  interactive?: boolean;
  onCoreClick?: () => void;
}

/**
 * 3D Living AI Core Mesh:
 * Dark metallic orb, nested orbital rings, glowing teal lines, burnt orange accents,
 * and orbital energy nodes.
 */
function LivingAiCoreMesh({
  coreState,
  mousePos,
  isHovered,
}: {
  coreState: AiCoreState;
  mousePos: { x: number; y: number };
  isHovered: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const innerIcosaRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const nodesGroupRef = useRef<THREE.Group>(null);

  // Dynamic color assignments according to state
  const colors = useMemo(() => {
    switch (coreState) {
      case 'processing':
        return {
          coreEmissive: '#FF6900', // Burnt orange
          ringEmissive: '#19C5C9', // Electric teal
          accent: '#FFAE00',
          speedMult: 2.2,
          pulseSpeed: 4.5,
        };
      case 'scanning':
        return {
          coreEmissive: '#19C5C9', // Electric teal
          ringEmissive: '#00E5FF',
          accent: '#A5B2C0',
          speedMult: 1.8,
          pulseSpeed: 3.5,
        };
      case 'threat':
        return {
          coreEmissive: '#C93646', // Danger red
          ringEmissive: '#991B1B',
          accent: '#FF4D60',
          speedMult: 2.8,
          pulseSpeed: 6.0,
        };
      case 'idle':
      default:
        return {
          coreEmissive: '#19C5C9', // Electric teal idle glow
          ringEmissive: '#C7A56B', // Antique gold
          accent: '#FF6900',       // Burnt orange highlight
          speedMult: 1.0,
          pulseSpeed: 2.0,
        };
    }
  }, [coreState]);

  // Generate 8 satellite orbital data nodes
  const nodes = useMemo(() => {
    const list = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 1.85 + (i % 2) * 0.35;
      list.push({
        id: i,
        initialAngle: angle,
        radius,
        speed: 0.6 + (i % 3) * 0.25,
        elevation: (Math.sin(i * 1.5) * 0.5),
      });
    }
    return list;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;
    const speed = delta * colors.speedMult;

    // Smooth mouse parallax
    const targetRotX = -mousePos.y * 0.35;
    const targetRotY = mousePos.x * 0.5;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.06;
    groupRef.current.rotation.y += speed * 0.4 + (targetRotY - groupRef.current.rotation.y) * 0.06;

    // Orbital Ring 1 (Teal Equator)
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += speed * 0.9;
      ring1Ref.current.rotation.x = Math.sin(time * 0.8) * 0.25;
    }

    // Orbital Ring 2 (Antique Gold Inclined)
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= speed * 0.7;
      ring2Ref.current.rotation.z += speed * 0.3;
    }

    // Orbital Ring 3 (Deep Charcoal Exterior Bracket)
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += speed * 0.5;
      ring3Ref.current.rotation.y += speed * 0.6;
    }

    // Central core pulsation
    if (coreRef.current) {
      const pulse = 1 + Math.sin(time * colors.pulseSpeed) * (coreState === 'processing' ? 0.12 : 0.05);
      coreRef.current.scale.set(pulse, pulse, pulse);
    }

    // Inner geometric cage rotation
    if (innerIcosaRef.current) {
      innerIcosaRef.current.rotation.x -= speed * 1.2;
      innerIcosaRef.current.rotation.y += speed * 1.5;
    }

    // Orbiting data nodes
    if (nodesGroupRef.current) {
      nodesGroupRef.current.children.forEach((child, idx) => {
        const node = nodes[idx];
        if (!node) return;
        const currentAngle = node.initialAngle + time * node.speed * colors.speedMult * 0.5;
        child.position.x = Math.cos(currentAngle) * node.radius;
        child.position.z = Math.sin(currentAngle) * node.radius;
        child.position.y = node.elevation + Math.sin(time * 2 + idx) * 0.15;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Metallic Spherical Core with Geometric Facets */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.78, 32, 32]} />
        <meshStandardMaterial
          color="#101117"
          metalness={0.92}
          roughness={0.15}
          emissive={colors.coreEmissive}
          emissiveIntensity={isHovered ? 1.4 : 0.85}
        />
      </mesh>

      {/* Inner Crystalline Icosahedron Energy Skeleton */}
      <mesh ref={innerIcosaRef}>
        <icosahedronGeometry args={[0.92, 0]} />
        <meshStandardMaterial
          wireframe
          color={colors.accent}
          emissive={colors.accent}
          emissiveIntensity={1.2}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Primary Orbital Ring 1: Electric Teal Energy Torus */}
      <group ref={ring1Ref}>
        <mesh>
          <torusGeometry args={[1.35, 0.028, 16, 64]} />
          <meshStandardMaterial
            color="#19C5C9"
            emissive={colors.ringEmissive}
            emissiveIntensity={1.2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Secondary Orbital Ring 2: Antique Gold Gothic Filigree */}
      <group ref={ring2Ref} rotation={[Math.PI / 4, 0, Math.PI / 6]}>
        <mesh>
          <torusGeometry args={[1.6, 0.032, 16, 64]} />
          <meshStandardMaterial
            color="#C7A56B"
            emissive="#C7A56B"
            emissiveIntensity={0.65}
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>
      </group>

      {/* Tertiary Orbital Ring 3: Segmented Dark Mechanical Arc */}
      <group ref={ring3Ref} rotation={[-Math.PI / 3, Math.PI / 5, 0]}>
        <mesh>
          <torusGeometry args={[1.9, 0.022, 16, 48, Math.PI * 1.5]} />
          <meshStandardMaterial
            color="#A5B2C0"
            emissive={colors.coreEmissive}
            emissiveIntensity={0.5}
            metalness={0.85}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Orbiting Satellite Data Nodes */}
      <group ref={nodesGroupRef}>
        {nodes.map((node) => (
          <mesh key={node.id} position={[node.radius, node.elevation, 0]}>
            <octahedronGeometry args={[0.075, 0]} />
            <meshStandardMaterial
              color="#19C5C9"
              emissive={colors.accent}
              emissiveIntensity={1.5}
            />
          </mesh>
        ))}
      </group>

      {/* Local Point Lights for Atmospheric Volumetric Radiance */}
      <pointLight color={colors.coreEmissive} intensity={3.5} distance={6} />
      <pointLight color={colors.ringEmissive} intensity={2.0} distance={4} position={[0, 1.5, 0]} />
    </group>
  );
}

/**
 * CyberGothicAiCore:
 * Canvas wrapper with responsive mouse tracking, fallback, and status tooltips.
 */
export const CyberGothicAiCore: React.FC<CyberGothicAiCoreProps> = ({
  state = 'idle',
  className = '',
  interactive = true,
  onCoreClick,
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!hasWebGL) {
    // Elegant CSS Fallback
    return (
      <div 
        onClick={onCoreClick}
        className={`relative flex items-center justify-center ${className} cursor-pointer`}
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#0B1924] via-[#19C5C9]/20 to-[#FF6900]/30 border border-[#19C5C9]/40 flex items-center justify-center animate-pulse">
          <div className="w-12 h-12 rounded-full bg-[#101117] border border-[#C7A56B] shadow-[0_0_20px_#19C5C9]" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative ${className} select-none`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onCoreClick}
    >
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: interactive ? 'auto' : 'none' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 4.6]} fov={45} />
        <ambientLight intensity={0.5} color="#0B1924" />
        <directionalLight position={[4, 5, 4]} intensity={1.5} color="#FFE4AD" />
        <directionalLight position={[-4, -3, -2]} intensity={0.8} color="#19C5C9" />

        <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
          <LivingAiCoreMesh
            coreState={state}
            mousePos={mousePos}
            isHovered={isHovered}
          />
        </Float>

        {/* Ambient floating cyber embers */}
        <Sparkles
          count={28}
          scale={[5, 4, 3]}
          size={2}
          speed={0.4}
          opacity={0.4}
          color="#19C5C9"
        />
        <Sparkles
          count={18}
          scale={[4, 4, 3]}
          size={2.5}
          speed={0.5}
          opacity={0.35}
          color="#FF6900"
        />
      </Canvas>
    </div>
  );
};
