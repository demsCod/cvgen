import React from 'react';
import { useCvStore } from '../../../hooks/useCvStore';

interface Props { onNext: () => void; onBack: () => void; }

const ExperiencesStep: React.FC<Props> = ({ onNext, onBack }) => {
  const profile = useCvStore(s => s.profile);
  const { updateProfile, addExperience, removeExperience } = useCvStore();
  if (!profile) return null;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button onClick={addExperience} className="text-sm text-indigo-600">+ Ajouter</button>
      </div>
      <div className="space-y-4">
        {profile.experiences.map((exp, idx) => (
          <div key={exp.id || idx} className="border rounded p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Poste" className="border rounded px-3 py-2" value={exp.role || ''} onChange={e => {
                const experiences = [...profile.experiences];
                experiences[idx] = { ...experiences[idx], role: e.target.value };
                updateProfile({ experiences });
              }} />
              <input placeholder="Entreprise" className="border rounded px-3 py-2" value={exp.company || ''} onChange={e => {
                const experiences = [...profile.experiences];
                experiences[idx] = { ...experiences[idx], company: e.target.value };
                updateProfile({ experiences });
              }} />
              <input placeholder="Début" className="border rounded px-3 py-2" value={exp.start || ''} onChange={e => {
                const experiences = [...profile.experiences];
                experiences[idx] = { ...experiences[idx], start: e.target.value };
                updateProfile({ experiences });
              }} />
              <input placeholder="Fin" className="border rounded px-3 py-2" value={exp.end || ''} onChange={e => {
                const experiences = [...profile.experiences];
                experiences[idx] = { ...experiences[idx], end: e.target.value };
                updateProfile({ experiences });
              }} />
            </div>
            <textarea placeholder="Description" className="w-full border rounded px-3 py-2" value={exp.description || ''} onChange={e => {
              const experiences = [...profile.experiences];
              experiences[idx] = { ...experiences[idx], description: e.target.value };
              updateProfile({ experiences });
            }} />
            <div className="flex justify-end">
              <button onClick={() => exp.id && removeExperience(exp.id!)} className="text-xs text-red-600">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <button onClick={onBack} className="px-4 py-2 border rounded">Retour</button>
        <button onClick={onNext} className="px-4 py-2 bg-indigo-600 text-white rounded">Suivant</button>
      </div>
    </div>
  );
};

export default ExperiencesStep;
