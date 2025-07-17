import SubscribePageClient from '@/components/SubscribePageClient';

// Metadata for the subscribe page
export const metadata = {
  title: "Upgrade to Pro - Premium Resume Features",
  description: "Unlock unlimited resume links, priority support, advanced security features, and premium templates. Upgrade to ResumeSprites Pro for the ultimate professional advantage.",
  keywords: [
    "resume pro",
    "premium resume features",
    "unlimited resume links",
    "resume upgrade",
    "professional resume tools",
    "resume subscription"
  ],
  openGraph: {
    title: "Upgrade to Pro - Premium Resume Features",
    description: "Unlock unlimited resume links, priority support, and premium templates. Upgrade to ResumeSprites Pro for the ultimate professional advantage.",
    images: ["/og-subscribe.png"],
  },
  twitter: {
    title: "Upgrade to Pro - Premium Resume Features",
    description: "Unlock unlimited resume links, priority support, and premium templates. Upgrade to Pro!",
  }
};

export default function SubscribePage() {
  return <SubscribePageClient />;
}
