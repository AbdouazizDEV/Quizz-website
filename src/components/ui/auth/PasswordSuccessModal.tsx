import { Icon } from '@components/ui/Icon';

export function PasswordSuccessModal() {
  return (
    <div className="auth-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="auth-success-title">
      <div className="auth-modal-card">
        <div className="auth-spark-ring" aria-hidden>
          <span className="auth-spark-dot auth-spark-dot--t" />
          <span className="auth-spark-dot auth-spark-dot--r" />
          <span className="auth-spark-dot auth-spark-dot--b" />
          <span className="auth-spark-dot auth-spark-dot--l" />
        </div>
        <div className="auth-avatar">
          <Icon name="user" size={38} color="#FFFFFF" />
        </div>
        <h2 id="auth-success-title" className="auth-modal-title">
          Réussi !
        </h2>
        <p className="auth-modal-subtitle">Attendez un instant, nous nous préparons pour vous...</p>
        <div className="auth-loader auth-loader--gold" aria-hidden />
      </div>
    </div>
  );
}
