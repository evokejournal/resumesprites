import { z } from 'zod';

// Base schemas for common fields
const emailSchema = z.string().email('Invalid email address');
const phoneSchema = z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number');
const urlSchema = z.string().url('Invalid URL').optional().or(z.literal(''));
const dateSchema = z.string().regex(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}$|^Present$/, 'Invalid date format (e.g., "Jan 2020" or "Present")');

// About section validation
export const aboutSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').trim(),
  jobTitle: z.string().min(1, 'Job title is required').max(100, 'Job title too long').trim(),
  summary: z.string().max(1000, 'Summary too long').trim(),
  photo: z.string().optional(), // Data URL for profile photo
});

// Contact section validation
export const contactSchema = z.object({
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal('')),
  website: urlSchema,
  location: z.string().max(100, 'Location too long').trim(),
});

// Experience item validation
export const experienceItemSchema = z.object({
  id: z.string().optional(),
  company: z.string().min(1, 'Company name is required').max(100, 'Company name too long').trim(),
  role: z.string().min(1, 'Role is required').max(100, 'Role too long').trim(),
  startDate: dateSchema,
  endDate: dateSchema,
  description: z.string().max(2000, 'Description too long').trim(),
});

// Education item validation
export const educationItemSchema = z.object({
  id: z.string().optional(),
  institution: z.string().min(1, 'Institution name is required').max(100, 'Institution name too long').trim(),
  degree: z.string().min(1, 'Degree is required').max(100, 'Degree too long').trim(),
  startDate: dateSchema,
  endDate: dateSchema,
  description: z.string().max(1000, 'Description too long').trim(),
});

// Skill item validation
export const skillItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Skill name is required').max(50, 'Skill name too long').trim(),
  level: z.number().min(0, 'Level must be 0-100').max(100, 'Level must be 0-100'),
});

// Portfolio item validation
export const portfolioItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Project title is required').max(100, 'Project title too long').trim(),
  url: urlSchema,
  description: z.string().max(500, 'Description too long').trim(),
});

// Reference item validation
export const referenceItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Reference name is required').max(100, 'Reference name too long').trim(),
  role: z.string().min(1, 'Reference role is required').max(100, 'Reference role too long').trim(),
  company: z.string().min(1, 'Company name is required').max(100, 'Company name too long').trim(),
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal('')),
});

// Custom section validation
export const customItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Item title is required').max(100, 'Item title too long').trim(),
  description: z.string().max(1000, 'Description too long').trim(),
});

export const customSectionSchema = z.object({
  title: z.string().min(1, 'Section title is required').max(100, 'Section title too long').trim(),
  items: z.array(customItemSchema).max(20, 'Too many custom items'),
});

// Complete resume data validation
export const resumeDataSchema = z.object({
  about: aboutSchema,
  contact: contactSchema,
  experience: z.array(experienceItemSchema).max(20, 'Too many experience items'),
  education: z.array(educationItemSchema).max(10, 'Too many education items'),
  skills: z.array(skillItemSchema).max(50, 'Too many skills'),
  portfolio: z.array(portfolioItemSchema).max(20, 'Too many portfolio items'),
  references: z.array(referenceItemSchema).max(10, 'Too many references'),
  custom: customSectionSchema.optional(),
  template: z.string().min(1, 'Template is required').max(50, 'Template name too long'),
  coverLetter: z.string().max(5000, 'Cover letter too long').trim(),
});

// API request validation schemas
export const createResumeSchema = z.object({
  resumeData: resumeDataSchema,
});

export const updateResumeSchema = z.object({
  id: z.string().min(1, 'Resume ID is required'),
  resumeData: resumeDataSchema.partial(), // Allow partial updates
});

export const deleteResumeSchema = z.object({
  id: z.string().min(1, 'Resume ID is required'),
});

export const getResumeSchema = z.object({
  userId: z.string().optional(),
  id: z.string().optional(),
}).refine(data => data.userId || data.id, {
  message: 'Either userId or id must be provided',
});

// Link generation validation
export const generateLinkSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters').max(50, 'Password too long'),
  templateOverride: z.string().optional(),
});

// PDF generation validation
export const pdfGenerationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  occupation: z.string().min(1, 'Occupation is required').max(100, 'Occupation too long'),
  company: z.string().max(100, 'Company name too long').optional(),
  address: z.string().max(200, 'Address too long').optional(),
  content: z.string().min(1, 'Content is required').max(10000, 'Content too long'),
  templateId: z.string().min(1, 'Template ID is required'),
  resumeUrl: z.string().url('Invalid resume URL'),
  password: z.string().min(1, 'Password is required'),
});

// File upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File).refine(
    file => file.size <= 5 * 1024 * 1024, // 5MB
    'File size must be less than 5MB'
  ).refine(
    file => ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(file.type),
    'Invalid file type. Allowed: images, PDF, DOC, DOCX, TXT'
  ),
});

// Authentication validation
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one number'
  ),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Search and filter validation
export const searchSchema = z.object({
  query: z.string().max(100, 'Search query too long').optional(),
  template: z.string().max(50, 'Template name too long').optional(),
  limit: z.number().min(1).max(100).optional().default(20),
  offset: z.number().min(0).optional().default(0),
});

// Utility function to sanitize and validate data
export function sanitizeAndValidate<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

// Utility function to validate with custom error handling
export function validateWithErrors<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { 
      success: false, 
      errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
    };
  }
} 