import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useGameStore } from '../../store/useGameStore';

export function SceneSetup() {
  const ambientRef = useRef<THREE.AmbientLight>(null);

  useEffect(() => {
    // Initialize lamp off (matches original line 1209)
    useGameStore.getState().setLamp(false, false);
    // Transition from loading to title after 500ms (matches line 1212-1215)
    const timer = setTimeout(() => {
      useGameStore.getState().setGameState('title');
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <ambientLight ref={ambientRef} color={0x1a2244} intensity={0.5} />
      <directionalLight color={0x334466} intensity={0.25} position={[-8, 3, -4]} />
    </>
  );
}
