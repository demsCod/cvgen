import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useCvStore } from '../../hooks/useCvStore';
import PersonalBasicsStep from '@/components/resume/steps/PersonalBasicsStep';
import ContactInfoStep from '@/components/resume/steps/ContactInfoStep';
import ExperiencesStep from '@/components/resume/steps/ExperiencesStep';
import EducationStep from '@/components/resume/steps/EducationStep';
import SkillsStep from '@/components/resume/steps/SkillsStep';
import ProjectsStep from '@/components/resume/steps/ProjectsStep';
import LanguagesStep from '@/components/resume/steps/LanguagesStep';
import { FiEdit2, FiSave, FiTrash2, FiLayout } from 'react-icons/fi';
import { useCvFiles } from '@/hooks/useCvFiles';
export default function EditResume(){
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const profile = useCvStore(s => s.profile);
  const loadCvFromFile = useCvStore(s => s.loadCvFromFile);
  const saveCvToFile = useCvStore(s => s.saveCvToFile);
  const deleteCv = useCvFiles().deleteCv;
  const updateProfile = useCvStore(s => s.updateProfile);
  const [editingTitle, setEditingTitle] = useState(false);
  const [step, setStep] = useState(0);
  const steps = ['Profil', 'Contact', 'Expériences', 'Éducation', 'Compétences', 'Projets', 'Langues'];
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (resumeId) {
      loadCvFromFile(resumeId);
    }
  }, [resumeId, loadCvFromFile]);

  const goNext = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const goBack = () => setStep(s => Math.max(s - 1, 0));

  async function handleSave(exit?: boolean) {
    await saveCvToFile();
    if (exit) navigate('/dashboard');
  }

  async function handleDelete() {
    if (resumeId && confirm('Supprimer ce CV ?')) {
      await deleteCv(resumeId);
      navigate('/dashboard');
    }
  }

  function renderStep() {
    switch(step) {
      case 0: return <PersonalBasicsStep onNext={goNext} />;
      case 1: return <ContactInfoStep onNext={goNext} onBack={goBack} />;
      case 2: return <ExperiencesStep onNext={goNext} onBack={goBack} />;
      case 3: return <EducationStep onNext={goNext} onBack={goBack} />;
      case 4: return <SkillsStep onNext={goNext} onBack={goBack} />;
      case 5: return <ProjectsStep onNext={goNext} onBack={goBack} />;
      case 6: return <LanguagesStep onNext={() => { /* last step */ }} onBack={goBack} />;
      default: return null;
    }
  }
  return (
    <DashboardLayout activeMenu="home">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <header className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {editingTitle ? (
                <input
                  autoFocus
                  className="text-2xl font-semibold border-b border-indigo-400 focus:outline-none px-1"
                  value={profile?.title || ''}
                  onChange={(e) => updateProfile({ title: e.target.value })}
                  onBlur={() => setEditingTitle(false)}
                />
              ) : (
                <h1 className="text-2xl font-semibold flex items-center gap-2">
                  {profile?.title || 'Titre du CV'}
                  <button onClick={() => setEditingTitle(true)} className="text-indigo-500 hover:text-indigo-600" aria-label="Modifier le titre">
                    <FiEdit2 />
                  </button>
                </h1>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded hover:bg-slate-100" title="Changer de template" aria-label="Template"><FiLayout /></button>
              <button onClick={() => handleSave(false)} className="p-2 rounded hover:bg-slate-100 text-green-600" title="Sauvegarder" aria-label="Sauvegarder"><FiSave /></button>
              <button onClick={handleDelete} className="p-2 rounded hover:bg-slate-100 text-red-600" title="Supprimer" aria-label="Supprimer"><FiTrash2 /></button>
            </div>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm">
            {steps.map((label, i) => (
              <button
                key={label}
                onClick={() => setStep(i)}
                className={`px-3 py-1 rounded border ${i === step ? 'bg-indigo-600 text-white border-indigo-600' : 'hover:bg-slate-100'}`}
              >
                {i + 1}. {label}
              </button>
            ))}
          </nav>
        </header>
        <section className="bg-white border rounded-md shadow p-6">
          {renderStep()}
        </section>
        <footer className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <button onClick={() => navigate('/dashboard')} className="px-4 py-2 border rounded">Retour Dashboard</button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleSave(true)} className="px-4 py-2 border rounded">Save & Exit</button>
            {step < steps.length -1 && <button onClick={goNext} className="px-4 py-2 bg-indigo-600 text-white rounded">Next</button>}
          </div>
        </footer>
      </div>
    </DashboardLayout>
  );
}
