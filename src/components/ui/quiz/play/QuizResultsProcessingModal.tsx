interface QuizResultsProcessingModalProps {
  visible: boolean;
}

export function QuizResultsProcessingModal({ visible }: QuizResultsProcessingModalProps) {
  if (!visible) return null;

  return (
    <div
      className="quiz-results-processing-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-results-processing-title"
      aria-busy="true"
    >
      <div className="quiz-results-processing-card">
        <div className="quiz-results-processing-loader" aria-hidden="true">
          <span className="quiz-results-processing-ring quiz-results-processing-ring--outer" />
          <span className="quiz-results-processing-ring quiz-results-processing-ring--inner" />
          <span className="quiz-results-processing-core">✨</span>
        </div>
        <h2 id="quiz-results-processing-title" className="quiz-results-processing-title">
          Résultats en cours de traitement
        </h2>
        <p className="quiz-results-processing-subtitle">Calcul de votre score…</p>
        <div className="quiz-results-processing-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
