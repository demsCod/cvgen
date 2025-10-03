export type LanguageCode = 'fr' | 'en';

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  achievements: string[];
  technologies: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  impact?: string;
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  summary?: string;
  experiences: Experience[];
  skills: string[];
  education: Education[];
  projects: Project[];
  languages: { label: string; level: string }[];
}

export interface JobOffer {
  id: string;
  title: string;
  company?: string;
  description: string;
  location?: string;
  keywords?: string[];
}

export interface AdaptationResult {
  adaptedResume: string;
  adaptedCoverLetter: string;
  highlights: HighlightSpan[];
}

export interface HighlightSpan {
  id: string;
  type: 'addition' | 'removal' | 'emphasis';
  start: number;
  end: number;
}

export interface ExtractionPayload {
  profile: CandidateProfile;
  rawText: string;
  warnings: string[];
}

export interface ExportPayload {
  resumePath: string;
  coverLetterPath: string;
}
