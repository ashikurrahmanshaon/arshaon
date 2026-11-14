'use client';

import React, { useState } from 'react';
import {
  Award,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Compass,
  Heart,
  Layers,
  X,
} from 'lucide-react';
import { BUSINESS_SPECIALTIES } from '@/data/businessData';
import { PROFILE_DATA } from '@/data/profileData';
import { useCityStore } from '@/hooks/useCityStore';

/**
 * EXPERIENCE C — ABOUT ME (Editorial Biography Section)
 * Includes:
 * - Introduction
 * - Professional identity
 * - Skills
 * - Career journey
 * - Personal interests
 * - Expandable executive capabilities
 */
export function AboutMeSection() {
  const [expandedSpecialty, setExpandedSpecialty] = useState<string | null>(
    BUSINESS_SPECIALTIES[0].id
  );

  return (
    <section
      id="about"
      className="mx-auto max-w-7xl px-4 py-20 sm:px-8 border-t border-alabaster-300 no-print"
    >
      {/* Editorial Section Header */}
      <div className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-wood-dark">
          02 · ABOUT ME & PROFESSIONAL IDENTITY
        </p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-charcoal-900">
          {PROFILE_DATA.fullName}
        </h2>
        <p className="mt-1 text-base font-medium text-accent-600">
          {PROFILE_DATA.tagline} · Brand: {PROFILE_DATA.brandName}
        </p>
      </div>

      {/* Main Editorial Grid */}
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        {/* Left 7 Columns: Introduction, Professional Identity & Career Journey */}
        <div className="lg:col-span-7 space-y-8">
          <div className="rounded-3xl border border-alabaster-300 bg-white p-7 sm:p-9 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
              Introduction
            </h3>
            <p className="mt-3 text-base leading-relaxed text-charcoal-800">
              {PROFILE_DATA.introduction}
            </p>

            <h3 className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
              Professional Identity ({PROFILE_DATA.brandName})
            </h3>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-zinc-600">
              {PROFILE_DATA.professionalIdentity}
            </p>
          </div>

          {/* Career Journey */}
          <div className="rounded-3xl border border-alabaster-300 bg-white p-7 sm:p-9 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-wood-dark">
              <Briefcase className="h-4 w-4" />
              <span>Career Journey & Leadership</span>
            </div>

            <div className="mt-6 space-y-6">
              {PROFILE_DATA.careerHistory.map((item, idx) => (
                <div
                  key={idx}
                  className="relative border-l-2 border-alabaster-300 pl-5 transition-colors hover:border-accent-600"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="text-base font-bold text-charcoal-900">{item.role}</h4>
                    <span className="text-xs font-semibold text-wood-dark">
                      {item.organization}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs font-semibold text-accent-600">
                    {item.focus}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Personal Journey Milestones */}
            <div className="mt-8 border-t border-alabaster-200 pt-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-400">
                <Compass className="h-4 w-4 text-accent-600" />
                <span>Personal Vision & Evolution</span>
              </div>
              <ul className="mt-4 space-y-3">
                {PROFILE_DATA.personalJourney.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-zinc-600">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-wood-dark" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Core Skills, Personal Interests & Executive Disciplines */}
        <div className="lg:col-span-5 space-y-8">
          {/* Skills */}
          <div className="rounded-3xl border border-alabaster-300 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-wood-dark">
              <Layers className="h-4 w-4" />
              <span>Skills & Core Competencies</span>
            </div>

            <div className="mt-5 space-y-5">
              {PROFILE_DATA.skills.map((group) => (
                <div key={group.category}>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
                    {group.category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-alabaster-300 bg-alabaster-100 px-3 py-1 text-xs font-medium text-charcoal-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Interests */}
          <div className="rounded-3xl border border-alabaster-300 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-wood-dark">
              <Heart className="h-4 w-4" />
              <span>Personal Interests</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {PROFILE_DATA.interests.map((interest) => (
                <span
                  key={interest}
                  className="rounded-full border border-wood-light/50 bg-alabaster-100 px-3.5 py-1.5 text-xs font-medium text-charcoal-900"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Expandable Core Practice Areas */}
          <div className="rounded-3xl border border-alabaster-300 bg-white p-7 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-wood-dark">
              <Award className="h-4 w-4" />
              <span>Executive Practice Areas</span>
            </div>
            <div className="mt-4 divide-y divide-alabaster-200">
              {BUSINESS_SPECIALTIES.slice(0, 6).map((spec) => {
                const isOpen = expandedSpecialty === spec.id;
                return (
                  <div key={spec.id} className="py-3">
                    <button
                      onClick={() =>
                        setExpandedSpecialty(isOpen ? null : spec.id)
                      }
                      className="flex w-full items-center justify-between text-left text-xs font-bold text-charcoal-900 hover:text-accent-600"
                    >
                      <span>{spec.title}</span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-zinc-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-zinc-400" />
                      )}
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-xs leading-relaxed text-zinc-600">
                        {spec.summary}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Quick Biography Modal when clicking the 3D Bookshelf in the Workspace.
 */
export function AboutMeModal() {
  const activeModal = useCityStore((s) => s.activeModal);
  const setActiveModal = useCityStore((s) => s.setActiveModal);

  if (activeModal !== 'about') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/60 p-4 backdrop-blur-sm no-print">
      <div className="relative max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-alabaster-300 bg-alabaster-50 p-6 sm:p-8 text-charcoal-900 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-alabaster-300 pb-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-wood-dark">
              STUDIO BOOKSHELF · BIOGRAPHY
            </p>
            <h3 className="mt-1 text-2xl font-extrabold text-charcoal-900">
              {PROFILE_DATA.fullName} ({PROFILE_DATA.brandName})
            </h3>
            <p className="text-xs font-medium text-accent-600">{PROFILE_DATA.tagline}</p>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="rounded-full border border-alabaster-300 bg-white p-2 text-zinc-500 hover:text-charcoal-900"
            aria-label="Close Modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 space-y-5 text-sm leading-relaxed text-zinc-700">
          <p>{PROFILE_DATA.introduction}</p>
          <p>{PROFILE_DATA.professionalIdentity}</p>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 mb-2">
              Key Competencies
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {PROFILE_DATA.skills.flatMap((g) => g.items).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-alabaster-300 bg-white px-3 py-1 text-xs font-medium text-charcoal-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-alabaster-300 pt-4">
          <a
            href="#about"
            onClick={() => setActiveModal('none')}
            className="rounded-full bg-charcoal-900 px-5 py-2 text-xs font-semibold text-white hover:bg-accent-600"
          >
            Read Full Biography Section →
          </a>
        </div>
      </div>
    </div>
  );
}
