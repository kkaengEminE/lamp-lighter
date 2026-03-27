import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import { easeInOut } from '../utils/easing';
import { PRINCE_ANGLE, SURFACE_R } from '../data/constants';

export function useExitAnimation() {
  const scene = useThree((s) => s.scene);

  useFrame((_, delta) => {
    const state = useGameStore.getState();
    if (!state.exitActive) return;

    const { animRefs, exitPrinceWorldPos } = state;
    const exitFlock = animRefs.exitFlock;
    const princeGroup = animRefs.princeGroup;
    const planetGroup = animRefs.planetGroup;
    if (!exitFlock || !princeGroup) return;

    let exitT = state.exitT + delta;
    const phase = state.exitPhase;

    if (phase === 0) {
      const t = Math.min(exitT / 1.5, 1);
      const e = easeInOut(t);
      exitFlock.position.y = exitPrinceWorldPos.y + 9 - e * 8.5;
      exitFlock.position.x = exitPrinceWorldPos.x;
      exitFlock.position.z = exitPrinceWorldPos.z;
      if (t >= 1) {
        // Reparent prince: planet -> scene
        const wp = new THREE.Vector3();
        princeGroup.getWorldPosition(wp);
        if (planetGroup) planetGroup.remove(princeGroup);
        scene.add(princeGroup);
        princeGroup.position.copy(wp);
        princeGroup.rotation.set(0, 0, 0);
        useGameStore.setState({ exitPhase: 1, exitT: 0 });
        return;
      }
    } else if (phase === 1) {
      const t = Math.min(exitT / 2.2, 1);
      const e = easeInOut(t);
      const tx = exitPrinceWorldPos.x + e * 18;
      const ty = exitPrinceWorldPos.y + e * 8;
      exitFlock.position.set(tx, ty, exitPrinceWorldPos.z);
      princeGroup.position.set(tx, ty - 1.0, exitPrinceWorldPos.z);
      if (t >= 1) {
        useGameStore.setState({ exitPhase: 2, exitT: 0 });
        return;
      }
    } else {
      // Phase 2: fade handled by FadeOverlay component reading exitPhase/exitT
      const t = Math.min(exitT / 1.5, 1);
      if (t >= 1) {
        // Reset everything
        exitFlock.visible = false;

        // Reparent prince back to planet
        scene.remove(princeGroup);
        if (planetGroup) {
          planetGroup.add(princeGroup);
          princeGroup.position.set(
            Math.sin(PRINCE_ANGLE) * SURFACE_R,
            Math.cos(PRINCE_ANGLE) * SURFACE_R,
            0
          );
          princeGroup.rotation.set(0, 0, -PRINCE_ANGLE);
        }

        // Reset state
        const titleFlock = animRefs.titleFlock;
        if (titleFlock) {
          titleFlock.visible = true;
          titleFlock.position.set(-12, 2, -3);
          titleFlock.scale.setScalar(1.2);
        }
        if (planetGroup) {
          planetGroup.scale.setScalar(1);
          planetGroup.position.set(0, 0, 0);
        }

        useGameStore.setState({
          exitActive: false,
          exitPhase: 0,
          exitT: 0,
          gameState: 'title',
          isPaused: false,
          princeVisible: false,
        });
        return;
      }
    }

    useGameStore.setState({ exitT });
  });
}
