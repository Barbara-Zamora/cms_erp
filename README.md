# Modern CMS Admin

Panel administrativo modular construido con React, TypeScript, Vite y TailwindCSS. Incluye mocks de API con MSW, control de permisos (RBAC), gestión de contenido, medios, menús, taxonomías, usuarios, ajustes, webhooks y registro de auditoría.

## Requisitos

- Node 18+
- pnpm (recomendado)

## Instalación

```bash
pnpm install
```

## Desarrollo

```bash
pnpm dev
```

El proyecto inicia MSW automáticamente en modo desarrollo para servir los endpoints `/api/*`.

## Tests

```bash
pnpm test
```

## Lint

```bash
pnpm lint
```

## Formato

```bash
pnpm format
```

## Estructura principal

```
src/
  app/           # Layouts y rutas principales
  components/    # UI reutilizable (botones, tablas, formularios, toasts, etc.)
  modules/       # Módulos de dominio (content, media, menus, taxonomies, users, settings, webhooks, audit)
  providers/     # Contextos globales (tema, auth, toasts, MSW)
  services/      # Cliente API y mocks MSW
  hooks/         # Hooks reutilizables (useApiResource, usePermission)
  types/         # Modelos TypeScript
  styles/        # Estilos globales y Tailwind
```

## Variables de entorno

No se requieren variables adicionales para el mock. El worker de MSW gestiona los endpoints en el navegador.

## Accesibilidad e i18n

- Layout responsivo con sidebar colapsable y topbar.
- Textos disponibles en inglés y español mediante i18next.
- Componentes accesibles con soporte de teclado y estados de foco.

## Estado y permisos

- `AuthProvider` simula login, logout y refresh tokens.
- `usePermission` permite ocultar o deshabilitar acciones según el rol asignado.

## Mock API

- Se utiliza [MSW](https://mswjs.io/) para interceptar peticiones `fetch` hacia `/api/*`.
- Endpoints disponibles para contenido, medios, menús, taxonomías, usuarios, roles, ajustes, webhooks y auditoría.
