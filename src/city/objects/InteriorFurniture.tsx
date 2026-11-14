'use client';

import React, { useMemo } from 'react';
import { Html, RoundedBox, Text } from '@react-three/drei';
import {
  getArchitecturalConcreteTexture,
  getTravertinePaverTexture,
  getWoodFloorTexture,
} from '@/city/core/TextureFactory';
import { useAudioFeedback } from '@/hooks/useAudioFeedback';
import { useCityStore } from '@/hooks/useCityStore';

function setPointerCursor(active: boolean) {
  if (typeof document !== 'undefined') {
    document.body.style.cursor = active ? 'pointer' : 'auto';
  }
}

/**
 * 1. Architectural Room Shell:
 *    - Natural Oak/Walnut Hardwood Floor + Woven Travertine Rug
 *    - Off-White Plaster Back Wall with Travertine Stone Feature Panel & Framed Minimalist Art
 *    - Sunlit Floor-to-Ceiling Architectural Window Wall on the Left with Warm Cedar Mullions
 */
export function ArchitecturalStudioRoom() {
  const woodTex = useMemo(() => getWoodFloorTexture(), []);
  const travertineTex = useMemo(() => getTravertinePaverTexture(4, 3), []);
  const concreteTex = useMemo(() => getArchitecturalConcreteTexture(3, 2), []);

  return (
    <group name="studio-room-shell">
      {/* Hardwood Studio Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[11.5, 9.0]} />
        <meshStandardMaterial map={woodTex} color="#B88B61" roughness={0.42} metalness={0.05} />
      </mesh>

      {/* Baseboard Trim */}
      <mesh position={[0, 0.06, -3.55]} receiveShadow>
        <boxGeometry args={[11.2, 0.12, 0.08]} />
        <meshStandardMaterial color="#E4E0D8" roughness={0.5} />
      </mesh>

      {/* Woven Alabaster Wool Area Rug under the Desk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0.1]} receiveShadow>
        <planeGeometry args={[5.4, 3.6]} />
        <meshStandardMaterial color="#EAE5DC" roughness={0.92} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0.1]} receiveShadow>
        <planeGeometry args={[5.56, 3.76]} />
        <meshStandardMaterial color="#D4CFC4" roughness={0.9} />
      </mesh>

      {/* Back Architectural Wall (Off-White Plaster + Travertine Feature Panel) */}
      <mesh position={[0, 2.3, -3.65]} receiveShadow>
        <boxGeometry args={[11.5, 4.6, 0.2]} />
        <meshStandardMaterial color="#F5F2EC" roughness={0.72} />
      </mesh>

      {/* Center Honed Travertine Architectural Feature Panel behind Desk */}
      <mesh position={[0, 2.3, -3.52]} receiveShadow castShadow>
        <boxGeometry args={[4.4, 4.4, 0.08]} />
        <meshStandardMaterial map={travertineTex} color="#E6DFD3" roughness={0.48} />
      </mesh>
      {/* Subtle Vertical Timber Acoustic Slats flanking the Travertine Panel */}
      {[-2.4, -2.28, -2.16, 2.16, 2.28, 2.4].map((xSlat, idx) => (
        <mesh key={`slat-${idx}`} position={[xSlat, 2.3, -3.51]} castShadow>
          <boxGeometry args={[0.06, 4.4, 0.09]} />
          <meshStandardMaterial color="#9C6B43" roughness={0.5} />
        </mesh>
      ))}

      {/* Framed Minimalist Architectural Relief Art on Back Wall */}
      <group position={[0, 2.85, -3.46]}>
        {/* Walnut Frame */}
        <mesh castShadow>
          <boxGeometry args={[1.95, 1.15, 0.05]} />
          <meshStandardMaterial color="#5C3A21" roughness={0.45} />
        </mesh>
        {/* Warm Off-White Canvas Mat */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[1.82, 1.02]} />
          <meshStandardMaterial color="#FAF8F5" roughness={0.8} />
        </mesh>
        {/* Minimalist Geometric Composition */}
        <mesh position={[-0.32, 0.04, 0.04]}>
          <circleGeometry args={[0.26, 32]} />
          <meshStandardMaterial color="#C8B69E" roughness={0.6} />
        </mesh>
        <mesh position={[0.22, -0.05, 0.042]}>
          <planeGeometry args={[0.62, 0.52]} />
          <meshStandardMaterial color="#27272A" roughness={0.5} />
        </mesh>
        <Text position={[0, -0.4, 0.045]} fontSize={0.055} color="#71717A" anchorX="center">
          ARSHAON ARCHITECTURAL STUDIO · EST. ARSHAON.COM
        </Text>
      </group>

      {/* Left Wall: Sunlit Floor-to-Ceiling Architectural Window with Cedar Louvers */}
      <group position={[-5.2, 0, 0]}>
        {/* Top & Bottom Wall Headers */}
        <mesh position={[0, 4.25, 0]} receiveShadow>
          <boxGeometry args={[0.24, 0.7, 9.0]} />
          <meshStandardMaterial map={concreteTex} color="#EFECE6" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.25, 0]} receiveShadow>
          <boxGeometry args={[0.24, 0.5, 9.0]} />
          <meshStandardMaterial map={concreteTex} color="#EFECE6" roughness={0.6} />
        </mesh>
        {/* Exterior Sunlit Sky Backdrop Plane */}
        <mesh position={[-0.45, 2.3, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[8.8, 4.2]} />
          <meshBasicMaterial color="#FFFDF9" />
        </mesh>
        {/* Window Glass Pane */}
        <mesh position={[0, 2.25, 0]}>
          <boxGeometry args={[0.04, 3.5, 8.4]} />
          <meshPhysicalMaterial
            color="#E0F2FE"
            transparent
            opacity={0.26}
            roughness={0.05}
            metalness={0.1}
          />
        </mesh>
        {/* Vertical Anodized Charcoal & Cedar Window Mullions */}
        {[-3.2, -1.6, 0, 1.6, 3.2].map((zM, idx) => (
          <mesh key={`win-mullion-${idx}`} position={[0.04, 2.25, zM]} castShadow>
            <boxGeometry args={[0.14, 3.55, 0.08]} />
            <meshStandardMaterial color="#27272A" metalness={0.6} roughness={0.35} />
          </mesh>
        ))}
      </group>

      {/* Right Wall (Warm Alabaster Plaster) */}
      <mesh position={[5.2, 2.3, 0]} receiveShadow>
        <boxGeometry args={[0.2, 4.6, 9.0]} />
        <meshStandardMaterial color="#F2EFE9" roughness={0.75} />
      </mesh>
    </group>
  );
}

