export interface ExperienceItem { company?: string; role?: string; start?: string; end?: string; bullets?: string[] }
export interface EducationItem { school?: string; degree?: string; start?: string; end?: string }
export interface ProjectItem { name?: string; description?: string; tech?: string[]; links?: Record<string,string> }

export interface CandidateProfile {
  id: string;
  fullName?: string;
  title?: string; // Titre professionnel affiché (distinct du nom complet)
  email?: string;
  phone?: string;
  summary?: string;
  experiences: ExperienceItem[];
  skills: string[];
  education: EducationItem[];
  projects: ProjectItem[];
  languages: string[];
}

export interface JobOffer { id?: string; title?: string; company?: string; description?: string }
export interface AdaptationResult { id?: string; summary?: string; highlights?: string[] }
export interface ExtractionPayload { rawText?: string; tokens?: string[] }
