
"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

import { RetroTerminalPreview } from "@/components/templates/previews/RetroTerminalPreview";
import { OperatingSystemPreview } from "@/components/templates/previews/OperatingSystemPreview";
import { YoublePreview } from "@/components/templates/previews/GoobleItPreview";
import { ForTaxPurposesPreview } from "@/components/templates/previews/ReceiptRollPreview";
import { ExplosivePotentialPreview } from "@/components/templates/previews/ExplosivePotentialPreview";
import { cn } from '@/lib/utils';
import { templates } from '@/lib/templates';


const VerticalCarousel = ({
  templates,
  duration = 60000,
  reverse = false,
}: {
  templates: { name: string; previewComponent: React.ReactNode }[];
  duration?: number;
  reverse?: boolean;
}) => {
  const duplicatedTemplates = [...templates, ...templates];

  return (
    <div className="w-full h-full overflow-hidden mask-gradient">
      <div
        className={cn("flex flex-col", reverse ? "animate-vertical-scroll-reverse" : "animate-vertical-scroll")}
        style={{ animationDuration: `${duration}ms` }}
      >
        {duplicatedTemplates.map((template, index) => (
          <div key={index} className="w-full flex-shrink-0 aspect-square p-4">
            <div className="w-full h-full p-4 bg-card/60 rounded-2xl shadow-xl backdrop-blur-sm border border-border/50">
              {template.previewComponent}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function HeroPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to builder
  useEffect(() => {
    if (!loading && user) {
      router.push('/builder');
    }
  }, [user, loading, router]);

  // Don't render the landing page if user is authenticated
  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Only show these templates in the hero carousel
  const HERO_TEMPLATE_IDS = [
    'youble',
    'operating-system',
    'for-tax-purposes',
    'code-syntax',
    'snakebite-resume',
    'bouncing-resume',
    'explosive-potential',
    'sms-conversation',
    'retro-terminal',
  ];
  const heroTemplates = templates.filter(t => HERO_TEMPLATE_IDS.includes(t.id));

  // To ensure no two same templates appear at once, offset each column
  const column1Templates = [...heroTemplates];
  const column2Templates = [...heroTemplates.slice(3), ...heroTemplates.slice(0, 3)];
  const column3Templates = [...heroTemplates.slice(6), ...heroTemplates.slice(0, 6)];

  return (
    <div className="relative isolate min-h-screen w-full overflow-hidden bg-background">
      <div
        className="[--aurora:repeating-linear-gradient(100deg,hsl(var(--primary)/0.1)_10%,hsl(var(--accent)/0.15)_15%,hsl(var(--primary)/0.1)_20%)] [background-image:var(--aurora),var(--aurora)] [background-size:200%_100%] [background-position:50%_50%,50%_50%] filter blur-[10px] after:content-[''] after:absolute after:inset-0 after:bg-background/80 after:z-[-1] animate-[aurora_15s_linear_infinite] fixed inset-0"
      ></div>

      {/* Flying firefly-like pixels */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center p-4">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold font-headline flex items-baseline justify-center gap-x-2">
              <span>Resume</span><span className="font-pixelify text-6xl md:text-8xl text-primary">Sprites</span>
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Stop blending in. Start standing out. Transform your static resume into a dynamic, interactive story that captures attention and gets you noticed. Apply for jobs with a PDF cover letter and unique link to your resume. Track when it has been accessed and stay on top of the game.
            </p>
          </div>
        </motion.div>
        
        <div className="relative w-full max-w-4xl h-[300px] md:h-[350px] flex justify-center items-center gap-4 md:gap-8">
            <div className="w-1/3 h-full">
                <VerticalCarousel templates={column1Templates} duration={80000} />
            </div>
             <div className="w-1/3 h-full">
                <VerticalCarousel templates={column2Templates} duration={80000} reverse={true} />
            </div>
             <div className="w-1/3 h-full">
                <VerticalCarousel templates={column3Templates} duration={80000} />
            </div>
        </div>
        
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
            className="mt-12 w-full max-w-sm sm:max-w-md grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
            <Button asChild size="lg" className="text-lg font-semibold rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105">
                <Link href="/auth">
                    Log In / Sign Up
                </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg font-semibold rounded-full shadow-lg transition-transform hover:scale-105 bg-background/50">
                <Link href="/explore-templates">
                    Preview Templates
                </Link>
            </Button>
        </motion.div>

      </main>
    </div>
  );
}
