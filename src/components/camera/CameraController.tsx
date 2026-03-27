import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useGameStore } from '../../store/useGameStore';
import { CAM_TARGET, CAM_RADIUS } from '../../data/constants';

export function CameraController() {
  const { camera, gl } = useThree();
  const drag = useRef({
    active: false,
    prevX: 0,
    prevY: 0,
    theta: 0,
    phi: 0.28,
  });

  // Spherical drag when paused in free mode
  useEffect(() => {
    const canvas = gl.domElement;

    const onMouseDown = (e: MouseEvent) => {
      const { isPaused, gameState } = useGameStore.getState();
      if (!isPaused || gameState !== 'free') return;
      drag.current.active = true;
      drag.current.prevX = e.clientX;
      drag.current.prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!drag.current.active) return;
      const dx = (e.clientX - drag.current.prevX) * 0.006;
      const dy = (e.clientY - drag.current.prevY) * 0.006;
      drag.current.theta -= dx;
      drag.current.phi = Math.max(0.12, Math.min(Math.PI * 0.88, drag.current.phi + dy));
      drag.current.prevX = e.clientX;
      drag.current.prevY = e.clientY;

      const { theta, phi } = drag.current;
      camera.position.x = CAM_RADIUS * Math.sin(phi) * Math.sin(theta);
      camera.position.y = CAM_RADIUS * Math.cos(phi) + 0.5;
      camera.position.z = CAM_RADIUS * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(CAM_TARGET);
    };

    const onMouseUp = () => {
      drag.current.active = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [camera, gl]);

  // Reset camera when unpausing
  useFrame(() => {
    const { isPaused, gameState } = useGameStore.getState();
    if (!isPaused && gameState === 'free') {
      // If drag was active and we just unpaused, reset
      if (drag.current.theta !== 0 || drag.current.phi !== 0.28) {
        drag.current.theta = 0;
        drag.current.phi = 0.28;
        camera.position.set(0, 2.5, 9);
        camera.lookAt(CAM_TARGET);
      }
    }
  });

  return null;
}
