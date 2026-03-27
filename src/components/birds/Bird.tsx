import { useMemo } from 'react';
import * as THREE from 'three';

interface BirdProps {
  size?: number;
  position?: [number, number, number];
}

/**
 * A single bird with named wings for animation.
 * Original lines 614-644.
 */
export function Bird({ size = 0.8, position = [0, 0, 0] }: BirdProps) {
  const sz = size;

  // Memoize wing shape geometry since it depends on size
  const wingGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(
      0.15 * sz,
      0.06 * sz,
      0.26 * sz,
      0.16 * sz,
      0.32 * sz,
      0,
    );
    shape.bezierCurveTo(
      0.2 * sz,
      -0.08 * sz,
      0.1 * sz,
      -0.05 * sz,
      0,
      0,
    );
    return new THREE.ShapeGeometry(shape);
  }, [sz]);

  return (
    <group position={position}>
      {/* Body */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04 * sz, 0.06 * sz, 0.25 * sz, 6]} />
        <meshStandardMaterial color={0x99bbcc} />
      </mesh>

      {/* Left wing */}
      <mesh name="leftWing" geometry={wingGeometry} position={[0, 0, 0.02]}>
        <meshStandardMaterial
          color={0x88bbcc}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Right wing */}
      <mesh
        name="rightWing"
        geometry={wingGeometry}
        position={[0, 0, -0.02]}
        rotation={[0, Math.PI, 0]}
      >
        <meshStandardMaterial
          color={0x88bbcc}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0.17 * sz, 0.025 * sz, 0]}>
        <sphereGeometry args={[0.07 * sz, 8, 8]} />
        <meshStandardMaterial color={0x77aabb} />
      </mesh>
    </group>
  );
}
