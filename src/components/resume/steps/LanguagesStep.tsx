import React from 'react';
import { useCvStore } from '../../../hooks/useCvStore';

interface Props { onNext: () => void; onBack: () => void; }

const LanguagesStep: React.FC<Props> = ({ onNext, onBack }) => {
  const profile = useCvStore(s => s.profile);
  const { updateProfile, addLanguage, removeLanguage } = useCvStore();
  if (!profile) return null;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Langues</h3>
        <button onClick={addLanguage} className="text-sm text-indigo-600">+ Ajouter</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profile.languages.map((lng, idx) => (
          <div key={lng.id || idx} className="border rounded p-3 flex items-center gap-2">
            <input className="flex-1 border rounded px-2 py-1" value={lng.name} onChange={e => {
              const languages = [...profile.languages];
              languages[idx] = { ...languages[idx], name: e.target.value };
              updateProfile({ languages });
            }} />
            <button onClick={() => lng.id && removeLanguage(lng.id)} className="text-xs text-red-600">X</button>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <button onClick={onBack} className="px-4 py-2 border rounded">Retour</button>
        <button onClick={onNext} className="px-4 py-2 bg-indigo-600 text-white rounded">Terminer</button>
      </div>
    </div>
  );
};

export default LanguagesStep;
