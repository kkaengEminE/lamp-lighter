import { useGameStore } from '../store/useGameStore';

export function TimeIndicator() {
  const gameState = useGameStore((s) => s.gameState);
  const isNight = useGameStore((s) => s.isNight);
  const visible = gameState === 'free';

  return (
    <div id="time-indicator" className={visible ? 'visible' : ''}>
      {isNight ? '🌙 밤' : '☀️ 낮'}
    </div>
  );
}
