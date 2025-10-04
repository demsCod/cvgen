export interface TemplateSectionConstraint {
  required?: string[];
  optional?: string[];
  maxItems?: number;
  layout?: 'two-column' | 'single-column' | 'compact' | 'detailed';
  grouping?: 'category' | 'list';
  display?: 'pill' | 'bullet';
}

export interface TemplateStyleTokens {
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  styleTokens: TemplateStyleTokens;
  sections: Record<string, TemplateSectionConstraint>;
}

export interface TemplateManifest {
  schemaVersion: number;
  templates: TemplateDefinition[];
}
