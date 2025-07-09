
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
