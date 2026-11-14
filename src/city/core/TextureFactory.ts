'use client';

import * as THREE from 'three';

const textureCache = new Map<string, THREE.CanvasTexture>();

function finalizeTexture(
  canvas: HTMLCanvasElement,
  repeatX = 1,
  repeatY = 1
): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/**
 * 1. Weathered Asphalt Road Texture with fine mineral aggregate & subtle lane wear.
 */
export function getAsphaltTexture(repeatX = 4, repeatY = 36): THREE.CanvasTexture {
  const key = `asphalt-${repeatX}-${repeatY}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#383c42';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle tire track longitudinal shading
  const trackGrad = ctx.createLinearGradient(0, 0, 512, 0);
  trackGrad.addColorStop(0, 'rgba(30,33,38,0.28)');
  trackGrad.addColorStop(0.25, 'rgba(68,73,82,0.12)');
  trackGrad.addColorStop(0.5, 'rgba(28,31,36,0.25)');
  trackGrad.addColorStop(0.75, 'rgba(68,73,82,0.12)');
  trackGrad.addColorStop(1, 'rgba(30,33,38,0.28)');
  ctx.fillStyle = trackGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Deterministic mineral aggregate speckle
  let seed = 1337;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 6500; i++) {
    const x = rand() * 512;
    const y = rand() * 512;
    const shade = Math.floor(46 + rand() * 42);
    ctx.fillStyle = `rgb(${shade},${shade + 2},${shade + 5})`;
    ctx.fillRect(x, y, 1.6, 1.6);
  }

  const tex = finalizeTexture(canvas, repeatX, repeatY);
  textureCache.set(key, tex);
  return tex;
}

/**
 * 2. Warm European Travertine / Limestone Paver Texture for sidewalks and pedestrian plazas.
 */
export function getTravertinePaverTexture(repeatX = 8, repeatY = 8): THREE.CanvasTexture {
  const key = `travertine-${repeatX}-${repeatY}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ddd5c7';
  ctx.fillRect(0, 0, 512, 512);

  const tones = ['#e6dfd3', '#dcd3c4', '#eae4d8', '#d5cbb9', '#e2dacb'];
  const rows = 8;
  const cols = 4;
  const cellH = 512 / rows;
  const cellW = 512 / cols;

  for (let r = 0; r < rows; r++) {
    const offset = (r % 2) * (cellW / 2);
    for (let c = -1; c <= cols; c++) {
      const x = c * cellW + offset;
      const y = r * cellH;
      ctx.fillStyle = tones[(r * 3 + c + 10) % tones.length];
      ctx.fillRect(x + 2, y + 2, cellW - 4, cellH - 4);

      // Subtle natural travertine vein lines
      ctx.fillStyle = 'rgba(160, 145, 125, 0.14)';
      ctx.fillRect(x + 8, y + cellH * 0.35, cellW - 16, 2);
      ctx.fillRect(x + 14, y + cellH * 0.7, cellW - 24, 1.5);
    }
  }

  const tex = finalizeTexture(canvas, repeatX, repeatY);
  textureCache.set(key, tex);
  return tex;
}

/**
 * 3. Precast Architectural Concrete Panel Texture.
 */
export function getArchitecturalConcreteTexture(repeatX = 4, repeatY = 4): THREE.CanvasTexture {
  const key = `arch-concrete-${repeatX}-${repeatY}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#d6d2c9';
  ctx.fillRect(0, 0, 512, 512);

  const panelsX = 4;
  const panelsY = 4;
  const pw = 512 / panelsX;
  const ph = 512 / panelsY;
  const shades = ['#dad6cd', '#d1cdc3', '#dedad2', '#ccc7bd'];

  for (let py = 0; py < panelsY; py++) {
    for (let px = 0; px < panelsX; px++) {
      ctx.fillStyle = shades[(px + py * 3) % shades.length];
      ctx.fillRect(px * pw + 2, py * ph + 2, pw - 4, ph - 4);

      // Form tie-rod recesses
      ctx.fillStyle = '#9c968b';
      ctx.beginPath();
      ctx.arc(px * pw + 14, py * ph + 14, 2.2, 0, Math.PI * 2);
      ctx.arc((px + 1) * pw - 14, py * ph + 14, 2.2, 0, Math.PI * 2);
      ctx.arc(px * pw + 14, (py + 1) * ph - 14, 2.2, 0, Math.PI * 2);
      ctx.arc((px + 1) * pw - 14, (py + 1) * ph - 14, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const tex = finalizeTexture(canvas, repeatX, repeatY);
  textureCache.set(key, tex);
  return tex;
}

/**
 * 4. Natural Landscaped Park Grass & Meadow Texture (replaces flat dark-green ground).
 */
export function getGrassTerrainTexture(repeatX = 28, repeatY = 28): THREE.CanvasTexture {
  const key = `natural-grass-${repeatX}-${repeatY}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm natural European park turf base
  ctx.fillStyle = '#5c7c4e';
  ctx.fillRect(0, 0, 512, 512);

  let seed = 4242;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const bladeColors = ['#698b58', '#527045', '#749662', '#4a663d', '#7ea16b'];
  for (let i = 0; i < 7000; i++) {
    ctx.fillStyle = bladeColors[i % bladeColors.length];
    const x = rand() * 512;
    const y = rand() * 512;
    ctx.fillRect(x, y, 2, 4);
  }

  const tex = finalizeTexture(canvas, repeatX, repeatY);
  textureCache.set(key, tex);
  return tex;
}

