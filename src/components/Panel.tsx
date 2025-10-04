import type { PropsWithChildren, ReactNode } from 'react';
import { clsx } from 'clsx';

interface PanelProps {
  title: string;
  actions?: ReactNode;
  className?: string;
}

export function Panel({ title, actions, className, children }: PropsWithChildren<PanelProps>) {
  return (
    <section
      className={clsx(
        'flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md',
        className,
      )}
    >
      <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
        {actions && <div className="flex items-center gap-2 text-sm text-slate-600">{actions}</div>}
      </header>
      <div className="flex-1 overflow-auto px-5 py-4">{children}</div>
    </section>
  );
}
