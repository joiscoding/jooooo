import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const DEFAULT_DURATION_MS = 2600;

type ToastContextValue = {
  showToast: (message: string, durationMs?: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState(DEFAULT_DURATION_MS);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => {
      setMessage('');
    }, duration);
    return () => clearTimeout(t);
  }, [message, duration]);

  const showToast = useCallback((text: string, durationMs: number = DEFAULT_DURATION_MS) => {
    const m = text.trim();
    if (!m) return;
    setDuration(Math.max(400, durationMs));
    setMessage(m);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {message && (
        <p className="toast-global" role="status" aria-live="polite">
          {message}
        </p>
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
