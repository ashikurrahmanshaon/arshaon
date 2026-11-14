import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://arshaon.com/sitemap.xml',
    host: 'https://arshaon.com',
  };
}