/**
 * 5. Realistic Curtain-Wall Glazing Texture with silver/champagne aluminum mullions,
 * spandrel bands, and subtle interior room blinds/lighting.
 */
export function getGlassFacadeTexture(
  frameColor = '#94a3b8',
  nightMode = false
): THREE.CanvasTexture {
  const key = `curtainwall-v2-${frameColor}-${nightMode}`;
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base architectural glass reflection tone
  ctx.fillStyle = nightMode ? '#1e293b' : '#647d94';
  ctx.fillRect(0, 0, 512, 512);

  const cols = 6;
  const rows = 4;
  const cellW = 512 / cols;
  const cellH = 512 / rows;

  for (let r = 0; r < rows; r++) {
    // Horizontal aluminum spandrel slab band at top of each floor
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, r * cellH, 512, 16);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(0, r * cellH + 16, 512, 4);

    for (let c = 0; c < cols; c++) {
      const x = c * cellW;
      const y = r * cellH + 20;
      const h = cellH - 22;

      const grad = ctx.createLinearGradient(x, y, x + cellW, y + h);
      const warmInterior = (r * 5 + c * 7) % 3 === 0;

      if (nightMode && warmInterior) {
        grad.addColorStop(0, '#fef3c7');
        grad.addColorStop(1, '#f59e0b');
      } else {
        grad.addColorStop(0, warmInterior ? '#9eb7c9' : '#7b97ad');
        grad.addColorStop(0.55, '#59768e');
        grad.addColorStop(1, '#3f586d');
      }

      ctx.fillStyle = grad;
      ctx.fillRect(x + 4, y, cellW - 8, h);

      // Subtle architectural Venetian blind / ceiling soffit strip inside top of window
      ctx.fillStyle = 'rgba(241, 245, 249, 0.35)';
      ctx.fillRect(x + 6, y + 2, cellW - 12, 10 + ((r + c) % 3) * 6);
    }
  }

  // Crisp anodized aluminum vertical mullions
  ctx.fillStyle = '#e2e8f0';
  for (let i = 0; i <= cols; i++) {
    ctx.fillRect(i * cellW - 2, 0, 4, 512);
  }

  const tex = finalizeTexture(canvas, 2, 2);
  textureCache.set(key, tex);
  return tex;
}

/**
 * 6. Natural Cedar / Oak Timber Slats Texture.
 */
export function getWoodFloorTexture(): THREE.CanvasTexture {
  const key = 'wood-floor-v2';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  const tones = ['#9c6b43', '#ab784e', '#8e5e38', '#b58359'];
  const planks = 8;
  const plankH = 256 / planks;

  for (let i = 0; i < planks; i++) {
    ctx.fillStyle = tones[i % tones.length];
    ctx.fillRect(0, i * plankH, 256, plankH - 1.5);
    ctx.fillStyle = '#6e4526';
    ctx.fillRect(0, (i + 1) * plankH - 1.5, 256, 1.5);
  }

  const tex = finalizeTexture(canvas, 6, 6);
  textureCache.set(key, tex);
  return tex;
}

/**
 * 7. Honed Carrara / Travertine Marble Floor Texture.
 */
export function getMarbleFloorTexture(): THREE.CanvasTexture {
  const key = 'marble-floor-v2';
  if (textureCache.has(key)) return textureCache.get(key)!;

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#f1ede6';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#d6cfc2';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 4; i++) {
    const pos = i * 64;
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, 256);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(256, pos);
    ctx.stroke();
  }

  const tex = finalizeTexture(canvas, 5, 5);
  textureCache.set(key, tex);
  return tex;
}
