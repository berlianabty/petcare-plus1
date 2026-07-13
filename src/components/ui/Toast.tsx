import { useToast, type ToastVariant } from '../../hooks/useToast';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

const variantConfig: Record<ToastVariant, { icon: typeof CheckCircle2; color: string }> = {
  success: { icon: CheckCircle2, color: 'text-emerald-500' },
  error: { icon: XCircle, color: 'text-red-500' },
  warning: { icon: AlertCircle, color: 'text-amber-500' },
  info: { icon: Info, color: 'text-blue-500' },
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {toasts.map((toast) => {
        const { icon: Icon, color } = variantConfig[toast.variant];
        return (
          <div
            key={toast.id}
            className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 px-4 py-3 min-w-[280px] max-w-sm animate-slide-in"
          >
            <Icon className={`h-5 w-5 shrink-0 ${color}`} />
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
