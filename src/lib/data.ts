
import type { ResumeData } from './types';

export const initialResumeData: ResumeData = {
  about: {
    name: 'Alex Doe',
    jobTitle: 'Operations Manager',
    summary: 'A passionate Operations Manager with experience in building web applications with React, Next.js, and Node.js. Eager to join a creative and challenging environment.',
    photo: 'https://placehold.co/400x400.png',
  },
  contact: {
    email: 'alex.doe@example.com',
    phone: '+1 123-456-7890',
    website: 'alexdoe.dev',
    location: 'San Francisco, CA',
  },
  experience: [
    {
      id: 'exp1',
      company: 'Tech Solutions Inc.',
      role: 'Senior Developer',
      startDate: 'Jan 2020',
      endDate: 'Present',
      description: '- Led the development of a major e-commerce platform.\n- Mentored junior developers and conducted code reviews.\n- Improved application performance by 30%.',
    },
    {
      id: 'exp2',
      company: 'Web Innovations',
      role: 'Junior Developer',
      startDate: 'Jun 2018',
      endDate: 'Dec 2019',
      description: '- Assisted in the development of client websites.\n- Wrote and maintained technical documentation.',
    },
  ],
  education: [
    {
      id: 'edu1',
      institution: 'State University',
      degree: 'B.S. in Computer Science',
      startDate: '2014',
      endDate: '2018',
      description: 'Graduated with honors. Member of the coding club.',
    },
  ],
  skills: [
    { id: 'skill1', name: 'JavaScript', level: 95 },
    { id: 'skill2', name: 'React & Next.js', level: 90 },
    { id: 'skill3', name: 'Node.js', level: 85 },
    { id: 'skill4', name: 'UI/UX Design', level: 75 },
    { id: 'skill5', name: 'Database Management', level: 80 },
  ],
  portfolio: [
    {
      id: 'port1',
      title: 'Project Alpha',
      url: 'https://github.com/project-alpha',
      description: 'An open-source project management tool.',
    },
  ],
  interests: [
    { id: 'int1', name: 'Hiking' },
    { id: 'int2', name: 'Photography' },
    { id: 'int3', name: 'Playing the guitar' },
  ],
  references: [
    {
      id: 'ref1',
      name: 'Jane Smith',
      contact: 'jane.smith@techsolutions.com',
      relation: 'Former Manager',
    },
  ],
  custom: {
    title: 'Awards',
    items: [
      {
        id: 'custom1',
        description: 'Awarded for outstanding performance in Q2 2021.',
      },
    ],
  },
  template: 'career-path',
  theme: 'original',
  coverLetter: "To Whom It May Concern,\n\nI am writing to express my keen interest in the developer position I saw advertised. With a proven track record of developing robust and scalable web applications, I am confident that I possess the skills, experience, and passion necessary to make a significant contribution to your team.\n\nMy experience at Tech Solutions Inc. involved leading a team to deliver a high-traffic e-commerce platform, where I was responsible for both front-end and back-end development. This role honed my abilities in React, Next.js, and Node.js, and gave me valuable experience in mentoring junior developers and overseeing project lifecycles.\n\nI am particularly drawn to your company's commitment to innovation and user-centric design, values that I share and have championed in my own work. I am eager to bring my technical expertise and creative problem-solving skills to a new and exciting challenge.\n\nThank you for considering my application. I have attached my interactive resume for your review and welcome the opportunity to discuss how I can benefit your organization.\n\nSincerely,\nAlex Doe",
};

