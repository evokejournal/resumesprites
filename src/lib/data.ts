
import type { ResumeData } from './types';

export const initialResumeData: ResumeData = {
  about: {
    name: '',
    jobTitle: '',
    summary: '',
    photo: '',
  },
  contact: {
    email: '',
    phone: '',
    website: '',
    location: '',
  },
  experience: [],
  education: [],
  skills: [],
  portfolio: [],
  interests: [],
  references: [],
  custom: {
    title: '',
    items: [],
  },
  template: '',
  coverLetter: '',
};

// Placeholder data for template previews (unauthenticated users)
export const previewResumeData: ResumeData = {
  about: {
    name: 'Alex Johnson',
    jobTitle: 'Senior Software Engineer',
    summary: 'Passionate full-stack developer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies. Proven track record of leading development teams and delivering high-impact projects.',
    photo: '',
  },
  contact: {
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    website: 'alexjohnson.dev',
    location: 'San Francisco, CA',
  },
  experience: [
    {
      id: '1',
      company: 'TechCorp Inc.',
      role: 'Senior Software Engineer',
      startDate: '2022-01',
      endDate: 'Present',
      description: 'Lead development of microservices architecture serving 1M+ users. Implemented CI/CD pipelines reducing deployment time by 60%. Mentored 3 junior developers and conducted code reviews.',
    },
    {
      id: '2',
      company: 'StartupXYZ',
      role: 'Full Stack Developer',
      startDate: '2020-03',
      endDate: '2021-12',
      description: 'Built and maintained React/Node.js applications. Collaborated with design team to implement responsive UI components. Optimized database queries improving performance by 40%.',
    },
    {
      id: '3',
      company: 'Digital Solutions',
      role: 'Frontend Developer',
      startDate: '2019-06',
      endDate: '2020-02',
      description: 'Developed user interfaces using React and TypeScript. Worked with REST APIs and implemented state management with Redux. Participated in agile development process.',
    },
  ],
  education: [
    {
      id: '1',
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science in Computer Science',
      startDate: '2015-09',
      endDate: '2019-05',
      description: 'Graduated with honors. Relevant coursework: Data Structures, Algorithms, Software Engineering, Database Systems.',
    },
    {
      id: '2',
      institution: 'Stanford Online',
      degree: 'Machine Learning Specialization',
      startDate: '2021-01',
      endDate: '2021-06',
      description: 'Completed 5-course specialization covering machine learning fundamentals and practical applications.',
    },
  ],
  skills: [
    { id: '1', name: 'JavaScript/TypeScript', level: 95 },
    { id: '2', name: 'React & Next.js', level: 90 },
    { id: '3', name: 'Node.js & Express', level: 85 },
    { id: '4', name: 'Python', level: 80 },
    { id: '5', name: 'PostgreSQL & MongoDB', level: 85 },
    { id: '6', name: 'AWS & Docker', level: 75 },
    { id: '7', name: 'Git & CI/CD', level: 90 },
    { id: '8', name: 'REST APIs & GraphQL', level: 85 },
  ],
  portfolio: [
    {
      id: '1',
      title: 'E-Commerce Platform',
      url: 'https://github.com/alexjohnson/ecommerce',
      description: 'Full-stack e-commerce solution with React frontend, Node.js backend, and Stripe payment integration.',
    },
    {
      id: '2',
      title: 'Task Management App',
      url: 'https://github.com/alexjohnson/taskmanager',
      description: 'Real-time collaborative task management application with WebSocket integration and real-time updates.',
    },
    {
      id: '3',
      title: 'Weather Dashboard',
      url: 'https://github.com/alexjohnson/weather-app',
      description: 'React-based weather application with location-based forecasts and interactive charts.',
    },
  ],
  interests: [
    { id: '1', name: 'Open Source Contribution' },
    { id: '2', name: 'Machine Learning' },
    { id: '3', name: 'Hiking & Photography' },
    { id: '4', name: 'Tech Blogging' },
  ],
  references: [
    {
      id: '1',
      name: 'Sarah Chen',
      contact: 'sarah.chen@techcorp.com',
      relation: 'Engineering Manager at TechCorp Inc.',
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      contact: 'michael@startupxyz.com',
      relation: 'CTO at StartupXYZ',
    },
    {
      id: '3',
      name: 'Dr. Emily Watson',
      contact: 'ewatson@berkeley.edu',
      relation: 'Professor, UC Berkeley',
    },
  ],
  custom: {
    title: 'Certifications',
    items: [
      { id: '1', description: 'AWS Certified Solutions Architect' },
      { id: '2', description: 'Google Cloud Professional Developer' },
      { id: '3', description: 'Certified Scrum Master (CSM)' },
    ],
  },
  template: '',
  coverLetter: 'Dear Hiring Manager,\n\nI am excited to apply for the Senior Software Engineer position at your company. With over 5 years of experience in full-stack development and a proven track record of delivering high-impact projects, I am confident in my ability to contribute significantly to your team.\n\nMy experience includes leading development teams, implementing scalable architectures, and mentoring junior developers. I am passionate about clean code, performance optimization, and staying current with emerging technologies.\n\nI would welcome the opportunity to discuss how my skills and experience align with your team\'s needs.\n\nBest regards,\nAlex Johnson',
};
