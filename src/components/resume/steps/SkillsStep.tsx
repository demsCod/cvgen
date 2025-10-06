import React from 'react';
import { useCvStore } from '../../../hooks/useCvStore';

interface Props { onNext: () => void; onBack: () => void; }

const SkillsStep: React.FC<Props> = ({ onNext, onBack }) => {
  const profile = useCvStore(s => s.profile);
  const { updateProfile, addSkill, removeSkill } = useCvStore();
  if (!profile) return null;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Compétences</h3>
        <button onClick={addSkill} className="text-sm text-indigo-600">+ Ajouter</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profile.skills.map((sk, idx) => (
          <div key={sk.id || idx} className="border rounded p-3 flex items-center gap-2">
            <input className="flex-1 border rounded px-2 py-1" value={sk.name} onChange={e => {
              const skills = [...profile.skills];
              skills[idx] = { ...skills[idx], name: e.target.value };
              updateProfile({ skills });
            }} />
            <button onClick={() => sk.id && removeSkill(sk.id)} className="text-xs text-red-600">X</button>
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

export default SkillsStep;
