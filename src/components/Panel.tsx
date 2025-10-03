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
        'flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 shadow-lg backdrop-blur',
        className,
      )}
    >
      <header className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
        <h2 className="text-base font-semibold text-slate-100">{title}</h2>
        {actions && <div className="flex items-center gap-2 text-sm text-slate-300">{actions}</div>}
      </header>
      <div className="flex-1 overflow-auto px-5 py-4">{children}</div>
    </section>
  );
}
