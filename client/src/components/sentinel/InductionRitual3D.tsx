'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function RitualGoldenKey({ mousePos }: { mousePos: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const outerWardsRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    // Mouse parallax
    groupRef.current.rotation.y = delta * 0.4 + mousePos.x * 0.45;
    groupRef.current.rotation.x = -mousePos.y * 0.3;

    // Counter-rotating concentric ritual rings
    if (ringRef.current) ringRef.current.rotation.z += delta * 0.7;
    if (outerWardsRef.current) outerWardsRef.current.rotation.z -= delta * 0.45;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central Golden Master Key */}
      {/* Bow / Handle */}
      <mesh position={[0, 0.75, 0]}>
        <torusGeometry args={[0.42, 0.05, 16, 48]} />
        <meshStandardMaterial
          color="#C5A46D"
          metalness={0.95}
          roughness={0.15}
          emissive="#6E1025"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Key Shaft */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 1.4, 16]} />
        <meshStandardMaterial
          color="#C5A46D"
          metalness={0.95}
          roughness={0.15}
        />
      </mesh>
      {/* Key Bit / Notches */}
      <mesh position={[0.18, -0.65, 0]}>
        <boxGeometry args={[0.28, 0.35, 0.06]} />
        <meshStandardMaterial color="#C5A46D" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Outer Concentric Ritual Ward Rings */}
      <group ref={outerWardsRef}>
        <mesh>
          <torusGeometry args={[1.35, 0.03, 16, 64]} />
          <meshStandardMaterial
            color="#6E1025"
            metalness={0.8}
            roughness={0.2}
            emissive="#6E1025"
            emissiveIntensity={1.2}
          />
        </mesh>
        <mesh rotation={[0.4, 0.4, 0]}>
          <torusGeometry args={[1.65, 0.02, 16, 64]} />
          <meshStandardMaterial
            color="#FFE4AD"
            metalness={0.9}
            roughness={0.2}
            emissive="#FFE4AD"
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>

      {/* Inner Glowing Crystal Core */}
      <mesh ref={ringRef} position={[0, 0.75, 0]}>
        <octahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial
          color="#FFE4AD"
          emissive="#FFE4AD"
          emissiveIntensity={2.5}
        />
      </mesh>

      <pointLight color="#FFE4AD" intensity={3.5} distance={5} position={[0, 0.75, 0]} />
      <pointLight color="#6E1025" intensity={2.5} distance={4} position={[0, -0.5, 0]} />
    </group>
  );
}

export const InductionRitual3D: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
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
    return (
      <div className="w-full h-full bg-cover bg-center opacity-40" style={{ backgroundImage: "url('/halloween/gothic_vault_chamber.jpg')" }} />
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden select-none">
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 4.0]} fov={42} />
        <ambientLight intensity={0.4} color="#0B1020" />
        <directionalLight position={[3, 5, 4]} intensity={1.5} color="#AFC7E8" />

        <Float speed={1.8} rotationIntensity={0.5} floatIntensity={0.6}>
          <RitualGoldenKey mousePos={mousePos} />
        </Float>

        {/* Ambient Ritual Embers */}
        <Sparkles count={45} scale={[6, 6, 4]} size={3.0} speed={0.45} opacity={0.65} color="#C5A46D" />
        <Sparkles count={30} scale={[5, 5, 3]} size={2.5} speed={0.6} opacity={0.5} color="#6E1025" />
      </Canvas>
    </div>
  );
};
