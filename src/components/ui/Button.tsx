import React from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const base = 'inline-flex items-center gap-2 font-medium rounded-md px-4 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
const variants: Record<Variant,string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-500',
  secondary: 'bg-white text-slate-800 ring-1 ring-slate-300 hover:bg-slate-50 focus-visible:ring-indigo-500',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-indigo-500'
};

export function Button({variant='primary', className, children, loading, iconLeft, iconRight, ...rest}: ButtonProps) {
  return (
    <button className={clsx(base, variants[variant], className)} disabled={loading || rest.disabled} {...rest}>
      {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />}
      {!loading && iconLeft}
      <span>{children}</span>
      {!loading && iconRight}
    </button>
  );
}
