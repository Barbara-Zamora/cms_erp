import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      dashboard: 'Dashboard',
      content: 'Content',
      media: 'Media',
      menus: 'Menus',
      taxonomies: 'Taxonomies',
      users: 'Users',
      roles: 'Roles',
      settings: 'Settings',
      webhooks: 'Webhooks',
      auditLog: 'Audit log',
      login: 'Sign in',
      logout: 'Sign out',
      search: 'Search',
      create: 'Create',
    },
  },
  es: {
    translation: {
      dashboard: 'Panel',
      content: 'Contenido',
      media: 'Medios',
      menus: 'Menús',
      taxonomies: 'Taxonomías',
      users: 'Usuarios',
      roles: 'Roles',
      settings: 'Configuración',
      webhooks: 'Webhooks',
      auditLog: 'Registro',
      login: 'Iniciar sesión',
      logout: 'Cerrar sesión',
      search: 'Buscar',
      create: 'Crear',
    },
  },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
}

export default i18n;