/**
 * 2. Sculpted Walnut Executive Desk + Computer + Monitor + Keyboard + Mouse + Chair + Lamp
 *    Clicking the Computer/Monitor opens the Portfolio / My Creations view.
 */
export function InteractiveExecutiveDesk({
  onOpenCreations,
}: {
  onOpenCreations: () => void;
}) {
  const { playClick } = useAudioFeedback();
  const hoveredObject = useCityStore((s) => s.hoveredObject);
  const setHoveredObject = useCityStore((s) => s.setHoveredObject);
  const setWorkspaceFocus = useCityStore((s) => s.setWorkspaceFocus);
  const deskLampOn = useCityStore((s) => s.deskLampOn);
  const toggleDeskLamp = useCityStore((s) => s.toggleDeskLamp);

  const isComputerHovered = hoveredObject === 'computer';
  const isLampHovered = hoveredObject === 'lamp';

  return (
    <group position={[0, 0, -1.25]}>
      {/* Sculpted Natural Walnut Desk Top */}
      <RoundedBox
        args={[2.75, 0.075, 1.15]}
        radius={0.02}
        smoothness={4}
        position={[0, 0.76, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#6E472B" roughness={0.38} metalness={0.08} />
      </RoundedBox>

      {/* Architectural Brushed Charcoal Steel Sleek Sled Legs */}
      {[-1.18, 1.18].map((xLeg) => (
        <group key={`desk-leg-${xLeg}`} position={[xLeg, 0.37, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.07, 0.74, 0.96]} />
            <meshStandardMaterial color="#27272A" metalness={0.75} roughness={0.28} />
          </mesh>
        </group>
      ))}
      {/* Modesty Front Panel in Warm Walnut */}
      <mesh position={[0, 0.56, -0.42]} castShadow>
        <boxGeometry args={[2.28, 0.34, 0.04]} />
        <meshStandardMaterial color="#5C3A21" roughness={0.45} />
      </mesh>

      {/* Charcoal Merino Wool Felt Desk Mat */}
      <mesh position={[0, 0.801, 0.14]} receiveShadow>
        <boxGeometry args={[1.15, 0.008, 0.44]} />
        <meshStandardMaterial color="#27272A" roughness={0.9} />
      </mesh>

      {/* Mechanical Keyboard (Anodized Silver Frame + Charcoal/Off-White Keycaps) */}
      <group position={[-0.08, 0.818, 0.16]}>
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.022, 0.15]} />
          <meshStandardMaterial color="#D4D4D8" metalness={0.7} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.012, 0]}>
          <boxGeometry args={[0.39, 0.008, 0.13]} />
          <meshStandardMaterial color="#27272A" roughness={0.6} />
        </mesh>
      </group>

      {/* Ergonomic Wireless Mouse */}
      <RoundedBox
        args={[0.07, 0.028, 0.115]}
        radius={0.012}
        position={[0.28, 0.818, 0.16]}
        castShadow
      >
        <meshStandardMaterial color="#18181B" roughness={0.35} metalness={0.3} />
      </RoundedBox>

      {/* =================================================================
          CLICKABLE COMPUTER & ULTRA-WIDE STUDIO MONITOR -> OPENS PORTFOLIO
         ================================================================= */}
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredObject('computer');
          setPointerCursor(true);
        }}
        onPointerOut={() => {
          setHoveredObject(null);
          setPointerCursor(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          playClick();
          setWorkspaceFocus('computer');
          onOpenCreations();
        }}
      >
        {/* Brushed Aluminum Workstation Computer Case on Right Side of Desk */}
        <RoundedBox
          args={[0.24, 0.46, 0.44]}
          radius={0.015}
          position={[1.05, 1.03, -0.18]}
          castShadow
        >
          <meshStandardMaterial color="#D4D4D8" metalness={0.82} roughness={0.22} />
        </RoundedBox>
        {/* Subtle Front Ventilation Grille */}
        <mesh position={[1.05, 1.03, 0.042]}>
          <planeGeometry args={[0.18, 0.36]} />
          <meshStandardMaterial color="#27272A" roughness={0.5} />
        </mesh>

        {/* Walnut Monitor Riser Shelf */}
        <mesh position={[0, 0.86, -0.26]} castShadow>
          <boxGeometry args={[1.35, 0.09, 0.26]} />
          <meshStandardMaterial color="#5C3A21" roughness={0.45} />
        </mesh>

        {/* Brushed Aluminum Monitor Stand */}
        <mesh position={[0, 1.04, -0.3]} castShadow>
          <boxGeometry args={[0.1, 0.32, 0.06]} />
          <meshStandardMaterial color="#A1A1AA" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Primary 34-inch Architectural Studio Display */}
        <group position={[0, 1.28, -0.26]}>
          <RoundedBox args={[1.26, 0.58, 0.035]} radius={0.01} castShadow>
            <meshStandardMaterial
              color={isComputerHovered ? '#2563EB' : '#18181B'}
              metalness={0.6}
              roughness={0.25}
            />
          </RoundedBox>
          {/* Active Portfolio Screen Display */}
          <mesh position={[0, 0, 0.02]}>
            <planeGeometry args={[1.21, 0.53]} />
            <meshStandardMaterial
              color="#FAF8F5"
              emissive={isComputerHovered ? '#DBEAFE' : '#F7F5F0'}
              emissiveIntensity={isComputerHovered ? 0.45 : 0.22}
              roughness={0.2}
            />
          </mesh>
          {/* Editorial Screen Content */}
          <Text position={[0, 0.14, 0.025]} fontSize={0.042} color="#2563EB" anchorX="center">
            ARSHAON.COM · DIGITAL PORTFOLIO
          </Text>
          <Text position={[0, 0.03, 0.025]} fontSize={0.065} color="#18181B" anchorX="center">
            ASHIKUR RAHMAN SHAON
          </Text>
          <Text position={[0, -0.07, 0.025]} fontSize={0.038} color="#71717A" anchorX="center">
            Websites · SaaS · AI Automation · Digital Marketing
          </Text>
          <Text position={[0, -0.17, 0.025]} fontSize={0.038} color="#2563EB" anchorX="center">
            [ Click Monitor to Explore My Creations ]
          </Text>
        </group>

        {/* Secondary Angled Reference Display on Left */}
        <group position={[-0.86, 1.24, -0.14]} rotation={[0, 0.32, 0]}>
          <RoundedBox args={[0.42, 0.56, 0.03]} radius={0.01} castShadow>
            <meshStandardMaterial color="#18181B" metalness={0.6} roughness={0.25} />
          </RoundedBox>
          <mesh position={[0, 0, 0.018]}>
            <planeGeometry args={[0.38, 0.52]} />
            <meshStandardMaterial
              color="#18181B"
              emissive="#1E293B"
              emissiveIntensity={0.35}
            />
          </mesh>
          <Text position={[0, 0.06, 0.022]} fontSize={0.035} color="#93C5FD" anchorX="center">
            SYSTEMS & CODE
          </Text>
          <Text position={[0, -0.04, 0.022]} fontSize={0.028} color="#CBD5E1" anchorX="center">
            TypeScript · Next.js
          </Text>
        </group>

        {/* Floating Interactive Pill above Monitor */}
        <Html position={[0, 1.72, -0.26]} center distanceFactor={6}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              playClick();
              setWorkspaceFocus('computer');
              onOpenCreations();
            }}
            className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold shadow-lg transition-all ${
              isComputerHovered
                ? 'scale-105 border-accent-600 bg-accent-600 text-white'
                : 'border-charcoal-900/15 bg-white/95 text-charcoal-900 hover:bg-accent-600 hover:text-white'
            }`}
          >
            ● Computer — Open Portfolio
          </button>
        </Html>
      </group>

      {/* =================================================================
          CLICKABLE WARM BRASS ARCHITECTURAL DESK LAMP
         ================================================================= */}
      <group
        position={[-1.12, 0.8, -0.3]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredObject('lamp');
          setPointerCursor(true);
        }}
        onPointerOut={() => {
          setHoveredObject(null);
          setPointerCursor(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          playClick();
          toggleDeskLamp();
        }}
      >
        {/* Heavy Travertine & Brass Base */}
        <mesh position={[0, 0.03, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.12, 0.06, 24]} />
          <meshStandardMaterial color="#D4B996" roughness={0.4} />
        </mesh>
        {/* Brass Stem & Arm */}
        <mesh position={[0, 0.28, 0]} castShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.48, 12]} />
          <meshStandardMaterial color="#C29B61" metalness={0.85} roughness={0.2} />
        </mesh>
        <mesh position={[0.12, 0.5, 0.05]} rotation={[0, 0, -0.5]} castShadow>
          <cylinderGeometry args={[0.012, 0.012, 0.3, 12]} />
          <meshStandardMaterial color="#C29B61" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Conical Brass Shade */}
        <mesh position={[0.22, 0.48, 0.08]} rotation={[0.2, 0, -0.35]} castShadow>
          <coneGeometry args={[0.11, 0.16, 24]} />
          <meshStandardMaterial
            color={isLampHovered ? '#D4AF37' : '#C29B61'}
            metalness={0.85}
            roughness={0.22}
          />
        </mesh>
        {deskLampOn && (
          <pointLight
            position={[0.24, 0.4, 0.1]}
            intensity={1.2}
            distance={3.2}
            color="#FDE68A"
          />
        )}
      </group>

      {/* Ceramic Vessel with Decorative Olive Branch on Desk */}
      <group position={[0.68, 0.8, 0.24]}>
        <mesh position={[0, 0.08, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.07, 0.16, 18]} />
          <meshStandardMaterial color="#E6DFD3" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.22, 0]} castShadow>
          <sphereGeometry args={[0.09, 10, 10]} />
          <meshStandardMaterial color="#5E7A52" roughness={0.8} />
        </mesh>
      </group>

      {/* =================================================================
          ERGONOMIC COGNAC-LEATHER & CHARCOAL EXECUTIVE CHAIR
         ================================================================= */}
      <group position={[0, 0, 0.78]} rotation={[0, Math.PI + 0.18, 0]}>
        {/* 5-Star Brushed Aluminum Base & Pneumatic Cylinder */}
        <mesh position={[0, 0.05, 0]} castShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.04, 10]} />
          <meshStandardMaterial color="#52525B" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.26, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.42, 12]} />
          <meshStandardMaterial color="#27272A" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Cognac Leather Seat Cushion */}
        <RoundedBox
          args={[0.56, 0.08, 0.54]}
          radius={0.025}
          position={[0, 0.48, 0]}
          castShadow
        >
          <meshStandardMaterial color="#8C5A32" roughness={0.48} />
        </RoundedBox>
        {/* Sculpted Walnut & Cognac Leather Backrest */}
        <RoundedBox
          args={[0.52, 0.72, 0.07]}
          radius={0.025}
          position={[0, 0.88, -0.24]}
          castShadow
        >
          <meshStandardMaterial color="#8C5A32" roughness={0.48} />
        </RoundedBox>
        {/* Headrest */}
        <RoundedBox
          args={[0.32, 0.16, 0.065]}
          radius={0.02}
          position={[0, 1.31, -0.23]}
          castShadow
        >
          <meshStandardMaterial color="#6E472B" roughness={0.48} />
        </RoundedBox>
        {/* Brushed Metal Armrests */}
        {[-0.29, 0.29].map((ax) => (
          <mesh key={`arm-${ax}`} position={[ax, 0.66, -0.04]} castShadow>
            <boxGeometry args={[0.045, 0.03, 0.34]} />
            <meshStandardMaterial color="#27272A" metalness={0.6} roughness={0.3} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/**
 * 3. Built-in Walnut & Travertine Architectural Bookshelf (Left-Rear Corner)
 *    Clicking opens/scrolls to About Me.
 */
export function InteractiveBookshelf({
  onOpenAbout,
}: {
  onOpenAbout: () => void;
}) {
  const { playClick } = useAudioFeedback();
  const hoveredObject = useCityStore((s) => s.hoveredObject);
  const setHoveredObject = useCityStore((s) => s.setHoveredObject);
  const setWorkspaceFocus = useCityStore((s) => s.setWorkspaceFocus);

  const isHovered = hoveredObject === 'bookshelf';
  const spinePalette = ['#27272A', '#D4B996', '#8C5A32', '#E4E0D8', '#3B82F6', '#52525B'];

  return (
    <group
      position={[-3.35, 0, -2.95]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredObject('bookshelf');
        setPointerCursor(true);
      }}
      onPointerOut={() => {
        setHoveredObject(null);
        setPointerCursor(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        playClick();
        setWorkspaceFocus('bookshelf');
        onOpenAbout();
      }}
    >
      {/* Walnut Bookshelf Case */}
      <mesh position={[0, 1.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.85, 2.9, 0.46]} />
        <meshStandardMaterial
          color={isHovered ? '#7C4F2B' : '#5C3A21'}
          roughness={0.48}
        />
      </mesh>
      {/* Warm Travertine Back Panel Insert */}
      <mesh position={[0, 1.45, -0.18]}>
        <boxGeometry args={[1.72, 2.76, 0.04]} />
        <meshStandardMaterial color="#E6DFD3" roughness={0.6} />
      </mesh>

      {/* Shelves & Curated Architectural Volumes */}
      {[0.48, 1.05, 1.62, 2.18].map((shelfY, rIdx) => (
        <group key={`bs-row-${rIdx}`}>
          <mesh position={[0, shelfY, 0.02]} castShadow>
            <boxGeometry args={[1.74, 0.045, 0.42]} />
            <meshStandardMaterial color="#6E472B" roughness={0.45} />
          </mesh>
          {Array.from({ length: 7 }).map((_, bIdx) => (
            <mesh
              key={`vol-${rIdx}-${bIdx}`}
              position={[-0.62 + bIdx * 0.19, shelfY + 0.17, 0.04]}
              castShadow
            >
              <boxGeometry args={[0.11, 0.28 + (bIdx % 2) * 0.04, 0.26]} />
              <meshStandardMaterial
                color={spinePalette[(rIdx * 3 + bIdx) % spinePalette.length]}
                roughness={0.55}
              />
            </mesh>
          ))}
        </group>
      ))}

      <Html position={[0, 2.65, 0.25]} center distanceFactor={6}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            playClick();
            setWorkspaceFocus('bookshelf');
            onOpenAbout();
          }}
          className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold shadow-lg transition-all ${
            isHovered
              ? 'scale-105 border-wood-dark bg-wood-dark text-white'
              : 'border-charcoal-900/15 bg-white/95 text-charcoal-900 hover:bg-charcoal-900 hover:text-white'
          }`}
        >
          ● Bookshelf — About Me
        </button>
      </Html>
    </group>
  );
}

