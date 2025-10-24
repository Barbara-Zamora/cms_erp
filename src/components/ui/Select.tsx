import { SelectHTMLAttributes } from 'react';
import { clsx } from 'clsx';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={clsx(
        'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
