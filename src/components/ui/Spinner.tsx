import React from 'react';

export function Spinner({size=20, className}:{size?:number; className?:string;}) {
  return (
    <svg className={['animate-spin text-indigo-600', className].filter(Boolean).join(' ')} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
