import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';

const navItems = [
  { to: '/admin/dashboard', labelKey: 'dashboard', icon: '🏠' },
  { to: '/admin/content', labelKey: 'content', icon: '📝' },
  { to: '/admin/media', labelKey: 'media', icon: '🖼️' },
  { to: '/admin/menus', labelKey: 'menus', icon: '🧭' },
  { to: '/admin/taxonomies', labelKey: 'taxonomies', icon: '🏷️' },
  { to: '/admin/users', labelKey: 'users', icon: '👥' },
  { to: '/admin/roles', labelKey: 'roles', icon: '🛡️' },
  { to: '/admin/settings', labelKey: 'settings', icon: '⚙️' },
  { to: '/admin/webhooks', labelKey: 'webhooks', icon: '🔗' },
  { to: '/admin/audit-log', labelKey: 'auditLog', icon: '📜' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();

  return (
    <aside
      className={clsx(
        'flex h-full flex-col border-r border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-900/80 backdrop-blur',
        collapsed ? 'w-20' : 'w-64',
      )}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <span className="text-lg font-semibold">CMS</span>
        <button
          type="button"
          className="rounded border px-2 py-1 text-xs"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '»' : '«'}
        </button>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800',
                isActive ? 'bg-slate-200 dark:bg-slate-800' : undefined,
              )
            }
          >
            <span aria-hidden>{item.icon}</span>
            {!collapsed && <span>{t(item.labelKey)}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
