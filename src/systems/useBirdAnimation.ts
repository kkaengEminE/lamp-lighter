import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export function useBirdAnimation(
  groupRef: React.RefObject<THREE.Group | null>,
  speed: number = 3
) {
  const flapT = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    flapT.current += delta * speed;
    const val = Math.sin(flapT.current) * 0.45;
    groupRef.current.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        if (c.name === 'leftWing') c.rotation.z = val;
        if (c.name === 'rightWing') c.rotation.z = val;
      }
    });
  });
}
