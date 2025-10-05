# CVGen – Conversation & Architecture Summary

_Date:_ 2025-10-05  
_Project:_ `cvgen`  
_Context: This document consolidates the recent assistant summary you requested into a persistent Markdown reference._

---
## 1. Vue d’ensemble de la conversation

Phases principales:
1. Intégration d’un shader WebGL2 (dithering / sphere) dans le hero de la landing page.
2. Débogage prolongé (sphere invisible) + ajouts de modes debug, resizing, DPI handling.
3. Abandon du shader + suppression du composant et de l’UI de debug pour simplifier.
4. Nouvelle priorité: Transformer les pages Login / Signup en modales superposées à la landing (pattern React Router background route state).
5. Correction d’un bug: perte du fond (overlay) lors du switch login -> signup (état non propagé).
6. Améliorations UX: scroll lock, focus trap, gestion ESC, states d’accessibilité.
7. Validation des formulaires avec `react-hook-form` + `zod` (login et inscription).
8. Réécriture propre de `AuthModal.tsx` après corruption de patchs (ordre logique, types unifiés).
9. Livraison d’un briefing architectural complet (frontend + Tauri + Python + AI + templates).
10. Présent document: synthèse structurée des actions récentes.

Évolution d’intention: Effet visuel expérimental → abandon pragmatique → robustification du flux d’authentification modale → documentation architecturale en vue d’étapes backend/AI.

---
## 2. Fondation technique

- Frontend: React 18, TypeScript, Vite, TailwindCSS.
- Routing: React Router (pattern modal overlay via `backgroundLocation`).
- State mgmt prévu: Zustand (pour CV data, templates, session locale).
- Desktop runtime: Tauri (Rust) pour pont natif: parsing PDF, exécution Python, génération/export.
- Python: Extraction CV, NLP, pont Ollama (scripts planifiés).
- AI: Local (Ollama) – prompts pour extraction/normalisation d’entités CV et suggestion d’améliorations.
- Validation formulaires: `react-hook-form` + `zod`.
- Accessibilité: Focus trap, scroll lock, gestion `Escape`.
- Build tooling: Vite + TypeScript config standard, Tailwind + PostCSS.

---
## 3. État du code (fichiers clés)

### `src/pages/LandingPage.tsx`
- Rôle: Hero marketing & CTA (Sign Up / Log In via modales).
- Shader retiré (plus de dépendance WebGL dans l’UI).
- Boutons naviguent avec `state: { backgroundLocation: location }`.

### `src/components/auth/AuthModal.tsx`
- Rôle: Composant modal unifié login/signup.
- Contenu:
  - Détection mode (`login` vs `signup`).
  - Schémas `zod` séparés + refinement password confirmation.
  - `react-hook-form` (erreurs champ par champ + état `submitting`).
  - Focus trap manuel (Tab / Shift+Tab cycle).
  - Scroll lock (`document.body.style.overflow = 'hidden'`).
  - Liens internes préservant `backgroundLocation`.
  - Stub bouton Google (désactivé pour futur OAuth).
- Refactoring final: Correction ordre calcul `isLogin` avant sélection du schéma; consolidation types.

### `src/pages/Auth/Login.tsx` & `src/pages/Auth/SignUp.tsx`
- Rôle: Fallback pages directes si l’utilisateur accède sans `backgroundLocation`.
- Simples wrappers (logique principale déplacée dans la modal).

### `src/App.tsx`
- Rôle: Gestion des routes + rendu conditionnel de la modale si `location.state.backgroundLocation`.
- Pattern: Rendu de la page d’arrière-plan via `backgroundLocation` + overlay modale.

### Fichier shader `dithering-shader.tsx`
- Statut: Inutilisé (peut être supprimé à terme pour épurer le repo).

### `global.d.ts`
- Statut: Simplifié (dépendances TS plus propres après migration des pages `.jsx` vers `.tsx`).

---
## 4. Problèmes rencontrés & résolutions

| Problème | Cause Racine | Résolution |
|----------|--------------|-----------|
| Sphere shader invisible | Paramétrage / logique uniforms non consolidée | Abandon fonctionnel + retrait composant |
| Perte overlay lors du switch login->signup | Oubli de rechainer `backgroundLocation` dans `Link` | Propagation explicite de l’état dans les liens |
| Erreurs TypeScript dans `AuthModal.tsx` | Ordre de définition (isLogin après usage), patchs partiels corrompus | Réécriture complète stable |
| Validation signup (password confirm) | Besoin d’un refine inter-champs | Schéma `zod` avec `refine` & message ciblé |
| Focus tab hors modale | Absence de trap | Implémentation trap manuel + cycle indexes |

Leçons clés:
- Toujours définir les flags conditionnant le schéma avant instanciation `zod`.
- Lors de corruption de fichier par patchs successifs: repartir d’une version propre.
- Préserver l’état de routage dans chaque transition interne du flux modale.

---
## 5. Avancement vs. plan initial

Réalisé:
- Suppression shader + nettoyage UI.
- Modal auth (routing overlay) fonctionnelle.
- Preservation background route on switch.
- Validation complète (login & signup) + messages inline.
- UX améliorations (focus, scroll, escape, disabled states).
- Documentation architecturale initiale (ce document + briefing précédent).

