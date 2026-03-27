import { useGameStore } from '../store/useGameStore';

export function FloatBubbles() {
  const princeBubble = useGameStore((s) => s.princeBubble);
  const lamplighterBubble = useGameStore((s) => s.lamplighterBubble);

  return (
    <>
      <div
        className={`float-bubble ${princeBubble.visible ? 'visible' : ''}`}
        id="prince-bubble"
      >
        {princeBubble.text}
      </div>
      <div
        className={`float-bubble ${lamplighterBubble.visible ? 'visible' : ''}`}
        id="lamplighter-bubble"
      >
        {lamplighterBubble.text}
      </div>
    </>
  );
}
