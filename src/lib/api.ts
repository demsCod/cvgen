import { invoke } from '@tauri-apps/api/tauri';
import { AdaptationResult, ExtractionPayload, ExportPayload, JobOffer } from '../types';

export async function importCv(filePath: string): Promise<ExtractionPayload> {
  return invoke<ExtractionPayload>('import_cv', { filePath });
}

export async function analyzeOffer(offer: JobOffer): Promise<JobOffer> {
  return invoke<JobOffer>('analyze_offer', { offer });
}

export async function adaptDocuments(
  profileId: string,
  offerId: string,
): Promise<AdaptationResult> {
  return invoke<AdaptationResult>('adapt_documents', { profileId, offerId });
}

export async function exportDocuments(
  profileId: string,
  format: 'pdf' | 'docx',
): Promise<ExportPayload> {
  return invoke<ExportPayload>('export_documents', { profileId, format });
}
