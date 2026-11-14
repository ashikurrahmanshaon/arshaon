import { BUSINESS_SPECIALTIES } from '@/data/businessData';
import { CV_DATA } from '@/data/cvData';
import { PROFILE_DATA } from '@/data/profileData';
import { PROJECTS_DATA } from '@/data/projectsData';
import { CreationCategory } from '@/types/city';
import { AppleAppId } from './appleOSIcons';

export const CREATION_CATEGORIES: CreationCategory[] = [
  'All',
  'Websites',
  'SaaS Products',
  'AI Projects',
  'Digital Marketing Campaigns',
  'Creative Work',
];

export interface AppleNoteItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  pinned?: boolean;
  primary?: boolean;
  own?: boolean;
  content: string;
  links?: { label: string; app: AppleAppId; arg?: string }[];
}

export const INITIAL_APPLE_NOTES: AppleNoteItem[] = [
  {
    id: 'welcome',
    title: "👋 Hi, I'm Ashikur Rahman Shaon",
    subtitle: 'Welcome to my digital world · arshaon.com',
    date: 'Pinned',
    pinned: true,
    primary: true,
    content: `I am Ashikur Rahman Shaon — a digital entrepreneur, marketing strategist, and creative technologist building modern web platforms, SaaS products, AI automation workflows, and high-converting digital growth ecosystems under ARSHAON (arshaon.com).

My work sits at the intersection of full-stack product engineering and performance-driven brand growth: I architect the product, build the conversion funnel, automate operations with AI, and scale customer acquisition across Meta Ads, Google Ads, and Search.

Explore this computer:
• Creations (Photos): Browse my flagship websites, SaaS platforms, AI systems & marketing campaigns.
• Finder: Inspect my experience, 10 executive capabilities, and project files.
• Messages (iMessage): Ask me anything directly in a live chat interface.
• Preview: Read, print (⌘P), or download my A4 Curriculum Vitae as a PDF.
• For Clients & Recruiters: Open the 60-second Executive Fast-Track brief.
• Terminal: Run interactive zsh commands (type "help").`,
    links: [
      { label: 'Open Creations (Photos)', app: 'photos' },
      { label: 'Executive Fast-Track', app: 'hire' },
      { label: 'Preview & Print CV (PDF)', app: 'preview' },
      { label: 'Ask Me in Messages', app: 'messages' },
    ],
  },
  {
    id: 'skills',
    title: '🧰 Skills & Full-Stack Capabilities',
    subtitle: 'Engineering · AI · Performance Marketing · Growth',
    date: 'Pinned',
    pinned: true,
    content: PROFILE_DATA.skills
      .map((g) => `${g.category.toUpperCase()}\n• ${g.items.join('\n• ')}`)
      .join('\n\n'),
    links: [
      { label: 'Inspect 10 Capabilities in Finder', app: 'finder', arg: 'capabilities' },
    ],
  },
  {
    id: 'what-i-bring',
    title: '🚀 What I Build & Scale (ARSHAON)',
    subtitle: 'Product Engineering + Revenue Growth',
    date: 'Pinned',
    pinned: true,
    content: `In one line: I bridge technical product execution and commercial revenue growth so brands don't have to choose between great engineering and profitable marketing.

1. Modern Web & SaaS Product Engineering
• Architecting high-speed Next.js, React, and TypeScript web applications and multi-tenant SaaS platforms.
• Designing editorial, conversion-focused user interfaces with clean design systems.

2. AI Automation & Intelligent Workflows
• Building custom AI agents, LLM integrations, automated lead qualification pipelines, and internal operational tools.

3. Full-Funnel Digital Marketing & Paid Acquisition
• Scaling profitable Meta Ads (Facebook & Instagram) and Google Ads (Search, PMax, YouTube) with server-side CAPI & GA4 attribution.
• Technical SEO, content architecture, and E-Commerce CRO for sustainable organic and paid scale.`,
    links: [
      { label: 'View Flagship Projects', app: 'photos' },
      { label: 'Send Direct Mail', app: 'mail' },
    ],
  },
  {
    id: 'career',
    title: '💼 Executive Career Journey',
    subtitle: 'Founder, Strategist & Technologist',
    date: 'Experience',
    content: PROFILE_DATA.careerHistory
      .map(
        (c) =>
          `${c.role} — ${c.organization} (${c.focus})\n${c.description}`
      )
      .join('\n\n'),
    links: [
      { label: 'Open Full CV in Preview', app: 'preview' },
      { label: 'Open Experience Folder', app: 'finder', arg: 'experience' },
    ],
  },
  {
    id: 'principles',
    title: '🧭 Principles & Personal Interests',
    subtitle: 'How I work & what inspires me',
    date: 'Always',
    content: `PRINCIPLES I WORK BY
• Clarity over complexity — build products and funnels people understand in seconds.
• Measure what matters — tie every creative and engineering decision to real business outcomes.
• End-to-end ownership — from first architecture diagram to profitable customer acquisition.
• Relentless iteration — test, learn, refine, and compound gains every week.

PERSONAL INTERESTS
• ${PROFILE_DATA.interests.join('\n• ')}`,
  },
];

