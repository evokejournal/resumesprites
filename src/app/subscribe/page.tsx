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
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
      <div className="max-w-xl w-full bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4 text-center">Unlock All 9 Flagship Resume Templates</h1>
        <p className="text-lg text-muted-foreground mb-6 text-center">
          Make a one-time purchase to get <strong>lifetime access</strong> to our 9 professionally designed, animated resume templates.<br />
          <span className="block mt-2">No recurring fees—pay once, use forever.</span>
        </p>
        <ul className="list-disc list-inside text-left mb-6 text-base">
          <li>All 9 flagship templates, including all current pro features</li>
          <li>Unlimited resume creation and downloads</li>
          <li>Priority support</li>
        </ul>
        <div className="mb-6 text-sm text-muted-foreground text-center">
          <strong>Note:</strong> Future template releases and advanced features will be available via optional subscription.
        </div>
        {/* ... existing purchase button/flow ... */}
      </div>
    </div>
  );
}
