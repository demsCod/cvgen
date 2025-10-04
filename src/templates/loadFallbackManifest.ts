import manifestJson from '../../templates/manifest.json';
import modernPreview from '../../templates/previews/modern.svg';
import classicPreview from '../../templates/previews/classic.svg';
import { TemplateManifest } from './types';

const previewMap: Record<string, string> = {
  'previews/modern.svg': modernPreview,
  'previews/classic.svg': classicPreview,
};

export function loadFallbackManifest(): TemplateManifest {
  const manifest = manifestJson as TemplateManifest;
  return {
    ...manifest,
    templates: manifest.templates.map((template) => ({
      ...template,
      previewImage: previewMap[template.previewImage] ?? template.previewImage,
    })),
  };
}
