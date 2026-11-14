import { CVData } from '@/types/city';

/**
 * Editable structured CV data for Ashikur Rahman Shaon (arshaon.com).
 * Note: Strictly avoids invented employment dates, fabricated university degrees,
 * or fake metrics. All sections can be edited directly in this file.
 */
export const CV_DATA: CVData = {
  name: 'Ashikur Rahman Shaon',
  brand: 'ARSHAON',
  title: 'Digital Entrepreneur, Marketing Strategist & Creative Technologist',
  website: 'https://arshaon.com',
  email: 'contact@arshaon.com',
  location: 'arshaon.com · Global Digital Operations',
  summary:
    'Multidisciplinary Digital Entrepreneur and Creative Technologist operating under the ARSHAON brand (arshaon.com). Experienced across strategic digital marketing, Meta Ads, Google Ads, Search Engine Optimization (SEO), social media strategy, e-commerce architecture, AI workflow automation, and modern full-stack web development. Focused on building high-performing digital products and scalable brand ecosystems.',
  experience: [
    {
      role: 'Founder & Digital Strategist',
      organization: 'ARSHAON (arshaon.com)',
      scope: 'Brand Architecture · Web Platforms · Growth Strategy',
      responsibilities: [
        'Direct end-to-end digital strategy, web platform development, and brand positioning under the ARSHAON ecosystem.',
        'Architect modern interactive web applications and digital portfolios using Next.js, React, TypeScript, and Three.js.',
        'Integrate product design, technical SEO, and conversion-focused user journeys into cohesive digital properties.',
      ],
    },
    {
      role: 'Digital Marketing & Performance Advertising Specialist',
      organization: 'Digital Growth & Campaign Operations',
      scope: 'Meta Ads · Google Ads · SEO · Social Media Strategy',
      responsibilities: [
        'Plan and manage paid acquisition campaigns across Meta Ads (Facebook & Instagram) and Google Ads (Search, Display, YouTube).',
        'Execute technical and on-page Search Engine Optimization (SEO) strategies to strengthen organic search visibility.',
        'Develop social media strategies, content pillars, and conversion tracking frameworks for digital brands and e-commerce.',
      ],
    },
    {
      role: 'Creative Technologist & Product Developer',
      organization: 'Technology & Automation Studio',
      scope: 'Web Development · E-Commerce · AI Automation',
      responsibilities: [
        'Build responsive web interfaces, e-commerce storefronts, and custom digital products tailored for cross-device performance.',
        'Design AI automation workflows to streamline content pipelines, research, and business operations.',
        'Maintain modular, maintainable TypeScript codebases ready for production deployment.',
      ],
    },
  ],
  skills: [
    {
      group: 'Marketing & Paid Acquisition',
      list: [
        'Digital Marketing Strategy',
        'Meta Ads (Campaign Architecture & Pixel/CAPI)',
        'Google Ads (Search, Display & Performance Campaigns)',
        'Search Engine Optimization (Technical & On-Page SEO)',
        'Social Media Strategy & Content Systems',
      ],
    },
    {
      group: 'Web & Product Engineering',
      list: [
        'Web Development (Next.js, React, TypeScript)',
        'Interactive 3D Web (Three.js, React Three Fiber)',
        'UI/UX Design & Tailwind CSS',
        'E-Commerce Storefront Development',
        'Product Development & Prototyping',
      ],
    },
    {
      group: 'Automation & Operations',
      list: [
        'AI Automation & Intelligent Workflows',
        'Analytics & Conversion Tracking',
        'Digital Brand Positioning',
        'Cross-Functional Project Execution',
      ],
    },
  ],
  services: [
    {
      title: 'Digital Marketing & Social Media Strategy',
      description: 'Full-funnel marketing blueprints, brand positioning, and audience growth systems.',
    },
    {
      title: 'Meta Ads & Google Ads Management',
      description: 'Targeted paid acquisition, creative testing frameworks, and conversion tracking setup.',
    },
    {
      title: 'Search Engine Optimization (SEO)',
      description: 'Technical SEO, structured data (JSON-LD), on-page optimization, and organic search architecture.',
    },
    {
      title: 'Web, E-Commerce & Product Development',
      description: 'Custom Next.js/TypeScript websites, interactive 3D web experiences, and scalable online stores.',
    },
    {
      title: 'AI Automation Solutions',
      description: 'Practical AI workflow integration to accelerate marketing, content, and operational execution.',
    },
  ],
  projects: [
    {
      name: 'ARSHAON CITY (arshaon.com)',
      role: 'Creator & Lead Architect',
      url: 'https://arshaon.com',
      summary:
        'Interactive 3D personal website and digital city featuring six architectural districts, first/third-person exploration, interactive studios, and an integrated A4 CV printing center.',
    },
    {
      name: 'ARSHAON Digital Marketing & Growth Framework',
      role: 'Lead Strategist',
      url: 'https://arshaon.com',
      summary:
        'Unified performance marketing framework combining Meta Ads, Google Ads, technical SEO, and analytics attribution.',
    },
    {
      name: 'AI Automation & Web Product Suite',
      role: 'Product Developer',
      url: 'https://arshaon.com',
      summary:
        'Modular web application and AI workflow templates built for modern digital businesses and e-commerce operations.',
    },
  ],
  education: [
    {
      program: 'Continuous Professional Development & Applied Technology',
      institution: 'Independent Research & Professional Practice (Editable in src/data/cvData.ts)',
      notes:
        'Ongoing specialization in Modern Web Engineering (TypeScript / Next.js / 3D Web), Performance Advertising (Meta & Google Ecosystems), Technical SEO, and Applied AI Automation.',
    },
  ],
  contact: {
    website: 'https://arshaon.com',
    email: 'contact@arshaon.com',
    linkedin: 'https://arshaon.com',
    github: 'https://arshaon.com',
    availability: 'Available for strategic partnerships, digital product development, and consulting via arshaon.com',
  },
};

