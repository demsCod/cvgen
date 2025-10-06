import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCvStore } from '../../hooks/useCvStore';
import { useCvFiles } from '../../hooks/useCvFiles';

const CreateResumeForm = () => {
    const [title, setTitle] = useState('');
    const [error , setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const setProfile = useCvStore(s => s.setProfile);
    const saveCvToFile = useCvStore(s => s.saveCvToFile);
    const setStage = useCvStore(s => s.setStage);
    const setErrorStore = useCvStore(s => s.setError);
    const currentCvId = useCvStore(s => s.currentCvId);
    const { saveCv } = useCvFiles();


    const handleCreateResume = async (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim().length < 2) {
            setError('Le titre doit contenir au moins 2 caractères.');
            return;
        }
        try {
            const id = `cv_${Date.now()}`;
            const profile = {
              id,
              fullName: title,
              summary: 'Résumé à compléter',
              experiences: [],
              skills: [],
              education: [],
              projects: [],
              languages: []
            };
            await saveCv(id, profile as any);
            navigate(`/resume/${id}`);
        } catch (err) {
            console.error(err);
            setError('Une erreur est survenue lors de la création du CV. Veuillez réessayer.');
        }
    };
    return (
       <div className='w-full max-w-md'>
           <h1 className='text-xl font-semibold mb-4'>Créer un CV</h1>
           <form onSubmit={handleCreateResume}>
               <div className='mb-4'>
                   <label htmlFor='title' className='block text-sm font-medium text-gray-700'>
                       Titre
                   </label>
                   <input
                       type='text'
                       id='title'
                       value={title}
                       onChange={(e) => setTitle(e.target.value)}
                       placeholder='CV ux/ui, CV développeur...'
                       className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                   />
                   {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
               </div>
               <button
                   type='submit'
                   className='w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition'
               >
                   Créer le CV
               </button>
           </form>
       </div>
    );
};

export default CreateResumeForm;
