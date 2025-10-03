import { useState, type ChangeEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Panel } from './components/Panel';
import { FileDropzone } from './components/FileDropzone';
import { HighlightText } from './components/HighlightText';
import { useCvStore } from './hooks/useCvStore';
import { importCv, analyzeOffer, adaptDocuments, exportDocuments } from './lib/api';
import type { AdaptationResult, ExtractionPayload, ExportPayload, JobOffer } from './types';

const defaultOffer: JobOffer = {
  id: 'offer-draft',
  title: '',
  description: '',
};

function ToolbarButton({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      className="rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-slate-100 shadow hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

export default function App() {
  const store = useCvStore();
  const [offer, setOffer] = useState<JobOffer>(defaultOffer);
  const [adaptTab, setAdaptTab] = useState<'resume' | 'cover' | 'diff'>('resume');
  const [exportInfo, setExportInfo] = useState<ExportPayload>();

  const updateOffer = (patch: Partial<JobOffer>) => {
    setOffer((prev: JobOffer) => {
      const next = { ...prev, ...patch };
      store.setJobOffer(next);
      return next;
    });
  };

  const importMutation = useMutation<ExtractionPayload, Error, string>({
    mutationFn: (filePath: string) => importCv(filePath),
    onMutate: () => {
      store.setStage('extracting');
      store.setError(undefined);
    },
    onSuccess: (payload: ExtractionPayload) => {
      store.setExtraction(payload);
      store.setProfile(payload.profile);
      store.setStage('idle');
    },
    onError: (error: Error) => {
      store.setError(error.message);
      store.setStage('error');
    },
  });

  const analyzeMutation = useMutation<JobOffer, Error, JobOffer>({
    mutationFn: (body: JobOffer) => analyzeOffer(body),
    onMutate: () => store.setStage('extracting'),
    onSuccess: (enhanced: JobOffer) => {
      store.setJobOffer(enhanced);
      setOffer(enhanced);
      store.setStage('idle');
    },
    onError: (error: Error) => {
      store.setError(error.message);
      store.setStage('error');
    },
  });

  const adaptMutation = useMutation<AdaptationResult, Error, void>({
    mutationFn: () => {
      if (!store.profile || !store.jobOffer) {
        throw new Error('Profil ou offre manquants');
      }
      return adaptDocuments(store.profile.id, store.jobOffer.id);
    },
    onMutate: () => store.setStage('adapting'),
    onSuccess: (payload: AdaptationResult) => {
      store.setAdaptation(payload);
      store.setStage('ready');
    },
    onError: (error: Error) => {
      store.setError(error.message);
      store.setStage('error');
    },
  });

  const exportMutation = useMutation<ExportPayload, Error, 'pdf' | 'docx'>({
    mutationFn: (format: 'pdf' | 'docx') => {
      if (!store.profile) {
        throw new Error('Profil manquant');
      }
      return exportDocuments(store.profile.id, format);
    },
    onSuccess: (payload: ExportPayload) => {
      setExportInfo(payload);
    },
    onError: (error: Error) => {
      store.setError(error.message);
    },
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-950/90 px-8 py-5">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-emerald-400">CVGen Local</h1>
            <div className="flex items-center gap-3">
              <ToolbarButton
                label="Exporter PDF"
                onClick={() => exportMutation.mutate('pdf')}
                disabled={!store.adaptation || exportMutation.isPending}
              />
              <ToolbarButton
                label="Exporter Word"
                onClick={() => exportMutation.mutate('docx')}
                disabled={!store.adaptation || exportMutation.isPending}
              />
              <ToolbarButton
                label="Réinitialiser"
                onClick={() => {
                  store.reset();
                  setOffer(defaultOffer);
                  setExportInfo(undefined);
                }}
              />
            </div>
          </div>
          <p className="text-sm text-slate-400">
            Fonctionne 100% hors-ligne • Extraction locale OCR/NLP • Adaptation automatique CV + lettre
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 gap-6 px-8 py-6">
        <Panel
          title="Offre d'emploi"
          actions={
            <ToolbarButton
              label={analyzeMutation.isPending ? 'Analyse…' : 'Analyser'}
              disabled={!offer.description || analyzeMutation.isPending}
              onClick={() => analyzeMutation.mutate({ ...offer, id: offer.id || crypto.randomUUID() })}
            />
          }
          className="w-1/2"
        >
          <div className="flex flex-col gap-4">
            <div className="grid gap-3">
              <label className="text-sm font-medium text-slate-200" htmlFor="offer-title">
                Titre du poste
              </label>
              <input
                id="offer-title"
                value={offer.title}
                onChange={(event: ChangeEvent<HTMLInputElement>) => updateOffer({ title: event.target.value })}
                className="rounded-md border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-400"
                placeholder="Ex: Développeur Fullstack React/Tauri"
              />
            </div>
            <div className="grid gap-3">
              <label className="text-sm font-medium text-slate-200" htmlFor="offer-description">
                Description détaillée / copier-coller de l'offre
              </label>
              <textarea
                id="offer-description"
                value={offer.description}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  updateOffer({ description: event.target.value })
                }
                className="min-h-[320px] rounded-md border border-slate-700 bg-slate-900/80 px-3 py-3 text-sm text-slate-100 outline-none focus:border-emerald-400"
                placeholder="Collez ici l'offre d'emploi pour analyse…"
              />
            </div>
            <div className="grid gap-2 text-xs text-slate-400">
              <span>Étapes :</span>
              <ol className="list-inside list-decimal space-y-1">
                <li>Importer votre CV via le panneau de droite</li>
                <li>Collez l'offre et lancez l'analyse</li>
                <li>Générez le CV et la lettre adaptés</li>
              </ol>
              {store.jobOffer?.keywords?.length ? (
                <div className="mt-3 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-[11px] text-emerald-200">
                  <p className="mb-2 font-semibold uppercase tracking-wide">Mots-clés détectés</p>
                  <div className="flex flex-wrap gap-1">
                    {store.jobOffer.keywords.map((keyword: string) => (
                      <span
                        key={keyword}
                        className="rounded-full bg-emerald-500/20 px-2 py-1 text-[10px] font-medium text-emerald-200"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  {store.jobOffer.location && (
                    <p className="mt-2 text-[10px] uppercase text-emerald-300">
                      Localisation estimée : {store.jobOffer.location}
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </Panel>

        <Panel
          title="CV & Lettre adaptés"
          actions={
            <ToolbarButton
              label={adaptMutation.isPending ? 'Adaptation…' : 'Adapter CV + lettre'}
              onClick={() => adaptMutation.mutate()}
              disabled={!store.profile || !store.jobOffer || adaptMutation.isPending}
            />
          }
          className="w-1/2"
        >
          <div className="space-y-6">
            <FileDropzone
              accept={['.pdf', '.docx', '.doc', '.png', '.jpg', '.jpeg']}
              onFileSelected={(path) => importMutation.mutateAsync(path)}
            />

            {store.profile && (
              <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-300">
                <p className="text-base font-semibold text-emerald-300">{store.profile.fullName}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {store.profile.skills.length} compétences • {store.profile.experiences.length} expériences •{' '}
                  {store.profile.education.length} formations
                </p>
                {store.extraction?.warnings.length ? (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-amber-300">
                    {store.extraction.warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            )}

            {exportInfo && (
              <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-200">
                <p className="font-semibold">Exports générés</p>
                <p className="mt-1 break-all">CV : {exportInfo.resumePath}</p>
                <p className="break-all">Lettre : {exportInfo.coverLetterPath}</p>
              </div>
            )}

            {store.adaptation && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    className={`rounded-md px-3 py-1 ${
                      adaptTab === 'resume'
                        ? 'bg-emerald-500 text-emerald-50'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                    onClick={() => setAdaptTab('resume')}
                  >
                    CV adapté
                  </button>
                  <button
                    type="button"
                    className={`rounded-md px-3 py-1 ${
                      adaptTab === 'cover'
                        ? 'bg-emerald-500 text-emerald-50'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                    onClick={() => setAdaptTab('cover')}
                  >
                    Lettre de motivation
                  </button>
                  <button
                    type="button"
                    className={`rounded-md px-3 py-1 ${
                      adaptTab === 'diff'
                        ? 'bg-emerald-500 text-emerald-50'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                    onClick={() => setAdaptTab('diff')}
                  >
                    Modifications
                  </button>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 text-sm">
                  {adaptTab === 'resume' && (
                    <HighlightText
                      text={store.adaptation.adaptedResume}
                      highlights={store.adaptation.highlights.filter((span) => span.type !== 'removal')}
                    />
                  )}
                  {adaptTab === 'cover' && (
                    <HighlightText
                      text={store.adaptation.adaptedCoverLetter}
                      highlights={store.adaptation.highlights.filter((span) => span.type !== 'removal')}
                    />
                  )}
                  {adaptTab === 'diff' && (
                    <HighlightText text={store.adaptation.adaptedResume} highlights={store.adaptation.highlights} />
                  )}
                </div>
              </div>
            )}

            {store.error && (
              <div className="rounded-md border border-rose-600 bg-rose-950/70 p-3 text-sm text-rose-200">
                {store.error}
              </div>
            )}
          </div>
        </Panel>
      </main>
    </div>
  );
}
