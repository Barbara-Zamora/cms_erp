import { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

type ToggleProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  pressed?: boolean;
};

export function Toggle({ pressed, className, children, ...props }: ToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={clsx(
        'inline-flex items-center rounded-full border px-3 py-1 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        pressed
          ? 'border-primary bg-primary text-white'
          : 'border-slate-300 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
