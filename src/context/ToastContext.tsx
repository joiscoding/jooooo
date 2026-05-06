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

const DEFAULT_DURATION_MS = 2600;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(() => setMessage(''), DEFAULT_DURATION_MS);
    return () => window.clearTimeout(t);
  }, [message]);

  const showToast = useCallback((msg: string) => {
    setMessage(msg);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="global-toast"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        hidden={!message}
      >
        {message}
      </div>
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
