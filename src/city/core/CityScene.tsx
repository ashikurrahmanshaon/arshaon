'use client';

import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { LightingAndSky } from '@/city/environment/LightingAndSky';
import {
  ArchitecturalStudioRoom,
  InteractiveBookshelf,
  InteractiveExecutiveDesk,
  InteractiveStudioPrinter,
} from '@/city/objects/InteriorFurniture';
import { useCityStore } from '@/hooks/useCityStore';
import { WorkspaceFocus } from '@/types/city';

const CAMERA_PRESETS: Record<
  WorkspaceFocus,
  { pos: [number, number, number]; lookAt: [number, number, number] }
> = {
  overview: { pos: [0, 2.35, 3.85], lookAt: [0, 1.15, -1.4] },
  computer: { pos: [0, 1.42, 0.55], lookAt: [0, 1.25, -1.52] },
  printer: { pos: [1.95, 1.65, -0.35], lookAt: [3.15, 1.08, -2.35] },
  bookshelf: { pos: [-1.85, 1.75, -0.35], lookAt: [-3.3, 1.45, -2.9] },
  desk: { pos: [1.45, 1.85, 1.25], lookAt: [0, 1.0, -1.25] },
};

interface CitySceneProps {
  onOpenCreations: () => void;
  onOpenCV: () => void;
  onOpenAbout: () => void;
}

export function CityScene({
  onOpenCreations,
  onOpenCV,
  onOpenAbout,
}: CitySceneProps) {
  const { camera } = useThree();
  const workspaceFocus = useCityStore((s) => s.workspaceFocus);

  const smoothLookAtRef = useRef(new THREE.Vector3(0, 1.15, -1.4));
  const pointerRef = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const preset = CAMERA_PRESETS[workspaceFocus] || CAMERA_PRESETS.overview;

    // Subtle mouse parallax around the active camera preset
    pointerRef.current.x = THREE.MathUtils.lerp(pointerRef.current.x, state.pointer.x, dt * 4);
    pointerRef.current.y = THREE.MathUtils.lerp(pointerRef.current.y, state.pointer.y, dt * 4);

    const parallaxX = workspaceFocus === 'overview' ? pointerRef.current.x * 0.45 : pointerRef.current.x * 0.12;
    const parallaxY = workspaceFocus === 'overview' ? pointerRef.current.y * 0.22 : pointerRef.current.y * 0.08;

    const desiredPos = new THREE.Vector3(
      preset.pos[0] + parallaxX,
      preset.pos[1] + parallaxY,
      preset.pos[2]
    );
    const desiredLook = new THREE.Vector3(
      preset.lookAt[0],
      preset.lookAt[1],
      preset.lookAt[2]
    );

    camera.position.lerp(desiredPos, Math.min(1, dt * 5.5));
    smoothLookAtRef.current.lerp(desiredLook, Math.min(1, dt * 6.5));
    camera.lookAt(smoothLookAtRef.current);
  });

  return (
    <group name="arshaon-workspace-scene">
      <LightingAndSky />
      <ArchitecturalStudioRoom />
      <InteractiveExecutiveDesk onOpenCreations={onOpenCreations} />
      <InteractiveBookshelf onOpenAbout={onOpenAbout} />
      <InteractiveStudioPrinter onOpenCV={onOpenCV} />
    </group>
  );
}
