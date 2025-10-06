import { invoke } from '@tauri-apps/api/tauri';

export interface CvData {
  id: string;
  fullName?: string;
  title?: string;
  email?: string;
  phone?: string;
  summary?: string;
  experiences?: any[];
  skills?: string[];
  education?: any[];
  projects?: any[];
  languages?: string[];
  meta?: Record<string, any>;
}

export interface CvMeta { id: string; title: string; updatedAt: string }

export function useCvFiles() {
  async function listCvs(): Promise<string[]> {
    const res = await invoke<any>('list_cvs');
    if (Array.isArray(res)) return res as string[];
    return [];
  }

  async function listCvsMeta(): Promise<CvMeta[]> {
    const res = await invoke<any>('list_cvs_meta');
    if (Array.isArray(res)) {
      return res.filter(r => r && typeof r === 'object' && r.id).map(r => ({
        id: r.id,
        title: r.title || 'CV',
        updatedAt: r.updatedAt || '',
      }));
    }
    return [];
  }

  async function loadCv(id: string): Promise<CvData | null> {
    try {
      const data = await invoke<any>('load_cv', { id });
      if (data && typeof data === 'object') return data as CvData;
      return null;
    } catch (e) {
      console.error('loadCv error', e);
      return null;
    }
  }

  async function saveCv(id: string, data: CvData): Promise<boolean> {
    try {
      await invoke('save_cv', { id, data });
      return true;
    } catch (e) {
      console.error('saveCv error', e);
      return false;
    }
  }

  async function deleteCv(id: string): Promise<boolean> {
    try {
      await invoke('delete_cv', { id });
      return true;
    } catch (e) {
      console.error('deleteCv error', e);
      return false;
    }
  }

  return { listCvs, listCvsMeta, loadCv, saveCv, deleteCv };
}