export type WallpaperId = 'dusk' | 'sequoia' | 'ocean' | 'night' | 'dunes' | 'mint';

export const APPLE_WALLS: Record<
  WallpaperId,
  { name: string; subtitle: string; skyline: boolean; css: string; dark: boolean }
> = {
  dusk: {
    name: 'Studio Dusk',
    subtitle: 'Skyline Horizon & Sunset Glow',
    skyline: true,
    dark: true,
    css: 'radial-gradient(1100px 500px at 70% 105%, #ffb36b 0%, transparent 60%), radial-gradient(900px 500px at 10% 100%, #e2483d 0%, transparent 55%), linear-gradient(180deg, #16244a 0%, #4b2f6e 42%, #b6527a 72%, #f2a06b 100%)',
  },
  sequoia: {
    name: 'macOS Sequoia',
    subtitle: 'Deep Indigo & Electric Blue Glow',
    skyline: false,
    dark: true,
    css: 'radial-gradient(1100px 760px at 8% -10%, #4a2fd0 0%, transparent 60%), radial-gradient(1200px 820px at 105% 110%, #0a78d8 0%, transparent 62%), radial-gradient(900px 600px at 60% 40%, #1d2a8f 0%, transparent 70%), linear-gradient(160deg, #1a1166 0%, #0a1a55 45%, #083f8f 100%)',
  },
  ocean: {
    name: 'Gulf Blue',
    subtitle: 'Deep Ocean & Cyan Skyline',
    skyline: true,
    dark: true,
    css: 'radial-gradient(900px 500px at 80% 10%, #58c3d6 0%, transparent 60%), linear-gradient(160deg, #0b1f45 0%, #1e5f9e 55%, #3fb0c9 100%)',
  },
  night: {
    name: 'Midnight Pro',
    subtitle: 'Space Black & Deep Violet Skyline',
    skyline: true,
    dark: true,
    css: 'radial-gradient(900px 420px at 50% 115%, #4a2f9a 0%, transparent 70%), linear-gradient(180deg, #04050c 0%, #10173a 100%)',
  },
  dunes: {
    name: 'Golden Dunes',
    subtitle: 'Warm California Amber & Sand',
    skyline: false,
    dark: false,
    css: 'radial-gradient(1400px 400px at 30% 100%, #b4612f 0%, transparent 70%), radial-gradient(1200px 380px at 80% 95%, #d98a4a 0%, transparent 70%), linear-gradient(180deg, #8fc3e8 0%, #f5d7a6 55%, #e9a86b 100%)',
  },
  mint: {
    name: 'Cupertino Mint',
    subtitle: 'Soft Daylight Pastel Glass',
    skyline: false,
    dark: false,
    css: 'radial-gradient(800px 600px at 15% 20%, #ffffff 0%, transparent 60%), linear-gradient(135deg, #c9f2e1 0%, #a9d6f2 60%, #c8b6f2 100%)',
  },
};

