import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type ToastContextValue = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 2400;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [message]);

  const showToast = useCallback((next: string) => {
    setMessage(next);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {message && (
        <div className="global-toast" role="status" aria-live="polite">
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}
