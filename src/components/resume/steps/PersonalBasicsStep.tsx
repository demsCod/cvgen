import React from 'react';
import { useCvStore } from '../../../hooks/useCvStore';

interface Props { onNext: () => void; }

const PersonalBasicsStep: React.FC<Props> = ({ onNext }) => {
  const profile = useCvStore(s => s.profile);
  const update = useCvStore(s => s.updateProfile);
  if (!profile) return null;
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Nom complet</label>
        <input className="w-full border rounded px-3 py-2" value={profile.fullName || ''} onChange={e => update({ fullName: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Titre / Poste</label>
        <input className="w-full border rounded px-3 py-2" value={profile.title || ''} onChange={e => update({ title: e.target.value })} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Résumé</label>
        <textarea className="w-full border rounded px-3 py-2 h-28" value={profile.summary || ''} onChange={e => update({ summary: e.target.value })} />
      </div>
      <div className="flex justify-end">
        <button onClick={onNext} className="px-4 py-2 bg-indigo-600 text-white rounded">Suivant</button>
      </div>
    </div>
  );
};

export default PersonalBasicsStep;
