interface DefisStateViewsProps {
  loading?: boolean;
  error?: Error | string | null;
  empty?: string | null;
  onRetry?: () => void;
}

export function DefisStateViews({ loading, error, empty, onRetry }: DefisStateViewsProps) {
  if (loading) {
    return (
      <div className="defis-state">
        <div className="defis-spinner" aria-label="Chargement" />
      </div>
    );
  }

  if (error) {
    const message = error instanceof Error ? error.message : error;
    return (
      <div className="defis-state">
        <p className="defis-error">{message || 'Impossible de charger les défis.'}</p>
        {onRetry ? (
          <button type="button" className="defis-retry" onClick={onRetry}>
            Réessayer
          </button>
        ) : null}
      </div>
    );
  }

  if (empty) {
    return (
      <div className="defis-state">
        <p className="defis-muted">{empty}</p>
      </div>
    );
  }

  return null;
}
