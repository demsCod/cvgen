import { useState } from 'react';
import { cn } from '@/lib/utils';

export const Component = () => {
  const [count, setCount] = useState(0);
  return (
    <div className={cn('flex flex-col items-center gap-4 p-4 rounded-lg border bg-white/5 backdrop-blur-sm shadow')}>      
      <h1 className="text-2xl font-bold mb-2">Component Example</h1>
      <h2 className="text-xl font-semibold">{count}</h2>
      <div className="flex gap-2">
        <button className="px-3 py-1 rounded bg-slate-800 text-white" onClick={() => setCount(prev => prev - 1)}>-</button>
        <button className="px-3 py-1 rounded bg-rose-600 text-white" onClick={() => setCount(prev => prev + 1)}>+</button>
      </div>
    </div>
  );
};
