"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { templates } from '@/lib/templates';
import { templateComponentMap } from '@/lib/templates';
import { Button } from '@/components/ui/button';

// Sample resume data for all templates
const sampleResumeData = {
  about: {
    name: "Alex Johnson",
    jobTitle: "Senior Full Stack Developer",
    summary: "Passionate developer with 8+ years of experience building scalable web applications and leading engineering teams.",
    photo: ""
  },
  contact: {
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    website: "alexjohnson.dev",
    location: "San Francisco, CA"
  },
  experience: [
    {
      id: "1",
      company: "TechCorp Inc.",
      role: "Senior Full Stack Developer",
      startDate: "2022-01",
      endDate: "Present",
      description: "Lead development of microservices architecture, mentored junior developers, and improved system performance by 40%."
    },
    {
      id: "2", 
      company: "StartupXYZ",
      role: "Full Stack Developer",
      startDate: "2020-03",
      endDate: "2021-12",
      description: "Built and deployed 15+ features, reduced bug reports by 60%, and implemented CI/CD pipeline."
    }
  ],
  education: [
    {
      id: "1",
      institution: "Stanford University",
      degree: "Bachelor of Science in Computer Science",
      startDate: "2016-09",
      endDate: "2020-05",
      description: "Graduated with honors. Specialized in software engineering and web development."
    }
  ],
  skills: [
    { id: "1", name: "React", level: 95 },
    { id: "2", name: "Node.js", level: 90 },
    { id: "3", name: "TypeScript", level: 88 },
    { id: "4", name: "Python", level: 85 },
    { id: "5", name: "AWS", level: 80 }
  ],
  portfolio: [
    {
      id: "1",
      title: "E-commerce Platform",
      url: "https://example.com/project1",
      description: "Full-stack e-commerce solution with 10k+ users"
    }
  ],
  interests: [
    { id: "1", name: "Open Source" },
    { id: "2", name: "Machine Learning" },
    { id: "3", name: "Blockchain" }
  ],
  references: [
    {
      id: "1",
      name: "Sarah Chen",
      contact: "sarah.chen@techcorp.com",
      relation: "Engineering Manager"
    }
  ],
  custom: {
    title: "Additional Projects",
    items: [
      { id: "1", description: "Built a real-time chat application with WebSocket" },
      { id: "2", description: "Developed a mobile app with React Native" }
    ]
  },
  template: "youble"
};

export default function ShowcasePageClient() {
  const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  const [showTemplateName, setShowTemplateName] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const currentTemplate = templates[currentTemplateIndex];
  const TemplateComponent = templateComponentMap[currentTemplate.id];

  // Check if site is locked (from URL params or environment)
  const isSiteLocked = typeof window !== 'undefined' 
    ? new URLSearchParams(window.location.search).get('locked') === 'true' 
    : process.env.NEXT_PUBLIC_SITE_LOCKED === 'true';

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        handleNextTemplate();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Handle next template
  const handleNextTemplate = () => {
    // Show template name
    setShowTemplateName(true);
    
    // Update template index immediately
    setCurrentTemplateIndex((prev) => (prev + 1) % templates.length);
    
    // Hide template name after 2.8 seconds (allows for animation completion)
    setTimeout(() => {
      setShowTemplateName(false);
    }, 2800);
  };

  // Initial load sequence
  useEffect(() => {
    if (isInitialLoad) {
      // Extended initial display for first load
      setTimeout(() => {
        setShowTemplateName(false);
        setIsInitialLoad(false);
      }, 3500);
    }
  }, [isInitialLoad]);

  return (
    <div className="fixed inset-0 bg-black overflow-auto">
      {/* Black Screen Overlay - Linked to Template Name */}
      <motion.div
        className="fixed inset-0 bg-black z-40 pointer-events-none"
        animate={{ 
          opacity: showTemplateName ? 1 : 0 
        }}
        transition={{ 
          duration: 0.3,
          ease: "easeInOut"
        }}
      />

      {/* Large Template Name Animation */}
      <AnimatePresence mode="wait">
        {showTemplateName && (
          <motion.div
            key={`name-${currentTemplate.id}`}
            initial={{ opacity: 0, scale: 0.3, rotateY: -90, x: -200 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0, x: 0 }}
            exit={{ opacity: 0, scale: 1.3, rotateY: 90, x: 200 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.25, 0.46, 0.45, 0.94],
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
            className="fixed inset-0 flex items-center justify-center z-50"
          >
            <div className="text-center">
              <motion.div
                initial={{ y: 30, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  type: "spring",
                  stiffness: 400,
                  damping: 15
                }}
                className="relative inline-block"
              >
                {/* Angular background */}
                <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white px-12 py-8 transform -skew-x-12 shadow-2xl border-4 border-white rounded-lg">
                  <div className="transform skew-x-12">
                    <h1 
                      className="text-6xl md:text-7xl font-bold tracking-wider"
                      style={{
                        textShadow: '0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      {currentTemplate.name}
                    </h1>
                  </div>
                </div>
                
                {/* Angular cut-off effect */}
                <div className="absolute -top-5 -right-5 w-10 h-10 bg-black transform rotate-45 border-4 border-white"></div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Template Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTemplate.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="w-full h-full relative"
          style={{ 
            opacity: showTemplateName ? 0 : 1
          }}
        >
          {/* Template Component */}
          <div className="w-full h-full">
            <TemplateComponent data={sampleResumeData} pdfMode={false} showcaseMode={true} />
          </div>
        </motion.div>
      </AnimatePresence>


    </div>
  );
} 