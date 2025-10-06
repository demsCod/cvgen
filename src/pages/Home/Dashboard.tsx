import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import ResumeSummaryCard from '../../components/Cards/ResumeSummaryCard';
import { useCvFiles } from '../../hooks/useCvFiles';
import { useCvStore } from '../../hooks/useCvStore';
import Modal from '../../components/Modal';
import CreateResumeForm from './CreateResumeForm';


export default function Dashboard(){
  const navigate = useNavigate();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [allResumes, setAllResumes] = useState<{ id: string; title: string; updatedAt: string }[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { listCvsMeta } = useCvFiles();
  const loadCvFromFile = useCvStore(s => s.loadCvFromFile);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await listCvsMeta();
        if (mounted) setAllResumes(data);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);
  

  return (
    <DashboardLayout activeMenu="home">
      <div className=" px-4 md:px-8 mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">Mes CV</h2>
      </div>
      {loading && (
        <div className="px-4 md:px-8 text-sm text-slate-500">Chargement des CV...</div>
      )}
      {!loading && allResumes && allResumes.length === 0 && (
        <div className="px-4 md:px-8 text-sm text-slate-500">Aucun CV pour l'instant. Créez-en un !</div>
      )}
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
        {!loading && allResumes && allResumes.map((resume) => (
          <ResumeSummaryCard
            key={resume.id}
            imgUrl={null}
            title={resume.title}
            lastUpdate={resume.updatedAt ? moment(resume.updatedAt).format('DD/MM/YYYY') : 'Jamais'}
            onSelect={async () => {
              await loadCvFromFile(resume.id);
              navigate(`/resume/${resume.id}`);
            }}
          />
        ))}
      </div>
        <Modal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)} hideHeader>
          <div className="p-4">
            <CreateResumeForm />
          </div>
        </Modal>
    </DashboardLayout>
  );
}
