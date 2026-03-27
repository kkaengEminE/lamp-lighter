import * as THREE from 'three';
import { create } from 'zustand';

export type GameState = 'loading' | 'title' | 'flying' | 'modeSelect' | 'story' | 'free';
export type LampAction = 'idle' | 'lighting' | 'extinguishing';

export interface AnimRefs {
  stick: THREE.Mesh | null;
  rightArm: THREE.Mesh | null;
  bulbMat: THREE.MeshPhongMaterial | null;
  glowMat: THREE.MeshBasicMaterial | null;
  lampLight: THREE.PointLight | null;
  titleFlock: THREE.Group | null;
  exitFlock: THREE.Group | null;
  princeGroup: THREE.Group | null;
  planetGroup: THREE.Group | null;
  sunGroup: THREE.Group | null;
  sunMesh: THREE.Group | null;
}

interface GameStore {
  // Core state
  gameState: GameState;
  isPaused: boolean;
  rotationSpeed: number;
  lampOn: boolean;
  isNight: boolean;
  storyStep: number;

  // Animation state
  spaceAngle: number;
  lamplighterAnimating: boolean;
  lamplighterAnimFrame: number;
  lamplighterAction: LampAction;

  // Flying animation
  flyingPhase: number;
  flyingT: number;

  // Exit animation
  exitActive: boolean;
  exitPhase: number;
  exitT: number;
  exitPrinceWorldPos: THREE.Vector3;

  // Timing
  elapsed: number;
  wingFlapT: number;

  // Visibility
  princeVisible: boolean;

  // Float bubbles
  princeBubble: { text: string; visible: boolean };
  lamplighterBubble: { text: string; visible: boolean };

  // Refs for cross-component animation
  animRefs: AnimRefs;

  // Actions
  setGameState: (s: GameState) => void;
  togglePause: () => void;
  setRotationSpeed: (speed: number) => void;
  setLamp: (on: boolean, animate: boolean) => void;
  triggerLampAnim: (action: LampAction) => void;
  setNight: (night: boolean) => void;
  nextStory: () => void;
  enterFreeMode: () => void;
  startFlying: () => void;
  startExit: () => void;
  registerRef: (name: keyof AnimRefs, ref: any) => void;
  showFloatBubble: (who: 'prince' | 'lamplighter', text: string, dur?: number) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Core state — matches original lines 188-203
  gameState: 'loading',
  isPaused: false,
  rotationSpeed: 1.0,
  lampOn: false,
  isNight: false,
  storyStep: 0,

  // Animation state
  spaceAngle: 0,
  lamplighterAnimating: false,
  lamplighterAnimFrame: 0,
  lamplighterAction: 'idle',

  // Flying animation
  flyingPhase: 0,
  flyingT: 0,

  // Exit animation
  exitActive: false,
  exitPhase: 0,
  exitT: 0,
  exitPrinceWorldPos: new THREE.Vector3(),

  // Timing
  elapsed: 0,
  wingFlapT: 0,

  // Visibility
  princeVisible: false,

  // Float bubbles
  princeBubble: { text: '', visible: false },
  lamplighterBubble: { text: '', visible: false },

  // Refs
  animRefs: {
    stick: null,
    rightArm: null,
    bulbMat: null,
    glowMat: null,
    lampLight: null,
    titleFlock: null,
    exitFlock: null,
    princeGroup: null,
    planetGroup: null,
    sunGroup: null,
    sunMesh: null,
  },

  // Actions
  setGameState: (gameState) => set({ gameState }),

  togglePause: () => {
    const { isPaused } = get();
    set({ isPaused: !isPaused });
  },

  setRotationSpeed: (rotationSpeed) => set({ rotationSpeed }),

  setLamp: (on, animate) => {
    set({ lampOn: on });
    if (animate) {
      get().triggerLampAnim(on ? 'lighting' : 'extinguishing');
    } else {
      const { animRefs } = get();
      if (on) {
        if (animRefs.lampLight) animRefs.lampLight.intensity = 2.5;
        if (animRefs.bulbMat) animRefs.bulbMat.emissiveIntensity = 2.5;
        if (animRefs.glowMat) animRefs.glowMat.opacity = 0.25;
      } else {
        if (animRefs.lampLight) animRefs.lampLight.intensity = 0;
        if (animRefs.bulbMat) animRefs.bulbMat.emissiveIntensity = 0.1;
        if (animRefs.glowMat) animRefs.glowMat.opacity = 0;
      }
    }
  },

  triggerLampAnim: (action) => {
    if (get().lamplighterAnimating) return;
    set({
      lamplighterAnimating: true,
      lamplighterAction: action,
      lamplighterAnimFrame: 0,
    });
  },

  setNight: (isNight) => set({ isNight }),

  nextStory: () => {
    const { storyStep } = get();
    const next = storyStep + 1;
    set({ storyStep: next });
    // If story ends, switch to free mode (handled in StoryBubble component)
  },

  enterFreeMode: () => {
    set({
      gameState: 'free',
      princeVisible: true,
    });
  },

  startFlying: () => {
    set({
      gameState: 'flying',
      flyingPhase: 0,
      flyingT: 0,
    });
  },

  startExit: () => {
    const { animRefs } = get();
    const wp = new THREE.Vector3();
    if (animRefs.princeGroup) {
      animRefs.princeGroup.getWorldPosition(wp);
    }
    set({
      exitActive: true,
      exitPhase: 0,
      exitT: 0,
      exitPrinceWorldPos: wp,
    });
  },

  registerRef: (name, ref) => {
    set((state) => ({
      animRefs: { ...state.animRefs, [name]: ref },
    }));
  },

  showFloatBubble: (who, text, dur = 3000) => {
    const key = who === 'prince' ? 'princeBubble' : 'lamplighterBubble';
    set({ [key]: { text, visible: true } });
    if (dur > 0) {
      setTimeout(() => {
        set({ [key]: { text: '', visible: false } });
      }, dur);
    }
  },
}));
