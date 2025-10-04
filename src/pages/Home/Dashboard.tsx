import React from 'react';
import { Card, CardHeader, CardSection } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { NavLink } from 'react-router-dom';

export default function Dashboard(){
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between bg-red-100">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Mon espace</h1>
          <p className="mt-1 text-sm text-slate-600">Centralisez vos CV et adaptations récentes.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">Importer un CV</Button>
          <NavLink to="/resume/new"><Button>Nouvelle adaptation</Button></NavLink>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader title="Dernière adaptation" description="Résumé rapide" />
          <CardSection>
            <p className="text-sm text-slate-600">Aucune adaptation encore — commencez maintenant.</p>
            <Button className="mt-2 px-3 py-1.5 text-xs">Adapter</Button>
          </CardSection>
        </Card>
        <Card>
          <CardHeader title="Mots-clés identifiés" />
          <CardSection>
            <div className="flex flex-wrap gap-2">
              {['API','React','TypeScript','CI/CD'].map(k => <Badge key={k} tone="indigo">{k}</Badge>)}
            </div>
          </CardSection>
        </Card>
        <Card>
          <CardHeader title="Prochaines actions" />
          <CardSection>
            <ul className="list-disc pl-4 text-sm text-slate-600 space-y-1">
              <li>Importer un CV initial</li>
              <li>Coller une offre</li>
              <li>Lancer l’analyse</li>
            </ul>
          </CardSection>
        </Card>
      </div>
    </div>
  );
}
