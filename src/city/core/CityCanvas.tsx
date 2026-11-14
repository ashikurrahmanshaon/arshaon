'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { CityScene } from './CityScene';

interface CityCanvasProps {
  onOpenCreations: () => void;
  onOpenCV: () => void;
  onOpenAbout: () => void;
}

export function CityCanvas({
  onOpenCreations,
  onOpenCV,
  onOpenAbout,
}: CityCanvasProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-[#EFECE6] no-print">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 2.35, 3.85], fov: 42, near: 0.1, far: 60 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.02,
        }}
      >
        <Suspense fallback={null}>
          <CityScene
            onOpenCreations={onOpenCreations}
            onOpenCV={onOpenCV}
            onOpenAbout={onOpenAbout}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
