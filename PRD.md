# PRD — Frontend BSC Dashboard

## 1. Visión general

Aplicación SPA (Single Page Application) para visualizar y gestionar un **Balanced Scorecard (BSC)**. Permite a los usuarios autenticados consultar perspectivas, proyectos y actividades, actualizar el avance de las actividades, y consultar la tabla de ponderaciones del cuadro de mando.

---

## 2. Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Routing | React Router v7 |
| State server | TanStack Query v5 |
| State client | React Context (auth, tema, sidebar) |
| HTTP | Axios (con interceptor JWT + refresh) |
| Estilos | Tailwind CSS v4 (`@theme`, `@custom-variant`, `@utility`) |
| Validación | Zod (schemas desde `bsc-shared`) |
| Tipos compartidos | `bsc-shared` (vía `file:../bsc-shared`) |
| Fuente | Outfit (Google Fonts CDN) |
| Plantilla base | TailAdmin React |

---

## 3. Requisitos funcionales

### 3.1 Autenticación

| ID | Requisito | Detalle |
|----|-----------|---------|
| AUTH-01 | Login con credenciales | Formulario en `/signin` que envía `username` + `password` a `POST /api/auth/login`. Almacena `token`, `refreshToken`, `username`, `role` en `localStorage`. |
| AUTH-02 | Protección de rutas | Todas las rutas del dashboard están envueltas en `<ProtectedRoute>`, que redirige a `/signin` si no hay usuario autenticado. |
| AUTH-03 | Auto-refresh de JWT | El interceptor de Axios detecta respuestas 401, usa el `refreshToken` para obtener un nuevo JWT (`POST /api/auth/refresh`), reencola las peticiones fallidas y actualiza `localStorage`. Si el refresh falla, limpia sesión y redirige a `/signin`. |
| AUTH-04 | Logout | Elimina todos los tokens de `localStorage` y resetea el estado del `AuthContext`. |
| AUTH-05 | Persistencia de sesión | Al recargar la página, el `AuthProvider` lee `localStorage` para restaurar la sesión sin requerir login de nuevo. |

### 3.2 Perspectivas (vista principal)

| ID | Requisito | Detalle |
|----|-----------|---------|
| PERS-01 | Listado de perspectivas | Página `/` muestra tarjetas (`StrategicCard`) con nombre, objetivo, peso y progreso calculado de cada perspectiva. |
| PERS-02 | Cálculo de progreso | Progreso de perspectiva = suma ponderada de progreso de proyectos (peso del proyecto / peso total de proyectos). Progreso de proyecto = promedio de avances de actividades. |
| PERS-03 | KPIs resumen | Se muestran 4 indicadores: Progreso General (%), N.° Perspectivas, N.° Proyectos, Completadas (100%). |
| PERS-04 | Colores por perspectiva | Cada perspectiva tiene un color asociado (`perspectiveColors.ts`): financiero → brand, asociados → blue-light, procesos → violet, aprendizaje → warning. |
| PERS-05 | Semáforo progreso | ≥80 % verde (emerald), ≥50 % ámbar, <50 % rojo. |

### 3.3 Proyectos

| ID | Requisito | Detalle |
|----|-----------|---------|
| PROJ-01 | Agrupación por perspectiva | Página `/proyectos` muestra secciones colapsables por perspectiva. Cada sección muestra barra de color, nombre, badge de peso (% del BSC) y listado de proyectos. |
| PROJ-02 | Tarjetas de proyecto | Cada proyecto se muestra como `ComponentProjectsCard` con nombre y actividades con progreso. |
| PROJ-03 | Navegación a acciones | Click en tarjeta de proyecto navega a `/acciones?expand={projectId}` para resaltar ese proyecto. |
| PROJ-04 | Expand/collapse | Cada sección de perspectiva se puede expandir/colapsar con animación CSS (`max-h` + `opacity`). Si hay `?expand=` en URL, solo esa sección se expande. |

### 3.4 Actividades (Acciones)

