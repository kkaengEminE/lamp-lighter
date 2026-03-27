import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import './App.css';

// Scene
import { SceneSetup } from './components/scene/SceneSetup';
import { Stars } from './components/scene/Stars';
import { Sun } from './components/scene/Sun';

// Planet
import { Planet } from './components/planet/Planet';
import { LampPost } from './components/planet/LampPost';
import { Lamplighter } from './components/planet/Lamplighter';
import { Prince } from './components/planet/Prince';

// Birds
import { BirdFlock } from './components/birds/BirdFlock';

// Camera
import { CameraController } from './components/camera/CameraController';

// Animation systems
import { AnimationManager } from './systems/AnimationManager';

// HTML Overlays
import { LoadingScreen } from './overlays/LoadingScreen';
import { TitleScreen } from './overlays/TitleScreen';
import { ModeSelect } from './overlays/ModeSelect';
import { StoryBubble } from './overlays/StoryBubble';
import { FreeUI } from './overlays/FreeUI';
import { FloatBubbles } from './overlays/FloatBubbles';
import { TimeIndicator } from './overlays/TimeIndicator';
import { HintText } from './overlays/HintText';
import { FadeOverlay } from './overlays/FadeOverlay';

export default function App() {
  return (
    <>
      <Canvas
        shadows={{ type: THREE.PCFSoftShadowMap }}
        camera={{
          fov: 55,
          near: 0.1,
          far: 1000,
          position: [0, 2.5, 9],
        }}
        gl={{ antialias: true, pixelRatio: Math.min(window.devicePixelRatio, 2) }}
      >
        {/* Scene infrastructure */}
        <SceneSetup />
        <Stars />
        <Sun />

        {/* Planet with children */}
        <Planet>
          <LampPost />
          <Lamplighter />
          <Prince />
        </Planet>

        {/* Bird flocks */}
        <BirdFlock variant="title" />
        <BirdFlock variant="exit" />

        {/* Camera controls */}
        <CameraController />

        {/* Animation systems (invisible) */}
        <AnimationManager />
      </Canvas>

      {/* HTML Overlays (outside Canvas) */}
      <LoadingScreen />
      <FadeOverlay />
      <TitleScreen />
      <ModeSelect />
      <StoryBubble />
      <FreeUI />
      <FloatBubbles />
      <TimeIndicator />
      <HintText />
    </>
  );
}
