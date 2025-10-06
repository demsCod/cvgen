export interface ExperienceItem { id?: string; company?: string; role?: string; start?: string; end?: string; location?: string; description?: string; bullets?: string[] }
export interface EducationItem { school?: string; degree?: string; start?: string; end?: string }
export interface ProjectItem { id?: string; name?: string; description?: string; tech?: string[]; links?: Record<string,string> }
export interface SkillItem { id?: string; name: string; level?: string }
export interface LanguageItem { id?: string; name: string; level?: string }
export interface SocialLinks { linkedin?: string; github?: string; website?: string; portfolio?: string; twitter?: string; }
export interface AddressInfo { street?: string; city?: string; postalCode?: string; country?: string; }
export interface InterestItem { id?: string; name: string }

export interface CandidateProfile {
  id: string;
  fullName?: string;
  title?: string; // Titre professionnel affiché (distinct du nom complet)
  email?: string;
  phone?: string;
  address?: AddressInfo;
  socials?: SocialLinks;
  summary?: string;
  experiences: ExperienceItem[];
  skills: SkillItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  languages: LanguageItem[];
  interests?: InterestItem[];
}

export interface JobOffer { id?: string; title?: string; company?: string; description?: string }
export interface AdaptationResult { id?: string; summary?: string; highlights?: string[] }
export interface ExtractionPayload { rawText?: string; tokens?: string[] }
