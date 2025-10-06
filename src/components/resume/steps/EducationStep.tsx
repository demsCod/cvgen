import React from 'react';
import { useCvStore } from '../../../hooks/useCvStore';

interface Props { onNext: () => void; onBack: () => void; }

const EducationStep: React.FC<Props> = ({ onNext, onBack }) => {
  const profile = useCvStore(s => s.profile);
  const { updateProfile, addEducation, removeEducation } = useCvStore();
  if (!profile) return null;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Éducation</h3>
        <button onClick={addEducation} className="text-sm text-indigo-600">+ Ajouter</button>
      </div>
      <div className="space-y-4">
        {profile.education.map((ed, idx) => (
          <div key={idx} className="border rounded p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input placeholder="Diplôme" className="border rounded px-3 py-2" value={ed.degree || ''} onChange={e => {
                const education = [...profile.education];
                education[idx] = { ...education[idx], degree: e.target.value };
                updateProfile({ education });
              }} />
              <input placeholder="École" className="border rounded px-3 py-2" value={ed.school || ''} onChange={e => {
                const education = [...profile.education];
                education[idx] = { ...education[idx], school: e.target.value };
                updateProfile({ education });
              }} />
              <input placeholder="Début" className="border rounded px-3 py-2" value={ed.start || ''} onChange={e => {
                const education = [...profile.education];
                education[idx] = { ...education[idx], start: e.target.value };
                updateProfile({ education });
              }} />
              <input placeholder="Fin" className="border rounded px-3 py-2" value={ed.end || ''} onChange={e => {
                const education = [...profile.education];
                education[idx] = { ...education[idx], end: e.target.value };
                updateProfile({ education });
              }} />
            </div>
            <div className="flex justify-end">
              <button onClick={() => removeEducation(idx)} className="text-xs text-red-600">Supprimer</button>
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

export default EducationStep;
