import { BusinessSpecialty } from '@/types/city';

/**
 * Editable Business District data representing Ashikur Rahman Shaon's
 * professional career and core operational disciplines.
 */
export const BUSINESS_SPECIALTIES: BusinessSpecialty[] = [
  {
    id: 'professional-experience',
    title: 'Professional Experience & Executive Strategy',
    category: 'marketing',
    summary:
      'Cross-functional leadership combining business strategy, brand positioning, digital product execution, and full-funnel growth systems.',
    capabilities: [
      'Digital brand architecture & multi-channel positioning',
      'Go-to-market planning for digital products and services',
      'Cross-disciplinary execution across design, engineering, and marketing',
      'Data-informed decision frameworks and KPI tracking',
    ],
    toolsAndPlatforms: ['Executive Dashboards', 'GA4', 'Looker Studio', 'Notion', 'Modern Web Stack'],
    deliverables: ['Growth Roadmaps', 'Brand Architecture Systems', 'Full-Stack Digital Platforms'],
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Ecosystems',
    category: 'marketing',
    summary:
      'Holistic digital marketing frameworks that align content, search visibility, paid media, and conversion funnels into a unified engine.',
    capabilities: [
      'Full-funnel customer journey mapping (Awareness → Consideration → Conversion)',
      'Landing page messaging and conversion architecture',
      'Audience research, value proposition clarity, and retention workflows',
      'Cross-channel campaign orchestration and attribution',
    ],
    toolsAndPlatforms: ['Google Analytics 4', 'Google Tag Manager', 'CRM Pipelines', 'Email & Funnel Systems'],
    deliverables: ['Integrated Marketing Campaigns', 'High-Converting Landing Funnels', 'Analytics Audits'],
  },
  {
    id: 'social-media-strategy',
    title: 'Social Media Strategy & Brand Presence',
    category: 'marketing',
    summary:
      'Strategic brand storytelling and content systems engineered to build authority, community trust, and organic engagement.',
    capabilities: [
      'Platform-native content pillars and editorial systems',
      'Brand voice, visual identity consistency, and creative direction',
      'Community growth workflows and engagement loops',
      'Short-form and long-form media distribution strategies',
    ],
    toolsAndPlatforms: ['Meta Business Suite', 'LinkedIn', 'YouTube Studio', 'Content Calendar Systems'],
    deliverables: ['Social Brand Playbooks', 'Content Production Frameworks', 'Audience Growth Strategies'],
  },
  {
    id: 'meta-ads',
    title: 'Meta Ads (Facebook & Instagram Advertising)',
    category: 'advertising',
    summary:
      'Precision-targeted paid social campaigns focused on creative testing, pixel/CAPI signal quality, and scalable audience acquisition.',
    capabilities: [
      'Campaign structure architecture (Prospecting, Retargeting, Advantage+)',
      'Meta Pixel & Conversions API (CAPI) event tracking implementation',
      'Systematic ad creative & hook testing frameworks',
      'Audience segmentation, lookalike modeling, and budget scaling',
    ],
    toolsAndPlatforms: ['Meta Ads Manager', 'Meta Events Manager', 'Conversions API', 'Creative Testing Matrices'],
    deliverables: ['Full-Funnel Meta Ad Campaigns', 'Server-Side Tracking Setup', 'Creative Performance Briefs'],
  },
  {
    id: 'google-ads',
    title: 'Google Ads & Search Intent Acquisition',
    category: 'advertising',
    summary:
      'High-intent search, display, Performance Max, and YouTube campaigns designed to capture active demand at the moment of search.',
    capabilities: [
      'Keyword intent research, match-type architecture, and negative keyword hygiene',
      'Search, Performance Max (PMax), Display, and YouTube campaign setup',
      'Ad copy optimization, extensions/assets, and Quality Score improvement',
      'Conversion tracking via Google Tag Manager and enhanced conversions',
    ],
    toolsAndPlatforms: ['Google Ads', 'Google Keyword Planner', 'Google Tag Manager', 'Merchant Center'],
    deliverables: ['Search & PMax Campaign Builds', 'Keyword & Bidding Architecture', 'Conversion Tracking Audits'],
  },
  {
    id: 'seo',
    title: 'Search Engine Optimization (SEO)',
    category: 'marketing',
    summary:
      'Technical, on-page, and semantic SEO engineering that builds sustainable organic search visibility and domain authority.',
    capabilities: [
      'Technical SEO audits (Core Web Vitals, crawlability, sitemaps, schema.org JSON-LD)',
      'On-page semantic optimization and topical authority architecture',
      'Keyword cluster mapping and search-intent content structuring',
      'Local and global search visibility optimization',
    ],
    toolsAndPlatforms: ['Google Search Console', 'Schema.org JSON-LD', 'Lighthouse', 'Technical SEO Suites'],
    deliverables: ['Technical SEO Architecture', 'Structured Data Implementation', 'Content & Keyword Roadmaps'],
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Architecture & Growth',
    category: 'commerce',
    summary:
      'End-to-end e-commerce store creation, catalog optimization, checkout flow refinement, and retention-focused commerce systems.',
    capabilities: [
      'Modern storefront design and mobile-first shopping experiences',
      'Product page persuasion architecture and checkout friction reduction',
      'Catalog feed integration for Meta Shops and Google Merchant Center',
      'Order workflow automation and customer lifecycle optimization',
    ],
    toolsAndPlatforms: ['Custom Next.js Commerce', 'Shopify / WooCommerce', 'Payment Gateways', 'Catalog Feeds'],
    deliverables: ['Scalable E-Commerce Storefronts', 'Product Feed Integrations', 'Checkout Optimization'],
  },
  {
    id: 'ai-automation',
    title: 'AI Automation & Intelligent Workflows',
    category: 'technology',
    summary:
      'Practical AI integration and workflow automation that eliminate repetitive bottlenecks and accelerate creative and operational output.',
    capabilities: [
      'Custom AI agent workflows and LLM-powered business assistants',
      'Automated lead routing, content pipelines, and CRM synchronization',
      'Prompt engineering systems for marketing, research, and code generation',
      'API integrations connecting modern web apps with intelligent automation',
    ],
    toolsAndPlatforms: ['LLM APIs', 'Workflow Automation Pipelines', 'Custom Webhooks', 'TypeScript Agents'],
    deliverables: ['Automated Business Pipelines', 'AI Content & Operations Systems', 'Custom Assistant Integrations'],
  },
  {
    id: 'web-development',
    title: 'Web Development & Interactive 3D Experiences',
    category: 'technology',
    summary:
      'High-performance web applications, corporate platforms, and spatial 3D WebGL experiences engineered with Next.js, TypeScript, and Three.js.',
    capabilities: [
      'Full-stack Next.js & TypeScript application development',
      'Interactive 3D web environments with React Three Fiber & Three.js',
      'Responsive UI systems using Tailwind CSS and accessible component design',
      'Edge-ready deployment, fast load times, and clean modular codebases',
    ],
    toolsAndPlatforms: ['Next.js', 'TypeScript', 'React', 'Three.js / R3F', 'Tailwind CSS'],
    deliverables: ['Custom Web Applications', 'Interactive 3D Portfolios', 'Corporate & Brand Websites'],
  },
  {
    id: 'product-development',
    title: 'Digital Product Development',
    category: 'technology',
    summary:
      'From initial concept and UX prototyping to production release and growth iteration—turning ideas into polished digital products.',
    capabilities: [
      'Product discovery, feature scoping, and modular system architecture',
      'Interactive UI/UX prototyping and design system engineering',
      'Rapid MVP development and iterative user feedback integration',
      'Production launch readiness, SEO, analytics, and reliability engineering',
    ],
    toolsAndPlatforms: ['TypeScript', 'Design Systems', 'Git Workflows', 'Cloud Deployment Platforms'],
    deliverables: ['Production SaaS & Web Products', 'Interactive Prototypes', 'Scalable Component Libraries'],
  },
];

