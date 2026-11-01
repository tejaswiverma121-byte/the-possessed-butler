'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function StudyDeskArtifact({ mousePos }: { mousePos: { x: number; y: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Mesh>(null);
  const orbRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    // Mouse parallax
    groupRef.current.rotation.y = mousePos.x * 0.4;
    groupRef.current.rotation.x = -mousePos.y * 0.25;

    // Candle flame flicker
    if (flameRef.current) {
      const flicker = 1 + Math.sin(time * 12) * 0.08 + Math.cos(time * 24) * 0.05;
      flameRef.current.scale.set(flicker, flicker * 1.1, flicker);
    }

    // Levitating mysterious study talisman
    if (orbRef.current) {
      orbRef.current.rotation.y += delta * 0.7;
      orbRef.current.rotation.z += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.4, 0]}>
      {/* Antique Mahogany Desk Surface */}
      <mesh position={[0, -0.8, 0]}>
        <boxGeometry args={[3.2, 0.15, 2.0]} />
        <meshStandardMaterial
          color="#151219" // Dark wood
          metalness={0.4}
          roughness={0.7}
          emissive="#3A101A"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Brass Candle Holder */}
      <mesh position={[-0.8, -0.6, 0.2]}>
        <cylinderGeometry args={[0.08, 0.14, 0.35, 16]} />
        <meshStandardMaterial color="#C5A46D" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Candle Wax */}
      <mesh position={[-0.8, -0.32, 0.2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 16]} />
        <meshStandardMaterial color="#FFE4AD" roughness={0.3} />
      </mesh>
      {/* Flickering Flame */}
      <mesh ref={flameRef} position={[-0.8, -0.12, 0.2]}>
        <coneGeometry args={[0.035, 0.12, 12]} />
        <meshStandardMaterial
          color="#FFE4AD"
          emissive="#FF8C1A"
          emissiveIntensity={3.5}
        />
      </mesh>
      <pointLight color="#FFE4AD" intensity={3.0} distance={4.5} position={[-0.8, -0.05, 0.2]} />

      {/* Stack of Antique Leather Volumes */}
      <mesh position={[0.7, -0.65, -0.2]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.65, 0.14, 0.9]} />
        <meshStandardMaterial color="#6E1025" roughness={0.8} />
      </mesh>
      <mesh position={[0.72, -0.52, -0.18]} rotation={[0, -0.15, 0]}>
        <boxGeometry args={[0.6, 0.12, 0.85]} />
        <meshStandardMaterial color="#0B1020" roughness={0.8} />
      </mesh>

      {/* Mysterious Levitating Talisman (Study Centerpiece) */}
      <mesh ref={orbRef} position={[0, 0.45, 0]}>
        <octahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial
          color="#C5A46D"
          metalness={0.95}
          roughness={0.15}
          emissive="#6E1025"
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* Orbiting Gold Ring around Talisman */}
      <mesh position={[0, 0.45, 0]} rotation={[0.6, 0.4, 0]}>
        <torusGeometry args={[0.75, 0.02, 16, 48]} />
        <meshStandardMaterial color="#C5A46D" metalness={0.9} emissive="#C5A46D" emissiveIntensity={0.5} />
      </mesh>
      <pointLight color="#C5A46D" intensity={2.0} distance={3} position={[0, 0.45, 0]} />
    </group>
  );
}

export const PrivateStudy3D: React.FC = () => {
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
      <div className="w-full h-full bg-cover bg-center opacity-40" style={{ backgroundImage: "url('/halloween/mansion_candlelit_library.jpg')" }} />
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden select-none">
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 3.8]} fov={42} />
        <ambientLight intensity={0.35} color="#0B1020" />
        <directionalLight position={[3, 4, 3]} intensity={1.2} color="#FFE4AD" />

        <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.4}>
          <StudyDeskArtifact mousePos={mousePos} />
        </Float>

        {/* Ambient Candle Dust Embers */}
        <Sparkles count={40} scale={[6, 5, 4]} size={2.5} speed={0.4} opacity={0.6} color="#FFE4AD" />
        <Sparkles count={25} scale={[5, 4, 3]} size={3.0} speed={0.5} opacity={0.4} color="#C5A46D" />
      </Canvas>
    </div>
  );
};
