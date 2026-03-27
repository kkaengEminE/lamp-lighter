import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import { easeInOut } from '../utils/easing';

export function useFlyingAnimation() {
  useFrame((_, delta) => {
    const state = useGameStore.getState();
    if (state.gameState !== 'flying') return;

    const { animRefs } = state;
    const titleFlock = animRefs.titleFlock;
    const planetGroup = animRefs.planetGroup;
    if (!titleFlock || !planetGroup) return;

    let flyingT = state.flyingT + delta;
    const phase = state.flyingPhase;

    if (phase === 0) {
      const t = Math.min(flyingT / 3, 1);
      const e = easeInOut(t);
      titleFlock.position.x = -14 + e * 20;
      titleFlock.position.y = 1 + Math.sin(t * Math.PI) * 1.5 + Math.sin(flyingT * 2) * 0.2;
      const pt = Math.min(flyingT / 4, 1);
      planetGroup.position.x = 8 * (1 - pt);
      planetGroup.position.z = -5 + pt * 5;
      planetGroup.scale.setScalar(0.25 + pt * 0.75);
      if (flyingT > 2.5) {
        useGameStore.setState({ flyingPhase: 1, flyingT: 0 });
        return;
      }
    } else if (phase === 1) {
      const t = Math.min(flyingT / 2.5, 1);
      const e = easeInOut(t);
      titleFlock.position.x = 6 + e * (-6);
      titleFlock.position.y = 3 - e * 2.8;
      titleFlock.position.z = -3 + e * 3;
      titleFlock.scale.setScalar(1.2 * (1 - t * 0.6));
      planetGroup.scale.setScalar(1);
      planetGroup.position.set(0, 0, 0);
      if (t >= 1) {
        useGameStore.setState({ flyingPhase: 2, flyingT: 0 });
        return;
      }
    } else {
      const t = Math.min(flyingT / 0.8, 1);
      titleFlock.scale.setScalar(0.5 * (1 - t));
      if (t >= 1) {
        titleFlock.visible = false;
        useGameStore.setState({
          gameState: 'modeSelect',
          princeVisible: true,
          flyingT: 0,
        });
        return;
      }
    }

    useGameStore.setState({ flyingT });
  });
}
