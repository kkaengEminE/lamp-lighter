import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import { useLampAnimation } from './useLampAnimation';
import { useFlyingAnimation } from './useFlyingAnimation';
import { useExitAnimation } from './useExitAnimation';

/**
 * Invisible component that runs all animation system hooks.
 * Also handles bird animation and elapsed time updates for the title screen.
 */
export function AnimationManager() {
  const flapT = useRef(0);

  // System hooks
  useLampAnimation();
  useFlyingAnimation();
  useExitAnimation();

  // Bird animation + title flock bobbing + elapsed timer
  useFrame((_, delta) => {
    const state = useGameStore.getState();
    const { gameState, animRefs } = state;

    // Update elapsed
    useGameStore.setState({ elapsed: state.elapsed + delta });

    // Bird wing flap for active flocks
    flapT.current += delta * 3;
    const val = Math.sin(flapT.current) * 0.45;

    const flapWings = (group: THREE.Group | null) => {
      if (!group || !group.visible) return;
      group.traverse((c) => {
        if ((c as THREE.Mesh).isMesh) {
          if (c.name === 'leftWing') c.rotation.z = val;
          if (c.name === 'rightWing') c.rotation.z = val;
        }
      });
    };

    // Flap title flock (title + flying states)
    if (gameState === 'title' || gameState === 'flying') {
      flapWings(animRefs.titleFlock);
    }

    // Flap exit flock
    if (state.exitActive) {
      flapWings(animRefs.exitFlock);
    }

    // Title flock bobbing animation (original lines 1194-1198)
    if (gameState === 'title' && animRefs.titleFlock) {
      const elapsed = state.elapsed;
      animRefs.titleFlock.position.y = 2 + Math.sin(elapsed * 0.5) * 0.3;
      animRefs.titleFlock.position.x = -12 + Math.sin(elapsed * 0.2) * 0.4;
    }
  });

  return null;
}