Restant (conceptuel / à implémenter):
- Commandes Tauri (Rust): `parse_cv`, `run_ai_prompt`, `export_pdf`, `save_cv`, `list_templates`.
- Scripts Python (extraction texte CV, parsing entités, pont Ollama).
- Intégration AI (prompt templates + injection de context CV + suggestions sections).
- Persistence (Zustand persist + filesystem JSON via Tauri).
- Template gallery & mapping dynamique manifest `templates/manifest.json` → composants React.
- Export PDF (CSS print + html-to-pdf natif via Tauri ou wkhtmltopdf wrapper / `print_to_pdf`).
- Système de notifications (toasts) & erreur globale.
- Suppression fichiers morts (shader) + tests unitaires ciblés.

---
## 6. Architecture cible (résumé)

### Flux CV (import → enrichissement → export)
1. Utilisateur dépose un PDF/Docx.
2. Tauri commande `parse_cv` lance script Python → JSON `CVData` brut.
3. Normalisation & enrichissement (compétences, expériences structurées) via `run_ai_prompt` (Ollama modèle local).
4. Stockage en mémoire (Zustand) + persistance (fichier utilisateur / localStorage).
5. Sélection template (manifest) → rendu React dynamique.
6. Export: `export_pdf` génère PDF (HTML/CSS print ou pipeline headless + Tauri API).

### Contrats JSON (exemple simplifié)
```jsonc
// CVData
{
  "basics": { "fullName": "", "title": "", "location": "", "summary": "" },
  "experience": [ { "company": "", "role": "", "start": "", "end": "", "bullets": ["..."] } ],
  "education": [ { "school": "", "degree": "", "start": "", "end": "" } ],
  "skills": { "core": [""], "tools": [""], "languages": [""], "other": ["" ] },
  "projects": [ { "name": "", "description": "", "tech": [""], "links": { "repo": "", "demo": "" } } ],
  "meta": { "sourceFile": "", "lastUpdated": "2025-10-05T12:00:00Z" }
}
```

### Rust ↔ Python Bridge
- Rust exécute Python via `Command` (bloquant ou async). 
- Communication: stdin JSON → stdout JSON (strict, lignes terminées par `\n`).
- Timeout & validation schéma (serde + `Result` centralisé).

### AI Integration (Ollama)
- Prompt templates versionnées.
- Post-processing: tokens → sections validées contre typing TypeScript.
- Stratégie fallback: si LLM réponse invalide → garde extraction brute + log.

---
## 7. Accessibilité & UX Checklist (actuel vs futur)
| Élément | Statut | Améliorations futures |
|---------|--------|-----------------------|
| Focus Trap | Implémenté | Externaliser hook réutilisable |
| Scroll Lock | Implémenté | Gérer empilement modales nested |
| Escape Close | Oui | Ajouter annonce ARIA live region |
| Error Messages | Inline text | ARIA `aria-describedby` + rôles |
| Keyboard Nav | Basique | Pièges SHIFT+Tab test multi-browsers |

---
## 8. Risques & Mitigations
| Risque | Impact | Mitigation |
|--------|--------|------------|
| Accumulation dette (fichiers morts) | Confusion dev | Faire un sweep & supprimer shader | 
| Contrats JSON non formalisés tôt | Rewrites massifs | Définir interface `CVData` + tests snapshot | 
| LLM hallucinations | Données CV corrompues | Post-validation stricte + champs whitelist | 
| Blocage export PDF cross-plateforme | Retard release | Prototyper tôt avec print CSS + fallback lib | 
| Focus trap edge cases | A11y régression | Tests manuels + utilitaire unifié |

---
## 9. Prochaines étapes recommandées (ordre suggéré)
1. Définir interface `CVData.ts` + zod schema miroir (validation runtime). 
2. Scaffolder commandes Rust Tauri (stubs renvoyant JSON mock). 
3. Ajouter hooks front (`useCvStore`, `useImportCv`, `useTemplates`). 
4. Implémenter parser Python minimal (extraction texte + regex basique). 
5. Intégrer cycle import → afficher données brutes dans panneau debug (temporaire). 
6. Introduire manifest templates + un template basique rendu dynamique. 
7. Export PDF MVP (print CSS). 
8. Brancher Ollama enrichissement (prompt + post-validate). 
9. Tests unitaires (schema validation + reducers store). 
10. Nettoyage (supprimer shader + legacy fichiers). 

---
## 10. Historique des tâches (résumé rapide)
- Shader ajouté → debug intensif → retiré.
- Mise en place modal auth + corrections overlay state.
- Validation formulaires + réécriture propre après corruption.
- Documentation architecture rédigée.

---
## 11. Glossaire rapide
- Background Route Pattern: Technique React Router pour afficher une modale en conservant l’écran précédent derrière (stockage de `location` initial dans `state`).
- Focus Trap: Contrainte du cycle de tabulation dans la modale pour A11y.
- Refinement (zod): Validation inter-champs (ex: password === confirmPassword).
- Manifest Template: Descripteur JSON listant templates disponibles pour mapping dynamique.

---
## 12. Annexes potentielles (à créer ultérieurement)
- `CVData` schema détaillé.
- Convention de commits / branching.
- Guide contribution templates.
- Contrats Rust <-> JS (types partagés via `ts-rs` ou génération). 

---
## 13. Synthèse finale
Base frontend stabilisée (auth modal + UX). Prochain objectif: établir socle données (CVData), pont Tauri/Python et pipeline AI. Ce document sert de référence pour maintenir cohérence architecturale pendant l’implémentation backend & AI.

---
_Fin du document._
