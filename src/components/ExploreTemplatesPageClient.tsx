"use client";

import Link from 'next/link';
import { PublicTemplateCard } from '@/components/templates/PublicTemplateCard';
import { templates } from '@/lib/templates';
import { Button } from '@/components/ui/button';

export default function ExploreTemplatesPageClient() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto h-16 flex items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-1">
            <h1 className="text-2xl font-headline font-semibold flex items-baseline">
              <span>Resume</span><span className="font-pixelify text-3xl font-semibold">Sprites</span>
            </h1>
          </Link>
          <Button asChild>
            <Link href="/builder">Sign Up</Link>
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-headline font-bold">Explore Our Templates</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Find the perfect design to tell your unique professional story. Sign up to customize and share.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <PublicTemplateCard key={template.id} template={template} />
          ))}
        </div>
      </main>
    </div>
  );
} 