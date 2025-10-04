import { useEffect } from 'react';
import { convertFileSrc } from '@tauri-apps/api/tauri';
import { TemplateDefinition } from '../templates/types';
import { useTemplates } from '../templates/useTemplates';

type TemplateGalleryProps = {
  selectedTemplateId?: string;
  onSelect: (templateId: string) => void;
};

export function TemplateGallery({ selectedTemplateId, onSelect }: TemplateGalleryProps) {
  const { data, isLoading, error } = useTemplates();
  const templates = data ?? [];

  useEffect(() => {
    if (!selectedTemplateId && templates.length) {
      onSelect(templates[0].id);
    }
  }, [selectedTemplateId, templates, onSelect]);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
        Chargement des modèles…
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-rose-800 bg-rose-950/70 p-4 text-sm text-rose-200">
        Impossible de charger les modèles : {error.message}
      </div>
    );
  }

  if (!templates.length) {
    return (
      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
        Aucun modèle disponible pour le moment.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Modèles de CV</h2>
        <span className="text-xs text-slate-500">{templates.length} disponibles</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {templates.map((template: TemplateDefinition) => {
          const isActive = template.id === selectedTemplateId;
          const previewSrc = getPreviewSrc(template.previewImage);
          return (
            <button
              key={template.id}
              type="button"
              className={`flex flex-col overflow-hidden rounded-lg border transition ${
                isActive ? 'border-emerald-400 ring-2 ring-emerald-400/50' : 'border-slate-800 hover:border-emerald-500'
              } bg-slate-950/60 text-left`}
              onClick={() => onSelect(template.id)}
            >
              <img src={previewSrc} alt={`Prévisualisation du modèle ${template.name}`} className="h-32 w-full object-cover" />
              <div className="space-y-1 px-3 py-2">
                <p className="text-sm font-semibold text-slate-100">{template.name}</p>
                <p className="text-xs text-slate-400">{template.description}</p>
              </div>
            </button>
          );
        })}
      </div>
      {selectedTemplateId ? (
        <p className="text-xs text-emerald-300">
          Modèle sélectionné : {templates.find((tpl) => tpl.id === selectedTemplateId)?.name ?? selectedTemplateId}
        </p>
      ) : (
        <p className="text-xs text-slate-500">Sélectionnez un modèle pour prévisualiser votre CV.</p>
      )}
    </div>
  );
}

function getPreviewSrc(imagePath: string): string {
  if (!imagePath) {
    return '';
  }

  if (/^(https?:)?\/\//.test(imagePath) || imagePath.startsWith('data:')) {
    return imagePath;
  }

  const isTauri = typeof window !== 'undefined' && '__TAURI_IPC__' in window;

  if (!isTauri) {
    return imagePath;
  }

  try {
    return convertFileSrc(imagePath);
  } catch (error) {
    console.warn('[TemplateGallery] preview fallback', error);
    return imagePath;
  }
}
