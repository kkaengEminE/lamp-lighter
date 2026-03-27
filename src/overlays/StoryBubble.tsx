import { useGameStore } from '../store/useGameStore';
import { storyScript } from '../data/storyScript';

export function StoryBubble() {
  const gameState = useGameStore((s) => s.gameState);
  const storyStep = useGameStore((s) => s.storyStep);

  const visible = gameState === 'story' && storyStep < storyScript.length;
  const entry = storyScript[storyStep];

  const handleClick = () => {
    if (gameState !== 'story') return;
    // Advance to next step
    const next = storyStep + 1;
    if (next >= storyScript.length) {
      // Story finished, enter free mode
      useGameStore.getState().enterFreeMode();
      return;
    }

    useGameStore.setState({ storyStep: next });

    // Apply next step's action
    const nextEntry = storyScript[next];
    if (nextEntry.action === 'arrive') {
      useGameStore.setState({ princeVisible: true });
    } else if (nextEntry.action === 'extinguish') {
      useGameStore.getState().setLamp(false, true);
    } else if (nextEntry.action === 'light') {
      useGameStore.getState().setLamp(true, true);
    }
  };

  // Apply first step's action on first render
  if (gameState === 'story' && storyStep === 0 && entry) {
    // handled by initial state: arrive shows prince
    if (entry.action === 'arrive') {
      // Ensure prince is visible
      const { princeVisible } = useGameStore.getState();
      if (!princeVisible) {
        useGameStore.setState({ princeVisible: true });
      }
    }
  }

  if (!visible || !entry) return null;

  return (
    <div
      id="story-bubble"
      className="visible clickable"
      onClick={handleClick}
    >
      <div className="bubble-speaker">{entry.speaker}</div>
      <div className="bubble-text">{entry.text}</div>
      <div className="bubble-next">클릭하여 계속 ▶</div>
    </div>
  );
}
