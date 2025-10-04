import { create } from 'zustand';
import { CandidateProfile, JobOffer, AdaptationResult, ExtractionPayload } from '../types';

type Stage = 'idle' | 'extracting' | 'adapting' | 'ready' | 'error';

interface CvState {
  profile?: CandidateProfile;
  jobOffer?: JobOffer;
  extraction?: ExtractionPayload;
  adaptation?: AdaptationResult;
  selectedTemplateId?: string;
  stage: Stage;
  error?: string;
  setProfile: (profile: CandidateProfile) => void;
  setJobOffer: (offer: JobOffer) => void;
  setExtraction: (payload: ExtractionPayload) => void;
  setAdaptation: (payload: AdaptationResult) => void;
  setSelectedTemplate: (templateId: string) => void;
  setStage: (stage: Stage) => void;
  setError: (message?: string) => void;
  reset: () => void;
}

export const useCvStore = create<CvState>((set) => ({
  stage: 'idle',
  selectedTemplateId: undefined,
  setProfile: (profile: CandidateProfile) => set({ profile }),
  setJobOffer: (jobOffer: JobOffer) => set({ jobOffer }),
  setExtraction: (extraction: ExtractionPayload) => set({ extraction }),
  setAdaptation: (adaptation: AdaptationResult) => set({ adaptation }),
  setSelectedTemplate: (selectedTemplateId: string) => set({ selectedTemplateId }),
  setStage: (stage: Stage) => set({ stage }),
  setError: (error?: string) => set({ error }),
  reset: () =>
    set({
      profile: undefined,
      jobOffer: undefined,
      extraction: undefined,
      adaptation: undefined,
      selectedTemplateId: undefined,
      stage: 'idle',
      error: undefined,
    }),
}));
