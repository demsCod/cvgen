# CVGen – Prototype d'application locale

CVGen est un prototype d'application desktop multiplateforme (macOS, Windows, Linux) permettant de générer, adapter et exporter un CV ainsi qu'une lettre de motivation sur la base d'une offre d'emploi — le tout 100 % hors-ligne.

## Fonctionnalités clés

- Import d'un CV existant (PDF, Word, image) avec OCR local.
- Extraction des informations et structuration en JSON (profil, expériences, compétences, formations, projets).
- Collage ou import d'une offre d'emploi et analyse locale des mots-clés.
- Adaptation automatique du CV et de la lettre de motivation avec surlignage des ajouts/modifications.
- Interface React en deux panneaux : offre à gauche, documents adaptés à droite.
- Export local en PDF et Word (docx) via Python.
- Stockage interne du profil et des offres dans un fichier JSON local.

## Architecture

| Couche | Stack | Rôle |
| --- | --- | --- |
| Frontend | Vite + React + TailwindCSS + Radix primitives | UI deux panneaux, gestion d'état (Zustand), appels Tauri |
| Backend | Tauri (Rust) | Orchestration, commandes d'import/IA/export, stockage local |
| IA locale | Python (sentence-transformers + onnxruntime) | Extraction CV, analyse offre, adaptation documents |
| OCR / Export | pdfminer, python-docx, pytesseract, reportlab | OCR local, génération PDF/DOCX |

## Prérequis

- **Node.js** ≥ 18
- **Rust** toolchain (via [rustup](https://rustup.rs/))
- **Python** ≥ 3.9
- **Tesseract OCR** installé localement (macOS : `brew install tesseract`, Windows : installeur officiel)
- Optionnel mais recommandé : `antiword` (pour de vieux `.doc`), GPU compatible ONNX Runtime

## Installation

1. **Installer les dépendances JavaScript**
   ```bash
   npm install
   ```

2. **Configurer l'environnement Python local**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # Windows : .venv\Scripts\activate
   pip install --upgrade pip
   pip install -r python/requirements.txt
   ```
   > ℹ️ Le support des anciens fichiers `.doc` repose sur `textract`, non installé par défaut pour éviter des conflits de dépendances. Si nécessaire, installez-le manuellement (`pip install textract==1.6.5 pdfminer.six==20191110`) ou convertissez vos fichiers en `.docx`.

3. **(Optionnel) Pré-télécharger le modèle d'embedding pour un usage totalement hors-ligne**
   ```bash
   python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')"
   ```
   Le modèle sera mis en cache localement dans `~/.cache/torch/sentence_transformers`.

4. **Lancer l'application en mode développement**
   ```bash
   npm run tauri:dev
   ```

### Raccourcis make (optionnel)

Un `Makefile` est fourni pour automatiser les étapes fréquentes :

```bash
make install      # installe les dépendances Node + Python (crée .venv)
make dev          # lance l'app Tauri en dev
make lint         # exécute eslint sur le frontend
make check        # cargo check côté Rust
make build        # build frontend + cargo build
make tauri-build  # build des binaires desktop
make clean        # nettoyage complet (node_modules, .venv, dist, target)
```

Le backend Rust utilisera la variable d'environnement `PYTHON_CMD` si elle est définie (permet de cibler un interpréteur précis). Sinon, `python3` est utilisé par défaut.

## Utilisation

1. Importez votre CV via le panneau droit (formats PDF, DOCX, PNG/JPG).
2. Collez l'offre d'emploi dans le panneau gauche et lancez l'analyse pour extraire les mots-clefs.
3. Cliquez sur « Adapter CV + lettre » pour générer les versions personnalisées (les ajouts sont surlignés).
4. Exportez en PDF ou en DOCX via les boutons d'export. Les fichiers sont générés dans `~/.cvgen/exports`.

## Structure principale du code

```
cvgen/
├── src/                         # Frontend React
│   ├── App.tsx                  # Interface principale deux panneaux
│   ├── components/              # Composants UI réutilisables
│   ├── hooks/useCvStore.ts      # État global (Zustand)
│   ├── lib/api.ts               # Ponts vers les commandes Tauri
│   └── types/                   # Types partagés
├── src-tauri/                   # Backend Rust (Tauri)
│   ├── src/
│   │   ├── file_import.rs       # Import & extraction via Python
│   │   ├── ai_engine.rs         # Analyse offre & adaptation
│   │   ├── exporter.rs          # Exports PDF/DOCX
│   │   ├── python_bridge.rs     # Exécution des scripts Python
│   │   ├── state.rs             # Stockage local en mémoire
│   │   └── models.rs            # Structures partagées (serde)
│   └── tauri.conf.json          # Configuration Tauri
└── python/                      # Pipeline IA locale
    ├── main.py                  # CLI Typer
    ├── app/
    │   ├── ocr/extractor.py     # OCR / parsing fichiers
    │   ├── nlp/parser.py        # Structuration profil
    │   ├── nlp/offer.py         # Analyse offre & mots-clefs
    │   ├── nlp/adapter.py       # Génération CV/lettre + highlights
    │   └── exporter/documents.py# Exports PDF/DOCX
    └── requirements.txt
```

## Tests & validation

- `npm run lint` — vérifie le code TypeScript/React.
- `npm run build` — build frontend Vite.
- `cargo fmt && cargo clippy` (à exécuter dans `src-tauri`) — format + lint Rust.
- `pytest` (à implémenter) ou scripts de test Python spécifiques si besoin.

> ⚠️ Les dépendances Python (OCR / NLP) peuvent nécessiter des bibliothèques système (libomp, poppler, etc.) selon votre OS.

## Limitations & pistes d'amélioration

- Parsing du CV basé sur des heuristiques simples — prévoir un modèle NLP dédié pour plus de robustesse.
- Première exécution du modèle `sentence-transformers` nécessite une connexion pour télécharger les poids. Fournir un bundle local ou une procédure de pré-téléchargement.
- Pas encore de tests automatisés pour la pipeline Python (ajouter `pytest`).
- UI minimaliste (peut être renforcée avec shadcn/ui ou animations supplémentaires).
- Support `.doc` nécessite l'installation manuelle de `textract` (voir note d'installation) et peut exiger `antiword`/`catdoc`.

## Licence

Prototype éducatif. À adapter avant diffusion en production.
