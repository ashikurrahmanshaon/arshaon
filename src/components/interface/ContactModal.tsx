'use client';

import React, { useState } from 'react';
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Download,
  Globe,
  Mail,
  Maximize2,
  Printer,
  Send,
} from 'lucide-react';
import { downloadResumePDFFile, ResumeSheetContent } from '@/components/cv/CVPreviewModal';
import { CV_DATA } from '@/data/cvData';
import { PROFILE_DATA } from '@/data/profileData';
import { useAudioFeedback } from '@/hooks/useAudioFeedback';
import { useCityStore } from '@/hooks/useCityStore';

/**
 * EXPERIENCE E — MY CV AND CONTACT
 * Includes:
 * - Professional CV preview
 * - PDF download
 * - Browser print
 * - Email contact, LinkedIn, Social media links
 * - Collaboration form
 */
export function CVAndContactSection() {
  const { playClick } = useAudioFeedback();
  const setActiveModal = useCityStore((s) => s.setActiveModal);

  const [downloaded, setDownloaded] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Web & Product Development');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleDownloadPDF = () => {
    playClick();
    downloadResumePDFFile(() => {
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    });
  };

  const handlePrint = () => {
    playClick();
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playClick();
    setSubmitted(true);
    const subject = encodeURIComponent(`[ARSHAON.COM Collaboration] ${topic} — from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`
    );
    window.open(`mailto:${CV_DATA.email}?subject=${subject}&body=${body}`, '_self');
  };

  return (
    <section
      id="cv-contact"
      className="mx-auto max-w-7xl px-4 py-20 sm:px-8 border-t border-alabaster-300 no-print"
    >
      {/* Section Header */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-wood-dark">
            04 · MY CV & COLLABORATION
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-charcoal-900">
            Curriculum Vitae & Direct Contact
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-600">
            Review or print my executive resume, download the A4 PDF directly, or initiate a conversation regarding your next digital initiative.
          </p>
        </div>

        {/* CV Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2 rounded-full border border-charcoal-900/20 bg-white px-4 py-2.5 text-xs font-semibold text-charcoal-900 hover:border-charcoal-900 transition-colors"
          >
            {downloaded ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span>PDF Downloaded</span>
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                <span>Download PDF</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-full border border-charcoal-900/20 bg-white px-4 py-2.5 text-xs font-semibold text-charcoal-900 hover:border-charcoal-900 transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Browser Print CV</span>
          </button>

          <button
            onClick={() => {
              playClick();
              setActiveModal('cv');
            }}
            className="inline-flex items-center gap-2 rounded-full bg-charcoal-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-accent-600 transition-colors"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span>Full-Screen A4 View</span>
          </button>
        </div>
      </div>

      {/* Two-Column Layout: Left = Live CV Preview, Right = Contact & Collaboration Form */}
      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        {/* Left 7 Columns: Inline Professional CV Preview */}
        <div className="lg:col-span-7">
          <ResumeSheetContent />
        </div>

        {/* Right 5 Columns: Direct Contact, Social Links & Collaboration Form */}
        <div className="lg:col-span-5 space-y-8">
          {/* Direct Channels & Social Links */}
          <div className="rounded-3xl border border-alabaster-300 bg-white p-7 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-wood-dark">
              Direct Contact & Professional Profiles
            </h3>
            <p className="mt-2 text-sm text-zinc-600">
              Connect directly with {PROFILE_DATA.fullName} across email and professional networks.
            </p>

            <div className="mt-5 space-y-3">
              <a
                href={`mailto:${CV_DATA.email}`}
                className="flex items-center justify-between rounded-2xl border border-alabaster-300 bg-alabaster-50 px-4 py-3.5 transition-colors hover:border-charcoal-900"
              >
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-accent-600" />
                  <div>
                    <span className="block text-xs font-bold text-charcoal-900">
                      Email Contact
                    </span>
                    <span className="block text-xs text-zinc-600">{CV_DATA.email}</span>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-zinc-400" />
              </a>

              <a
                href={CV_DATA.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-2xl border border-alabaster-300 bg-alabaster-50 px-4 py-3.5 transition-colors hover:border-charcoal-900"
              >
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-wood-dark" />
                  <div>
                    <span className="block text-xs font-bold text-charcoal-900">
                      Official Website
                    </span>
                    <span className="block text-xs text-zinc-600">{CV_DATA.website}</span>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-zinc-400" />
              </a>
            </div>

            {/* LinkedIn & Social Media Links */}
            <div className="mt-5 pt-5 border-t border-alabaster-200">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3">
                LinkedIn & Social Media
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: 'LinkedIn', href: CV_DATA.contact.linkedin },
                  { label: 'GitHub', href: CV_DATA.contact.github },
                  { label: 'Facebook / Meta', href: 'https://arshaon.com' },
                  { label: 'Instagram / X', href: 'https://arshaon.com' },
                ].map((net) => (
                  <a
                    key={net.label}
                    href={net.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-alabaster-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-charcoal-900 hover:border-charcoal-900 transition-colors"
                  >
                    <span>{net.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-zinc-400" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Collaboration Form */}
          <div className="rounded-3xl border border-alabaster-300 bg-white p-7 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-wood-dark">
              Collaboration Inquiry Form
            </h3>
            <p className="mt-1.5 text-xs text-zinc-600">
              Share your project scope or partnership inquiry below.
            </p>

            {submitted ? (
              <div className="mt-6 rounded-2xl border border-alabaster-300 bg-alabaster-50 p-6 text-center">
                <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
                <h4 className="mt-3 text-base font-bold text-charcoal-900">
                  Inquiry Ready for {PROFILE_DATA.fullName}
                </h4>
                <p className="mt-1 text-xs text-zinc-600">
                  Your message has been prepared for {CV_DATA.email}.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 rounded-full bg-charcoal-900 px-4 py-2 text-xs font-semibold text-white"
                >
                  Write Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-900 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full rounded-xl border border-alabaster-300 bg-alabaster-50 px-3.5 py-2.5 text-xs text-charcoal-900 placeholder-zinc-400 focus:border-charcoal-900 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-900 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full rounded-xl border border-alabaster-300 bg-alabaster-50 px-3.5 py-2.5 text-xs text-charcoal-900 placeholder-zinc-400 focus:border-charcoal-900 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-900 mb-1">
                    Area of Collaboration
                  </label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full rounded-xl border border-alabaster-300 bg-alabaster-50 px-3.5 py-2.5 text-xs text-charcoal-900 focus:border-charcoal-900 focus:bg-white focus:outline-none"
                  >
                    <option>Web & Product Development</option>
                    <option>SaaS & E-Commerce Architecture</option>
                    <option>AI Projects & Workflow Automation</option>
                    <option>Digital Marketing, Meta Ads & Google Ads</option>
                    <option>Search Engine Optimization (SEO)</option>
                    <option>Executive Advisory & Brand Strategy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-900 mb-1">
                    Project Brief or Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me about your objectives, timeline, or question..."
                    className="w-full rounded-xl border border-alabaster-300 bg-alabaster-50 px-3.5 py-2.5 text-xs text-charcoal-900 placeholder-zinc-400 focus:border-charcoal-900 focus:bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-charcoal-900 px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-accent-600"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Collaboration Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
