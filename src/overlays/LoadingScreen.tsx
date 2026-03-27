import { useGameStore } from '../store/useGameStore';

export function LoadingScreen() {
  const gameState = useGameStore((s) => s.gameState);
  if (gameState !== 'loading') return null;

  return (
    <div id="loading">
      로딩 중...
    </div>
  );
}
