import { useGameStore } from '../store/useGameStore';

export function FadeOverlay() {
  const exitActive = useGameStore((s) => s.exitActive);
  const exitPhase = useGameStore((s) => s.exitPhase);
  const exitT = useGameStore((s) => s.exitT);

  // Only show fade during exit phase 2
  let opacity = 0;
  if (exitActive && exitPhase === 2) {
    opacity = Math.min(exitT / 1.5, 1);
  }

  return (
    <div
      id="fade-overlay"
      style={{ opacity, pointerEvents: opacity > 0 ? 'all' : 'none' }}
    />
  );
}
