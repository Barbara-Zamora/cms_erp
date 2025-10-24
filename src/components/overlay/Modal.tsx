import * as Dialog from '@radix-ui/react-dialog';
import { ReactNode } from 'react';

interface ModalProps {
  title: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export function Modal({ title, description, open, onOpenChange, children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed inset-0 m-auto flex h-fit w-full max-w-lg flex-col gap-4 rounded-lg bg-white p-6 shadow-xl focus:outline-none dark:bg-slate-900">
          <div className="space-y-2">
            <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
            {description ? <Dialog.Description className="text-sm text-slate-500">{description}</Dialog.Description> : null}
          </div>
          <div>{children}</div>
          <Dialog.Close className="self-end text-sm underline">Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
