import BuilderPageClient from '@/components/BuilderPageClient';

// Metadata for the builder page
export const metadata = {
  title: "Resume Builder - Create Your Professional Resume",
  description: "Build your professional resume step by step. Fill in your details, choose sections, and create a stunning interactive resume that stands out to employers.",
  keywords: [
    "resume builder",
    "create resume",
    "professional resume",
    "resume sections",
    "resume content",
    "job application builder"
  ],
  openGraph: {
    title: "Resume Builder - Create Your Professional Resume",
    description: "Build your professional resume step by step. Create a stunning interactive resume that stands out to employers.",
    images: ["/og-builder.png"],
  },
  twitter: {
    title: "Resume Builder - Create Your Professional Resume",
    description: "Build your professional resume step by step. Create a stunning interactive resume!",
  }
};

export default function BuilderPage() {
  return <BuilderPageClient />;
}
