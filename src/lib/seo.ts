import type { Metadata } from 'next';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export function generateMetadata(config: SEOConfig): Metadata {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://resumesprites.com';
  const fullUrl = config.url ? `${baseUrl}${config.url}` : baseUrl;
  const imageUrl = config.image ? `${baseUrl}${config.image}` : `${baseUrl}/og-default.png`;

  const openGraph: any = {
    title: config.title,
    description: config.description,
    url: fullUrl,
    siteName: 'ResumeSprites',
    images: [
      {
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: config.title,
      },
    ],
    type: config.type || 'website',
    locale: 'en_US',
  };

  if (config.publishedTime) {
    openGraph.publishedTime = config.publishedTime;
  }

  if (config.modifiedTime) {
    openGraph.modifiedTime = config.modifiedTime;
  }

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [imageUrl],
      creator: '@resumesprites',
    },
    alternates: {
      canonical: fullUrl,
    },
    ...(config.author && { authors: [{ name: config.author }] }),
  };
}

export function generatePersonStructuredData(personData: {
  name: string;
  jobTitle: string;
  description: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  experience: Array<{
    company: string;
    role: string;
    startDate: string;
    endDate: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
  }>;
  skills: Array<{ name: string }>;
  portfolio: Array<{ url: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": personData.name,
    "jobTitle": personData.jobTitle,
    "description": personData.description,
    "email": personData.email,
    "telephone": personData.phone,
    "url": personData.website,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": personData.location
    },
    "worksFor": personData.experience.map(exp => ({
      "@type": "Organization",
      "name": exp.company,
      "jobTitle": exp.role,
      "startDate": exp.startDate,
      "endDate": exp.endDate
    })),
    "alumniOf": personData.education.map(edu => ({
      "@type": "Organization",
      "name": edu.institution,
      "description": edu.degree
    })),
    "knowsAbout": personData.skills.map(skill => skill.name),
    "sameAs": personData.portfolio.map(project => project.url)
  };
}

export function generateWebAppStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "ResumeSprites",
    "description": "Interactive resume builder with animated templates",
    "url": "https://resumesprites.com",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "ResumeSprites"
    },
    "featureList": [
      "Interactive resume templates",
      "Password-protected links",
      "Real-time tracking",
      "PDF generation",
      "Cover letter creation"
    ]
  };
}

export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ResumeSprites",
    "url": "https://resumesprites.com",
    "logo": "https://resumesprites.com/logo.png",
    "description": "Interactive resume builder with animated templates",
    "sameAs": [
      "https://twitter.com/resumesprites",
      "https://linkedin.com/company/resumesprites"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "support@resumesprites.com"
    }
  };
} 