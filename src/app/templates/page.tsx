
import TemplatesPageClient from '@/components/TemplatesPageClient';

// Metadata for the templates page
export const metadata = {
  title: "Resume Templates - Choose Your Style",
  description: "Browse our collection of unique, animated resume templates. From retro terminals to modern designs, find the perfect template to showcase your professional story.",
  keywords: [
    "resume templates",
    "animated resume templates",
    "interactive resume designs",
    "resume styles",
    "professional templates",
    "creative resume layouts"
  ],
  openGraph: {
    title: "Resume Templates - Choose Your Style",
    description: "Browse our collection of unique, animated resume templates. Find the perfect design to showcase your professional story.",
    images: ["/og-templates.png"],
  },
  twitter: {
    title: "Resume Templates - Choose Your Style",
    description: "Browse our collection of unique, animated resume templates. Find the perfect design!",
  }
};

export default function TemplatesPage() {
  return <TemplatesPageClient />;
}
