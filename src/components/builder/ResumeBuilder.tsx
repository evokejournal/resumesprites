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
import { useResume } from '@/context/ResumeContext';
import { useToast } from "@/hooks/use-toast";

export function ResumeBuilder() {
  const [activeTab, setActiveTab] = useState('coverLetter');
  const { setResumeData } = useResume();
  const { toast } = useToast();

  const generateTestData = () => {
    setResumeData({
      about: {
        name: 'Jordan Smith',
        jobTitle: 'Product Designer',
        summary: 'Creative and detail-oriented Product Designer with 7+ years of experience designing delightful user experiences for SaaS and mobile apps.',
        photo: '',
      },
      contact: {
        email: 'jordan.smith@email.com',
        phone: '+1 555-123-4567',
        website: 'jordansmith.design',
        location: 'New York, NY',
      },
      experience: [
        {
          id: 'exp1',
          company: 'Pixel Labs',
          role: 'Lead Product Designer',
          startDate: 'Feb 2021',
          endDate: 'Present',
          description: '- Led design for a B2B SaaS platform used by 10,000+ companies.\n- Mentored a team of 4 designers.\n- Improved onboarding conversion by 22%.',
        },
        {
          id: 'exp2',
          company: 'Appify',
          role: 'UX/UI Designer',
          startDate: 'Jan 2018',
          endDate: 'Jan 2021',
          description: '- Designed mobile apps for fintech and health startups.\n- Conducted user research and usability testing.\n- Collaborated with engineers and PMs.',
        },
        {
          id: 'exp3',
          company: 'Freelance',
          role: 'Designer & Illustrator',
          startDate: '2016',
          endDate: '2018',
          description: '- Created branding and web design for small businesses.\n- Illustrated icons and infographics.\n- Managed client relationships.',
        },
      ],
      education: [
        {
          id: 'edu1',
          institution: 'Parsons School of Design',
          degree: 'BFA in Communication Design',
          startDate: '2012',
          endDate: '2016',
          description: 'Graduated with honors. President of the Design Club.',
        },
        {
          id: 'edu2',
          institution: 'Coursera',
          degree: 'UX Research Certificate',
          startDate: '2019',
          endDate: '2019',
          description: 'Completed a 6-month intensive UX research program.',
        },
        {
          id: 'edu3',
          institution: 'General Assembly',
          degree: 'Front-End Web Development',
          startDate: '2017',
          endDate: '2017',
          description: 'Built and deployed 3 web apps as capstone projects.',
        },
      ],
      skills: [
        { id: 'skill1', name: 'Figma', level: 95 },
        { id: 'skill2', name: 'User Research', level: 90 },
        { id: 'skill3', name: 'Prototyping', level: 88 },
        { id: 'skill4', name: 'HTML/CSS', level: 80 },
        { id: 'skill5', name: 'Illustration', level: 75 },
      ],
      portfolio: [
        {
          id: 'port1',
          title: 'SaaS Dashboard Redesign',
          url: 'https://jordansmith.design/saas-dashboard',
          description: 'A complete redesign of a SaaS analytics dashboard for improved usability and aesthetics.',
        },
        {
          id: 'port2',
          title: 'Health App UI Kit',
          url: 'https://jordansmith.design/health-ui-kit',
          description: 'A UI kit for a mobile health tracking app, including 30+ screens and components.',
        },
        {
          id: 'port3',
          title: 'Branding for Local Cafe',
          url: 'https://jordansmith.design/cafe-branding',
          description: 'Logo, menu, and website design for a boutique coffee shop.',
        },
      ],
      interests: [
        { id: 'int1', name: 'Photography' },
        { id: 'int2', name: 'Cycling' },
        { id: 'int3', name: 'Travel' },
      ],
      references: [
        {
          id: 'ref1',
          name: 'Taylor Lee',
          contact: 'taylor.lee@pixellabs.com',
          relation: 'Manager',
        },
        {
          id: 'ref2',
          name: 'Morgan Patel',
          contact: 'morgan.patel@appify.com',
          relation: 'Colleague',
        },
        {
          id: 'ref3',
          name: 'Jamie Chen',
          contact: 'jamie.chen@freelance.com',
          relation: 'Client',
        },
      ],
      custom: {
        title: 'Awards',
        items: [
          { id: 'custom1', description: 'Winner, Best UX Design, SaaS Awards 2022' },
          { id: 'custom2', description: 'Speaker, NYC Design Conference 2021' },
          { id: 'custom3', description: 'Finalist, Adobe Design Jam 2020' },
        ],
      },
      template: '',
      coverLetter: `Dear Hiring Manager,\n\nI am excited to apply for the Product Designer position at your company. My experience leading design for SaaS platforms and my passion for user-centered design make me a strong fit for your team.\n\nAt Pixel Labs, I led a team to redesign our flagship product, resulting in a 22% increase in onboarding conversion. I thrive on collaboration and love turning complex problems into elegant solutions.\n\nI look forward to the opportunity to contribute to your mission.\n\nBest regards,\nJordan Smith`,
    });
    
    toast({
      title: "Test data generated!",
      description: "Sample resume data has been loaded and will be saved automatically.",
    });
  };

  const clearResumeData = () => {
    setResumeData({
      about: { name: '', jobTitle: '', summary: '', photo: '' },
      contact: { email: '', phone: '', website: '', location: '' },
      experience: [],
      education: [],
      skills: [],
      portfolio: [],
      interests: [],
      references: [],
      custom: { title: '', items: [] },
      template: '',
      coverLetter: '',
    });
    
    toast({
      title: "Data cleared!",
      description: "All resume data has been cleared and will be saved automatically.",
    });
  };

  const tabs = [
    { value: 'coverLetter', label: 'Cover Letter', icon: CoverLetterIcon, component: <CoverLetterForm /> },
    { value: 'about', label: 'About Me', icon: User, component: <AboutForm /> },
    { value: 'contact', label: 'Contact', icon: AtSign, component: <ContactForm /> },
    { value: 'experience', label: 'Experience', icon: Briefcase, component: <ExperienceForm /> },
    { value: 'education', label: 'Education', icon: GraduationCap, component: <EducationForm /> },
    { value: 'skills', label: 'Skills', icon: Star, component: <SkillsForm /> },
    { value: 'portfolio', label: 'Portfolio', icon: FolderGit2, component: <PortfolioForm /> },
    { value: 'custom', label: 'Custom', icon: Heart, component: <CustomForm /> },
    { value: 'references', label: 'References', icon: Users, component: <ReferencesForm /> },
  ];

  const activeTabObj = tabs.find(tab => tab.value === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline font-bold">Resume Builder</h1>
          <p className="text-muted-foreground">Fill in your details to create a professional, interactive resume.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={generateTestData}>Generate Test Information</Button>
          <Button variant="destructive" onClick={clearResumeData}>Clear Resume Data</Button>
        </div>
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
          {/* Add extra padding/margin if Cover Letter is active */}
          <div className={activeTab === 'coverLetter' ? 'p-8 mb-8 bg-background rounded-xl border shadow-sm' : ''}>
            {activeTabObj?.component}
          </div>
        </main>
      </div>
    </div>
  );
} 