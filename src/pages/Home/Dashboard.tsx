import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import CvPreviewCard from '../../components/Cards/CvPreviewCard';
import { useCvFiles } from '../../hooks/useCvFiles';
import { useCvStore } from '../../hooks/useCvStore';
import Modal from '@/components/Modal';
import CreateResumeForm from './CreateResumeForm';


export default function Dashboard(){
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  interface ResumeItem {
    id: string;
    title: string;
    updatedAt: string;
    data?: any;
    isDeleting?: boolean;
  }
  
  const [allResumes, setAllResumes] = useState<ResumeItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { listCvsMeta, loadCv, deleteCv } = useCvFiles();
  const loadCvFromFile = useCvStore(s => s.loadCvFromFile);
  const resetStore = useCvStore(s => s.reset);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);

  const refreshCvs = async () => {
    try {
      setLoading(true);
      const metaData = await listCvsMeta();
      const resumesWithData = await Promise.all(
        metaData.map(async (resume) => {
          try {
            const data = await loadCv(resume.id);
            if (!data) {
              return null;
            }
            return { ...resume, data };
          } catch (error) {
            console.log(`Erreur lors du chargement du CV ${resume.id}:`, error);
            return null;
          }
        })
      );
      // Filtrer les CV qui n'ont pas pu être chargés
      setAllResumes(resumesWithData.filter(resume => resume !== null));
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des CVs:", error);
      setAllResumes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (mounted) await refreshCvs();
    })();
    return () => { mounted = false; };
  }, []);
  

  return (
    <DashboardLayout activeMenu="home">
      <div className="px-4 md:px-8 mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">Mes CV</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 px-4 md:px-8 pb-10">
        {/* New CV tile first */}
        <div
          className="h-[300px] flex flex-col gap-3 items-center justify-center bg-white border border-indigo-200 cursor-pointer border-dashed rounded-lg hover:bg-indigo-50 transition"
          onClick={() => setOpenCreateModal(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setOpenCreateModal(true); } }}
          aria-label="Créer un nouveau CV"
        >
          <div className='w-10 h-10 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-md'>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-xs font-medium text-indigo-700">Nouveau CV</span>
        </div>
        {allResumes && allResumes.map((resume) => (
          <CvPreviewCard
            key={resume.id}
            title={resume.title}
            lastUpdate={resume.updatedAt ? moment(resume.updatedAt).format('DD/MM/YYYY') : 'Jamais'}
            resumeData={resume.data}
            isDeleting={resume.isDeleting}
            onEdit={async () => {
              await loadCvFromFile(resume.id);
              navigate(`/resume/${resume.id}`);
            }}
            onView={() => {
              navigate(`/resume/${resume.id}`);
            }}
            onDelete={() => {
              setSelectedResumeId(resume.id);
              setDeleteModalOpen(true);
            }}
          />
        ))}
      </div>

      {/* Modal de création */}
      <Modal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)} hideHeader>
        <div className="p-4">
          <CreateResumeForm onSuccess={refreshCvs} />
        </div>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal 
        isOpen={deleteModalOpen} 
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedResumeId(null);
        }}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
          <p className="text-gray-600 mb-6">
            Êtes-vous sûr de vouloir supprimer ce CV ? Cette action est irréversible.
          </p>
          <div className="flex justify-end gap-4">
            <button
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedResumeId(null);
              }}
            >
              Annuler
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              disabled={loading}
              onClick={async () => {
                if (!selectedResumeId) return;
                
                // Marquer ce CV spécifique comme en cours de suppression
                setAllResumes((current) => 
                  current ? current.map(cv => 
                    cv.id === selectedResumeId ? { ...cv, isDeleting: true } : cv
                  ) : []
                );

                try {
                  const success = await deleteCv(selectedResumeId);
                  if (success) {
                    // Réinitialiser le store Zustand si nécessaire
                    resetStore();
                    // Supprimer uniquement le CV concerné
                    setAllResumes((current) => 
                      current ? current.filter(cv => cv.id !== selectedResumeId) : []
                    );
                  } else {
                    // En cas d'échec, retirer l'état de suppression
                    setAllResumes((current) => 
                      current ? current.map(cv => 
                        cv.id === selectedResumeId ? { ...cv, isDeleting: false } : cv
                      ) : []
                    );
                    console.error("Échec de la suppression du CV");
                    alert("Échec de la suppression du CV. Veuillez réessayer.");
                  }
                } catch (error) {
                  // En cas d'erreur, retirer l'état de suppression
                  setAllResumes((current) => 
                    current ? current.map(cv => 
                      cv.id === selectedResumeId ? { ...cv, isDeleting: false } : cv
                    ) : []
                  );
                  console.error("Erreur lors de la suppression du CV:", error);
                  alert("Une erreur est survenue lors de la suppression du CV.");
                }
                
                setDeleteModalOpen(false);
                setSelectedResumeId(null);
              }}
            >
              Supprimer
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
