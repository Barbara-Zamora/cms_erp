import * as TabsPrimitive from '@radix-ui/react-tabs';
import { ReactNode } from 'react';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  items: Array<{ value: string; label: string; content: ReactNode }>;
}

export function Tabs({ value, onValueChange, items }: TabsProps) {
  return (
    <TabsPrimitive.Root value={value} onValueChange={onValueChange}>
      <TabsPrimitive.List className="flex items-center gap-2 border-b border-slate-200 pb-2 dark:border-slate-700">
        {items.map((item) => (
          <TabsPrimitive.Trigger
            key={item.value}
            value={item.value}
            className="rounded-md px-3 py-1.5 text-sm font-medium outline-none data-[state=active]:bg-primary data-[state=active]:text-white"
          >
            {item.label}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
      {items.map((item) => (
        <TabsPrimitive.Content key={item.value} value={item.value} className="py-4">
          {item.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  );
}
