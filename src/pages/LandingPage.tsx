import React from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardSection } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { NavLink } from 'react-router-dom';

const features = [
  { title: 'Import intelligent', description: 'Extrait automatiquement le texte de votre CV existant (PDF / DOCX).' },
  { title: 'Analyse sémantique', description: 'Détection des mots-clés manquants face à l’offre.' },
  { title: 'Adaptation assistée', description: 'Propositions de reformulations ciblées.' },
  { title: 'Export propre', description: 'Téléchargez une version prête à envoyer.' },
];

export default function LandingPage(){
  return (
    <div className="relative">
      {/* Header local spécifique à la landing (on n'utilise pas position: absolute pour qu'il reste visible) */}
      <header
        className="sticky top-0 z-20 w-full  backdrop-blur-md"
        aria-label="Barre principale"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <NavLink to="/" className="text-xl font-semibold tracking-tight text-slate-900 font-display">CVGen</NavLink>
          <div className="flex items-center gap-3">
            <NavLink to="/login">
              <Button variant="primary">Login / Signup</Button>
            </NavLink>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-14 text-center sm:pt-20">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Optimisez votre CV avec l’IA
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
          CVGen analyse une offre, détecte les écarts et vous aide à adapter votre CV pour maximiser vos chances.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <NavLink to="/dashboard"><Button variant="primary">Commencer</Button></NavLink>
          <NavLink to="/login"><Button variant="ghost">Se connecter</Button></NavLink>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto mt-16 grid max-w-5xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(f => (
          <Card key={f.title} className="bg-white/70 backdrop-blur">
            <CardHeader title={f.title} />
            <CardSection>
              <p className="text-sm leading-relaxed text-slate-600">{f.description}</p>
            </CardSection>
          </Card>
        ))}
      </section>
    </div>
  );
}
