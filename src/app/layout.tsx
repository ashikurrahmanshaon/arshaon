import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#0b0c12',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://arshaon.com'),
  title: {
    default: 'Ashikur Rahman Shaon — ARSHAON OS',
    template: '%s | Ashikur Rahman Shaon (ARSHAON)',
  },
  description:
    'The interactive portfolio of Ashikur Rahman Shaon (ARSHAON · arshaon.com) — Digital Entrepreneur, Marketing Strategist & Creative Technologist. Explore my work on a tiny Apple computer in your browser.',
  keywords: [
    'Ashikur Rahman Shaon',
    'ARSHAON',
    'arshaon.com',
    'ARSHAON OS',
    'Digital Entrepreneur',
    'Creative Technologist',
    'Digital Marketing',
    'Meta Ads',
    'Google Ads',
    'SEO',
    'Web Development',
    'SaaS',
    'AI Automation',
  ],
  authors: [{ name: 'Ashikur Rahman Shaon', url: 'https://arshaon.com' }],
  creator: 'Ashikur Rahman Shaon',
  publisher: 'ARSHAON',
  icons: {
    icon: [
      { url: '/icons/apple-favicon.svg?v=appleblack1', type: 'image/svg+xml' },
      { url: '/icons/favicon.png?v=appleblack1', type: 'image/png', sizes: '64x64' },
      { url: '/favicon.ico?v=appleblack1', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico?v=appleblack1',
    apple: '/icons/favicon.png?v=appleblack1',
  },
  alternates: {
    canonical: 'https://arshaon.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://arshaon.com',
    siteName: 'ARSHAON OS — Ashikur Rahman Shaon',
    title: 'Ashikur Rahman Shaon — ARSHAON OS',
    description:
      'Explore the work of Ashikur Rahman Shaon (ARSHAON) on an interactive macOS & iOS computer in your browser.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ashikur Rahman Shaon — ARSHAON OS',
    description:
      'Explore the work of Ashikur Rahman Shaon (ARSHAON) on an interactive macOS & iOS computer in your browser.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://arshaon.com/#person',
      name: 'Ashikur Rahman Shaon',
      alternateName: 'ARSHAON',
      url: 'https://arshaon.com',
      email: 'info@arshaon.com',
      sameAs: ['https://www.linkedin.com/in/ashikurrahmanshaon/'],
      jobTitle: 'Founder & Digital Product Architect',
      knowsAbout: [
        'Digital Marketing',
        'Social Media Strategy',
        'Meta Ads',
        'Google Ads',
        'Search Engine Optimization (SEO)',
        'E-Commerce',
        'AI Automation',
        'Web Development',
        'SaaS Product Development',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://arshaon.com/#website',
      url: 'https://arshaon.com',
      name: 'ARSHAON OS — Ashikur Rahman Shaon',
      publisher: {
        '@id': 'https://arshaon.com/#person',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
