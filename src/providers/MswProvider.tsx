import { PropsWithChildren, useEffect, useState } from 'react';

export function MswProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(import.meta.env.PROD);

  useEffect(() => {
    if (import.meta.env.PROD) return;
    async function startWorker() {
      const { worker } = await import('../services/mocks/browser');
      await worker.start({ onUnhandledRequest: 'bypass' });
      setReady(true);
    }
    startWorker().catch((error) => {
      console.error('Failed to start MSW', error);
      setReady(true);
    });
  }, []);

  if (!ready) {
    return <div className="p-6">Preparing API mocks…</div>;
  }

  return <>{children}</>;
}
