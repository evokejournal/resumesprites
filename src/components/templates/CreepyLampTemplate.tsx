
'use client';

import React, { useState, useEffect } from 'react';
import type { ResumeData } from '@/lib/types';
import { motion, useMotionValue, animate, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TemplateProps {
  data: ResumeData;
}

const Section = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
  <section className={cn("mb-6", className)}>
    <h2 className="text-xl font-bold font-serif mb-2 text-yellow-100/90">{title}</h2>
    <div className="text-sm text-yellow-50/70 space-y-3">{children}</div>
  </section>
);

export function CreepyLampTemplate({ data }: TemplateProps) {
  const [isLampOn, setIsLampOn] = useState(false);
  const { about, contact, experience, education, skills, portfolio, custom } = data;

  const flickerStrength = useMotionValue(0);

  // The light cone's opacity is based on the flicker strength.
  const lightConeOpacity = useTransform(flickerStrength, [0, 1], [0.15, 1]); // Dim base light
  // The text opacity also flickers, but stays more visible than the light cone.
  const textOpacity = useTransform(flickerStrength, [0, 0.5, 1], [0, 0.6, 1]); // Text is invisible when lamp is off

  useEffect(() => {
    let animationControls: ReturnType<typeof animate>[] = [];
    let timeouts: NodeJS.Timeout[] = [];

    const stopAll = () => {
      timeouts.forEach(clearTimeout);
      animationControls.forEach(c => c.stop());
      timeouts = [];
      animationControls = [];
    };

    const flickerSequence = () => {
      const flickerCount = Math.floor(Math.random() * 5) + 3; // A burst of 3-7 flickers
      let i = 0;

      function nextFlicker() {
        if (i >= flickerCount) {
          // Flicker burst is over, return to a stable "on" state
          const stableAnim = animate(flickerStrength, 1, { duration: 0.2 });
          animationControls.push(stableAnim);

          // Schedule the next flicker burst after a random stable period
          const stableTimeout = setTimeout(flickerSequence, Math.random() * 3000 + 1000); // 1-4 seconds
          timeouts.push(stableTimeout);
          return;
        }
        
        const targetStrength = Math.random() * 0.5 + 0.5; // Flicker between 50% and 100% strength, never fully off
        const duration = Math.random() * 0.1 + 0.05; // Each flicker is quick
        
        const anim = animate(flickerStrength, targetStrength, {
          duration,
          ease: "linear",
          onComplete: () => {
            i++;
            nextFlicker();
          }
        });
        animationControls.push(anim);
      }
      nextFlicker();
    };

    if (isLampOn) {
      stopAll();
      // Animate from off to a fully on state first
      const turnOnAnim = animate(flickerStrength, 1, {
        duration: 0.5,
        ease: "easeOut",
        onComplete: () => {
          // After it's on, start the random stable/flicker loop
          const initialStableTimeout = setTimeout(flickerSequence, Math.random() * 3000 + 1000); // 1-4 seconds
          timeouts.push(initialStableTimeout);
        },
      });
      animationControls.push(turnOnAnim);
    } else {
      stopAll();
      // Animate from on to a fully off state
      const turnOffAnim = animate(flickerStrength, 0, {
        duration: 0.3,
        ease: "easeOut",
      });
      animationControls.push(turnOffAnim);
    }
    
    // Cleanup function to stop all animations and timeouts when the component unmounts or `isLampOn` changes
    return stopAll;
  }, [isLampOn, flickerStrength]);

  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-hidden relative isolate">
      {/* Light Source with flickering opacity */}
      <motion.div
        style={{ opacity: lightConeOpacity }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[200vw] h-[200vh] bg-[radial-gradient(ellipse_at_top,rgba(255,229,180,0.35)_0%,rgba(0,0,0,0)_50%)] pointer-events-none"
      />
      
      {/* Lamp Fixture */}
      <button
        onClick={() => setIsLampOn(!isLampOn)}
        className="absolute top-0 left-1/2 -translate-x-1/2 z-20 group"
        aria-label={isLampOn ? "Turn lamp off" : "Turn lamp on"}
      >
        <motion.div
            animate={{ rotate: [-0.5, 0.5, -0.5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="origin-top"
          >
              <div className="flex flex-col items-center">
                   {/* Cord */}
                  <div className="w-1 h-8 bg-gray-600"></div>
                  {/* Socket */}
                  <div className="w-8 h-6 bg-gray-700 border-b-2 border-gray-600"></div>
                  {/* Shade */}
                  <div className="relative w-48 h-24 bg-gray-800 border-b-8 border-yellow-600 group-hover:bg-gray-700 transition-colors"
                    style={{ clipPath: 'polygon(15% 0, 85% 0, 100% 100%, 0% 100%)' }}
                  >
                  </div>
              </div>
          </motion.div>
      </button>

      {/* Resume Content with flickering opacity */}
      <motion.main
        style={{ opacity: textOpacity }}
        className="pt-52 pb-20 max-w-2xl mx-auto px-4"
      >
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-yellow-100">{about.name}</h1>
          <p className="text-lg text-yellow-200/70">{about.jobTitle}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <aside className="md:col-span-1 space-y-6">
            <Section title="Contact">
                <p>{contact.email}</p>
                <p>{contact.phone}</p>
                <a href={contact.website} className="hover:underline">{contact.website}</a>
            </Section>
            <Section title="Skills">
              <ul className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <li key={skill.id} className="bg-yellow-900/50 text-yellow-200 px-2 py-0.5 rounded text-xs">{skill.name}</li>
                ))}
              </ul>
            </Section>
             {education.length > 0 && (
                <Section title="Education">
                    {education.map(edu => (
                        <div key={edu.id}>
                            <h4 className="font-bold">{edu.degree}</h4>
                            <p className="text-xs">{edu.institution}</p>
                        </div>
                    ))}
                </Section>
            )}
          </aside>
          <div className="md:col-span-2 space-y-6">
            <Section title="Summary">
              <p className="whitespace-pre-line">{about.summary}</p>
            </Section>
            {experience.length > 0 && (
              <Section title="Experience">
                {experience.map(job => (
                  <div key={job.id}>
                    <h3 className="font-bold">{job.role} at {job.company}</h3>
                    <p className="text-xs text-yellow-200/50 mb-1">{job.startDate} - {job.endDate}</p>
                    <p className="whitespace-pre-line text-xs">{job.description}</p>
                  </div>
                ))}
              </Section>
            )}
             {custom.items.length > 0 && custom.title && (
                <Section title={custom.title}>
                     <ul className="list-disc list-inside">
                        {custom.items.map(item => <li key={item.id}>{item.description}</li>)}
                     </ul>
                </Section>
            )}
          </div>
        </div>
      </motion.main>
    </div>
  );
}
