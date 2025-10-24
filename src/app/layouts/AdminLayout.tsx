import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { Breadcrumbs } from '../../components/navigation/Breadcrumbs';
import { useMemo } from 'react';

export function AdminLayout() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const crumbs = useMemo(
    () =>
      segments.map((segment, index) => ({
        label: segment,
        path: `/${segments.slice(0, index + 1).join('/')}`,
      })),
    [segments],
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-slate-200 bg-white/70 px-6 py-3 dark:border-slate-800 dark:bg-slate-900/80">
            <Breadcrumbs items={crumbs} />
          </div>
          <main className="flex-1 overflow-y-auto px-6 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
