'use client';

import React from 'react';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import { useCityStore } from '@/hooks/useCityStore';

/**
 * Architectural Studio Interior Lighting & HDR Environment Reflections.
 * Casts natural sunlight through the left studio window with soft contact shadows.
 */
export function LightingAndSky() {
  const lightingMode = useCityStore((s) => s.lightingMode);
  const isDay = lightingMode === 'daylight';

  const bgColor = isDay ? '#EFECE6' : '#1E2024';
  const sunColor = isDay ? '#FFF9EE' : '#FDBA74';
  const sunIntensity = isDay ? 2.4 : 1.1;

  return (
    <>
      <color attach="background" args={[bgColor]} />

      {/* GPU HDR Environment for realistic glass, walnut wood, and brushed metal reflections */}
      <Environment resolution={256} frames={1}>
        <Lightformer
          form="rect"
          intensity={isDay ? 2.8 : 1.2}
          color={isDay ? '#FFFDF9' : '#FED7AA'}
          scale={[12, 8, 1]}
          position={[-7, 3.5, 0]}
          rotation={[0, Math.PI / 2, 0]}
        />
        <Lightformer
          form="rect"
          intensity={isDay ? 1.5 : 0.7}
          color="#F5F2EB"
          scale={[14, 14, 1]}
          position={[0, 6, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        <Lightformer
          form="ring"
          intensity={isDay ? 1.2 : 0.8}
          color="#D4B996"
          scale={[10, 10, 1]}
          position={[5, 2, 4]}
        />
      </Environment>

      {/* Soft Architectural Ambient Fill */}
      <ambientLight intensity={isDay ? 0.8 : 0.42} color={isDay ? '#FAF8F5' : '#E2E8F0'} />

      <hemisphereLight
        args={[isDay ? '#FFFDF9' : '#CBD5E1', isDay ? '#D4B996' : '#334155', isDay ? 0.65 : 0.35]}
      />

      {/* Key Sunlight streaming through the West Architectural Window */}
      <directionalLight
        position={[-9, 7.5, 4.5]}
        intensity={sunIntensity}
        color={sunColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-camera-near={0.5}
        shadow-camera-far={28}
        shadow-bias={-0.0003}
      />

      {/* Soft Warm Ceiling Fill Light */}
      <pointLight
        position={[0, 3.9, 0.5]}
        intensity={isDay ? 0.55 : 1.1}
        distance={14}
        color="#FFF5E4"
      />

      {/* Grounded Architectural Contact Shadows */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.38}
        scale={14}
        blur={2.1}
        far={4.5}
        color="#27272A"
      />
    </>
  );
}