| ID | Requisito | Detalle |
|----|-----------|---------|
| ACT-01 | Agrupación por proyecto | Página `/acciones` muestra secciones colapsables por proyecto. Cada sección indica perspectiva contenedora, color de perspectiva, y badge de número de actividades. |
| ACT-02 | Tarjetas de actividad | Cada actividad se muestra como `ActionCard` con nombre y progreso con color semáforo. |
| ACT-03 | Expand/collapse con URL | Igual que PROJ-04, soporta `?expand={projectId}` para expandir una sección específica. |
| ACT-04 | Scroll automático | Al expandir una sección, se hace scroll suave (`scrollIntoView`) al elemento. |

### 3.5 Ingreso de datos (actualización de avance)

| ID | Requisito | Detalle |
|----|-----------|---------|
| DATA-01 | Selectores en cascada | Tres `<select>` en cascada: Perspectiva → Proyecto → Actividad. Cada selector depende del anterior y se deshabilita si no hay selección previa. |
| DATA-02 | Slider de avance | Input `range` de 0 a 100 para ajustar el progreso. Muestra valor actual con color semáforo. Al seleccionar una actividad, el slider se inicializa con su valor actual. |
| DATA-03 | Envío de actualización | Botón "Actualizar Avance" envía `PATCH /api/perspectives/{pid}/projects/{projid}/activities/{aid}/progress` con `{ progress }`. |
| DATA-04 | Feedback visual | Muestra mensaje de éxito animado (`animate-fade-in`) durante 3 s. Muestra mensaje de error si la petición falla. El botón se deshabilita mientras la petición está en curso. |
| DATA-05 | Invalidación de cache | Tras un update exitoso, se invalida la query `["perspectives"]` vía TanStack Query para que todas las vistas se refresquen. |
| DATA-06 | Barra de color de perspectiva | La parte superior del formulario muestra una barra del color de la perspectiva seleccionada, o gradiente arcoíris si no hay selección. |

### 3.6 Tabla de ponderaciones

| ID | Requisito | Detalle |
|----|-----------|---------|
| POND-01 | Vista jerárquica | Página `/ponderaciones` muestra acordeones anidados: Perspectiva → Proyectos → Actividades con tabla. |
| POND-02 | Datos por actividad | Cada fila muestra: nombre de actividad, peso (badge coloreado), avance (badge con semáforo), responsable, cumplimiento. |
| POND-03 | Contadores resumen | Header indica total de perspectivas, proyectos y actividades. |

---

## 4. Estructura de rutas

| Ruta | Componente | Protegida | Descripción |
|------|-----------|-----------|-------------|
| `/signin` | `SignIn` | No | Login |
| `/` | `StrategicLinesTab` | Sí | Perspectivas (Dashboard) |
| `/proyectos` | `ProjectsTab` | Sí | Proyectos agrupados por perspectiva |
| `/acciones` | `ActionsTab` | Sí | Actividades por proyecto |
| `/ingreso-datos` | `DataEntryTab` | Sí | Formulario actualización avance |
| `/ponderaciones` | `WeightingsPage` | Sí | Tabla de ponderaciones jerárquica |
| `*` | `NotFound` | No | 404 |

Todas las rutas protegidas están dentro de `<ProtectedRoute>` + `<AppLayout>` (sidebar + header).

---

## 5. Arquitectura de componentes

