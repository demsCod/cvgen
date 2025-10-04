import React from 'react';
import { Card, CardHeader, CardSection } from '../../components/ui/Card';
import { TextArea } from '../../components/ui/TextArea';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { StageIndicator } from '../../components/StageIndicator';

export default function EditResume(){
  const [analyzing, setAnalyzing] = React.useState(false);
  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Adaptation</h1>
          <p className="mt-1 text-sm text-slate-600">Collez votre CV et l’offre pour générer des suggestions ciblées.</p>
        </div>
        <StageIndicator />
      </header>
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader title="CV" description="Collez le contenu brut de votre CV" />
          <CardSection>
            <TextArea placeholder="Expériences, compétences..." hint="Pas de mise en forme nécessaire." />
          </CardSection>
        </Card>
        <Card className="flex flex-col">
          <CardHeader title="Offre" description="Collez l’offre ou un extrait" />
          <CardSection>
            <TextArea placeholder="Missions, profil recherché..." />
          </CardSection>
        </Card>
      </div>
      <div className="flex items-center gap-4">
        <Button onClick={()=>{setAnalyzing(true); setTimeout(()=>setAnalyzing(false),1500);}} disabled={analyzing}>
          {analyzing ? <><Spinner size={16} className="text-white" /> Analyse...</> : 'Analyser'}
        </Button>
        <Button variant="secondary" disabled={!analyzing}>Adapter</Button>
      </div>
    </div>
  );
}
