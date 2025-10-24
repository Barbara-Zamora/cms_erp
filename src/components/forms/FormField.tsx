import { ReactNode } from 'react';
import { FieldError } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  description?: string;
  error?: FieldError;
  required?: boolean;
  children: ReactNode;
  id: string;
}

export function FormField({ label, description, error, required, children, id }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required ? <span aria-hidden className="text-rose-600">*</span> : null}
      </label>
      {description ? <p className="text-xs text-slate-500">{description}</p> : null}
      <div className="mt-1" id={id}>
        {children}
      </div>
      {error ? <p className="text-xs text-rose-600">{error.message}</p> : null}
    </div>
  );
}
