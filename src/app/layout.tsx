import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";
import { Inter, Pixelify_Sans } from 'next/font/google';

// Optimize critical fonts
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const pixelifySans = Pixelify_Sans({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pixelify',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: {
    default: "ResumeSprites - Interactive Resume Builder",
    template: "%s | ResumeSprites"
  },
  description: "Create stunning, interactive resumes with unique animated templates. Stand out to employers with password-protected resume links, real-time tracking, and professional PDF generation.",
  keywords: [
    "resume builder",
    "interactive resume", 
    "animated resume",
    "job application",
    "professional portfolio",
    "resume templates",
    "cover letter generator",
    "resume link",
    "password protected resume",
    "resume tracking",
    "career tools",
    "job search"
  ],
  authors: [{ name: "ResumeSprites Team" }],
  creator: "ResumeSprites",
  publisher: "ResumeSprites",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://resumesprites.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'ResumeSprites - Interactive Resume Builder',
    description: 'Create stunning, interactive resumes with unique animated templates. Stand out to employers with password-protected resume links and real-time tracking.',
    siteName: 'ResumeSprites',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ResumeSprites - Interactive Resume Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ResumeSprites - Interactive Resume Builder',
    description: 'Create stunning, interactive resumes with unique animated templates. Stand out to employers!',
    images: ['/og-image.png'],
    creator: '@resumesprites',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`light ${inter.variable} ${pixelifySans.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Load non-critical fonts asynchronously */}
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bungee&family=Gloock&family=Orbitron:wght@400;700&family=Rock+Salt&family=Space+Grotesk:wght@400;500;700&family=Ultra&display=swap"
          rel="stylesheet"
          media="print"
          onLoad={(e) => {
            const target = e.target as HTMLLinkElement;
            target.media = 'all';
          }}
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
            })
          }}
        />
      </head>
      <body className="font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