export const templateThemes = {
  'career-path': [
    { id: 'forest', name: 'Forest', colors: ['#57534E', '#16A34A', '#F5F5F4'] },
    { id: 'sunrise', name: 'Sunrise', colors: ['#F97316', '#F59E0B', '#FFF7ED'] },
    { id: 'original', name: 'Slate', colors: ['#94A3B8', '#3B82F6', '#F1F5F9'] },
    { id: 'ocean', name: 'Ocean', colors: ['#475569', '#0EA5E9', '#F0F9FF'] },
    { id: 'lavender', name: 'Lavender', colors: ['#A8A29E', '#8B5CF6', '#F8FAFC'] },
  ],
  'scarlet-timeline': [
    { id: 'cobalt', name: 'Cobalt', colors: ['#2563EB', '#1E293B', '#F8FAFC'] },
    { id: 'amethyst', name: 'Amethyst', colors: ['#7E22CE', '#F3E8FF', '#2A004D'] },
    { id: 'original', name: 'Scarlet', colors: ['#A41F24', '#000000', '#F3EEE1'] },
    { id: 'emerald', name: 'Emerald', colors: ['#065F46', '#1C1917', '#F5F5F4'] },
    { id: 'goldleaf', name: 'Goldleaf', colors: ['#B45309', '#1C1917', '#FEFCE8'] },
  ],
  'typographic-grid': [
    { id: 'charcoal', name: 'Charcoal', colors: ['#FDE047', '#D6D3D1', '#262626'] },
    { id: 'blueprint', name: 'Blueprint', colors: ['#2563EB', '#93C5FD', '#EFF6FF'] },
    { id: 'original', name: 'Ink', colors: ['#000000', '#4A4A4A', '#FDFBF5'] },
    { id: 'coral', name: 'Coral', colors: ['#FF7F50', '#1E3A8A', '#E0F2FE'] },
    { id: 'rosewater', name: 'Rosewater', colors: ['#F43F5E', '#FECDD3', '#FFF1F2'] },
  ],
  'obsidian': [
    { id: 'ruby', name: 'Ruby', colors: ['#DC2626', '#1F2937', '#F3F4F6'] },
    { id: 'sapphire', name: 'Sapphire', colors: ['#2563EB', '#1E293B', '#F3F4F6'] },
    { id: 'original', name: 'Amber', colors: ['#FBBF24', '#374151', '#E5E7EB'] },
    { id: 'jade', name: 'Jade', colors: ['#14B8A6', '#F9FAFB', '#111827'] },
    { id: 'quartz', name: 'Quartz', colors: ['#EC4899', '#374151', '#FDF2F8'] },
  ],
  'muted-elegance': [
    { id: 'lavender', name: 'Lavender', colors: ['#A78BFA', '#475569', '#F1F5F9'] },
    { id: 'ocean', name: 'Ocean', colors: ['#38BDF8', '#075985', '#F0F9FF'] },
    { id: 'original', name: 'Stone', colors: ['#78716C', '#44403C', '#F5F5F4'] },
    { id: 'sage', name: 'Sage', colors: ['#4ADE80', '#27272A', '#FAFAF9'] },
    { id: 'clay', name: 'Clay', colors: ['#F97316', '#7C2D12', '#FFF7ED'] },
  ],
  'peach-pit': [
    { id: 'mint', name: 'Mint', colors: ['#6EE7B7', '#1F2937', '#F0FDF4'] },
    { id: 'sky', name: 'Sky', colors: ['#60A5FA', '#1E3A8A', '#EFF6FF'] },
    { id: 'original', name: 'Peach', colors: ['#FA8072', '#3D3D3D', '#FFF8F5'] },
    { id: 'butter', name: 'Butter', colors: ['#312E81', '#4338CA', '#FEFCE8'] },
    { id: 'lilac', name: 'Lilac', colors: ['#C084FC', '#5B21B6', '#FBF9FF'] },
  ],
  'extremely-professional': [
    { id: 'navy', name: 'Navy', colors: ['#1E3A8A', '#1E40AF', '#FEF3C7'] },
    { id: 'burgundy', name: 'Burgundy', colors: ['#881337', '#9F1239', '#FFF1F2'] },
    { id: 'original', name: 'Slate', colors: ['#475569', '#1E293B', '#F8FAFC'] },
    { id: 'graphite', name: 'Graphite', colors: ['#14B8A6', '#F9FAFB', '#171717'] },
    { id: 'olive', name: 'Olive', colors: ['#3F6212', '#4D7C0F', '#F7FEE7'] },
  ],
};
