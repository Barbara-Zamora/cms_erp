import * as PopoverPrimitive from '@radix-ui/react-popover';
import { ReactNode } from 'react';

interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
}

export function Popover({ trigger, children }: PopoverProps) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Content className="rounded-md border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900">
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Root>
  );
}
