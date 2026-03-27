import * as THREE from 'three';

// Planet
export const PLANET_R = 1.8;
export const SURFACE_R = PLANET_R;

// Sun
export const SUN_ORBIT_R = 7.5;
export const ONE_MIN = 60; // seconds for full orbit

// Character angles (radians from top of planet)
export const LAMP_ANGLE = 0;              // 12 o'clock
export const MAN_ANGLE = Math.PI / 6;     // 1 o'clock (30°)
export const PRINCE_ANGLE = Math.PI / 3;  // 2 o'clock (60°)

// Camera
export const CAM_TARGET = new THREE.Vector3(0, 0.5, 0);
export const INITIAL_CAM_POS: [number, number, number] = [0, 2.5, 9];
export const CAM_FOV = 55;
export const CAM_RADIUS = 9;

// Hill seeds: [angle, y_offset, radius]
export const HILL_SEEDS: [number, number, number][] = [
  [0.5, 0.3, 0.18],
  [2.2, -0.1, 0.22],
  [3.8, 0.2, 0.15],
  [5.0, -0.2, 0.19],
  [1.4, 0.1, 0.14],
];

// Sun ray data: [angle_degrees, length, width]
export const SUN_RAY_DATA: [number, number, number][] = [
  [0, 1.05, 0.13],
  [36, 0.75, 0.10],
  [72, 1.15, 0.14],
  [108, 0.70, 0.09],
  [144, 1.00, 0.12],
  [180, 0.80, 0.11],
  [216, 1.10, 0.13],
  [252, 0.72, 0.09],
  [288, 0.95, 0.12],
  [324, 0.78, 0.10],
];

// Bird flock positions
export const BIRD_POSITIONS: [number, number, number][] = [
  [-0.8, 1.5, 0.1],
  [-0.3, 1.8, -0.2],
  [0.3, 1.6, 0.2],
  [0.8, 1.9, -0.1],
  [-1.2, 1.2, -0.15],
  [1.3, 1.4, 0.05],
  [-0.5, 2.1, 0.3],
  [0.5, 2.0, -0.25],
  [0.0, 2.2, 0.15],
  [-1.0, 1.7, 0.2],
];

// Day/night thresholds
export const DAY_THRESHOLD = 0.15;
export const NIGHT_THRESHOLD = -0.05;
