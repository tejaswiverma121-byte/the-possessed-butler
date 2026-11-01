'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface CinematicMansionProps {
  scrollProgress?: number; // 0 (Scene 1) to 1 (Scene 5)
  activeScene?: number;    // 1 to 5
}

/**
 * 3D Butler Silhouette Character:
 * Elegant stylized silhouette standing at the threshold, with dramatic rim lighting,
 * subtle breathing/sway motion, and a faint supernatural ember aura.
 */
function Butler3DFigure({
  mousePos,
  scrollProgress,
}: {
  mousePos: { x: number; y: number };
  scrollProgress: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    // Subtle breathing / idle sway
    groupRef.current.position.y = -1.6 + Math.sin(time * 1.5) * 0.03;
    
    // Head tracks mouse slightly with dignified restraint
    if (headRef.current) {
      headRef.current.rotation.y = mousePos.x * 0.3;
      headRef.current.rotation.x = -mousePos.y * 0.2;
    }

    // Advance forward through the fog as user scrolls from Scene 1 to Scene 3
    groupRef.current.position.z = -1.2 + scrollProgress * 1.4;
  });

  return (
    <group ref={groupRef} position={[0, -1.6, -1.2]}>
      {/* Butler Head */}
      <mesh ref={headRef} position={[0, 2.35, 0]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial
          color="#07070A"
          metalness={0.6}
          roughness={0.4}
          emissive="#AFC7E8"
          emissiveIntensity={0.25} // Cold moon rim
        />
      </mesh>

      {/* High Victorian Collar & Tie Pin */}
      <mesh position={[0, 2.12, 0.05]}>
        <coneGeometry args={[0.18, 0.22, 16]} />
        <meshStandardMaterial
          color="#C5A46D" // Antique Gold
          metalness={0.9}
          roughness={0.2}
          emissive="#6E1025"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Victorian Tailcoat Torso */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.34, 0.28, 1.15, 24]} />
        <meshStandardMaterial
          color="#07070A"
          metalness={0.7}
          roughness={0.3}
          emissive="#0B1020"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Crimson Waistcoat Accent */}
      <mesh position={[0, 1.45, 0.16]}>
        <boxGeometry args={[0.26, 0.7, 0.04]} />
        <meshStandardMaterial
          color="#6E1025" // Deep Crimson Velvet
          metalness={0.3}
          roughness={0.8}
          emissive="#6E1025"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Lower Silhouette / Legs */}
      <mesh position={[-0.14, 0.42, 0]}>
        <cylinderGeometry args={[0.11, 0.08, 1.25, 16]} />
        <meshStandardMaterial color="#07070A" roughness={0.5} />
      </mesh>
      <mesh position={[0.14, 0.42, 0]}>
        <cylinderGeometry args={[0.11, 0.08, 1.25, 16]} />
        <meshStandardMaterial color="#07070A" roughness={0.5} />
      </mesh>

      {/* Dramatic Rim Lighting directly hitting Butler */}
      <pointLight color="#AFC7E8" intensity={4.5} distance={3} position={[-0.8, 2.5, -0.6]} />
      <pointLight color="#FFE4AD" intensity={2.5} distance={2.5} position={[0.8, 1.6, 0.8]} />
    </group>
  );
}

/**
 * 3D Interactive Supernatural Artifacts for Scene 4 (The Four Trials):
 * 1. Antique Pocket Watch
 * 2. Floating Sealed Letter
 * 3. Golden Skeleton Key
 * 4. Rotating Gothic Vault
 */
