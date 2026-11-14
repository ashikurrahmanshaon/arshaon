'use client';

import { useCallback, useRef } from 'react';
import { useCityStore } from './useCityStore';

export function useAudioFeedback() {
  const ctxRef = useRef<AudioContext | null>(null);
  const soundEnabled = useCityStore((s) => s.soundEnabled);

  const playTone = useCallback(
    (freq = 520, duration = 0.08, type: OscillatorType = 'sine') => {
      if (!soundEnabled || typeof window === 'undefined') return;
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        if (!ctxRef.current) {
          ctxRef.current = new AudioCtx();
        }
        const ctx = ctxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        // Ignore audio context autoplay restrictions
      }
    },
    [soundEnabled]
  );

  return {
    playClick: useCallback(() => playTone(660, 0.06, 'sine'), [playTone]),
    playInteract: useCallback(() => playTone(880, 0.11, 'triangle'), [playTone]),
    playTeleport: useCallback(() => playTone(440, 0.14, 'sine'), [playTone]),
  };
}

