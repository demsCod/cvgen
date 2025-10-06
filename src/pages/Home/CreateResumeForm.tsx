import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateResumeForm = () => {
    const [title, setTitle] = useState('');
    const [error , setError] = useState<string | null>(null);

    const navigate = useNavigate();


    const handleCreateResume = async (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim().length < 2) {
            setError('Le titre doit contenir au moins 2 caractères.');
            return;
        }
        try {
            // Simulate API call to create resume
            const newResumeId = 'newly-created-resume-id'; // Replace with actual ID from API response
            navigate(`/resume/${newResumeId}`);
        } catch (err) {
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
