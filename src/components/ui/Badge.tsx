import React from 'react';
import clsx from 'clsx';

type Tone = 'default' | 'green' | 'rose' | 'indigo';

const tones: Record<Tone,string> = {
  default: 'bg-slate-100 text-slate-700 ring-slate-200',
  green: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
  rose: 'bg-rose-100 text-rose-700 ring-rose-200',
  indigo: 'bg-indigo-100 text-indigo-700 ring-indigo-200'
};

export function Badge({tone='default', children, className}:{tone?:Tone; children:React.ReactNode; className?:string;}) {
  return <span className={clsx('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset', tones[tone], className)}>{children}</span>;
}
