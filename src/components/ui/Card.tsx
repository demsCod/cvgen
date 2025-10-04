import React from 'react';
import clsx from 'clsx';

export function Card({className, children}: React.PropsWithChildren<{className?: string;}>) {
  return <div className={clsx('rounded-lg bg-white shadow-sm ring-1 ring-slate-200/70 p-5', className)}>{children}</div>;
}

export function CardHeader({title, description, actions}:{title:string; description?:string; actions?:React.ReactNode;}) {
  return (
    <div className="mb-4 flex items-start gap-4">
      <div className="flex-1">
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
      </div>
      {actions}
    </div>
  );
}

export function CardSection({children,className}:{children:React.ReactNode;className?:string;}) {
  return <div className={clsx('mt-4 space-y-3', className)}>{children}</div>;
}
