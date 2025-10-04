import { create } from 'zustand';
import { CandidateProfile, JobOffer, AdaptationResult, ExtractionPayload } from '../types';

type Stage = 'idle' | 'extracting' | 'adapting' | 'ready' | 'error';

interface CvState {
  profile?: CandidateProfile;
  jobOffer?: JobOffer;
  extraction?: ExtractionPayload;
  adaptation?: AdaptationResult;
  stage: Stage;
  error?: string;
  setProfile: (profile: CandidateProfile) => void;
  setJobOffer: (offer: JobOffer) => void;
  setExtraction: (payload: ExtractionPayload) => void;
  setAdaptation: (payload: AdaptationResult) => void;
  initializeBlankProfile: (options?: { fullName?: string; title?: string }) => void;
  setStage: (stage: Stage) => void;
  setError: (message?: string) => void;
  reset: () => void;
}

export const useCvStore = create<CvState>((set) => ({
  stage: 'idle',
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
    }),
}));

function createBlankProfile(options?: { fullName?: string; title?: string }): CandidateProfile {
  return {
    id: `profile-${typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Date.now().toString(36)}`,
    fullName: options?.fullName ?? 'Votre nom',
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
