import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from './layouts/AdminLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardPage } from '../modules/content/pages/DashboardPage';
import { ContentListPage } from '../modules/content/pages/ContentListPage';
import { ContentEditorPage } from '../modules/content/pages/ContentEditorPage';
import { MediaLibraryPage } from '../modules/media/MediaLibraryPage';
import { MenusPage } from '../modules/menus/MenusPage';
import { TaxonomiesPage } from '../modules/taxonomies/TaxonomiesPage';
import { UsersPage } from '../modules/users/UsersPage';
import { RolesPage } from '../modules/users/RolesPage';
import { SettingsPage } from '../modules/settings/SettingsPage';
import { WebhooksPage } from '../modules/webhooks/WebhooksPage';
import { AuditLogPage } from '../modules/audit/AuditLogPage';
import { LoginPage } from '../modules/users/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SchedulerPage } from '../modules/content/pages/SchedulerPage';

export default function App() {
  useTranslation();

  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <Routes>
        <Route element={<AuthLayout />}> 
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="content">
            <Route index element={<ContentListPage defaultTab="pages" />} />
            <Route path=":type" element={<ContentListPage />} />
            <Route path=":type/new" element={<ContentEditorPage mode="create" />} />
            <Route path=":type/:id" element={<ContentEditorPage mode="edit" />} />
          </Route>
          <Route path="media" element={<MediaLibraryPage />} />
          <Route path="menus" element={<MenusPage />} />
          <Route path="taxonomies" element={<TaxonomiesPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="webhooks" element={<WebhooksPage />} />
          <Route path="audit-log" element={<AuditLogPage />} />
          <Route path="scheduled" element={<SchedulerPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Suspense>
  );
}
