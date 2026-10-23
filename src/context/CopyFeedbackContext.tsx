import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type CopyFeedbackContextValue = {
  notifyCopySuccess: (message?: string) => void;
  notifyCopyError: (message?: string) => void;
};

const CopyFeedbackContext = createContext<CopyFeedbackContextValue | null>(
  null,
);

export function CopyFeedbackProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ text: string; variant: 'ok' | 'err' } | null>(
    null,
  );

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const notifyCopySuccess = useCallback((message = 'Link copied.') => {
    setToast({ text: message, variant: 'ok' });
  }, []);

  const notifyCopyError = useCallback((message = 'Could not copy link.') => {
    setToast({ text: message, variant: 'err' });
  }, []);

  const value = useMemo(
    () => ({ notifyCopySuccess, notifyCopyError }),
    [notifyCopySuccess, notifyCopyError],
  );

  return (
    <CopyFeedbackContext.Provider value={value}>
      {children}
      {toast && (
        <div
          className={
            toast.variant === 'ok' ? 'site-toast site-toast--ok' : 'site-toast site-toast--err'
          }
          role="status"
          aria-live="polite"
        >
          {toast.text}
        </div>
      )}
    </CopyFeedbackContext.Provider>
  );
}

export function useCopyFeedback(): CopyFeedbackContextValue {
  const ctx = useContext(CopyFeedbackContext);
  if (!ctx) {
    throw new Error('useCopyFeedback must be used within CopyFeedbackProvider');
  }
  return ctx;
}
