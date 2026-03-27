import { useGameStore } from '../store/useGameStore';

export function FreeUI() {
  const gameState = useGameStore((s) => s.gameState);
  const isPaused = useGameStore((s) => s.isPaused);
  const visible = gameState === 'free';

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    useGameStore.getState().setRotationSpeed(parseFloat(e.target.value));
  };

  const handlePause = () => {
    useGameStore.getState().togglePause();
  };

  const handleExit = () => {
    useGameStore.getState().startExit();
  };

  return (
    <div id="free-ui" className={visible ? 'visible' : ''}>
      <div className="ui-panel">
        <div className="ui-label">자전 속도</div>
        <input
          type="range"
          id="speed-slider"
          min="0.1"
          max="5"
          step="0.1"
          defaultValue="1"
          onChange={handleSpeedChange}
        />
      </div>
      <button className="ui-btn" id="pause-btn" onClick={handlePause}>
        {isPaused ? '▶ 재생' : '⏸ 일시정지'}
      </button>
      <button className="ui-btn" id="exit-btn" onClick={handleExit}>
        ✕ 나가기
      </button>
    </div>
  );
}
