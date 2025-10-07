import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { useCvStore } from '@/hooks/useCvStore';
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
import Modal from '@/components/Modal';
export default function EditResume() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const profile = useCvStore(state => state.profile);
  const loadCvFromFile = useCvStore(state => state.loadCvFromFile);
  const saveCvToFile = useCvStore(state => state.saveCvToFile);
  const deleteCv = useCvFiles().deleteCv;
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (resumeId) {
      loadCvFromFile(resumeId);
    }
  }, [resumeId, loadCvFromFile]);

  async function handleSave(exit?: boolean) {
    setIsLoading(true);
    try {
      await saveCvToFile();
      if (exit) navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save CV:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    try {
      setIsLoading(true);
      if (resumeId) {
        const success = await deleteCv(resumeId);
        if (success) {
          navigate('/dashboard');
        } else {
          alert('Échec de la suppression du CV.');
        }
      }
    } catch (error) {
      console.error('Failed to delete CV:', error);
      alert('Une erreur est survenue lors de la suppression.');
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  }

  return (
    <DashboardLayout className="w-full mx-auto justify-start " activeMenu="home">
      <div className="w-full xl:min-w-[1000px] 2xl:min-w-[1800px]  mx-auto px-4 2xl:px-8">
        <header className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-3"></div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded hover:bg-slate-100" title="Changer de template" aria-label="Template">
              <FiLayout />
            </button>
            <button 
              onClick={() => handleSave(false)} 
              className="p-2 rounded hover:bg-slate-100 text-green-600" 
              title="Sauvegarder" 
              aria-label="Sauvegarder"
              disabled={isLoading}
            >
              <FiSave />
            </button>
            <button 
              onClick={() => setShowDeleteModal(true)} 
              className="p-2 rounded hover:bg-slate-100 text-red-600" 
              title="Supprimer" 
              aria-label="Supprimer"
            >
              <FiTrash2 />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8 2xl:gap-12">
          {/* Colonne Formulaire - Défiler avec la page */}
          <div className="space-y-4 font-sans px-2 md:px-4">
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
          <div className="md:sticky md:top-4 h-[calc(100vh-200px)] flex flex-col bg-white border rounded-lg shadow-lg overflow-hidden lg:min-w-[300px] xl:min-w-[500px] 2xl:min-w-[700px]">
            <div className="flex-1 overflow-hidden">
              <ChatAssistant />
            </div>
          </div>

          {/* Colonne Preview - Sticky */}
          <div className="md:sticky md:top-4 h-[calc(100vh-200px)]  xl:ml-40 flex flex-col  rounded-lg  w-full lg:min-w-[600px] xl:min-w-[700px] 2xl:min-w-[800px] ">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 w-full">
              <div className="flex justify-center items-center w-full ">
                {profile ? (
                  <div className="transform scale-[0.45] sm:scale-[0.5] md:scale-[0.55] lg:scale-[0.6] xl:scale-[0.55] 2xl:scale-[1] origin-top transition-transform duration-200 ">
                    <TemplateOne 
                      templateId="template1" 
                      resumeData={mapProfileToResumeData(profile)} 
                      template="template1" 
                    />
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
      </div>

      <Modal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Supprimer le CV"
      >
        <p className="mb-4">Êtes-vous sûr de vouloir supprimer ce CV ? Cette action est irréversible.</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
            onClick={() => setShowDeleteModal(false)}
          >
            Annuler
          </button>
          <button
            className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-50"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </Modal>

    </DashboardLayout>
  );
}
