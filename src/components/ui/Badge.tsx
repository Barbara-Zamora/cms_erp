import { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        {
          default: 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100',
          success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-700 dark:text-emerald-100',
          warning: 'bg-amber-100 text-amber-800 dark:bg-amber-700 dark:text-amber-100',
          danger: 'bg-rose-100 text-rose-800 dark:bg-rose-700 dark:text-rose-100',
        }[variant],
        className,
      )}
      {...props}
    />
  );
}
