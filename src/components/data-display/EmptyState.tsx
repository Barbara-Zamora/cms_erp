import { ReactNode } from 'react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
      {icon}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description ? <p className="text-sm text-slate-500">{description}</p> : null}
      {action ? (
        <Button onClick={action.onClick} variant="secondary">
          {action.label}
        </Button>
      ) : null}
    </div>
  );
}
