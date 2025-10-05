import type { PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';
import React from 'react';

const steps = [
  { key: 'import', label: 'Import' },
  { key: 'analyze', label: 'Analyse' },
  { key: 'adapt', label: 'Adaptation' },
  { key: 'export', label: 'Export' }
];

function Stepper({activeIndex=0}:{activeIndex?:number;}) {
  return (
    <ol className="flex flex-wrap gap-4 text-sm">
      {steps.map((s,i)=>{
        const active = i===activeIndex;
        return (
          <li key={s.key} className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold ring-1 ring-inset "> 
              {i+1}
            </span>
            <span className={active ? 'font-medium text-slate-900' : 'text-slate-500'}>{s.label}</span>
            {i < steps.length-1 && <span className="mx-1 h-px w-6 bg-slate-300" />}
          </li>
        );
      })}
    </ol>
  );
}

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col text-slate-800">
      <header className="border-b ">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <NavLink to="/" className="text-lg font-semibold tracking-tight text-slate-900 font-display">
              CVGen
            </NavLink>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <NavLink to="/" className={({isActive})=> isActive ? 'text-slate-900 font-medium' : 'text-slate-600 hover:text-slate-900'}>Accueil</NavLink>
              <NavLink to="/dashboard" className={({isActive})=> isActive ? 'text-slate-900 font-medium' : 'text-slate-600 hover:text-slate-900'}>Dashboard</NavLink>
              <NavLink to="/login" className={({isActive})=> isActive ? 'text-slate-900 font-medium' : 'text-slate-600 hover:text-slate-900'}>Login</NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <NavLink to="/login" className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:inline-flex">Se connecter</NavLink>
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="mb-8 hidden md:block">
          <Stepper activeIndex={0} />
        </div>
        {children}
      </div>
      <footer className="mt-auto border-t bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} CVGen</span>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-700">Code</a>
        </div>
      </footer>
    </div>
  );
}