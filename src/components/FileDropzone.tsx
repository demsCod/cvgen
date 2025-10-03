import { useState, type DragEvent } from 'react';
import { open } from '@tauri-apps/api/dialog';
import { clsx } from 'clsx';
import { FileUp, Loader2 } from 'lucide-react';

interface FileDropzoneProps {
  accept?: string[];
  onFileSelected: (path: string) => Promise<void>;
}

export function FileDropzone({ accept, onFileSelected }: FileDropzoneProps) {
  const [isHovering, setHovering] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  const handleChoose = async () => {
    setError(undefined);
    const files = await open({
      multiple: false,
      filters: accept?.map((ext) => ({ name: ext.toUpperCase(), extensions: [ext.replace('.', '')] })),
    });

    if (!files || Array.isArray(files)) {
      return;
    }

    try {
      setBusy(true);
      await onFileSelected(files);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de l\'import.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-700 bg-slate-800/60 px-6 py-10 text-center transition-colors',
        isHovering && 'border-emerald-400 bg-slate-800/90',
      )}
  onDragOver={(event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setHovering(true);
      }}
      onDragLeave={() => setHovering(false)}
  onDrop={async (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setHovering(false);
        const file = event.dataTransfer.files.item(0);
        if (!file) return;
        try {
          setBusy(true);
          // In a Tauri context, dropped files expose path via file.path
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const droppedPath = (file as any).path as string | undefined;
          if (!droppedPath) {
            throw new Error('Impossible de lire le chemin du fichier.');
          }
          await onFileSelected(droppedPath);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Échec de l\'import.');
        } finally {
          setBusy(false);
        }
      }}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-900/80 ring-1 ring-slate-700">
        {busy ? <Loader2 className="h-6 w-6 animate-spin text-emerald-400" /> : <FileUp className="h-6 w-6 text-emerald-400" />}
      </div>
      <div className="space-y-1">
        <p className="text-lg font-semibold">Déposez votre CV</p>
        <p className="text-sm text-slate-400">Formats acceptés : PDF, Word, PNG, JPG</p>
      </div>
      <button
        type="button"
        className="mt-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-50 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={busy}
        onClick={handleChoose}
      >
        {busy ? 'Import en cours…' : 'Choisir un fichier'}
      </button>
      {error && <p className="text-sm text-rose-300">{error}</p>}
    </div>
  );
}
