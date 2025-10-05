import React from 'react';
import { Card, CardHeader, CardSection } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  return (
    <div className="mx-auto max-w-sm py-10">
      <Card className="bg-white/80 backdrop-blur">
        <CardHeader title="Connexion" description="Accédez à votre espace" />
        <CardSection>
          <form className="space-y-4">
            <Input name="email" type="email" label="Email" placeholder="vous@exemple.com" />
            <Input name="password" type="password" label="Mot de passe" />
            <Button className="w-full mt-2">Se connecter</Button>
            <div className="relative py-2 text-center text-xs text-slate-500">
              <span className="bg-white/80 px-2">ou</span>
              <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-slate-200" />
            </div>
            <Button type="button" variant="ghost" className="w-full border border-slate-300 bg-white hover:bg-slate-50">Continuer avec Google</Button>
            <p className="pt-2 text-center text-sm text-slate-600">
              Pas de compte ? <Link to="/signup" className="text-blue-600 hover:underline">Créer un compte</Link>
            </p>
          </form>
        </CardSection>
      </Card>
    </div>
  );
};

export default Login;
