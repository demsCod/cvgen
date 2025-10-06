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
import FormSection from '@/components/resume/FormSection';
import ChatAssistant from '@/components/chat/ChatAssistant';
import TemplateOne from '@/components/ResumeTemplates/TemplateOne';
import { FiEdit2, FiSave, FiTrash2, FiLayout } from 'react-icons/fi';
import { useCvFiles } from '@/hooks/useCvFiles';
import { mapProfileToResumeData } from '@/utils/profileMappers';
export default function EditResume(){
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const profile = useCvStore(s => s.profile);
  const loadCvFromFile = useCvStore(s => s.loadCvFromFile);
  const saveCvToFile = useCvStore(s => s.saveCvToFile);
  const deleteCv = useCvFiles().deleteCv;
  const updateProfile = useCvStore(s => s.updateProfile);
  const [editingTitle, setEditingTitle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (resumeId) {
      loadCvFromFile(resumeId);
    }
  }, [resumeId, loadCvFromFile]);

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
  return (
    <DashboardLayout   className="w-full  mx-auto flex justify-center" activeMenu="home">
      <div className="w-full  ">
        <header className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3">
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded hover:bg-slate-100" title="Changer de template" aria-label="Template"><FiLayout /></button>
            <button onClick={() => handleSave(false)} className="p-2 rounded hover:bg-slate-100 text-green-600" title="Sauvegarder" aria-label="Sauvegarder"><FiSave /></button>
            <button onClick={handleDelete} className="p-2 rounded hover:bg-slate-100 text-red-600" title="Supprimer" aria-label="Supprimer"><FiTrash2 /></button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex justify-center ">
          {/* Colonne Formulaire - Défiler avec la page */}
          <div className="space-y-2 font-sans">
            <FormSection title="Informations Personnelles" defaultOpen>
              <PersonalBasicsStep onNext={() => {}} />
            </FormSection>
            
            <FormSection title="Contact">
              <ContactInfoStep onNext={() => {}} onBack={() => {}} />
            </FormSection>
            
            <FormSection title="Expériences">
              <ExperiencesStep onNext={() => {}} onBack={() => {}} />
            </FormSection>
            
            <FormSection title="Formation">
              <EducationStep onNext={() => {}} onBack={() => {}} />
            </FormSection>
            
            <FormSection title="Compétences">
              <SkillsStep onNext={() => {}} onBack={() => {}} />
            </FormSection>
            
            <FormSection title="Projets">
              <ProjectsStep onNext={() => {}} onBack={() => {}} />
            </FormSection>
            
            <FormSection title="Langues">
              <LanguagesStep onNext={() => {}} onBack={() => {}} />
            </FormSection>
          </div>

          {/* Colonne Chat - Sticky avec hauteur fixe */}
          <div className="md:sticky md:top-4 h-[calc(100vh-200px)] flex flex-col bg-white border rounded-lg shadow overflow-hidden">
            
            <div className="flex-1 overflow-hidden">
              <ChatAssistant />
            </div>
          </div>

          {/* Colonne Preview - Sticky */}
          <div className="md:sticky md:top-4 h-[calc(100vh-200px)] flex flex-col flex justify-center items-center  overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              {profile ? (
                <div className="transform scale-[0.50] origin-top">
                  <TemplateOne templateId="template1" resumeData={mapProfileToResumeData(profile)} template="template1" />
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  Chargement de l'aperçu...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
