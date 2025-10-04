import React from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {label, error, hint, className, id, ...rest}, ref
){
  const inputId = id || rest.name;
  return (
    <div className={clsx('grid gap-1', className)}>
      {label && <label htmlFor={inputId} className="text-sm font-medium text-slate-700">{label}</label>}
      <input id={inputId} ref={ref} className={clsx('w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50', error && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/30')} {...rest} />
      {error ? <p className="text-xs font-medium text-rose-600">{error}</p> : hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
});
