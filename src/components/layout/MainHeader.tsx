'use client';

import React, { useState } from 'react';
import { FileText, Menu, Volume2, VolumeX, X } from 'lucide-react';
import { useAudioFeedback } from '@/hooks/useAudioFeedback';
import { useCityStore } from '@/hooks/useCityStore';

const NAV_LINKS = [
  { id: 'entrance', label: 'The Entrance', href: '#entrance' },
  { id: 'workspace', label: 'My Workspace', href: '#workspace' },
  { id: 'about', label: 'About Me', href: '#about' },
  { id: 'creations', label: 'My Creations', href: '#creations' },
  { id: 'cv-contact', label: 'My CV & Contact', href: '#cv-contact' },
];

export function MainHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { playClick } = useAudioFeedback();
  const soundEnabled = useCityStore((s) => s.soundEnabled);
  const toggleSound = useCityStore((s) => s.toggleSound);
  const setActiveModal = useCityStore((s) => s.setActiveModal);

  return (
    <header className="sticky top-0 z-30 border-b border-alabaster-300 bg-alabaster-100/90 backdrop-blur-md no-print">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
        {/* Brand Monogram & Name */}
        <a
          href="#entrance"
          onClick={() => playClick()}
          className="flex items-center gap-3 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-charcoal-900 text-xs font-bold tracking-widest text-alabaster-50 transition-transform group-hover:scale-105">
            AR
          </div>
          <div>
            <span className="block text-xs font-bold uppercase tracking-[0.22em] text-charcoal-900">
              ARSHAON
            </span>
            <span className="block text-[11px] text-zinc-500">
              Ashikur Rahman Shaon
            </span>
          </div>
        </a>

        {/* Desktop Editorial Navigation */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Primary Navigation">
          {NAV_LINKS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => playClick()}
              className="text-xs font-medium tracking-wide text-zinc-600 transition-colors hover:text-charcoal-900"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Subtle UI Sound' : 'Enable Subtle UI Sound'}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-alabaster-300 bg-white text-zinc-600 transition-colors hover:border-charcoal-900 hover:text-charcoal-900"
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-charcoal-900" />
            ) : (
              <VolumeX className="h-4 w-4 text-zinc-400" />
            )}
          </button>

          <button
            onClick={() => {
              playClick();
              setActiveModal('cv');
            }}
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-charcoal-900 px-4 py-2 text-xs font-semibold tracking-wide text-alabaster-50 transition-colors hover:bg-accent-600"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Preview & Print CV</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-alabaster-300 bg-white text-charcoal-900 md:hidden"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-alabaster-300 bg-alabaster-50 px-6 py-5 md:hidden">
          <div className="flex flex-col space-y-3">
            {NAV_LINKS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => {
                  playClick();
                  setMobileMenuOpen(false);
                }}
                className="py-1.5 text-sm font-medium text-charcoal-900 hover:text-accent-600"
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => {
                playClick();
                setMobileMenuOpen(false);
                setActiveModal('cv');
              }}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-charcoal-900 px-4 py-2.5 text-xs font-semibold text-white"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Preview & Print CV</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
