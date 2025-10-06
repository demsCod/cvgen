import { create } from 'zustand';
import { CandidateProfile, JobOffer, AdaptationResult, ExtractionPayload } from '../types/index';
import { useCvFiles } from './useCvFiles';

type Stage = 'idle' | 'extracting' | 'adapting' | 'ready' | 'error';

interface CvState {
  profile?: CandidateProfile;
  jobOffer?: JobOffer;
  extraction?: ExtractionPayload;
  adaptation?: AdaptationResult;
  stage: Stage;
  error?: string;
  currentCvId?: string;
  initialized: boolean;
  setProfile: (profile: CandidateProfile) => void;
  setJobOffer: (offer: JobOffer) => void;
  setExtraction: (payload: ExtractionPayload) => void;
  setAdaptation: (payload: AdaptationResult) => void;
  initializeBlankProfile: (options?: { fullName?: string; title?: string }) => void;
  setStage: (stage: Stage) => void;
  setError: (message?: string) => void;
  reset: () => void;
  loadCvFromFile: (id: string) => Promise<void>;
  saveCvToFile: () => Promise<boolean>;
  ensureInitialized: () => Promise<void>;
  updateProfile: (patch: Partial<CandidateProfile>) => void;
  addExperience: () => void;
  removeExperience: (id: string) => void;
  addEducation: () => void;
  removeEducation: (index: number) => void;
  addProject: () => void;
  removeProject: (id: string) => void;
  addSkill: () => void;
  removeSkill: (id: string) => void;
  addLanguage: () => void;
  removeLanguage: (id: string) => void;
}

export const useCvStore = create<CvState>((set, get) => ({
  stage: 'idle',
  initialized: false,
  setProfile: (profile: CandidateProfile) => set({ profile }),
  setJobOffer: (jobOffer: JobOffer) => set({ jobOffer }),
  setExtraction: (extraction: ExtractionPayload) => set({ extraction }),
  setAdaptation: (adaptation: AdaptationResult) => set({ adaptation }),
  initializeBlankProfile: (options) =>
    set(() => ({
      profile: createBlankProfile(options),
      extraction: undefined,
      adaptation: undefined,
      stage: 'idle',
      error: undefined,
    })),
  setStage: (stage: Stage) => set({ stage }),
  setError: (error?: string) => set({ error }),
  reset: () =>
    set({
      profile: undefined,
      jobOffer: undefined,
      extraction: undefined,
      adaptation: undefined,
      stage: 'idle',
      error: undefined,
      currentCvId: undefined,
    }),
  loadCvFromFile: async (id: string) => {
    const { loadCv } = useCvFiles();
    set({ stage: 'idle' });
    const data = await loadCv(id);
    if (!data) {
      set({ error: 'Impossible de charger le CV', currentCvId: id });
      return;
    }
    const profile: CandidateProfile = {
      id: data.id || id,
      fullName: data.fullName || 'Nom Inconnu',
      title: data.title || data.summary || 'Titre',
      email: data.email,
      phone: data.phone,
      summary: data.summary,
      experiences: data.experiences || [],
      skills: Array.isArray(data.skills) ? data.skills.map((s: any) => typeof s === 'string' ? { name: s } : s) : [],
      education: data.education || [],
      projects: data.projects || [],
      languages: Array.isArray(data.languages) ? data.languages.map((l: any) => typeof l === 'string' ? { name: l } : l) : [],
    };
    set({ profile, currentCvId: id, error: undefined });
  },
  saveCvToFile: async () => {
    const { saveCv } = useCvFiles();
    const { profile, currentCvId } = get();
    if (!profile || !currentCvId) return false;
    const success = await saveCv(currentCvId, profile as any);
    if (!success) set({ error: 'Sauvegarde échouée' });
    return success;
  },
  ensureInitialized: async () => {
    if (get().initialized) return;
    const { listCvsMeta, saveCv } = useCvFiles() as any;
    const metaList = await listCvsMeta();
    if (!metaList || metaList.length === 0) {
      const defaultProfile = createBlankProfile({ fullName: 'Votre Nom', title: 'Titre / Accroche' });
      const defaultId = 'cv_default';
      await saveCv(defaultId, defaultProfile as any);
      set({ profile: defaultProfile, currentCvId: defaultId, initialized: true });
    } else {
      const mostRecent = metaList[0]; // already sorted desc from list_cvs_meta
      await get().loadCvFromFile(mostRecent.id);
      set({ initialized: true });
    }
  },
  updateProfile: (patch) => set(state => state.profile ? { profile: { ...state.profile, ...patch } } : {}),
  addExperience: () => set(state => ({ profile: state.profile ? { ...state.profile, experiences: [...state.profile.experiences, { id: genId(), role: 'Intitulé du poste', company: 'Entreprise', start: '', end: '', description: '' }] } : state.profile })),
  removeExperience: (id) => set(state => ({ profile: state.profile ? { ...state.profile, experiences: state.profile.experiences.filter(e => e.id !== id) } : state.profile })),
  addEducation: () => set(state => ({ profile: state.profile ? { ...state.profile, education: [...state.profile.education, { degree: 'Diplôme', school: 'Établissement', start: '', end: '' }] } : state.profile })),
  removeEducation: (index) => set(state => ({ profile: state.profile ? { ...state.profile, education: state.profile.education.filter((_, i) => i !== index) } : state.profile })),
  addProject: () => set(state => ({ profile: state.profile ? { ...state.profile, projects: [...state.profile.projects, { id: genId(), name: 'Projet', description: '', tech: [] }] } : state.profile })),
  removeProject: (id) => set(state => ({ profile: state.profile ? { ...state.profile, projects: state.profile.projects.filter(p => p.id !== id) } : state.profile })),
  addSkill: () => set(state => ({ profile: state.profile ? { ...state.profile, skills: [...state.profile.skills, { id: genId(), name: 'Compétence' }] } : state.profile })),
  removeSkill: (id) => set(state => ({ profile: state.profile ? { ...state.profile, skills: state.profile.skills.filter(s => s.id !== id) } : state.profile })),
  addLanguage: () => set(state => ({ profile: state.profile ? { ...state.profile, languages: [...state.profile.languages, { id: genId(), name: 'Langue' }] } : state.profile })),
  removeLanguage: (id) => set(state => ({ profile: state.profile ? { ...state.profile, languages: state.profile.languages.filter(l => l.id !== id) } : state.profile })),
}));

function createBlankProfile(options?: { fullName?: string; title?: string }): CandidateProfile {
  return {
    id: `profile-${typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Date.now().toString(36)}`,
    fullName: options?.fullName ?? 'Votre nom',
    title: options?.title ?? 'Titre / Accroche',
    email: undefined,
    phone: undefined,
    summary: options?.title ?? 'Titre du poste / Accroche',
    experiences: [],
    skills: [],
    education: [],
    projects: [],
    languages: [],
  };
}

function genId() {
  return Math.random().toString(36).slice(2, 10);
}
