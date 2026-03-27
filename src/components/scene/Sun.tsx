import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useGameStore } from '../../store/useGameStore';
import {
  SUN_ORBIT_R,
  ONE_MIN,
  SUN_RAY_DATA,
  DAY_THRESHOLD,
  NIGHT_THRESHOLD,
} from '../../data/constants';

const DEG2RAD = Math.PI / 180;

/* ---------- ray geometry helpers (created once) ---------- */

function makeRayShape(w: number, len: number): THREE.Shape {
  const sh = new THREE.Shape();
  sh.moveTo(-w, 0);
  sh.lineTo(w, 0);
  sh.lineTo(0, len);
  sh.closePath();
  return sh;
}

/* ---------- Sun component ---------- */

export function Sun() {
  const sunGroupRef = useRef<THREE.Group>(null);
  const sunMeshRef = useRef<THREE.Group>(null);
  const sunLightRef = useRef<THREE.PointLight>(null);
  const ambientRef = useRef<THREE.AmbientLight | null>(null);

  const { scene, camera } = useThree();

  // Register refs in store on mount
  useEffect(() => {
    if (sunGroupRef.current) {
      useGameStore.getState().registerRef('sunGroup', sunGroupRef.current);
    }
    if (sunMeshRef.current) {
      useGameStore.getState().registerRef('sunMesh', sunMeshRef.current);
    }
  }, []);

  // Locate ambient light once from scene
  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.AmbientLight).isLight && child.type === 'AmbientLight') {
        ambientRef.current = child as THREE.AmbientLight;
      }
    });
  }, [scene]);

  /* ---------- Memoised geometries for rays ---------- */

  const mainRayGeoms = useMemo(() => {
    return SUN_RAY_DATA.map(([angleDeg, len, w]) => {
      const shape = makeRayShape(w, len);
      const geom = new THREE.ShapeGeometry(shape);
      const a = angleDeg * DEG2RAD;
      return { geom, a, dist: 0.9 };
    });
  }, []);

  const suppRayGeoms = useMemo(() => {
    const rays: { geom: THREE.ShapeGeometry; a: number; dist: number }[] = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + 0.18;
      const shape = makeRayShape(0.04, 0.55);
      const geom = new THREE.ShapeGeometry(shape);
      rays.push({ geom, a, dist: 0.9 });
    }
    return rays;
  }, []);

  /* ---------- Face geometries ---------- */

  const eyeGeom = useMemo(() => new THREE.CircleGeometry(0.085, 16), []);

  const smileGeom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0.05, 0.24, Math.PI + 0.4, -0.4, true);
    return new THREE.ShapeGeometry(shape);
  }, []);

  const blushGeom = useMemo(() => new THREE.CircleGeometry(0.16, 16), []);

  /* ---------- useFrame: orbit, day/night, lamp toggle ---------- */

  useFrame((_, delta) => {
    const state = useGameStore.getState();
    const { gameState, isPaused, rotationSpeed } = state;

    if (isPaused) return;

    // Title state: slow constant orbit, ignore rotationSpeed
    // Other states: use rotationSpeed
    let newAngle: number;
    if (gameState === 'title') {
      newAngle = state.spaceAngle + delta * 0.25;
    } else {
      const angularSpeed = (Math.PI * 2) / ONE_MIN;
      newAngle = state.spaceAngle + angularSpeed * delta * rotationSpeed;
    }
    useGameStore.setState({ spaceAngle: newAngle });

    // Position sun group along yz-plane clockwise orbit
    const sy = Math.cos(newAngle) * SUN_ORBIT_R;
    const sz = -Math.sin(newAngle) * SUN_ORBIT_R;
    const sx = Math.sin(newAngle) * 1.5; // slight depth for parallax

    if (sunGroupRef.current) {
      sunGroupRef.current.position.set(sx, sy, sz);
    }

    // Sun mesh always faces camera
    if (sunMeshRef.current) {
      sunMeshRef.current.lookAt(camera.position);
    }

    // Day / night detection
    const dot = sy / SUN_ORBIT_R; // ranges -1 to 1
    const dayF = Math.max(0, dot);

    // Update scene background: lerp between deep night and lighter night sky
    const nightColor = new THREE.Color(0x010115);
    const duskColor = new THREE.Color(0x0d0a30);
    const bg = nightColor.clone().lerp(duskColor, dayF * 0.5);
    scene.background = bg;

    // Update ambient light: 0.3 + dayF * 0.6
    if (ambientRef.current) {
      ambientRef.current.intensity = 0.3 + dayF * 0.6;
    }

    // Update sun point light: 1.0 + dayF * 3.5
    if (sunLightRef.current) {
      sunLightRef.current.intensity = 1.0 + dayF * 3.5;
    }

    // Day/night state transitions (only in free / story modes, not title)
    if (gameState !== 'title') {
      const wasNight = state.isNight;

      if (dot > DAY_THRESHOLD && wasNight) {
        // Transition to day
        useGameStore.setState({ isNight: false });
        // Auto extinguish lamp in free mode
        if (gameState === 'free' && state.lampOn) {
          state.setLamp(false, true);
        }
      } else if (dot < NIGHT_THRESHOLD && !wasNight) {
        // Transition to night
        useGameStore.setState({ isNight: true });
        // Auto light lamp in free mode
        if (gameState === 'free' && !state.lampOn) {
          state.setLamp(true, true);
        }
      }
    }
  });

  /* ---------- render ---------- */

  return (
    <group ref={sunGroupRef}>
      {/* Sun mesh group: body + rays + face + glow */}
      <group ref={sunMeshRef}>
        {/* Body disc */}
        <mesh>
          <circleGeometry args={[0.8, 32]} />
          <meshBasicMaterial color={0xffe066} />
        </mesh>

        {/* Main rays */}
        {mainRayGeoms.map(({ geom, a, dist }, i) => (
          <mesh
            key={`main-ray-${i}`}
            geometry={geom}
            position={[Math.cos(a) * dist, Math.sin(a) * dist, 0.01]}
            rotation={[0, 0, a - Math.PI / 2]}
          >
            <meshBasicMaterial color={0xffe066} side={THREE.DoubleSide} />
          </mesh>
        ))}

        {/* Supplementary thin rays */}
        {suppRayGeoms.map(({ geom, a, dist }, i) => (
          <mesh
            key={`supp-ray-${i}`}
            geometry={geom}
            position={[Math.cos(a) * dist, Math.sin(a) * dist, 0.01]}
            rotation={[0, 0, a - Math.PI / 2]}
          >
            <meshBasicMaterial color={0xffe066} side={THREE.DoubleSide} />
          </mesh>
        ))}

        {/* Face: eyes */}
        <mesh geometry={eyeGeom} position={[-0.24, 0.18, 0.02]}>
          <meshBasicMaterial color={0xcc8800} />
        </mesh>
        <mesh geometry={eyeGeom} position={[0.24, 0.18, 0.02]}>
          <meshBasicMaterial color={0xcc8800} />
        </mesh>

        {/* Face: smile */}
        <mesh geometry={smileGeom} position={[0, -0.1, 0.02]}>
          <meshBasicMaterial color={0xcc8800} side={THREE.DoubleSide} />
        </mesh>

        {/* Face: blush */}
        <mesh geometry={blushGeom} position={[-0.42, 0.06, 0.02]}>
          <meshBasicMaterial color={0xff9966} transparent opacity={0.3} />
        </mesh>
        <mesh geometry={blushGeom} position={[0.42, 0.06, 0.02]}>
          <meshBasicMaterial color={0xff9966} transparent opacity={0.3} />
        </mesh>

        {/* Glow sprite behind sun */}
        <sprite scale={[4, 4, 1]} position={[0, 0, -0.1]}>
          <spriteMaterial color={0xffee88} transparent opacity={0.15} />
        </sprite>
      </group>

      {/* Sun point light */}
      <pointLight
        ref={sunLightRef}
        color={0xffeedd}
        intensity={1.0}
        distance={30}
        decay={1}
      />
    </group>
  );
}
