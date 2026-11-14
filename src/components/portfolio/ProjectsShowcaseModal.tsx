'use client';

import React from 'react';
import { ArrowUpRight, ExternalLink, Layers, Sparkles, X } from 'lucide-react';
import { PROJECTS_DATA } from '@/data/projectsData';
import { useAudioFeedback } from '@/hooks/useAudioFeedback';
import { useCityStore } from '@/hooks/useCityStore';
import { CreationCategory, ProjectItem } from '@/types/city';

const CREATION_CATEGORIES: CreationCategory[] = [
  'All',
  'Websites',
  'SaaS Products',
  'AI Projects',
  'Digital Marketing Campaigns',
  'Creative Work',
];

function EditorialProjectCard({
  project,
  onInspect,
}: {
  project: ProjectItem;
  onInspect: (id: string) => void;
}) {
  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-alabaster-300 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-charcoal-900/30 hover:shadow-xl">
      <div>
        {/* Architectural Visual Preview Header */}
        <div
          onClick={() => onInspect(project.id)}
          className={`cursor-pointer bg-gradient-to-br ${project.previewTone} p-6 border-b border-alabaster-300 transition-opacity group-hover:opacity-95`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-charcoal-900 shadow-sm">
              {project.category}
            </span>
            {project.featured && (
              <span className="rounded-full bg-charcoal-900 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-alabaster-50">
                Selected Work
              </span>
            )}
          </div>

          <div className="mt-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
              {project.previewLabel}
            </p>
            <h3 className="mt-1 text-lg font-extrabold tracking-tight text-charcoal-900">
              {project.name}
            </h3>
            <p className="mt-0.5 text-xs font-medium text-zinc-700">
              {project.subtitle}
            </p>
          </div>
        </div>

        {/* Editorial Body */}
        <div className="p-6">
          <p className="text-sm leading-relaxed text-zinc-600">
            {project.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-alabaster-300 bg-alabaster-100 px-2.5 py-0.5 text-[11px] font-medium text-charcoal-800"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between border-t border-alabaster-200 bg-alabaster-50/60 px-6 py-4">
        <button
          onClick={() => onInspect(project.id)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal-900 hover:text-accent-600 transition-colors"
        >
          <span>Interactive Preview</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-alabaster-300 bg-white px-3 py-1 text-[11px] font-semibold text-zinc-700 hover:border-charcoal-900 hover:text-charcoal-900 transition-colors"
          >
            <span>Visit Live</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </article>
  );
}

/**
 * EXPERIENCE D — MY CREATIONS
 * Showcases Websites, SaaS Products, AI Projects, Digital Marketing Campaigns, and Creative Work.
 */
export function CreationsSection() {
  const { playClick } = useAudioFeedback();
  const selectedCategory = useCityStore((s) => s.selectedCreationCategory);
  const setSelectedCategory = useCityStore((s) => s.setSelectedCreationCategory);
  const setInspectedProjectId = useCityStore((s) => s.setInspectedProjectId);
  const setActiveModal = useCityStore((s) => s.setActiveModal);

  const filteredProjects =
    selectedCategory === 'All'
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === selectedCategory);

  const handleInspect = (id: string) => {
    playClick();
    setInspectedProjectId(id);
    setActiveModal('projects');
  };

  return (
    <section
      id="creations"
      className="mx-auto max-w-7xl px-4 py-20 sm:px-8 border-t border-alabaster-300 no-print"
    >
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-wood-dark">
            03 · MY CREATIONS & DIGITAL PORTFOLIO
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-charcoal-900">
            Selected Works & Platforms
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-600">
            A curated collection of websites, SaaS architectures, AI automation workflows, digital marketing campaigns, and brand systems.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {CREATION_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  playClick();
                  setSelectedCategory(cat);
                }}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-charcoal-900 text-alabaster-50 shadow-sm'
                    : 'border border-alabaster-300 bg-white text-zinc-600 hover:border-charcoal-900 hover:text-charcoal-900'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <EditorialProjectCard
            key={project.id}
            project={project}
            onInspect={handleInspect}
          />
        ))}
      </div>
    </section>
  );
}

/**
 * Interactive Portfolio & Creation Preview Modal
 * Opens when clicking the 3D Computer in My Workspace or clicking "Interactive Preview" on any card.
 */
export function ProjectsShowcaseModal() {
  const activeModal = useCityStore((s) => s.activeModal);
  const inspectedProjectId = useCityStore((s) => s.inspectedProjectId);
  const setInspectedProjectId = useCityStore((s) => s.setInspectedProjectId);
  const setActiveModal = useCityStore((s) => s.setActiveModal);

  if (activeModal !== 'projects') return null;

  const activeProject =
    PROJECTS_DATA.find((p) => p.id === inspectedProjectId) || PROJECTS_DATA[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-950/60 p-4 backdrop-blur-sm no-print">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-alabaster-300 bg-alabaster-50 p-6 sm:p-8 text-charcoal-900 shadow-2xl">
        {/* Top Bar */}
        <div className="flex items-start justify-between gap-4 border-b border-alabaster-300 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent-600">
              <Sparkles className="h-3.5 w-3.5" />
              <span>STUDIO WORKSTATION · INTERACTIVE PORTFOLIO PREVIEW</span>
            </div>
            <h3 className="mt-1 text-2xl font-extrabold text-charcoal-900">
              {activeProject.name}
            </h3>
            <p className="text-xs font-medium text-zinc-500">{activeProject.subtitle}</p>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="rounded-full border border-alabaster-300 bg-white p-2 text-zinc-500 hover:text-charcoal-900"
            aria-label="Close Preview"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Project Switcher Strip */}
        <div className="mt-4 flex flex-wrap gap-2">
          {PROJECTS_DATA.map((p) => (
            <button
              key={p.id}
              onClick={() => setInspectedProjectId(p.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeProject.id === p.id
                  ? 'bg-charcoal-900 text-white'
                  : 'border border-alabaster-300 bg-white text-zinc-600 hover:text-charcoal-900'
              }`}
            >
              {p.category}: {p.name.split('—')[0].trim()}
            </button>
          ))}
        </div>

        {/* Selected Creation Detail Card */}
        <div className="mt-6 rounded-2xl border border-alabaster-300 bg-white p-6 shadow-sm">
          <div className={`rounded-xl bg-gradient-to-br ${activeProject.previewTone} p-6 mb-5 border border-alabaster-300`}>
            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-charcoal-900">
              {activeProject.category}
            </span>
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-zinc-600">
              {activeProject.previewLabel}
            </p>
            <h4 className="mt-1 text-xl font-extrabold text-charcoal-900">
              {activeProject.name}
            </h4>
          </div>

          <div className="space-y-4 text-sm leading-relaxed text-zinc-700">
            <p className="font-medium text-charcoal-900">{activeProject.description}</p>
            <p>{activeProject.details}</p>
          </div>

          <div className="mt-6 pt-4 border-t border-alabaster-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Layers className="h-4 w-4 text-wood-dark" />
              {activeProject.techStack.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-alabaster-100 border border-alabaster-300 px-3 py-1 text-xs font-medium text-charcoal-800"
                >
                  {t}
                </span>
              ))}
            </div>

            {activeProject.liveUrl && (
              <a
                href={activeProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-accent-600 px-5 py-2 text-xs font-semibold text-white hover:bg-accent-700"
              >
                <span>Open Live Website</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
