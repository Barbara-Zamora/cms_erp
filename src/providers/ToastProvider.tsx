import { createContext, useContext, useMemo, useState } from 'react';
import { PropsWithChildren } from 'react';
import { ToastContainer } from '../components/feedback/ToastContainer';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  tone?: 'success' | 'error' | 'info' | 'warning';
}

interface ToastContextValue {
  toasts: ToastMessage[];
  pushToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const value = useMemo<ToastContextValue>(() => ({
    toasts,
    pushToast: (toast) =>
      setToasts((prev) => [...prev, { ...toast, id: crypto.randomUUID() }]),
    dismissToast: (id) => setToasts((prev) => prev.filter((item) => item.id !== id)),
  }), [toasts]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={value.dismissToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('Toast context missing');
  }
  return ctx;
}
