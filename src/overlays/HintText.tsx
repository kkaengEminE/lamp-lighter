import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';

export function HintText() {
  const gameState = useGameStore((s) => s.gameState);
  const isPaused = useGameStore((s) => s.isPaused);
  const [hintVisible, setHintVisible] = useState(false);
  const [hintText, setHintText] = useState('');
  const [dragHintVisible, setDragHintVisible] = useState(false);

  // Show hint when entering free mode
  useEffect(() => {
    if (gameState === 'free') {
      setHintText('캐릭터를 클릭해 보세요!');
      setHintVisible(true);
      const t = setTimeout(() => setHintVisible(false), 4000);
      return () => clearTimeout(t);
    }
  }, [gameState]);

  // Show pause hints
  useEffect(() => {
    if (isPaused && gameState === 'free') {
      setDragHintVisible(true);
      setHintText('가로등 클릭해서 켜고 끄기 | 드래그로 시점 변경');
      setHintVisible(true);
      const t = setTimeout(() => setHintVisible(false), 3500);
      return () => clearTimeout(t);
    } else {
      setDragHintVisible(false);
    }
  }, [isPaused, gameState]);

  return (
    <>
      <div id="hint-text" className={hintVisible ? 'visible' : ''}>
        {hintText}
      </div>
      <div id="drag-hint" className={dragHintVisible ? 'visible' : ''}>
        🖱 드래그로 시점을 돌려보세요
      </div>
    </>
  );
}
