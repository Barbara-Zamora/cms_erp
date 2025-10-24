import { useTranslation } from 'react-i18next';
import { useAuth } from '../../providers/AuthProvider';
import { useTheme } from '../../providers/ThemeProvider';
import { Input } from '../../components/ui/Input';
import { DropdownMenu } from '../../components/navigation/DropdownMenu';
import { useToast } from '../../providers/ToastProvider';

export function Topbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const { toggleTheme } = useTheme();
  const { pushToast } = useToast();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    pushToast({ title: 'Language updated', tone: 'info' });
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center gap-4">
        <Input type="search" aria-label={t('search')} placeholder={t('search')} className="w-64" />
      </div>
      <div className="flex items-center gap-4">
        <button type="button" className="rounded border px-3 py-1 text-sm" onClick={toggleTheme}>
          🌗
        </button>
        <DropdownMenu
          trigger={
            <button type="button" className="flex items-center gap-2 rounded px-2 py-1 text-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                {user?.name?.charAt(0) ?? '?'}
              </div>
              <span className="hidden sm:inline">{user?.name}</span>
            </button>
          }
          items={[
            { label: 'English', onSelect: () => changeLanguage('en') },
            { label: 'Español', onSelect: () => changeLanguage('es') },
            { label: t('logout'), onSelect: logout },
          ]}
        />
      </div>
    </header>
  );
}