```
src/
├── main.tsx                          # Entry point (QueryClientProvider → AuthProvider → ThemeProvider → AppWrapper → App)
├── App.tsx                           # Router definitions
├── context/
│   ├── AuthContext.tsx                # Auth state + localStorage
│   ├── ThemeContext.tsx               # Dark mode toggle (.dark in <html>)
│   └── SidebarContext.tsx             # Sidebar expand/collapse/hover state
├── services/
│   ├── api.ts                        # Axios instance + JWT interceptor + refresh queue
│   ├── authService.ts                # login, refresh, logout
│   └── bscService.ts                 # CRUD perspectives, projects, activities, progress update
├── hooks/
│   ├── usePerspectives.ts            # useQuery + useInvalidatePerspectives
│   ├── useUpdateProgress.ts          # useMutation → PATCH progress + invalidate
│   ├── useModal.ts                   # Modal open/close state
│   └── useGoBack.ts                  # Router goBack
├── types/
│   └── bsc.ts                        # Re-export types from bsc-shared
├── utils/
│   └── perspectiveColors.ts          # Color mapping by perspective ID + progress color
├── layout/
│   ├── AppLayout.tsx                 # Sidebar + Header + Outlet wrapper
│   ├── AppSidebar.tsx                # Navigation sidebar
│   ├── AppHeader.tsx                  # Top bar (search, theme toggle, notifications, user dropdown)
│   ├── SidebarWidget.tsx             # Sidebar footer widget
│   └── Backdrop.tsx                  # Mobile overlay
├── pages/
│   ├── Dashboard/
│   │   ├── StrategicLinesTab.tsx      # Perspectivas view
│   │   ├── ProjectsTab.tsx            # Proyectos view
│   │   ├── ActionsTab.tsx             # Actividades view
│   │   └── DataEntryTab.tsx           # Data entry form
│   ├── WeightingsPage.tsx             # Ponderaciones table
│   ├── AuthPages/
│   │   ├── AuthPageLayout.tsx
│   │   └── SignIn.tsx
│   └── OtherPage/
│       └── NotFound.tsx
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx
│   ├── Cards/
│   │   ├── StrategicCard.tsx          # Perspective summary card
│   │   ├── ComponentProjectsCard.tsx  # Project card with activities
│   │   └── ActionCard.tsx             # Activity card with progress
│   ├── common/
│   │   ├── PageMeta.tsx               # <title> + <meta> via react-helmet-async
│   │   ├── ThemeToggleButton.tsx
│   │   ├── ThemeTogglerTwo.tsx
│   │   └── ScrollToTop.tsx
│   ├── TabsNavigation.tsx
│   ├── header/
│   │   ├── NotificationDropdown.tsx
│   │   └── UserDropdown.tsx
│   ├── form/...                       # Form elements (InputField, Select, MultiSelect, Switch, etc.)
│   ├── ui/...                         # Reusable UI (Modal, Badge, Button, Avatar, Alert, Table, Dropdown)
│   └── ecommerce/...                  # Template demo components
├── icons/
│   └── index.ts                       # Barrel export of SVG icon components (vite-plugin-svgr)
└── index.css                          # Tailwind v4 @theme, @custom-variant, @utility directives
```

---

## 6. Flujo de datos

```
┌──────────────┐     axios (JWT)     ┌──────────────┐
│   FRONT      │ ──────────────────►  │   bsc-api     │
│  (React SPA) │ ◄────────────────── │  (Express)    │
└──────────────┘                      └──────────────┘
       │                                     │
  TanStack Query                       PostgreSQL
  ["perspectives"]                      (Prisma)
       │
  usePerspectives() ─► bscService.fetchPerspectives()
  useUpdateProgress() ─► bscService.updateActivityProgress()
                          │ on success → invalidateQueries(["perspectives"])
```

- **Lectura**: `usePerspectives()` → `fetchPerspectives()` → `GET /api/perspectives` → almacena en cache de TanStack Query.
- **Escritura**: `useUpdateProgress()` → `updateActivityProgress()` → `PATCH /api/perspectives/{pid}/projects/{projid}/activities/{aid}/progress` → en éxito, invalida cache.
- **Auth**: Token JWT en `Authorization: Bearer <token>`. Auto-refresh en 401 con cola de peticiones en espera.

---

## 7. Modelo de datos (tipos TypeScript)

Importados desde `bsc-shared` vía `src/types/bsc.ts`:

```typescript
interface Perspective {
  id: string;
  name: string;
  objective: string;
  weightage: number;
  projects: Project[];
}

interface Project {
  id: string;
  name: string;
  weightage: number;
  strategy: string;
  detail: string;
  activities: Activity[];
}

interface Activity {
  id: string;
  name: string;
  weightage: number;
  progress: number;      // 0–100
  responsibleProcess: string;
  complianceDate: string;
  realizedActivities: string;
}

interface BSCData {
  perspectives: Perspective[];
}
```

