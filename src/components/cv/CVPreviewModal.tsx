'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Download,
  FileText,
  Globe,
  Mail,
  MapPin,
  Maximize2,
  Printer,
} from 'lucide-react';
import { CV_DATA } from '@/data/cvData';
import { useCityStore } from '@/hooks/useCityStore';

/**
 * Generates a valid A4 PDF binary document in pure TypeScript
 * so clicking "Download PDF" immediately saves `Ashikur_Rahman_Shaon_CV_arshaon.pdf`.
 */
export function downloadResumePDFFile(onComplete?: () => void) {
  const sanitize = (str: string) =>
    str
      .replace(/[—–]/g, '-')
      .replace(/[·•]/g, '*')
      .replace(/[()\\]/g, (m) => `\\${m}`)
      .replace(/[^\x20-\x7E]/g, '');

  const wrapLine = (text: string, maxChars = 88): string[] => {
    const words = sanitize(text).split(/\s+/);
    const lines: string[] = [];
    let current = '';
    for (const w of words) {
      if ((current + ' ' + w).trim().length > maxChars) {
        if (current) lines.push(current);
        current = w;
      } else {
        current = current ? `${current} ${w}` : w;
      }
    }
    if (current) lines.push(current);
    return lines;
  };

  let y = 795;
  const ops: string[] = [];

  const addText = (text: string, size = 10, bold = false, indent = 45, lineGap = 13) => {
    if (y < 45) return;
    const font = bold ? '/F2' : '/F1';
    ops.push(`BT ${font} ${size} Tf ${indent} ${y} Td (${sanitize(text)}) Tj ET`);
    y -= lineGap;
  };

  const addWrapped = (
    text: string,
    size = 9.5,
    bold = false,
    indent = 45,
    maxChars = 90,
    lineGap = 12
  ) => {
    const lines = wrapLine(text, maxChars);
    for (const line of lines) {
      addText(line, size, bold, indent, lineGap);
    }
  };

  addText(CV_DATA.name.toUpperCase(), 18, true, 45, 18);
  addText(`${CV_DATA.brand} | ${CV_DATA.title}`, 11, true, 45, 14);
  addText(`Website: ${CV_DATA.website} | Email: ${CV_DATA.email}`, 9.5, false, 45, 18);

  addText('PROFESSIONAL SUMMARY', 11, true, 45, 13);
  addWrapped(CV_DATA.summary, 9.5, false, 45, 92, 12);
  y -= 6;

  addText('WORK EXPERIENCE', 11, true, 45, 14);
  for (const exp of CV_DATA.experience) {
    addText(`${exp.role} - ${exp.organization} (${exp.scope})`, 10, true, 45, 13);
    for (const resp of exp.responsibilities) {
      addWrapped(`* ${resp}`, 9, false, 55, 86, 11.5);
    }
    y -= 4;
  }

  addText('SKILLS & COMPETENCIES', 11, true, 45, 14);
  for (const grp of CV_DATA.skills) {
    addWrapped(`${grp.group}: ${grp.list.join(', ')}`, 9, false, 45, 92, 12);
  }
  y -= 5;

  addText('PROFESSIONAL SERVICES', 11, true, 45, 14);
  for (const srv of CV_DATA.services) {
    addWrapped(`* ${srv.title}: ${srv.description}`, 9, false, 45, 92, 11.5);
  }
  y -= 5;

  addText('SELECTED PROJECTS', 11, true, 45, 14);
  for (const proj of CV_DATA.projects) {
    addWrapped(`${proj.name} (${proj.role}) - ${proj.url}: ${proj.summary}`, 9, false, 45, 92, 11.5);
  }
  y -= 5;

  addText('EDUCATION & CONTINUOUS DEVELOPMENT', 11, true, 45, 13);
  for (const edu of CV_DATA.education) {
    addWrapped(`${edu.program} - ${edu.notes}`, 9, false, 45, 92, 11.5);
  }
  y -= 4;
  addText(`CONTACT: ${CV_DATA.contact.website} | ${CV_DATA.contact.email}`, 9.5, true, 45, 12);

  const streamContent = ops.join('\n');
  const objects: string[] = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n',
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n',
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n',
    `6 0 obj\n<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(pdf.length);
    pdf += obj;
  }
  const xrefPos = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;

  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Ashikur_Rahman_Shaon_CV_arshaon.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  onComplete?.();
}

/**
 * Reusable A4 Resume Sheet Content.
 */
export function ResumeSheetContent({ id }: { id?: string }) {
  return (
    <article
      id={id}
      className="w-full rounded-2xl border border-alabaster-300 bg-white p-6 sm:p-10 text-charcoal-900 shadow-sm print:rounded-none print:border-none print:p-0 print:shadow-none"
    >
      {/* Header */}
      <header className="border-b-2 border-charcoal-900 pb-5">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-charcoal-900">
              {CV_DATA.name}
            </h3>
            <p className="mt-0.5 text-sm font-bold text-accent-600">
              {CV_DATA.title} · Brand: {CV_DATA.brand}
            </p>
          </div>
          <div className="text-xs text-zinc-600 space-y-1 sm:text-right">
            <div className="flex items-center sm:justify-end gap-1.5 font-semibold text-charcoal-900">
              <Globe className="h-3.5 w-3.5 text-accent-600" />
              <span>{CV_DATA.website}</span>
            </div>
            <div className="flex items-center sm:justify-end gap-1.5">
              <Mail className="h-3.5 w-3.5 text-accent-600" />
              <span>{CV_DATA.email}</span>
            </div>
            <div className="flex items-center sm:justify-end gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-accent-600" />
              <span>{CV_DATA.location}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Professional Summary */}
      <section className="mt-5">
        <h4 className="text-xs font-extrabold uppercase tracking-widest text-charcoal-900 border-b border-alabaster-300 pb-1">
          Professional Summary
        </h4>
        <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-zinc-700">
          {CV_DATA.summary}
        </p>
      </section>

      {/* Work Experience */}
      <section className="mt-5">
        <h4 className="text-xs font-extrabold uppercase tracking-widest text-charcoal-900 border-b border-alabaster-300 pb-1">
          Work Experience
        </h4>
        <div className="mt-3 space-y-3.5">
          {CV_DATA.experience.map((exp, idx) => (
            <div key={idx}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h5 className="text-sm font-bold text-charcoal-900">{exp.role}</h5>
                <span className="text-xs font-semibold text-wood-dark">
                  {exp.organization} · {exp.scope}
                </span>
              </div>
              <ul className="mt-1.5 list-disc pl-5 space-y-1 text-xs text-zinc-700">
                {exp.responsibilities.map((r, rIdx) => (
                  <li key={rIdx} className="leading-relaxed">
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Skills & Services */}
      <div className="mt-5 grid gap-6 sm:grid-cols-2 print:grid-cols-2">
        <section>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-charcoal-900 border-b border-alabaster-300 pb-1">
            Core Skills
          </h4>
          <div className="mt-2.5 space-y-2.5">
            {CV_DATA.skills.map((grp) => (
              <div key={grp.group}>
                <h5 className="text-xs font-bold text-charcoal-900">{grp.group}</h5>
                <p className="mt-0.5 text-xs leading-relaxed text-zinc-600">
                  {grp.list.join(' · ')}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-charcoal-900 border-b border-alabaster-300 pb-1">
            Services & Advisory
          </h4>
          <div className="mt-2.5 space-y-2">
            {CV_DATA.services.map((srv) => (
              <div key={srv.title}>
                <h5 className="text-xs font-bold text-charcoal-900">{srv.title}</h5>
                <p className="text-[11px] leading-snug text-zinc-600">{srv.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Selected Projects */}
      <section className="mt-5">
        <h4 className="text-xs font-extrabold uppercase tracking-widest text-charcoal-900 border-b border-alabaster-300 pb-1">
          Selected Projects
        </h4>
        <div className="mt-2.5 grid gap-3 sm:grid-cols-3 print:grid-cols-3">
          {CV_DATA.projects.map((proj) => (
            <div
              key={proj.name}
              className="rounded-xl border border-alabaster-300 bg-alabaster-50/70 p-3"
            >
              <h5 className="text-xs font-bold text-charcoal-900">{proj.name}</h5>
              <p className="text-[11px] font-semibold text-accent-600">{proj.role}</p>
              <p className="mt-1 text-[11px] leading-snug text-zinc-600">{proj.summary}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Education & Contact */}
      <div className="mt-5 grid gap-6 sm:grid-cols-2 print:grid-cols-2">
        <section>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-charcoal-900 border-b border-alabaster-300 pb-1">
            Professional Development
          </h4>
          {CV_DATA.education.map((edu, idx) => (
            <div key={idx} className="mt-2">
              <h5 className="text-xs font-bold text-charcoal-900">{edu.program}</h5>
              <p className="mt-1 text-[11px] leading-relaxed text-zinc-600">{edu.notes}</p>
            </div>
          ))}
        </section>

        <section>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-charcoal-900 border-b border-alabaster-300 pb-1">
            Direct Contact
          </h4>
          <div className="mt-2 space-y-1 text-xs text-zinc-700">
            <p>
              <span className="font-bold text-charcoal-900">Website:</span> {CV_DATA.contact.website}
            </p>
            <p>
              <span className="font-bold text-charcoal-900">Email:</span> {CV_DATA.contact.email}
            </p>
            <p className="mt-1 text-[11px] text-zinc-500">{CV_DATA.contact.availability}</p>
          </div>
        </section>
      </div>
    </article>
  );
}

/**
 * Full-Screen CV Preview Modal (triggered from the 3D Printer or Header CTA)
 * Also serves as the isolated `#cv-printable-area` when `window.print()` is executed.
 */
export function CVPreviewModal() {
  const activeModal = useCityStore((s) => s.activeModal);
  const setActiveModal = useCityStore((s) => s.setActiveModal);
  const [downloaded, setDownloaded] = useState(false);

  const handlePrintCV = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownloadPDF = () => {
    downloadResumePDFFile(() => {
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    });
  };

  return (
    <div
      className={`${
        activeModal === 'cv'
          ? 'fixed inset-0 z-50 flex flex-col items-center overflow-y-auto bg-charcoal-950/70 p-3 sm:p-6 backdrop-blur-sm'
          : 'hidden print:block'
      }`}
    >
      {/* Modal Action Bar (Hidden in Print) */}
      <div className="mb-4 flex w-full max-w-[210mm] flex-wrap items-center justify-between gap-3 rounded-2xl border border-alabaster-300 bg-alabaster-50 px-5 py-3.5 text-charcoal-900 shadow-xl no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveModal('none')}
            className="inline-flex items-center gap-1.5 rounded-full border border-alabaster-300 bg-white px-4 py-2 text-xs font-semibold text-charcoal-900 hover:bg-alabaster-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Studio</span>
          </button>
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal-900">
              <FileText className="h-3.5 w-3.5 text-accent-600" />
              <span>EXECUTIVE CURRICULUM VITAE</span>
            </div>
            <p className="text-[11px] text-zinc-500">A4 Print-Ready · {CV_DATA.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-1.5 rounded-full border border-charcoal-900/20 bg-white px-4 py-2 text-xs font-semibold text-charcoal-900 hover:border-charcoal-900 transition-colors"
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
            onClick={handlePrintCV}
            className="inline-flex items-center gap-1.5 rounded-full bg-charcoal-900 px-5 py-2 text-xs font-semibold text-white hover:bg-accent-600 transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print CV</span>
          </button>
        </div>
      </div>

      {/* Printable A4 Sheet */}
      <div className="w-full max-w-[210mm]">
        <ResumeSheetContent id="cv-printable-area" />
      </div>
    </div>
  );
}
