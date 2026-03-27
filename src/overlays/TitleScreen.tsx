import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';

export function TitleScreen() {
  const gameState = useGameStore((s) => s.gameState);
  const [hiding, setHiding] = useState(false);

  if (gameState !== 'title' && gameState !== 'loading' && !hiding) return null;

  const handleStart = () => {
    setHiding(true);
    // Start flying after fade (1.5s transition)
    setTimeout(() => {
      const store = useGameStore.getState();
      // Initialize flying positions
      const { animRefs } = store;
      if (animRefs.planetGroup) {
        animRefs.planetGroup.position.set(8, 0, -5);
        animRefs.planetGroup.scale.setScalar(0.25);
      }
      if (animRefs.titleFlock) {
        animRefs.titleFlock.position.set(-14, 1, -3);
        animRefs.titleFlock.visible = true;
      }
      store.startFlying();
      setHiding(false);
    }, 1500);
  };

  const visible = gameState === 'title' && !hiding;

  return (
    <div
      id="title-screen"
      style={{ opacity: visible ? 1 : 0, display: hiding || gameState === 'title' ? undefined : 'none' }}
    >
      <div style={{ textAlign: 'center' }}>
        <div className="title-main">어린왕자</div>
        <div className="title-sub">가로등 행성</div>
        <button id="start-btn" onClick={handleStart}>
          시 작 하 기
        </button>
      </div>
    </div>
  );
}
