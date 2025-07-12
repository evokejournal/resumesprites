'use server';
/**
 * @fileOverview An AI flow to parse a resume file and extract structured data.
 *
 * - parseResume - A function that handles parsing a resume file.
 * - ParseResumeInput - The input type for the parseResume function.
 * - ParseResumeOutput - The return type for the parseResume function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Schemas for individual resume sections
const AboutMeSchema = z.object({
  name: z.string().describe('The full name of the person.'),
  jobTitle: z.string().describe('The professional job title, like "Software Engineer".'),
  summary: z.string().describe('A professional summary or objective statement.'),
}).partial();

const ContactInfoSchema = z.object({
  email: z.string().describe('The email address.'),
  phone: z.string().describe('The phone number.'),
  website: z.string().describe('A personal website or portfolio URL.'),
  location: z.string().describe('The city and state, e.g., "San Francisco, CA".'),
}).partial();

const ExperienceSchema = z.object({
  company: z.string().describe('The name of the company.'),
  role: z.string().describe('The job title or role at the company.'),
  startDate: z.string().describe('The start date of employment (e.g., "Jan 2020").'),
  endDate: z.string().describe('The end date of employment (e.g., "Present").'),
  description: z.string().describe('A description of responsibilities and achievements in bullet points.'),
});

const EducationSchema = z.object({
  institution: z.string().describe('The name of the educational institution.'),
  degree: z.string().describe('The degree or field of study.'),
  startDate: z.string().describe('The start date of education.'),
  endDate: z.string().describe('The end date or graduation date.'),
  description: z.string().describe('Any honors, clubs, or relevant notes.'),
});

const SkillSchema = z.object({
  name: z.string().describe('The name of the skill, e.g., "JavaScript".'),
  level: z.number().min(0).max(100).describe('A proficiency level from 0 to 100, estimated based on context (e.g., "expert" is 95, "proficient" is 80, listed without detail is 50).'),
});

const PortfolioItemSchema = z.object({
  title: z.string().describe('The title of the portfolio project.'),
  url: z.string().describe('The URL to the project.'),
  description: z.string().describe('A brief description of the project.'),
});

const ReferenceSchema = z.object({
  name: z.string().describe("The reference's full name."),
  contact: z.string().describe("The reference's contact information (email or phone)."),
  relation: z.string().describe("The reference's professional relationship to the candidate."),
});

const CustomItemSchema = z.object({
  description: z.string().describe('A single item or entry in a custom section.'),
});

const CustomSectionSchema = z.object({
  title: z.string().describe('The title for a custom section that is not standard, like "Awards" or "Certifications".'),
  items: z.array(CustomItemSchema).describe('A list of items for the custom section.'),
});


// Main I/O Schemas for the flow
const ParseResumeInputSchema = z.object({
  resumeFileUri: z
    .string()
    .describe(
      "The resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ParseResumeInput = z.infer<typeof ParseResumeInputSchema>;

const ParseResumeOutputSchema = z.object({
  about: AboutMeSchema.optional(),
  contact: ContactInfoSchema.optional(),
  experience: z.array(ExperienceSchema).optional().describe('A list of professional experiences.'),
  education: z.array(EducationSchema).optional().describe('A list of educational qualifications.'),
  skills: z.array(SkillSchema).optional().describe('A list of skills.'),
  portfolio: z.array(PortfolioItemSchema).optional().describe('A list of portfolio projects.'),
  references: z.array(ReferenceSchema).optional().describe('A list of professional references.'),
  custom: CustomSectionSchema.optional().describe('A custom section for content that does not fit elsewhere.'),
  coverLetter: z.string().optional().describe("If a cover letter is included in the file, extract its full text here."),
}).describe("The parsed and structured data from the user's resume.");
export type ParseResumeOutput = z.infer<typeof ParseResumeOutputSchema>;


// The exported function that the client will call
export async function parseResume(input: ParseResumeInput): Promise<ParseResumeOutput> {
  return parseResumeFlow(input);
}


// Genkit Prompt
const resumeParserPrompt = ai.definePrompt({
    name: 'resumeParserPrompt',
    input: { schema: ParseResumeInputSchema },
    output: { schema: ParseResumeOutputSchema },
    prompt: `You are an expert resume parsing agent. Your task is to analyze the provided resume file and extract the information into a structured JSON format.

Pay close attention to the descriptions in the output schema to format the data correctly.
- For skills, estimate a proficiency level from 0-100.
- For experience and custom sections, preserve formatting like bullet points using markdown (-).
- If a section is not present in the resume text, omit it from the output.
- If you find a cover letter, extract its full text into the 'coverLetter' field.
- Identify any section that doesn't fit standard categories (like 'Awards', 'Certifications', 'Volunteering') and place it in the 'custom' section.

Resume File to Parse:
{{media url=resumeFileUri}}
`,
});

// Genkit Flow
const parseResumeFlow = ai.defineFlow(
  {
    name: 'parseResumeFlow',
    inputSchema: ParseResumeInputSchema,
    outputSchema: ParseResumeOutputSchema,
  },
  async (input) => {
    const { output } = await resumeParserPrompt(input);
    if (!output) {
      throw new Error("AI failed to return a valid structured response.");
    }
    return output;
  }
);
