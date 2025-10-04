import React from 'react';
import { Card, CardHeader, CardSection } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function Login(){
  return (
    <div className="mx-auto max-w-sm">
      <Card className="bg-white/80 backdrop-blur">
        <CardHeader title="Connexion" description="Accédez à votre espace" />
        <CardSection>
          <form className="space-y-4">
            <Input name="email" type="email" label="Email" placeholder="vous@exemple.com" />
            <Input name="password" type="password" label="Mot de passe" />
            <Button className="w-full mt-2">Se connecter</Button>
          </form>
        </CardSection>
      </Card>
    </div>
  );
}
