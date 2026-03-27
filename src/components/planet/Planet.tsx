import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import { PLANET_R, HILL_SEEDS } from '../../data/constants';

interface PlanetProps {
  children?: React.ReactNode;
}

export function Planet({ children }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (groupRef.current) {
      useGameStore.getState().registerRef('planetGroup', groupRef.current);
    }
  }, []);

  return (
    <group ref={groupRef}>
      {/* Main planet sphere */}
      <mesh receiveShadow castShadow>
        <sphereGeometry args={[PLANET_R, 48, 48]} />
        <meshPhongMaterial
          color={0xeee4c0}
          shininess={10}
          specular={new THREE.Color(0x222200)}
        />
      </mesh>
      {/* Atmosphere */}
      <mesh>
        <sphereGeometry args={[PLANET_R * 1.07, 32, 32]} />
        <meshPhongMaterial
          color={0xc8e0ff}
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>
      {/* Hills */}
      {HILL_SEEDS.map(([a, vy, r], i) => (
        <mesh
          key={i}
          position={[
            Math.cos(a) * PLANET_R * 0.99,
            vy,
            Math.sin(a) * PLANET_R * 0.99,
          ]}
        >
          <sphereGeometry args={[r, 8, 8]} />
          <meshPhongMaterial color={0xd8ccaa} />
        </mesh>
      ))}
      {children}
    </group>
  );
}
