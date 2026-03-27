import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import { SURFACE_R, PRINCE_ANGLE } from '../../data/constants';

interface PrinceModelProps {
  scale?: number;
}

export function PrinceModel({ scale = 1 }: PrinceModelProps) {
  return (
    <group scale={scale}>
      {/* Body */}
      <mesh position={[0, 0.19, 0]}>
        <cylinderGeometry args={[0.11, 0.14, 0.38, 8]} />
        <meshPhongMaterial color={0x5a9e4a} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.52, 0]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshPhongMaterial color={0xf5d080} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, 0.52, 0]}>
        <sphereGeometry
          args={[0.145, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.6]}
        />
        <meshPhongMaterial color={0xf5d44a} />
      </mesh>
      {/* Scarf */}
      <mesh position={[0, 0.38, 0]} rotation={[0.3, 0, 0]}>
        <torusGeometry args={[0.115, 0.04, 6, 12]} />
        <meshPhongMaterial color={0xf5d010} />
      </mesh>
      {/* Left leg */}
      <mesh position={[-0.06, -0.04, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.28, 6]} />
        <meshPhongMaterial color={0x5a9e4a} />
      </mesh>
      {/* Right leg */}
      <mesh position={[0.06, -0.04, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.28, 6]} />
        <meshPhongMaterial color={0x5a9e4a} />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.16, 0.28, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.035, 0.035, 0.28, 6]} />
        <meshPhongMaterial color={0x5a9e4a} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-0.16, 0.28, 0]} rotation={[0, 0, 0.5]}>
        <cylinderGeometry args={[0.035, 0.035, 0.28, 6]} />
        <meshPhongMaterial color={0x5a9e4a} />
      </mesh>
    </group>
  );
}

export function Prince() {
  const groupRef = useRef<THREE.Group>(null);
  const princeVisible = useGameStore((s) => s.princeVisible);

  useEffect(() => {
    if (groupRef.current) {
      useGameStore.getState().registerRef('princeGroup', groupRef.current);
    }
  }, []);

  const handleClick = (e: any) => {
    e.stopPropagation();
    const { gameState, showFloatBubble } = useGameStore.getState();
    if (gameState === 'free') {
      showFloatBubble('prince', '안녕하세요! ✨');
    }
  };

  return (
    <group
      ref={groupRef}
      position={[
        Math.sin(PRINCE_ANGLE) * SURFACE_R,
        Math.cos(PRINCE_ANGLE) * SURFACE_R,
        0,
      ]}
      rotation={[0, 0, -PRINCE_ANGLE]}
      visible={princeVisible}
      onClick={handleClick}
    >
      <PrinceModel />
    </group>
  );
}
