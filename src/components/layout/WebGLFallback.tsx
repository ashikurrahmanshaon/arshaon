'use client';

import React from 'react';
import { BookOpen, Monitor, Printer } from 'lucide-react';

interface WebGLFallbackProps {
  onOpenCreations: () => void;
  onOpenCV: () => void;
  onOpenAbout: () => void;
}

/**
 * Interactive 2D Architectural Studio Fallback if WebGL 3D rendering is unavailable.
 */
export function WebGLFallback({
  onOpenCreations,
  onOpenCV,
  onOpenAbout,
}: WebGLFallbackProps) {
  return (
    <div className="flex h-full w-full flex-col justify-between rounded-3xl border border-alabaster-300 bg-gradient-to-br from-[#F5F2EC] via-[#EAE4D8] to-[#DFD7C8] p-8 text-charcoal-900 no-print">
      <div>
        <span className="rounded-full bg-white/90 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-wood-dark">
          INTERACTIVE STUDIO SCHEMATIC
        </span>
        <h3 className="mt-3 text-2xl font-extrabold text-charcoal-900">
          Ashikur Rahman Shaon — Executive Workspace
        </h3>
        <p className="mt-1 max-w-xl text-sm text-zinc-600">
          Select any studio station below to explore my portfolio creations, professional biography, or print-ready curriculum vitae.
        </p>
      </div>

      <div className="my-8 grid gap-4 sm:grid-cols-3">
        <button
          onClick={onOpenCreations}
          className="flex flex-col items-start justify-between rounded-2xl border border-alabaster-300 bg-white/95 p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent-600"
        >
          <Monitor className="h-6 w-6 text-accent-600" />
          <div className="mt-4">
            <span className="block text-sm font-bold text-charcoal-900">
              Workstation Computer
            </span>
            <span className="mt-1 block text-xs text-zinc-500">
              Click to open Portfolio & My Creations
            </span>
          </div>
        </button>

        <button
          onClick={onOpenCV}
          className="flex flex-col items-start justify-between rounded-2xl border border-alabaster-300 bg-white/95 p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent-600"
        >
          <Printer className="h-6 w-6 text-wood-dark" />
          <div className="mt-4">
            <span className="block text-sm font-bold text-charcoal-900">
              Multifunction Studio Printer
            </span>
            <span className="mt-1 block text-xs text-zinc-500">
              Click to preview, download PDF, or print CV
            </span>
          </div>
        </button>

        <button
          onClick={onOpenAbout}
          className="flex flex-col items-start justify-between rounded-2xl border border-alabaster-300 bg-white/95 p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent-600"
        >
          <BookOpen className="h-6 w-6 text-charcoal-900" />
          <div className="mt-4">
            <span className="block text-sm font-bold text-charcoal-900">
              Architectural Bookshelf
            </span>
            <span className="mt-1 block text-xs text-zinc-500">
              Click to explore Biography, Skills & Journey
            </span>
          </div>
        </button>
      </div>

      <p className="font-mono text-[11px] text-zinc-500">
        ARSHAON STUDIO · ARCHITECTURAL WORKSPACE VIEW
      </p>
    </div>
  );
}