---

## 8. Diseño visual y UX

### 8.1 Paleta de colores

| Elemento | Clase Tailwind | Uso |
|----------|---------------|-----|
| Brand/primario | `brand-*` | Botones, sliders, sidebar activo |
| Financiero | `brand-*` (default = azul) | Perspectiva financiera |
| Asociados | `blue-light-*` | Perspectiva asociados/social/comercial |
| Procesos | `violet-*` | Perspectiva procesos internos |
| Aprendizaje | `warning-*` (naranja) | Perspectiva aprendizaje/crecimiento |
| Éxito | `emerald-*` | Progreso ≥80 % |
| Alerta | `amber-*` | Progreso 50–79 % |
| Peligro | `red-*` | Progreso <50 % |
| Grises | `gray-*` | Fondos, bordes, secundario |

### 8.2 Modo oscuro

- Toggle mediante `ThemeContext` que añade/elimina clase `.dark` en `<html>`.
- Tailwind v4 usa `@custom-variant dark (&:is(.dark *))`.
- Todos los componentes usan clases `dark:` para adaptar colores.

### 8.3 Layout

- **Sidebar** (260 px expandido, 80 px colapsado): navegación principal con secciones "Menu" y "Otros". Se colapsa en hover en desktop. En mobile, se overlay con backdrop.
- **Header**: sticky, con search input (desktop), toggle tema, notificaciones, dropdown de usuario.
- **Contenido**: `max-w-screen-2xl` con padding responsive (`p-4 → md:p-6 → 2xl:p-10`).

### 8.4 Tipografía

- Fuente: **Outfit** (Google Fonts CDN, definida en `src/index.css`).
- Headings: `text-xl font-bold`.
- Labels: `text-xs font-semibold uppercase tracking-widest`.

### 8.5 Componentes recurrentes

- **Acordeones**: características de colapso/expand animadas con `max-height` + `opacity` transitions (500 ms).
- **Cards con barra de color**: todas las Cards y secciones usan `<div className="h-1 {colorBar}">` como acento visual.
- **Badges de peso**: `bg-{color}-500/10 text-{color}-700 dark:text-{color}-300` para mostrar porcentajes.
- **Spinners de carga**: `animate-spin rounded-full border-4 border-brand-500 border-t-transparent`.

---

## 9. API endpoints consumidos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login → `{ token, refreshToken, username, role }` |
| POST | `/api/auth/refresh` | Refresh JWT → `{ token }` |
| GET | `/api/perspectives` | Obtener todas las perspectivas con proyectos y actividades |
| GET | `/api/perspectives/:id` | Obtener una perspectiva por ID |
| PATCH | `/api/perspectives/:pid/projects/:projid/activities/:aid/progress` | Actualizar avance de actividad → `{ progress }` |
| POST | `/api/perspectives` | Crear perspectiva (disponible en servicio, no en UI) |
| PATCH | `/api/perspectives/:id` | Actualizar perspectiva (disponible en servicio, no en UI) |
| DELETE | `/api/perspectives/:id` | Eliminar perspectiva (disponible en servicio, no en UI) |
| POST | `/api/perspectives/:pid/projects` | Crear proyecto (disponible en servicio) |
| PATCH | `/api/perspectives/:pid/projects/:projid` | Actualizar proyecto (disponible en servicio) |
| DELETE | `/api/perspectives/:pid/projects/:projid` | Eliminar proyecto (disponible en servicio) |
| POST | `/api/perspectives/:pid/projects/:projid/activities` | Crear actividad (disponible en servicio) |
| PATCH | `/api/perspectives/:pid/projects/:projid/activities/:aid` | Actualizar actividad (disponible en servicio) |
| DELETE | `/api/perspectives/:pid/projects/:projid/activities/:aid` | Eliminar actividad (disponible en servicio) |

> Los endpoints de creación/actualización/eliminación están implementados en `bscService.ts` pero **no son utilizados actualmente por ninguna vista de la SPA**. Están disponibles para funcionalidad futura.

---

## 10. No funcionalales

### 10.1 Rendimiento