export type AccentColorId =
  | 'blue'
  | 'purple'
  | 'pink'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'graphite';

export const APPLE_ACCENTS: Record<AccentColorId, { name: string; hex: string }> = {
  blue: { name: 'Blue', hex: '#0a84ff' },
  purple: { name: 'Purple', hex: '#bf5af2' },
  pink: { name: 'Pink', hex: '#ff375f' },
  red: { name: 'Red', hex: '#ff3b30' },
  orange: { name: 'Orange', hex: '#ff9f0a' },
  yellow: { name: 'Yellow', hex: '#e6b800' },
  green: { name: 'Green', hex: '#30d158' },
  graphite: { name: 'Graphite', hex: '#8e8e93' },
};

export interface IMessageEntry {
  from: 'them' | 'me';
  text: string;
  actionLabel?: string;
  actionApp?: AppleAppId;
}

export const IMESSAGE_QUICK_PROMPTS: {
  question: string;
  answer: string;
  actionLabel?: string;
  actionApp?: AppleAppId;
}[] = [
  {
    question: 'What do you build & specialize in?',
    answer: `I build full-stack web platforms, SaaS products, and AI automation workflows — and scale customer acquisition through Meta Ads, Google Ads, and SEO under ARSHAON (${PROFILE_DATA.website}).`,
    actionLabel: 'Explore Creations →',
    actionApp: 'photos',
  },
  {
    question: 'Show me your flagship projects',
    answer: `I've built ${PROJECTS_DATA.length} flagship systems across Websites, SaaS Products, AI Projects, Digital Marketing Campaigns, and Creative Work. Click below to open the Creations showcase!`,
    actionLabel: 'Open Creations App →',
    actionApp: 'photos',
  },
  {
    question: 'Can I view or download your CV?',
    answer: `Absolutely! You can view my A4 Curriculum Vitae in Preview, download the PDF directly, or print it using AirPrint (⌘P).`,
    actionLabel: 'Open CV in Preview →',
    actionApp: 'preview',
  },
  {
    question: 'How can we collaborate or hire you?',
    answer: `You can send me a message right here via the Mail app or email ${CV_DATA.email}. You can also check the "For Clients & Recruiters" fast-track brief!`,
    actionLabel: 'Open Mail Composer →',
    actionApp: 'mail',
  },
];

export const PROJECT_TILE_PALETTES: [string, string][] = [
  ['#0a84ff', '#16244a'],
  ['#5e5ce6', '#17154f'],
  ['#ff2d55', '#560d2b'],
  ['#2fbf5b', '#0a4420'],
  ['#ff8a00', '#742a00'],
  ['#22a6c4', '#083645'],
  ['#b658f0', '#36125f'],
  ['#e2483d', '#4a1210'],
];

/**
 * Generates deterministic procedural city skyline SVG path with central spire (inspired by shotok.io).
 */
export function generateSkylinePath(): string {
  let x = 0;
  let d = 'M0 260';
  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  while (x < 1440) {
    const w = 22 + rnd() * 46;
    const hgt = 40 + rnd() * 110;
    if (x > 660 && x < 700) {
      d += ` L${x} 160 L${x + 14} 120 L${x + 22} 40 L${x + 26} 0 L${x + 30} 40 L${
        x + 38
      } 120 L${x + 52} 160`;
      x += 52;
      continue;
    }
    d += ` L${x.toFixed(1)} ${(260 - hgt).toFixed(1)} L${(x + w).toFixed(1)} ${(
      260 - hgt
    ).toFixed(1)}`;
    if (rnd() > 0.7) {
      d += ` L${(x + w / 2).toFixed(1)} ${(260 - hgt - 18).toFixed(1)} L${(
        x + w
      ).toFixed(1)} ${(260 - hgt).toFixed(1)}`;
    }
    x += w;
  }
  return `${d} L1440 260 Z`;
}

export { BUSINESS_SPECIALTIES, CV_DATA, PROFILE_DATA, PROJECTS_DATA };
