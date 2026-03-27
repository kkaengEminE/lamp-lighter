import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';

export function useLampAnimation() {
  useFrame((_, delta) => {
    const state = useGameStore.getState();
    if (!state.lamplighterAnimating) return;

    const { animRefs, lamplighterAction } = state;
    const frame = state.lamplighterAnimFrame + delta * 60;
    const t = Math.min(frame / 60, 1);
    const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    const { stick, rightArm, lampLight, bulbMat, glowMat } = animRefs;

    if (lamplighterAction === 'lighting') {
      if (stick) stick.rotation.z = -0.3 + e * (-1.4);
      if (rightArm) rightArm.rotation.z = -0.4 + e * (-0.9);
      if (lampLight) lampLight.intensity = e * 2.5;
      if (bulbMat) bulbMat.emissiveIntensity = 0.1 + e * 2.4;
      if (glowMat) glowMat.opacity = e * 0.25;
    } else {
      if (stick) stick.rotation.z = -1.7 + e * 1.4;
      if (rightArm) rightArm.rotation.z = -1.3 + e * 0.9;
      if (lampLight) lampLight.intensity = 2.5 * (1 - e);
      if (bulbMat) bulbMat.emissiveIntensity = 2.5 * (1 - e * 0.9);
      if (glowMat) glowMat.opacity = 0.25 * (1 - e);
    }

    if (t >= 1) {
      // Reset pose
      if (stick) stick.rotation.z = -0.3;
      if (rightArm) rightArm.rotation.z = -0.4;
      if (lamplighterAction === 'lighting') {
        if (lampLight) lampLight.intensity = 2.5;
        if (bulbMat) bulbMat.emissiveIntensity = 2.5;
        if (glowMat) glowMat.opacity = 0.25;
      } else {
        if (lampLight) lampLight.intensity = 0;
        if (bulbMat) bulbMat.emissiveIntensity = 0.1;
        if (glowMat) glowMat.opacity = 0;
      }
      useGameStore.setState({
        lamplighterAnimating: false,
        lamplighterAnimFrame: 0,
      });
    } else {
      useGameStore.setState({ lamplighterAnimFrame: frame });
    }
  });
}
