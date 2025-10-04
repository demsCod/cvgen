# CV Template System – Feature Spec

**Status:** Draft (2025-10-03)

## 1. Why templates?
- Give users curated, polished layouts without manually formatting raw text.
- Keep profile data structured so we can adapt/export without layout regressions.
- Unlock rapid iteration on exports (PDF/DocX) by controlling the rendering layer.

### Success metrics (initial)
- User can pick from ≥2 templates during a session.
- Selected template renders the profile preview without runtime errors.
- Exported document reflects the chosen template.

### Non-goals (for this iteration)
- WYSIWYG editing inside the template canvas.
- Free-form layout designer.
- Automatic template recommendations (future idea).

## 2. Data & manifest model
We’ll introduce a shared manifest describing the templates. Both frontend (preview) and backend (export) read this source of truth.

```json
{
  "id": "modern",
  "name": "Modern Clean",
  "description": "Two-column layout with bold accents",
  "previewImage": "modern.png",
  "sections": {
    "header": { "required": ["fullName"], "optional": ["email", "phone"] },
    "experience": { "maxItems": 6, "layout": "vertical" },
    "skills": { "grouping": "category", "display": "pill" }
  },
  "styleTokens": {
    "primaryColor": "#2563eb",
    "accentColor": "#f97316",
    "fontFamily": "Inter"
  }
}
```

- **Location:** `templates/manifest.json` (bundled via Vite + Tauri). Preview assets live in `templates/previews/`.
- **Type safety:** add `TemplateDefinition` TypeScript type and Rust struct for validation.
- **Versioning:** each manifest has `schemaVersion`. Breaking schema changes bump the version.
- **Validation:** CI check (Node script or Rust build step) ensures required keys exist and preview files resolve.

### Runtime selection payload
React state keeps:
```ts
{
  selectedTemplateId: "modern",
  templates: TemplateDefinition[],
}
```
When invoking Python actions (adapt/export), include `template_id` inside the payload JSON so downstream renderers pick the right layout.

## 3. UX flow
1. **Template gallery step** (new screen after CV import): cards showing preview, name, tags.
2. **Preview pane** uses the chosen template to render profile data. Start with client-side rendering using Tailwind components per template.
3. **Editing controls** remain shared; changes in profile data re-render the template preview automatically.
4. **Export button** reads `selectedTemplateId` and passes it to the backend.

### Empty/error states
- If manifest fails to load: fallback template (“Classic”) baked into bundle.
- If a section required by template is missing data, show inline callout prompting the user to fill it.

## 4. Rendering & export strategy
- **Frontend preview:** create a template registry `src/templates/index.ts` that maps template id → React component receiving the normalized `CandidateProfile`.
- **Server/export:**
  - Short term: export via frontend using `@react-pdf/renderer` (reuses the React component tree).
  - Stretch goal: Python renders via Jinja2/WeasyPrint using the same manifest metadata (requires HTML/CSS templates).
- **Styling:** use Tailwind utilities scoped by template container. Keep Print/PDF overrides in dedicated CSS modules to avoid global bleed.

## 5. Implementation slices
1. **Foundation**
   - Add manifest + TypeScript types + loader hook.
   - Expose `list_templates` command from Tauri so Rust can validate and share to frontend.
2. **UI gallery**
   - Build gallery component with template cards, preview modals.
   - Persist `selectedTemplateId` in global state.
3. **Preview renderer**
   - Implement `Modern` template component (header, experience list, skills grid).
   - Add storybook-style test harness (React Testing Library snapshots).
4. **Export integration**
   - Pass template ID to Python `export_documents`; implement fallback behaviour if template unsupported.
5. **Polish/QA**
   - Accessibility review (keyboard nav, contrast).
   - Unit tests validating manifest + renderer coverage.
   - Analytics hooks (optional) to track template selection.

## 6. Open questions
- Should templates be editable per organization (multi-tenant)? For now, single shared manifest.
- Do we allow users to switch templates after manual edits? (Likely yes, with warning if layout-specific overrides exist.)
- Asset management for preview images when packaging the Tauri app (use `tauri.conf.json` resources array).

## 7. Next steps
1. Scaffold manifest & types (`templates/manifest.json`, `src/templates/types.ts`).
2. Build template selector UI skeleton.
3. Implement first template preview + ensure export consumes `template_id`.
4. Extend tests and docs as we add templates.
