import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

export function Stars() {
  const whiteGeoRef = useRef<THREE.BufferGeometry>(null);
  const yellowGeoRef = useRef<THREE.BufferGeometry>(null);

  const whitePositions = useMemo(() => {
    const cnt = 2500;
    const pos = new Float32Array(cnt * 3);
    for (let i = 0; i < cnt; i++) {
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const r = 120 + Math.random() * 180;
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      pos[i * 3 + 2] = r * Math.cos(ph);
    }
    return pos;
  }, []);

  const yellowPositions = useMemo(() => {
    const cnt = 80;
    const pos = new Float32Array(cnt * 3);
    for (let i = 0; i < cnt; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 5;
    }
    return pos;
  }, []);

  useEffect(() => {
    if (whiteGeoRef.current) {
      whiteGeoRef.current.setAttribute(
        'position',
        new THREE.BufferAttribute(whitePositions, 3)
      );
    }
    if (yellowGeoRef.current) {
      yellowGeoRef.current.setAttribute(
        'position',
        new THREE.BufferAttribute(yellowPositions, 3)
      );
    }
  }, [whitePositions, yellowPositions]);

  return (
    <>
      <points>
        <bufferGeometry ref={whiteGeoRef} />
        <pointsMaterial color={0xffffff} size={0.35} sizeAttenuation />
      </points>
      <points>
        <bufferGeometry ref={yellowGeoRef} />
        <pointsMaterial color={0xf5e642} size={0.55} />
      </points>
    </>
  );
}
