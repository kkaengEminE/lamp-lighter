import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';
import { PLANET_R } from '../../data/constants';

export function LampPost() {
  const bulbMatRef = useRef<THREE.MeshPhongMaterial>(null);
  const glowMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const lampLightRef = useRef<THREE.PointLight>(null);

  useEffect(() => {
    const store = useGameStore.getState();
    if (bulbMatRef.current) store.registerRef('bulbMat', bulbMatRef.current);
    if (glowMatRef.current) store.registerRef('glowMat', glowMatRef.current);
    if (lampLightRef.current) store.registerRef('lampLight', lampLightRef.current);
  }, []);

  const handleClick = (e: any) => {
    e.stopPropagation();
    const { gameState, isPaused, lampOn, setLamp } = useGameStore.getState();
    if (gameState === 'free' && isPaused) {
      setLamp(!lampOn, true);
    }
  };

  return (
    <group position={[0, PLANET_R, 0]} onClick={handleClick}>
      {/* Pole */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.04, 0.055, 2.0, 8]} />
        <meshPhongMaterial color={0x777777} />
      </mesh>
      {/* Arm */}
      <mesh position={[0.28, 2.0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.025, 0.025, 0.55, 8]} />
        <meshPhongMaterial color={0x777777} />
      </mesh>
      {/* Shade */}
      <mesh position={[0.55, 2.0, 0]}>
        <cylinderGeometry args={[0.11, 0.2, 0.24, 12]} />
        <meshPhongMaterial color={0x444444} />
      </mesh>
      {/* Bulb */}
      <mesh position={[0.55, 1.92, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshPhongMaterial
          ref={bulbMatRef}
          color={0xffee88}
          emissive={new THREE.Color(0xffcc44)}
          emissiveIntensity={0.1}
          transparent
          opacity={0.95}
        />
      </mesh>
      {/* Lamp Light */}
      <pointLight
        ref={lampLightRef}
        position={[0.55, 1.92, 0]}
        color={0xffdd66}
        intensity={0}
        distance={5}
      />
      {/* Glow */}
      <mesh position={[0.55, 1.92, 0]}>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshBasicMaterial
          ref={glowMatRef}
          color={0xffee88}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
