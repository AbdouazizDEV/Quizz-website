import { Link } from 'react-router-dom';
import { Routes } from '@constants/Routes';

export function ForgotPasswordPage() {
  return (
    <div className="auth-page">
      <div className="auth-inner">
        <h1>Mot de passe</h1>
        <p className="muted">
          Quizz+ n’utilise plus de mot de passe comme flux principal. Connecte-toi avec une passkey.
        </p>
        <Link to={Routes.LOGIN} className="btn btn-primary" style={{ marginTop: 24, display: 'inline-flex' }}>
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
