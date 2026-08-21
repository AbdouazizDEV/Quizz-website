import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export interface ShowAppErrorOptions {
  title?: string;
  confirmLabel?: string;
  retryLabel?: string;
  onClose?: () => void;
  onRetry?: () => void;
}

interface AppErrorContextValue {
  showAppError: (message: string, options?: ShowAppErrorOptions) => void;
  hideAppError: () => void;
}

const AppErrorContext = createContext<AppErrorContextValue | null>(null);

interface AppErrorState {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  retryLabel: string;
  onClose?: () => void;
  onRetry?: () => void;
}

const initialState: AppErrorState = {
  visible: false,
  title: 'Erreur',
  message: '',
  confirmLabel: 'Compris',
  retryLabel: 'Réessayer',
};

export function AppErrorProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppErrorState>(initialState);

  const hideAppError = useCallback(() => {
    setState((prev) => ({ ...prev, visible: false }));
  }, []);

  const showAppError = useCallback((message: string, options?: ShowAppErrorOptions) => {
    setState({
      visible: true,
      title: options?.title?.trim() || 'Erreur',
      message: message.trim() || 'Une erreur inattendue est survenue.',
      confirmLabel: options?.confirmLabel ?? 'Compris',
      retryLabel: options?.retryLabel ?? 'Réessayer',
      onClose: options?.onClose,
      onRetry: options?.onRetry,
    });
  }, []);

  const handleClose = useCallback(() => {
    const callback = state.onClose;
    hideAppError();
    callback?.();
  }, [hideAppError, state.onClose]);

  const handleRetry = useCallback(() => {
    const callback = state.onRetry;
    hideAppError();
    callback?.();
  }, [hideAppError, state.onRetry]);

  const value = useMemo(() => ({ showAppError, hideAppError }), [hideAppError, showAppError]);

  return (
    <AppErrorContext.Provider value={value}>
      {children}
      {state.visible ? (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="app-error-title">
          <div className="modal-card">
            <h2 id="app-error-title">{state.title}</h2>
            <p className="muted" style={{ margin: '12px 0 20px', whiteSpace: 'pre-wrap' }}>
              {state.message}
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              {state.onRetry ? (
                <button type="button" className="btn btn-ghost" onClick={handleRetry}>
                  {state.retryLabel}
                </button>
              ) : null}
              <button type="button" className="btn btn-primary" onClick={handleClose}>
                {state.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </AppErrorContext.Provider>
  );
}

export function useAppError(): AppErrorContextValue {
  const ctx = useContext(AppErrorContext);
  if (!ctx) throw new Error('useAppError must be used within AppErrorProvider');
  return ctx;
}
