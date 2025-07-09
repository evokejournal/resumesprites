
export interface AboutMe {
  name: string;
  jobTitle: string;
  summary: string;
  photo: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  website: string;
  location: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate:string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 0-100
}

export interface PortfolioItem {
  id: string;
  title: string;
  url: string;
  description: string;
}

export interface Interest {
  id: string;
  name: string;
}

export interface Reference {
  id: string;
  name: string;
  contact: string;
  relation: string;
}

export interface CustomItem {
  id: string;
  description: string;
}

export interface CustomSection {
  title: string;
  items: CustomItem[];
}

export interface ResumeView {
  timestamp: string;
  ip?: string;
  userAgent?: string;
}

export interface GeneratedLink {
  id: string;
  shortId: string;
  password: string;
  resumeDataSnapshot: ResumeData;
  templateSnapshot: string;
  createdAt: string;
  views: ResumeView[];
  lastViewed?: string;
  userId: string;
}

export interface ResumeData {
  about: AboutMe;
  contact: ContactInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  portfolio: PortfolioItem[];
  interests: Interest[];
  references: Reference[];
  custom: CustomSection;
  template: string;
  coverLetter?: string;
}
