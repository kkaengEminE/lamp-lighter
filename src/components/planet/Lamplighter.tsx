import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import { PLANET_R, SURFACE_R, MAN_ANGLE } from '../../data/constants';

export function Lamplighter() {
  const stickRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const store = useGameStore.getState();
    if (stickRef.current) store.registerRef('stick', stickRef.current);
    if (rightArmRef.current) store.registerRef('rightArm', rightArmRef.current);
  }, []);

  const handleClick = (e: any) => {
    e.stopPropagation();
    const { gameState, showFloatBubble } = useGameStore.getState();
    if (gameState === 'free') {
      showFloatBubble('lamplighter', '안녕! 바빠서 말 못해! 😅');
    }
  };

  return (
    <group
      position={[
        Math.sin(MAN_ANGLE) * SURFACE_R,
        Math.cos(MAN_ANGLE) * SURFACE_R,
        0,
      ]}
      rotation={[0, 0, -MAN_ANGLE]}
      onClick={handleClick}
    >
      {/* Body */}
      <mesh position={[0, 0.21, 0]}>
        <cylinderGeometry args={[0.14, 0.17, 0.42, 8]} />
        <meshPhongMaterial color={0x3a6e30} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.57, 0]}>
        <sphereGeometry args={[0.135, 12, 12]} />
        <meshPhongMaterial color={0xf0b888} />
      </mesh>
      {/* Hat brim */}
      <mesh position={[0, 0.68, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.035, 12]} />
        <meshPhongMaterial color={0x2a2a0a} />
      </mesh>
      {/* Hat top */}
      <mesh position={[0, 0.79, 0]}>
        <cylinderGeometry args={[0.125, 0.155, 0.2, 12]} />
        <meshPhongMaterial color={0x2a2a0a} />
      </mesh>
      {/* Left leg */}
      <mesh position={[-0.075, -0.04, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.32, 6]} />
        <meshPhongMaterial color={0x2a2a0a} />
      </mesh>
      {/* Right leg */}
      <mesh position={[0.075, -0.04, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.32, 6]} />
        <meshPhongMaterial color={0x2a2a0a} />
      </mesh>
      {/* Right arm (animated) */}
      <mesh
        ref={rightArmRef}
        position={[0.19, 0.32, 0]}
        rotation={[0, 0, -0.4]}
      >
        <cylinderGeometry args={[0.04, 0.04, 0.32, 6]} />
        <meshPhongMaterial color={0x3a6e30} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-0.19, 0.32, 0]} rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.04, 0.04, 0.32, 6]} />
        <meshPhongMaterial color={0x3a6e30} />
      </mesh>
      {/* Stick (animated) */}
      <mesh
        ref={stickRef}
        position={[0.33, 0.65, 0]}
        rotation={[0, 0, -0.3]}
      >
        <cylinderGeometry args={[0.022, 0.022, 1.3, 6]} />
        <meshPhongMaterial color={0x8b6914} />
      </mesh>
      {/* Flame */}
      <mesh position={[0.7, 1.25, 0]}>
        <sphereGeometry args={[0.065, 8, 8]} />
        <meshPhongMaterial
          color={0xff8800}
          emissive={new THREE.Color(0xff4400)}
          emissiveIntensity={1.5}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}
