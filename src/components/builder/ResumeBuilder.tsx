"use client";

import React, { useState } from "react";
import { AboutForm } from "@/components/builder/AboutForm";
import { ContactForm } from "@/components/builder/ContactForm";
import { ExperienceForm } from "@/components/builder/EmploymentForm";
import { EducationForm } from "@/components/builder/EducationForm";
import { SkillsForm } from "@/components/builder/SkillsForm";
import { PortfolioForm } from "@/components/builder/PortfolioForm";
import { ReferencesForm } from "@/components/builder/ReferencesForm";
import { CustomForm } from "@/components/builder/CustomForm";
import { CoverLetterForm } from "@/components/builder/CoverLetterForm";
import { ResumeImportForm } from "@/components/builder/ResumeImportForm";
import { User, Briefcase, GraduationCap, Star, FolderGit2, Heart, Users, AtSign, FileText as CoverLetterIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

export function ResumeBuilder() {
  const [activeTab, setActiveTab] = useState('about');

  const tabs = [
    { value: 'about', label: 'About Me', icon: User, component: <AboutForm /> },
    { value: 'contact', label: 'Contact', icon: AtSign, component: <ContactForm /> },
    { value: 'experience', label: 'Experience', icon: Briefcase, component: <ExperienceForm /> },
    { value: 'education', label: 'Education', icon: GraduationCap, component: <EducationForm /> },
    { value: 'skills', label: 'Skills', icon: Star, component: <SkillsForm /> },
    { value: 'portfolio', label: 'Portfolio', icon: FolderGit2, component: <PortfolioForm /> },
    { value: 'custom', label: 'Custom', icon: Heart, component: <CustomForm /> },
    { value: 'references', label: 'References', icon: Users, component: <ReferencesForm /> },
    { value: 'coverLetter', label: 'Cover Letter', icon: CoverLetterIcon, component: <CoverLetterForm /> },
  ];

  const activeComponent = tabs.find(tab => tab.value === activeTab)?.component;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">Resume Builder</h1>
        <p className="text-muted-foreground">Fill in your details to create a professional, interactive resume.</p>
      </div>
      
      <div className="mb-8">
          <ResumeImportForm />
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-48">
          <nav className="flex flex-col space-y-1">
            {tabs.map((tab) => (
              <Button
                key={tab.value}
                variant={activeTab === tab.value ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => setActiveTab(tab.value)}
              >
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.label}
              </Button>
            ))}
          </nav>
        </aside>
        <main className="flex-1">
          {activeComponent}
        </main>
      </div>
    </div>
  );
} 