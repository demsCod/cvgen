import React, { useCallback, useEffect, useRef } from 'react';
import { Card, CardHeader, CardSection } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Hook to extract and preserve the original background location (landing page) when modal first opened
function useBackgroundLocation(){
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | undefined;
  return state?.backgroundLocation;
}

interface AuthModalProps {
  mode: 'login' | 'signup';
  onClose?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ mode, onClose }) => {
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const backgroundLocation = useBackgroundLocation();
  const focusableRef = useRef<HTMLElement[]>([]);
  const isLogin = mode === 'login';

  // Scroll lock & key listeners & focus trap initialization
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'Tab') handleTab(e);
    };
    window.addEventListener('keydown', keyHandler);

    // Collect focusable elements inside dialog
    if (dialogRef.current){
      const selectors = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
      focusableRef.current = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(selectors))
        .filter(el => !el.hasAttribute('disabled'));
      // Focus first meaningful element (title or first input)
      const firstInput = focusableRef.current.find(el => el.tagName === 'INPUT') || focusableRef.current[0];
      firstInput?.focus();
    }
    const previouslyFocused = document.activeElement as HTMLElement | null;
    return () => {
      window.removeEventListener('keydown', keyHandler);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  const handleTab = useCallback((e: KeyboardEvent) => {
    if (focusableRef.current.length === 0) return;
    const list = focusableRef.current;
    const active = document.activeElement as HTMLElement | null;
    let idx = list.indexOf(active || list[0]);
    if (e.shiftKey){
      idx = idx <= 0 ? list.length - 1 : idx - 1;
    } else {
      idx = idx === list.length - 1 ? 0 : idx + 1;
    }
    e.preventDefault();
    list[idx]?.focus();
  }, []);

  const handleClose = () => {
    if (onClose) onClose();
    navigate('/', { replace: false });
  };

  const title = isLogin ? 'Connexion' : 'Créer un compte';
  const description = isLogin ? 'Accédez à votre espace' : 'Rejoignez la plateforme';

  return (
  <div className="fixed inset-0 z-50 flex items-center justify-center" aria-describedby="auth-modal-desc">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" aria-hidden="true" onClick={handleClose} />
      <div role="dialog" aria-modal="true" aria-label={title} ref={dialogRef} tabIndex={-1} className="relative mx-4 w-full max-w-md animate-in fade-in zoom-in rounded-xl shadow-xl focus:outline-none">
  <Card className="bg-white/90 backdrop-blur">
          <CardHeader title={title} description={description} />
          <CardSection>
            <form className="space-y-4">
              {!isLogin && (<Input name="fullname" label="Nom complet" placeholder="Jane Doe" />)}
              <Input name="email" type="email" label="Email" placeholder="vous@exemple.com" />
              <Input name="password" type="password" label="Mot de passe" />
              {!isLogin && (<Input name="passwordConfirm" type="password" label="Confirmer le mot de passe" />)}
              <Button className="w-full mt-2">{isLogin ? 'Se connecter' : "S'inscrire"}</Button>
              <div className="relative py-2 text-center text-xs text-slate-500" id="auth-modal-desc">
                <span className="bg-white/90 px-2">ou</span>
                <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-slate-200" />
              </div>
              <Button type="button" variant="ghost" className="w-full border border-slate-300 bg-white hover:bg-slate-50">Continuer avec Google</Button>
              <p className="pt-2 text-center text-sm text-slate-600">
                {isLogin ? (
                  <>Pas de compte ? <Link
                    to="/signup"
                    state={backgroundLocation ? { backgroundLocation } : undefined}
                    className="text-blue-600 hover:underline"
                  >Créer un compte</Link></>
                ) : (
                  <>Vous avez déjà un compte ? <Link
                    to="/login"
                    state={backgroundLocation ? { backgroundLocation } : undefined}
                    className="text-blue-600 hover:underline"
                  >Connexion</Link></>
                )}
              </p>
            </form>
          </CardSection>
        </Card>
        <button onClick={handleClose} className="absolute right-3 top-3 rounded p-1 text-slate-500 hover:bg-slate-200/60 focus:outline-none focus:ring" aria-label="Fermer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