/**
 * 4. Walnut Credenza & Sleek Multifunction Studio Printer (Right Side of Office)
 *    Clicking the Printer opens the CV Preview / Download PDF / Print modal.
 */
export function InteractiveStudioPrinter({
  onOpenCV,
}: {
  onOpenCV: () => void;
}) {
  const { playClick } = useAudioFeedback();
  const hoveredObject = useCityStore((s) => s.hoveredObject);
  const setHoveredObject = useCityStore((s) => s.setHoveredObject);
  const setWorkspaceFocus = useCityStore((s) => s.setWorkspaceFocus);

  const isHovered = hoveredObject === 'printer';

  return (
    <group
      position={[3.2, 0, -2.4]}
      rotation={[0, -0.35, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredObject('printer');
        setPointerCursor(true);
      }}
      onPointerOut={() => {
        setHoveredObject(null);
        setPointerCursor(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        playClick();
        setWorkspaceFocus('printer');
        onOpenCV();
      }}
    >
      {/* Walnut & Travertine Studio Credenza Cabinet */}
      <RoundedBox
        args={[1.65, 0.76, 0.78]}
        radius={0.02}
        position={[0, 0.38, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#5C3A21" roughness={0.45} />
      </RoundedBox>
      <mesh position={[0, 0.77, 0]} receiveShadow>
        <boxGeometry args={[1.68, 0.03, 0.8]} />
        <meshStandardMaterial color="#E6DFD3" roughness={0.35} />
      </mesh>

      {/* Sleek Multifunction Studio Printer Body */}
      <group position={[0, 0.79, 0]}>
        <RoundedBox
          args={[0.92, 0.44, 0.62]}
          radius={0.02}
          position={[0, 0.22, 0]}
          castShadow
        >
          <meshStandardMaterial
            color={isHovered ? '#EFF6FF' : '#F4F4F5'}
            roughness={0.32}
            metalness={0.1}
          />
        </RoundedBox>
        {/* Top Flatbed Scanner Lid */}
        <RoundedBox
          args={[0.94, 0.07, 0.64]}
          radius={0.015}
          position={[0, 0.47, 0]}
          castShadow
        >
          <meshStandardMaterial color="#27272A" roughness={0.35} />
        </RoundedBox>
        {/* Paper Output Cavity & Crisp Printed A4 CV Sheet */}
        <mesh position={[0, 0.24, 0.28]}>
          <boxGeometry args={[0.56, 0.1, 0.08]} />
          <meshStandardMaterial color="#18181B" />
        </mesh>
        <mesh position={[0, 0.22, 0.36]} rotation={[0.08, 0, 0]} castShadow>
          <boxGeometry args={[0.36, 0.01, 0.26]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        {/* Printer Touch Display */}
        <mesh position={[0.28, 0.49, 0.22]} rotation={[-0.4, 0, 0]}>
          <planeGeometry args={[0.22, 0.12]} />
          <meshStandardMaterial
            color="#2563EB"
            emissive="#2563EB"
            emissiveIntensity={0.45}
          />
        </mesh>
        <Text
          position={[0, 0.12, 0.32]}
          fontSize={0.042}
          color="#27272A"
          anchorX="center"
        >
          A4 RESUME & CV STATION
        </Text>
      </group>

      <Html position={[0, 1.68, 0]} center distanceFactor={6}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            playClick();
            setWorkspaceFocus('printer');
            onOpenCV();
          }}
          className={`whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold shadow-lg transition-all ${
            isHovered
              ? 'scale-105 border-accent-600 bg-accent-600 text-white'
              : 'border-charcoal-900/15 bg-white/95 text-charcoal-900 hover:bg-accent-600 hover:text-white'
          }`}
        >
          ● Printer — Open My CV & Print
        </button>
      </Html>
    </group>
  );
}
