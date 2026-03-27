import { useGameStore } from '../store/useGameStore';

export function ModeSelect() {
  const gameState = useGameStore((s) => s.gameState);
  const visible = gameState === 'modeSelect';

  const handleStory = () => {
    useGameStore.setState({ gameState: 'story', storyStep: 0 });
  };

  const handleFree = () => {
    useGameStore.getState().enterFreeMode();
  };

  return (
    <div id="mode-select" className={visible ? 'visible' : ''}>
      <div className="mode-title">모드를 선택하세요</div>
      <button className="mode-btn story" onClick={handleStory}>
        📖 이야기 모드
      </button>
      <button className="mode-btn free" onClick={handleFree}>
        🌍 자유 모드
      </button>
    </div>
  );
}
