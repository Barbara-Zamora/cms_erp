import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { ReactNode } from 'react';

interface DropdownMenuProps {
  trigger: ReactNode;
  items: Array<{ label: string; onSelect: () => void }>;
}

export function DropdownMenu({ trigger, items }: DropdownMenuProps) {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>{trigger}</Dropdown.Trigger>
      <Dropdown.Content
        className="min-w-[160px] rounded-md border border-slate-200 bg-white p-1 text-sm shadow-lg dark:border-slate-700 dark:bg-slate-800"
        align="end"
      >
        {items.map((item) => (
          <Dropdown.Item
            key={item.label}
            className="cursor-pointer rounded px-2 py-1.5 outline-none hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-slate-700"
            onSelect={item.onSelect}
          >
            {item.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
