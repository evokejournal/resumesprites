import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://resumesprites.com'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard/',
          '/builder/',
          '/templates/',
          '/settings/',
          '/subscribe/',
          '/preview/',
          '/resume/',
          '/cover-letter-pdf/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
} 