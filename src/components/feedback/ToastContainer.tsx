import { ToastMessage } from '../../providers/ToastProvider';
import { clsx } from 'clsx';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

const toneStyles: Record<NonNullable<ToastMessage['tone']>, string> = {
  success: 'bg-emerald-600 text-white',
  error: 'bg-rose-600 text-white',
  info: 'bg-sky-600 text-white',
  warning: 'bg-amber-500 text-slate-900',
};

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={clsx(
            'w-80 rounded-md shadow-lg px-4 py-3 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
            toneStyles[toast.tone ?? 'info'],
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">{toast.title}</p>
              {toast.description ? <p className="text-sm">{toast.description}</p> : null}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-sm underline"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
