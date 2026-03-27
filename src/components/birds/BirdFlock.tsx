import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { useGameStore } from '../../store/useGameStore';
import { BIRD_POSITIONS } from '../../data/constants';
import { Bird } from './Bird';
import { PrinceModel } from '../planet/Prince';

interface BirdFlockProps {
  variant: 'title' | 'exit';
}

/**
 * Bird flock component with two variants: 'title' and 'exit'.
 * Original lines 646-689.
 *
 * - 'title': includes a PrinceModel at origin + 10 birds + tether lines
 * - 'exit': only 10 birds + tether lines (no prince)
 */
export function BirdFlock({ variant }: BirdFlockProps) {
  const ref = useRef<THREE.Group>(null);
  const gameState = useGameStore((s) => s.gameState);
  const exitActive = useGameStore((s) => s.exitActive);
  const registerRef = useGameStore((s) => s.registerRef);

  // Register ref in store on mount
  useEffect(() => {
    if (ref.current) {
      const refName = variant === 'title' ? 'titleFlock' : 'exitFlock';
      registerRef(refName, ref.current);
    }
  }, [variant, registerRef]);

  // Visibility logic
  const visible =
    variant === 'title'
      ? gameState === 'title' || gameState === 'flying'
      : exitActive;

  // Initial position: title flock starts at [-12, 2, -3], exit flock at origin
  const position: [number, number, number] =
    variant === 'title' ? [-12, 2, -3] : [0, 0, 0];

  return (
    <group ref={ref} position={position} scale={1.2} visible={visible}>
      {/* Prince model only in title variant */}
      {variant === 'title' && <PrinceModel />}

      {/* Birds and tether lines */}
      {BIRD_POSITIONS.map((p, i) => (
        <group key={i}>
          <Bird position={p} />
          <Line
            points={[
              [p[0] * 0.3, p[1] * 0.3, p[2] * 0.3],
              p,
            ]}
            color={0x888888}
            transparent
            opacity={0.5}
          />
        </group>
      ))}
    </group>
  );
}
