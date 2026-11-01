'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

/**
 * FloatingCryptographicTalisman: Interactive 3D antique gold & ruby crest
 * representing the Butler's sovereign security ward.
 */
function FloatingCryptographicTalisman({ mousePos }: { mousePos: { x: number; y: number } }) {
  const meshRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smooth inertia mouse tracking
    meshRef.current.rotation.y += delta * 0.4 + (mousePos.x * 0.8 - meshRef.current.rotation.y) * 0.05;
    meshRef.current.rotation.x += delta * 0.2 + (-mousePos.y * 0.5 - meshRef.current.rotation.x) * 0.05;

    // Counter-rotating mechanical rings
    if (ringRef.current) ringRef.current.rotation.z -= delta * 0.8;
    if (outerRingRef.current) outerRingRef.current.rotation.z += delta * 0.5;

    // Pulsing inner ruby core
    if (coreRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2.5) * 0.08;
      coreRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={meshRef} position={[2.2, 0.2, 0]}>
      {/* Outer Cryptographic Vault Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[1.5, 0.05, 16, 64]} />
        <meshStandardMaterial
          color="#C6A56B"
          metalness={0.9}
          roughness={0.2}
          emissive="#3A101A"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Middle Iron Gate Ring with Notches */}
      <mesh ref={ringRef} rotation={[0.4, 0.4, 0]}>
        <torusGeometry args={[1.2, 0.04, 16, 32]} />
        <meshStandardMaterial
          color="#9E2638"
          metalness={0.8}
          roughness={0.3}
          emissive="#9E2638"
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Inner Octahedron / Ruby Soul Core */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial
          color="#F3D9A4"
          metalness={0.3}
          roughness={0.1}
          emissive="#C6A56B"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Point light emitted by talisman */}
      <pointLight color="#F3D9A4" intensity={1.5} distance={5} />
      <pointLight color="#9E2638" intensity={2.2} distance={3} />
    </group>
  );
}

/**
 * GothicAtmosphere3D: 3D volumetric moonlight and floating ember dust
 */
function GothicAtmosphere3D() {
  return (
    <>
      <ambientLight intensity={0.4} color="#151219" />
      <directionalLight
        position={[-5, 8, 4]}
        intensity={1.2}
        color="#F3D9A4"
        castShadow
      />
      <pointLight position={[0, -2, 2]} intensity={0.8} color="#9E2638" />

      {/* Floating 3D Embers and Candle Dust */}
      <Sparkles
        count={70}
        scale={[12, 10, 8]}
        size={2.5}
        speed={0.4}
        opacity={0.7}
        color="#F3D9A4"
      />
      <Sparkles
        count={35}
        scale={[10, 8, 6]}
        size={3}
        speed={0.6}
        opacity={0.5}
        color="#9E2638"
      />
    </>
  );
}

/**
 * MansionThreeScene: Responsive 3D Canvas integrated into the cinematic hero
 */
export const MansionThreeScene: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setIsSupported(false);
    } catch {
      setIsSupported(false);
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Normalized between -1 and 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!isSupported) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden hidden md:block">
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <GothicAtmosphere3D />
        <Float speed={1.8} rotationIntensity={0.6} floatIntensity={0.8}>
          <FloatingCryptographicTalisman mousePos={mousePos} />
        </Float>
      </Canvas>
    </div>
  );
};
