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
