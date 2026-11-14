import { ProjectItem } from '@/types/city';

/**
 * Editable structured creations & portfolio data for Section D (MY CREATIONS).
 * Categorized across:
 * - Websites
 * - SaaS Products
 * - AI Projects
 * - Digital Marketing Campaigns
 * - Creative Work
 */
export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'arshaon-digital-world',
    name: 'ARSHAON.COM — Interactive 3D Workspace & Editorial Portfolio',
    category: 'Websites',
    subtitle: 'Personal Brand Platform & Interactive 3D Architectural Office',
    description:
      'Flagship personal website combining modern editorial web typography, a sunlit interactive 3D architectural workspace, and an integrated A4 CV printing system.',
    details:
      'Engineered with Next.js, TypeScript, Three.js, React Three Fiber, and Tailwind CSS. Visitors can interact directly with 3D studio objects—clicking the workstation computer to explore creations or the multifunction printer to preview and download a print-ready A4 resume.',
    previewTone: 'from-[#EAE4D8] via-[#DFD7C8] to-[#CFC5B4]',
    previewLabel: 'WEBSITES · INTERACTIVE 3D & EDITORIAL WEB',
    techStack: ['Next.js', 'TypeScript', 'Three.js / R3F', 'Tailwind CSS', 'Schema.org SEO'],
    liveUrl: 'https://arshaon.com',
    featured: true,
  },
  {
    id: 'arshaon-commerce-saas',
    name: 'Modular E-Commerce & Conversion Funnel Suite',
    category: 'SaaS Products',
    subtitle: 'High-Speed Storefront & Checkout Architecture',
    description:
      'Scalable product and storefront framework designed for modern digital brands, featuring streamlined catalog management, fast page transitions, and conversion-ready product pages.',
    details:
      'Architected with clean TypeScript modules, mobile-first checkout ergonomics, and native catalog feed compatibility for Meta Shops and Google Merchant Center.',
    previewTone: 'from-[#E5E7EB] via-[#D5DBE3] to-[#C2CBD6]',
    previewLabel: 'SAAS PRODUCTS · COMMERCE SYSTEMS',
    techStack: ['Next.js App Router', 'TypeScript', 'E-Commerce Architecture', 'Tailwind CSS', 'Analytics'],
    liveUrl: 'https://arshaon.com',
    featured: true,
  },
  {
    id: 'arshaon-ai-automation',
    name: 'Intelligent Business & Content Automation Workflows',
    category: 'AI Projects',
    subtitle: 'LLM-Powered Operations, Research & Marketing Pipelines',
    description:
      'Practical AI workflow system connecting structured prompts, web intake forms, content brief generation, and operational routing into a cohesive automation pipeline.',
    details:
      'Designed to eliminate repetitive manual bottlenecks across content production, campaign research, and lead qualification while maintaining human editorial quality control.',
    previewTone: 'from-[#DBEAFE] via-[#C7D9F8] to-[#B4C8EE]',
    previewLabel: 'AI PROJECTS · WORKFLOW AUTOMATION',
    techStack: ['AI Automation', 'TypeScript', 'LLM APIs', 'Webhook Orchestration', 'Structured Prompts'],
    liveUrl: 'https://arshaon.com',
    featured: true,
  },
  {
    id: 'arshaon-performance-campaigns',
    name: 'Full-Funnel Meta Ads, Google Ads & Technical SEO Engine',
    category: 'Digital Marketing Campaigns',
    subtitle: 'Precision Paid Acquisition & Search Visibility Architecture',
    description:
      'Integrated growth framework uniting Meta Ads (Pixel & Conversions API), Google Search & Performance Max campaigns, and semantic technical SEO.',
    details:
      'Built around structured creative testing matrices, high-intent keyword architecture, conversion tracking via Google Tag Manager, and clear attribution reporting.',
    previewTone: 'from-[#E7E2D8] via-[#D8CFC0] to-[#C7B9A5]',
    previewLabel: 'DIGITAL MARKETING · META ADS · GOOGLE ADS · SEO',
    techStack: ['Meta Ads & CAPI', 'Google Ads', 'Technical SEO', 'Google Tag Manager', 'Conversion Strategy'],
    liveUrl: 'https://arshaon.com',
    featured: true,
  },
  {
    id: 'arshaon-editorial-brand-system',
    name: 'ARSHAON Minimalist Brand Identity & Visual Direction',
    category: 'Creative Work',
    subtitle: 'Editorial Design Language, Social Strategy & Media Systems',
    description:
      'Cohesive visual identity and creative production system built on architectural typography, controlled warm palettes, and high-performing social media storytelling.',
    details:
      'Establishes a timeless, recognizable visual standard across web interfaces, social media content pillars, paid ad creatives, and executive documentation.',
    previewTone: 'from-[#EFECE6] via-[#E2DDD3] to-[#D2C9BC]',
    previewLabel: 'CREATIVE WORK · BRAND & VISUAL DIRECTION',
    techStack: ['Brand Strategy', 'UI/UX Design', 'Social Media Strategy', 'Ad Creative Direction'],
    liveUrl: 'https://arshaon.com',
    featured: false,
  },
  {
    id: 'arshaon-corporate-web-architecture',
    name: 'Executive Corporate Web & SEO Platform Blueprint',
    category: 'Websites',
    subtitle: 'High-Performance Web Engineering for Modern Enterprises',
    description:
      'Fast, accessible, and search-optimized web platform architecture tailored for service businesses, consultants, and technology brands.',
    details:
      'Combines semantic HTML5 structure, JSON-LD schema markup, Core Web Vitals optimization, and responsive editorial layouts.',
    previewTone: 'from-[#E2E8F0] via-[#CBD5E1] to-[#B8C4D4]',
    previewLabel: 'WEBSITES · PERFORMANCE & TECHNICAL SEO',
    techStack: ['React', 'Next.js', 'TypeScript', 'Technical SEO', 'Responsive Design'],
    liveUrl: 'https://arshaon.com',
    featured: false,
  },
];
