import React from 'react';
import { useCvStore } from '../../../hooks/useCvStore';

interface Props { onNext: () => void; onBack: () => void; }

const ProjectsStep: React.FC<Props> = ({ onNext, onBack }) => {
  const profile = useCvStore(s => s.profile);
  const { updateProfile, addProject, removeProject } = useCvStore();
  if (!profile) return null;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Projets</h3>
        <button onClick={addProject} className="text-sm text-indigo-600">+ Ajouter</button>
      </div>
      <div className="space-y-4">
        {profile.projects.map((pr, idx) => (
          <div key={pr.id || idx} className="border rounded p-4 space-y-3">
            <input placeholder="Nom du projet" className="w-full border rounded px-3 py-2" value={pr.name || ''} onChange={e => {
              const projects = [...profile.projects];
              projects[idx] = { ...projects[idx], name: e.target.value };
              updateProfile({ projects });
            }} />
            <textarea placeholder="Description" className="w-full border rounded px-3 py-2" value={pr.description || ''} onChange={e => {
              const projects = [...profile.projects];
              projects[idx] = { ...projects[idx], description: e.target.value };
              updateProfile({ projects });
            }} />
            <input placeholder="Technologies (séparées par des virgules)" className="w-full border rounded px-3 py-2" value={(pr.tech || []).join(', ')} onChange={e => {
              const projects = [...profile.projects];
              projects[idx] = { ...projects[idx], tech: e.target.value.split(',').map(t => t.trim()).filter(Boolean) };
              updateProfile({ projects });
            }} />
            <div className="flex justify-end">
              <button onClick={() => pr.id && removeProject(pr.id)} className="text-xs text-red-600">Supprimer</button>
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

export default ProjectsStep;