function InteractiveArtifacts3D({
  activeScene,
  mousePos,
}: {
  activeScene: number;
  mousePos: { x: number; y: number };
}) {
  const watchRef = useRef<THREE.Group>(null);
  const letterRef = useRef<THREE.Group>(null);
  const keyRef = useRef<THREE.Group>(null);
  const vaultRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    // 1. Antique Pocket Watch (Ticking rotation)
    if (watchRef.current) {
      watchRef.current.rotation.y += delta * 0.6;
      watchRef.current.rotation.z = Math.sin(time * 2) * 0.15;
    }

    // 2. Floating Sealed Letter (Levitating wax seal)
    if (letterRef.current) {
      letterRef.current.position.y = 0.2 + Math.sin(time * 2.5) * 0.12;
      letterRef.current.rotation.x = -mousePos.y * 0.4;
      letterRef.current.rotation.y = mousePos.x * 0.5;
    }

    // 3. Golden Skeleton Key (Rotating orbital wards)
    if (keyRef.current) {
      keyRef.current.rotation.z += delta * 0.8;
      keyRef.current.rotation.x += delta * 0.4;
    }

    // 4. Rotating Gothic Vault (Heavy cylindrical mechanism)
    if (vaultRef.current) {
      vaultRef.current.rotation.z += delta * 0.35;
    }
  });

  return (
    <group position={[2.4, 0.3, 0]}>
      {/* Artifact 1: Antique Clock (Midnight Curse) */}
      <group ref={watchRef} position={[0, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.85, 0.85, 0.18, 32]} />
          <meshStandardMaterial
            color="#C5A46D"
            metalness={0.9}
            roughness={0.2}
            emissive="#C5A46D"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.72, 0.72, 0.05, 32]} />
          <meshStandardMaterial
            color="#07070A"
            metalness={0.8}
            roughness={0.4}
            emissive="#FFE4AD"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Watch Hands */}
        <mesh position={[0, 0.22, 0.13]}>
          <boxGeometry args={[0.04, 0.45, 0.02]} />
          <meshStandardMaterial color="#FFE4AD" emissive="#FFE4AD" emissiveIntensity={1} />
        </mesh>
        <mesh position={[0.18, 0, 0.13]}>
          <boxGeometry args={[0.35, 0.04, 0.02]} />
          <meshStandardMaterial color="#6E1025" emissive="#6E1025" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* Artifact 2: Floating Sealed Letter */}
      <group ref={letterRef} position={[-0.4, 1.2, -0.6]}>
        <mesh rotation={[0.2, 0.3, 0]}>
          <boxGeometry args={[1.1, 0.75, 0.04]} />
          <meshStandardMaterial
            color="#E8E0D5"
            roughness={0.7}
            emissive="#AFC7E8"
            emissiveIntensity={0.2}
          />
        </mesh>
        {/* Wax Seal */}
        <mesh position={[0, 0, 0.04]}>
          <cylinderGeometry args={[0.14, 0.14, 0.03, 24]} />
          <meshStandardMaterial
            color="#6E1025"
            metalness={0.4}
            roughness={0.4}
            emissive="#6E1025"
            emissiveIntensity={0.9}
          />
        </mesh>
      </group>

      {/* Artifact 3: Golden Skeleton Key Ring */}
      <group ref={keyRef} position={[-0.2, -1.3, -0.4]}>
        <mesh>
          <torusGeometry args={[0.45, 0.06, 16, 32]} />
          <meshStandardMaterial
            color="#C5A46D"
            metalness={0.95}
            roughness={0.15}
            emissive="#C5A46D"
            emissiveIntensity={0.5}
          />
        </mesh>
        <mesh position={[0, -0.65, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
          <meshStandardMaterial color="#C5A46D" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Artifact 4: Gothic Vault Outer Ring */}
      <group ref={vaultRef} position={[0.5, -0.3, -1.2]}>
        <mesh>
          <torusGeometry args={[1.5, 0.12, 16, 48]} />
          <meshStandardMaterial
            color="#151219"
            metalness={0.9}
            roughness={0.3}
            emissive="#C5A46D"
            emissiveIntensity={0.35}
          />
        </mesh>
      </group>
    </group>
  );
}

/**
 * GothicMansionSilhouettes3D:
 * Layered gothic spires, arched windows with candlelight, and heavy black marble pillars.
 */
