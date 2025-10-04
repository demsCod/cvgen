import React from 'react';
import { useCvStore } from '../hooks/useCvStore';
import { Badge } from './ui/Badge';

const labels: Record<string,string> = {
  idle: 'En attente',
  extracting: 'Extraction',
  adapting: 'Adaptation',
  ready: 'Prêt',
  error: 'Erreur'
};

export function StageIndicator(){
  const stage = useCvStore(s=>s.stage);
  return <Badge tone={stage==='error' ? 'rose' : stage==='ready' ? 'green' : 'indigo'}>{labels[stage]}</Badge>;
}
