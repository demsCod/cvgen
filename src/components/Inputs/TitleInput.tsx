
import { useState } from 'react';
import { LuCheck, LuPencil } from 'react-icons/lu';
type TitleInputProps = {
  title: string;
  setTitle: (value: string) => void;
};

const TitleInput = ({ title, setTitle }: TitleInputProps) => {

  const [showInput, setShowInput] = useState(false);
  return (
    <div className=''>
     {showInput ? (
        <>
        <input
          type='text'
          placeholder='Titre du CV'
          className='"text-sm md:text-lg font-semibold border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button className='ml-2 px-3 py-1 rounded bg-green-600 text-white' >
          <LuCheck className='w-4 h-4 text-indigo-200' onClick={() => setShowInput(prevState => !prevState)} />
        </button>
        </>
      ) : (
        <>
        <h2 className='text-2xl font-semibold'>{title}</h2>
        <button className='ml-2 px-3 py-1 rounded bg-indigo-600 text-white' onClick={() => setShowInput(prevState => !prevState)}>
           <LuPencil className='w-4 h-4 text-indigo-200' onClick={() => setShowInput(prevState => !prevState)} />
        </button>
        </>
      )}
    </div>
  );
};

export default TitleInput;