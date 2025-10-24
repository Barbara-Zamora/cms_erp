import { PropsWithChildren } from 'react';
import '../lib/i18n';
import { ThemeProvider } from './ThemeProvider';
import { ToastProvider } from './ToastProvider';
import { AuthProvider } from './AuthProvider';
import { MswProvider } from './MswProvider';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <MswProvider>
      <AuthProvider>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </AuthProvider>
    </MswProvider>
  );
}
