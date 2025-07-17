
import ExploreTemplatesPageClient from '@/components/ExploreTemplatesPageClient';

// Metadata for the explore templates page
export const metadata = {
  title: "Explore Resume Templates - Free Template Gallery",
  description: "Explore our free collection of animated resume templates. From retro terminals to modern designs, preview templates before signing up to create your own interactive resume.",
  keywords: [
    "free resume templates",
    "resume template gallery",
    "animated resume preview",
    "resume design examples",
    "interactive resume templates",
    "resume template showcase"
  ],
  openGraph: {
    title: "Explore Resume Templates - Free Template Gallery",
    description: "Explore our free collection of animated resume templates. Preview templates before creating your own interactive resume.",
    images: ["/og-explore-templates.png"],
  },
  twitter: {
    title: "Explore Resume Templates - Free Template Gallery",
    description: "Explore our free collection of animated resume templates. Preview before creating!",
  }
};

export default function ExploreTemplatesPage() {
  return <ExploreTemplatesPageClient />;
}