- TanStack Query cachea la respuesta de `GET /api/perspectives` y solo refetch en invalidación explícita o al remontar componente con `staleTime` por defecto.
- Vite hace code splitting por dynamic imports si se agrega `React.lazy`.
- SVG icons via `vite-plugin-svgr` para tree-shaking.

### 10.2 Seguridad

- JWT en `localStorage` (no httpOnly cookie). El interceptor añade `Authorization: Bearer` header.
- Refresh token también en `localStorage`.
- Rutas protegidas por `ProtectedRoute` (client-side guard).
- No hay gestión de roles en UI actual, aunque el backend soporta roles (`role` en token).

### 10.3 Accesibilidad

- Uso de labels para selects y sliders.
- Contraste de colores suficiente en modo claro/oscuro.
- Navegación por teclado en sidebar y formularios.
- Feedback visual y de color para estados de carga y error.

### 10.4 Responsive

- Grid responsive: `grid-cols-1 md:grid-cols-2 xl:grid-cols-2` en perspectivas.
- Sidebar colapsable con hover en desktop, overlay en mobile.
- Contenido con `max-w-screen-2xl` y padding adaptativo.

---

## 11. Dependencias clave

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `react` | ^19.0.0 | UI framework |
| `react-router` | ^7.1.5 | Client routing |
| `@tanstack/react-query` | ^5.100.7 | Server state management |
| `axios` | ^1.15.2 | HTTP client |
| `zod` | ^3.24.0 | Runtime validation |
| `bsc-shared` | file:../bsc-shared | Shared types + schemas |
| `tailwindcss` | ^4.0.8 | Styling |
| `vite` | ^6.1.0 | Build tool |
| `vite-plugin-svgr` | ^4.3.0 | SVG → React components |
| `react-helmet-async` | ^2.0.5 | `<title>` management |
| `clsx` | ^2.1.1 | Conditional classNames |
| `tailwind-merge` | ^3.0.1 | Merge Tailwind classes |

---

## 12. Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia Vite dev server (proxy `/api` → `localhost:3000`) |
| `npm run build` | `tsc -b && vite build` (typecheck + build) |
| `npm run lint` | ESLint con flat config |
| `npm run preview` | Preview del build de producción |

---

## 13. Limitaciones actuales

1. **Sin paginación**: Se carga todo el árbol de perspectivas/proyectos/actividades de una vez.
2. **Sin tests**: No hay test runner configurado ni archivos de test.
3. **Solo lectura excepto avance**: El único form de escritura es la actualización de progreso de actividades. Los endpoints CRUD completos existen en `bscService.ts` pero no tienen UI.
4. **Sin gestión de usuarios**: Solo hay login/logout. No hay vista de perfil, cambio de contraseña ni administración de usuarios.
5. **Sin i18n**: Todos los textos están en español hardcoded.
6. **Tokens en localStorage**: Vulnerable a XSS. Idealmente usar cookies httpOnly en producción.
7. **Sidebar widget estático**: `SidebarWidget` es decorativo, sin datos dinámicos.
8. **Search bar no funcional**: El input de búsqueda en el header es visual, no filtra datos.

---

## 14. Mejoras futuras propuestas

1. **CRUD completo**: UI para crear/editar/eliminar perspectivas, proyectos y actividades usando los endpoint ya disponibles en `bscService.ts`.
2. **Gráficos**: Integrar ApexCharts para visualizaciones de progreso (gráficos de barras, radares, dashboard ejecutivo).
3. **Paginación y filtros**: Para organizaciones con muchos datos.
4. **Exportación**: PDF/Excel del cuadro de mando completo.
5. **Notificaciones**: Conectar el `NotificationDropdown` existente a datos del backend.
6. **Roles y permisos**: UI condicional según `role` del usuario (admin vs viewer).
7. **Tests**: Configurar Vitest + Testing Library para unit/integration tests.
8. **i18n**: Internacionalización si se requiere multiidioma.
9. **Migrar tokens a cookies httpOnly**: Para mitigar riesgos XSS.
10. **Offline support**: Service worker + cache de TanStack Query para operación offline.