function GothicMansionSilhouettes3D({ scrollProgress }: { scrollProgress: number }) {
  const mansionRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!mansionRef.current) return;
    // Camera travel illusion: mansion expands slightly as you approach
    mansionRef.current.position.z = -5 + scrollProgress * 2.2;
  });

  return (
    <group ref={mansionRef} position={[0, 0, -5]}>
      {/* Central Grand Hall Facade */}
      <mesh position={[0, 0.8, -1]}>
        <boxGeometry args={[7, 5, 0.5]} />
        <meshStandardMaterial
          color="#07070A"
          roughness={0.8}
          metalness={0.3}
        />
      </mesh>

      {/* Left Gothic Tower */}
      <mesh position={[-3.8, 2.2, -0.8]}>
        <boxGeometry args={[1.6, 7.5, 1.6]} />
        <meshStandardMaterial color="#07070A" roughness={0.8} />
      </mesh>
      {/* Left Spire */}
      <mesh position={[-3.8, 6.3, -0.8]}>
        <coneGeometry args={[1.0, 2.5, 4]} />
        <meshStandardMaterial color="#0B1020" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Right Gothic Tower */}
      <mesh position={[3.8, 2.2, -0.8]}>
        <boxGeometry args={[1.6, 7.5, 1.6]} />
        <meshStandardMaterial color="#07070A" roughness={0.8} />
      </mesh>
      {/* Right Spire */}
      <mesh position={[3.8, 6.3, -0.8]}>
        <coneGeometry args={[1.0, 2.5, 4]} />
        <meshStandardMaterial color="#0B1020" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Arched Windows with Warm Candlelight Glow */}
      <mesh position={[-1.6, 1.6, -0.7]}>
        <cylinderGeometry args={[0.35, 0.35, 1.4, 16]} />
        <meshStandardMaterial
          color="#FFE4AD"
          emissive="#FFE4AD"
          emissiveIntensity={1.8}
        />
      </mesh>
      <mesh position={[1.6, 1.6, -0.7]}>
        <cylinderGeometry args={[0.35, 0.35, 1.4, 16]} />
        <meshStandardMaterial
          color="#FFE4AD"
          emissive="#FFE4AD"
          emissiveIntensity={1.8}
        />
      </mesh>
      <mesh position={[0, 2.5, -0.7]}>
        <cylinderGeometry args={[0.5, 0.5, 1.8, 16]} />
        <meshStandardMaterial
          color="#FFE4AD"
          emissive="#FFE4AD"
          emissiveIntensity={2.2}
        />
      </mesh>

      {/* Grand Entrance Pillars */}
      <mesh position={[-1.1, -0.6, -0.4]}>
        <cylinderGeometry args={[0.18, 0.18, 3.2, 16]} />
        <meshStandardMaterial color="#151219" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[1.1, -0.6, -0.4]}>
        <cylinderGeometry args={[0.18, 0.18, 3.2, 16]} />
        <meshStandardMaterial color="#151219" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Massive Silver Moon in the midnight sky */}
      <mesh position={[3.5, 4.2, -8]}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshStandardMaterial
          color="#AFC7E8"
          emissive="#AFC7E8"
          emissiveIntensity={1.4}
        />
      </mesh>
      <pointLight color="#AFC7E8" intensity={5.0} distance={20} position={[3.5, 4.2, -6]} />
    </group>
  );
}

/**
 * CinematicMansionExperience:
 * Responsive, award-winning Three.js canvas for the homepage.
 */
export const CinematicMansionExperience: React.FC<CinematicMansionProps> = ({
  scrollProgress = 0,
  activeScene = 1,
}) => {
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
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('/halloween/mansion_midnight_fog.jpg')" }} />
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      <Canvas
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={48} />
        <ambientLight intensity={0.4} color="#0B1020" />
        <directionalLight position={[-4, 7, 5]} intensity={1.8} color="#AFC7E8" />
        <pointLight position={[0, 0, 2]} intensity={2.0} color="#FFE4AD" />

        {/* 1. Mansion Architectural Silhouettes */}
        <GothicMansionSilhouettes3D scrollProgress={scrollProgress} />

        {/* 2. Interactive Butler Figure */}
        <Butler3DFigure mousePos={mousePos} scrollProgress={scrollProgress} />

        {/* 3. Interactive Supernatural Artifacts */}
        <Float speed={1.6} rotationIntensity={0.5} floatIntensity={0.7}>
          <InteractiveArtifacts3D activeScene={activeScene} mousePos={mousePos} />
        </Float>

        {/* 4. Drifting Volumetric-style Fog & Embers */}
        <Sparkles
          count={80}
          scale={[14, 12, 10]}
          size={3.2}
          speed={0.35}
          opacity={0.65}
          color="#FFE4AD" // Candlelight
        />
        <Sparkles
          count={50}
          scale={[12, 10, 8]}
          size={2.8}
          speed={0.55}
          opacity={0.45}
          color="#6E1025" // Deep Crimson Embers
        />
        <Sparkles
          count={40}
          scale={[15, 8, 12]}
          size={4.0}
          speed={0.25}
          opacity={0.35}
          color="#AFC7E8" // Moonlight Fog
        />
      </Canvas>
    </div>
  );
};
