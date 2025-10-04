import { invoke } from '@tauri-apps/api/tauri';
import { AdaptationResult, ExtractionPayload, ExportPayload, JobOffer } from '../types';

async function callBackend<T>(command: string, args: Record<string, unknown>): Promise<T> {
  try {
    const result = await invoke<T>(command, args);
    console.debug(`[api] ${command} success`, result);
    return result;
  } catch (error) {
    console.error(`[api] ${command} failed`, error);
    if (error instanceof Error) {
      throw error;
    }
    if (typeof error === 'string') {
      throw new Error(error);
    }
    throw new Error(JSON.stringify(error));
  }
}

export function importCv(filePath: string): Promise<ExtractionPayload> {
  return callBackend<ExtractionPayload>('import_cv', { filePath });
}

export function analyzeOffer(offer: JobOffer): Promise<JobOffer> {
  return callBackend<JobOffer>('analyze_offer', { offer });
}

export function adaptDocuments(profileId: string, offerId: string): Promise<AdaptationResult> {
  return callBackend<AdaptationResult>('adapt_documents', { profileId, offerId });
}

export function exportDocuments(profileId: string, format: 'pdf' | 'docx'): Promise<ExportPayload> {
  return callBackend<ExportPayload>('export_documents', { profileId, format });
}
