import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'primary', loading, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60',
        {
          primary: 'bg-primary text-primary-foreground hover:bg-indigo-500',
          secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300',
          ghost: 'bg-transparent text-slate-900 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800',
          danger: 'bg-rose-600 text-white hover:bg-rose-700',
        }[variant],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? '…' : null}
      {children}
    </button>
  ),
);

Button.displayName = 'Button';
