# Modificar proyecto a API REST

**Session ID:** ses_21a1753d4ffecFe54rIWoTa7Ij
**Created:** 5/2/2026, 1:38:44 AM
**Updated:** 5/2/2026, 1:43:31 AM

---

## User

como deberia modificarse el proyecto para ser apirest?

---

## Assistant (Plan · GLM-5.1 · 69.8s)

_Thinking:_

The user is asking how the project should be modified to become a REST API project. Currently, based on the AGENTS.md, this is a React 19 + TypeScript + Vite + Tailwind CSS v4 frontend project that uses client-side data from a JSON file. They want to know what changes would be needed to connect it to a REST API backend.

Let me first explore the project structure to understand the current data flow and architecture before makingrecommendations.

Voy a explorar la estructura actual del proyecto para entender cómo funciona la gestión de datos y poder proponerte un plan completo.

**Tool: task**

**Input:**
```json
{
  "description": "Explore project data architecture",
  "prompt": "Explore this React + Vite + TypeScript BSC (Balanced Scorecard) dashboard project thoroughly. I need to understand:\n\n1. The current data architecture: How data flows from `src/data/bscData.json` through `DataContext.tsx` to components\n2. What data operations exist (read, update, etc.) — look at `useBSCData()` hook\n3. The shape of the data in bscData.json (what entities exist)\n4. Any existing API or service layer code\n5. The project's package.json dependencies\n\nRead these key files:\n- src/data/bscData.json (at least the first 200 lines to understand structure)\n- src/context/DataContext.tsx\n- package.json\n- src/types/ directory if it exists\n\nReturn a detailed summary of:\n- All data entities and their relationships\n- All CRUD operations currently supported\n- The full data flow from JSON → context → components\n- Any existing service/API layer",
  "subagent_type": "explore"
}
```

**Output:**
```
task_id: ses_21a170b80ffeEXLDXefdTpBIX7 (for resuming to continue this task if needed)

<task_result>
Now I have a complete picture. Here is a detailed summary of the entire data architecture:

---

## 1. Data Entities and Their Relationships

The data model in `bscData.json` is a strict 3-level nested hierarchy with exactly **one top-level property**:

```
BSCData
  └── perspectives[]           (4 instances)
        ├── id                 string   e.g. "financiero"
        ├── name               string   e.g. "FINANCIERO"
        ├── objective          string   e.g. "Armonizar rentabilidad económica"
        ├── weightage          number   e.g. 10  (percentage of the whole BSC)
        └── projects[]         (variable count, 4-11 per perspective)
              ├── id           string   e.g. "fin-credito"
              ├── name         string   e.g. "Crédito"
              ├── weightage    number   e.g. 2.5  (percentage within perspective)
              ├── strategy     string
              ├── detail       string
              └── activities[] (1-5 per project)
                    ├── id                string   e.g. "fin-credito-act-1"
                    ├── name              string
                    ├── weightage         number   e.g. 2.5
                    ├── progress          number   0-100 (percentage complete)
                    ├── responsibleProcess string
                    ├── complianceDate    string   e.g. "Segundo semestre 2025"
                    └── realizedActivities string   (free-text field notes)
```

### Concrete entity counts in `bscData.json`:

| Perspective | ID | Weightage | # Projects | # Activities |
|---|---|---|---|---|
| FINANCIERO | `financiero` | 10% | 4 | 4 |
| ASOCIADOS, SOCIAL Y COMERCIAL | `asociados-social-comercial` | 32.5% | 11 | 20 |
| PROCESOS INTERNOS | `procesos-internos` | 12.5% | 5 | 5 |
| CONOCIMIENTO Y APRENDIZAJE | `aprendizaje` | 45% | 3 | 6 |

**Totals**: 4 perspectives, 23 projects, 35 activities.

### Entity Relationships (navigational path)

```
Perspective → Project → Activity
```

The relationship is purely hierarchical:
- Each `Perspective` contains many `Projects`
- Each `Project` contains many `Activities`
- Navigation requires all three IDs: `perspectiveId` + `projectId` + `activityId`

There are **no cross-references**, no IDs linking entities sideways, and no normalized relational structure.

---

## 2. TypeScript Type Definitions

All types are defined **inline in** `src/context/DataContext.tsx` (lines 7-36). There is **no `src/types/` directory** at all. The types are:

```typescript
export interface Activity {
  id: string;
  name: string;
  weightage: number;
  progress: number;
  responsibleProcess: string;
  complianceDate: string;
  realizedActivities: string;
}

export interface Project {
  id: string;
  name: string;
  weightage: number;
  strategy: string;
  detail: string;
  activities: Activity[];
}

export interface Perspective {
  id: string;
  name: string;
  objective: string;
  weightage: number;
  projects: Project[];
}

export interface BSCData {
  perspectives: Perspective[];
}
```

A secondary type utility is in `src/utils/perspectiveColors.ts`:
- `PerspectiveId` = union literal of the 4 perspective IDs: `"financiero" | "asociados-social-comercial" | "procesos-internos" | "aprendizaje"`
- `PerspectiveColorSet` = UI color tokens for each perspective

---

## 3. Data Operations (CRUD)

### Currently Supported Operations

| Operation | Method | Where Used |
|---|---|---|
| **READ** all data | `useBSCData()` → `{ data }` | All 5 pages |
| **UPDATE** activity progress | `useBSCData()` → `updateActivityProgress(perspectiveId, projectId, activityId, newProgress)` | `DataEntryTab.tsx` only |

### Detail of `updateActivityProgress`

```typescript
const updateActivityProgress = (
  perspectiveId: string,
  projectId: string,
  activityId: string,
  newProgress: number
) => {
  if (!data) return;
  const newData = { ...data };          // shallow copy of BSCData
  const perspective = newData.perspectives.find(p => p.id === perspectiveId);
  if (perspective) {
    const project = perspective.projects.find(p => p.id === projectId);
    if (project) {
      const activity = project.activities.find(a => a.id === activityId);
      if (activity) {
        activity.progress = newProgress;  // mutable update (!)
        setData(newData);
      }
    }
  }
};
```

**Critical observations**:
1. The shallow copy (`{ ...data }`) does NOT deep-clone the nested arrays. The `perspectives` array reference is shared, so the mutation `activity.progress = newProgress` actually mutates the state object in-place before `setData` is called. This is a **bug-risk** -- React may not detect the change in some edge cases because the reference to the `activities` array is unchanged.
2. Only the `progress` field of an `Activity` can be updated. No other CRUD operations exist for any entity.
3. No **CREATE** operations exist -- you cannot add perspectives, projects, or activities.
4. No **DELETE** operations exist.
5. No **UPDATE** operations exist for any fields other than `activity.progress` (no editing name, weightage, strategy, etc.).

### Not Supported (Missing)

- No create/delete for Perspectives, Projects, or Activities
- No update for any field on Perspective or Project
- No update for Activity fields other than `progress`
- No persistence -- `updateActivityProgress` updates React state only; on page refresh, data reverts to `bscData.json`
- No undo/redo mechanism

---

## 4. Full Data Flow: JSON → Context → Components

### Initialization Flow

```
main.tsx
  └─ DataProvider wraps entire app
       └─ useState<BSCData | null>(bscData as BSCData)   // static import at module level
           └─ DataContext.Provider value={{ data, error, updateActivityProgress }}
```

**Step-by-step**:
1. Vite bundles `bscData.json` as a static JSON import (thanks to `import bscData from "../data/bscData.json"`).
2. `DataProvider` initializes state: `useState<BSCData | null>(bscData as BSCData)`. The `as BSCData` cast is needed because JSON imports are typed as `any` by default (no structural validation).
3. Error state is always `null` (never set -- the `useState<string | null>(null)` has no setter).
4. The entire `BSCData` object lives in React state for the lifetime of the SPA.

### Consumer Flow (5 routes)

| Route | Component | What it reads from context | What it computes |
|---|---|---|---|
| `/` | `StrategicLinesTab` | `{ data }` | Aggregates perspective progress by weighted average of project activities |
| `/proyectos` | `ProjectsTab` | `{ data }` | Renders perspectives as collapsible sections; each shows its projects |
| `/acciones` | `ActionsTab` | `{ data }` | Flattens all projects across perspectives; shows activities per project |
| `/ingreso-datos` | `DataEntryTab` | `{ data, updateActivityProgress }` | 3-level cascading select (perspective → project → activity) + range slider to update progress |
| `/ponderaciones` | `WeightingsPage` | `{ data }` | Full hierarchical table: perspective → project → activities with weightage/progress/responsible/date |

### Component Data Props

The data flows from pages to leaf cards as plain props (no context in cards):

- **StrategicLinesTab** → computes aggregated `{ id, name, objective, weightage, progress, components[] }` → passes to `<StrategicCard>`
- **ProjectsTab** → passes `Project` objects → `<ComponentProjectsCard name={...} projects={activities} perspectiveId={...} />` (note: passes `activities` as `projects` prop with shape `{name, progress}`)
- **ActionsTab** → passes individual activity data → `<ActionCard name={...} progress={...} perspectiveId={...} />`
- **DataEntryTab** → cascading dropdowns derive from `data`, then calls `updateActivityProgress()`
- **WeightingsPage** → directly iterates raw `Perspective → Project → Activity` hierarchy

---

## 5. Service/API Layer

**There is none.** The grep for `fetch`, `axios`, `api`, `service`, or `endpoint` across all `.ts`/`.tsx` files returned zero results related to data fetching or HTTP calls (only SVG `xmlns` attributes and YouTube embed URLs from template components). There are no `src/services/`, `src/api/`, or `src/types/` directories.

The application is **entirely client-side with no backend communication**. All data originates from the static JSON file bundled at build time.

---

## 6. Package Dependencies (relevant to data/architecture)

| Package | Version | Relevance |
|---|---|---|
| `react` | ^19.0.0 | Core UI framework |
| `react-dom` | ^19.0.0 | DOM rendering |
| `react-router` | ^7.1.5 | Client-side routing (5 routes) |
| `react-helmet-async` | ^2.0.5 | Page `<title>` management (via `<PageMeta>`) |
| `apexcharts` / `react-apexcharts` | ^4.1.0 / ^1.7.0 | Charting (not used in BSC pages currently) |
| `clsx` / `tailwind-merge` | ^2.1.1 / ^3.0.1 | Utility CSS class merging |
| `react-dnd` + `react-dnd-html5-backend` | ^16.0.1 | Drag & drop (not used in BSC pages currently) |

No HTTP client library (no `axios`, no `swagger`, no `tanstack-query`). No state management beyond React context.

---

## Summary of Key Architectural Facts

1. **Data source**: Single static JSON file (`src/data/bscData.json`, 621 lines), imported at build time. No API, no backend, no database.

2. **Data model**: 3-level hierarchy: `Perspective → Project → Activity`. 4 perspectives, 23 projects, 35 activities (all currently at 100% progress).

3. **State management**: One React Context (`DataContext`) with a single `useState`. No reducers, no immer, no state machine.

4. **CRUD coverage**: Only **one** write operation exists: `updateActivityProgress()` -- it updates a single `activity.progress` field in-memory. All other operations are read-only traversals. No create, delete, or other update operations.

5. **Persistence**: **None**. Refreshing the page discards all progress updates. Data reverts to the bundled JSON.

6. **Type safety**: Types are co-located in `DataContext.tsx`. No dedicated types directory. Types are exported for reuse by pages (`type Perspective`, `type Project`).

7. **Bug risk**: `updateActivityProgress` uses a shallow spread `{ ...data }` then mutates deeply nested objects. The nested arrays/objects share references with the previous state, which can potentially cause React to miss re-renders or produce stale closures.

8. **No service layer**: Zero abstraction between data source and consumer. Any future backend integration would require creating this layer from scratch.
</task_result>
```

---

## Assistant (Plan · GLM-5.1 · 192.1s)

_Thinking:_

Now I have a comprehensive understanding of the project. The user wants to know how to modify the project to use a REST API instead of the current static JSON approach. Let me craft a detailed migration plan.

The key changes needed:
1. Backend API (new project)
2. Service layer in frontend
3. State management changes (React Query instead of useState)
4. Types extraction
5. DataContext refactor
6. Auth considerations

Let me present a well-structured plan.

## Plan de migración a API REST

Basándome en el análisis del proyecto, aquí está el plan completo:

---

### Estado actual

- **Datos**: Archivo estático `src/data/bscData.json` importado en build-time
- **Estado**: `DataContext` con `useState` (sin persistencia, cambios se pierden al refrescar)
- **Operaciones**: Solo lectura + `updateActivityProgress` (sin CREATE/DELETE)
- **Tipos**: Definidos inline en `DataContext.tsx`
- **Cliente HTTP**: No existe ninguno

---

### Cambios necesarios

#### 1. Extraer tipos a `src/types/bsc.ts`

Sacar `BSCData`, `Perspective`, `Project`, `Activity` del context a un archivo dedicado. Esto lo usará tanto el frontend como potencialmente el backend.

#### 2. Crear capa de servicio — `src/services/`

```
src/services/
  api.ts          # Cliente HTTP base (axios o fetch con baseURL, interceptores, auth headers)
  bscService.ts   # Funciones CRUD para cada entidad
```

Endpoints propuestos:

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/perspectives` | Listar todas las perspectivas con proyectos y actividades |
| `GET` | `/api/perspectives/:id` | Detalle de perspectiva |
| `PATCH` | `/api/perspectives/:id` | Actualizar perspectiva |
| `POST` | `/api/perspectives` | Crear perspectiva |
| `DELETE` | `/api/perspectives/:id` | Eliminar perspectiva |
| `GET` | `/api/perspectives/:pid/projects` | Proyectos de una perspectiva |
| `POST` | `/api/perspectives/:pid/projects` | Crear proyecto |
| `PATCH` | `/api/perspectives/:pid/projects/:id` | Actualizar proyecto |
| `DELETE` | `/api/perspectives/:pid/projects/:id` | Eliminar proyecto |
| `PATCH` | `/api/activities/:id/progress` | Actualizar progreso (la operación existente) |
| `POST` | `/api/perspectives/:pid/projects/:prid/activities` | Crear actividad |
| `PATCH` | `/api/activities/:id` | Actualizar actividad |
| `DELETE` | `/api/activities/:id` | Eliminar actividad |
| `GET` | `/api/weightings` | Ponderaciones agregadas |

> **Alternativa**: Una API flat con rutas independientes (`/api/perspectives`, `/api/projects`, `/api/activities`) y relaciones por ID, en vez del nesteo actual.

#### 3. Reemplazar estado con React Query (TanStack Query)

`DataContext` + `useState` → `@tanstack/react-query`

```tsx
// Antes
const { data, updateActivityProgress } = useBSCData();

// Después
const { data, isLoading, error } = useQuery({ queryKey: ['perspectives'], queryFn: fetchPerspectives });
const updateProgress = useMutation({ mutationFn: patchActivityProgress });
```

**Beneficios**: caching, refetch, estado de carga/errores automático, invalidación tras mutations.

#### 4. Refactorizar `DataContext.tsx` → `QueryClientProvider`

- Eliminar `DataProvider` y `useBSCData()`
- Agregar `QueryClientProvider` en `main.tsx`
- Cada página usa hooks de TanStack Query directamente (o crear custom hooks en `src/hooks/`)

#### 5. Instalar dependencias nuevas

```
npm install @tanstack/react-query axios
```

(`axios` es opcional — se puede usar `fetch` nativo, pero simplifica interceptores, manejo de errores y refresh tokens)

#### 6. Actualizar componentes consumidores

Cada página (`StrategicLinesTab`, `ProjectsTab`, `ActionsTab`, `DataEntryTab`, `WeightingsPage`) reemplaza:

- `data` → resultado de `useQuery()`
- `updateActivityProgress()` → `useMutation()` + `invalidateQueries()`
- Agregar estados de `isLoading` y `error`

#### 7. Backend (proyecto separado)

Opciones:
- **Node.js + Express/Fastify** — mismo lenguaje (TypeScript)
- **Python + FastAPI** — si el equipo prefiere Python
- **Node.js + NestJS** — si se quiere un framework más estructurado

El backend debe:
- Servir los endpoints de arriba
- Persistir en base de datos (PostgreSQL, MySQL, o incluso SQLite para empezar)
- Incluir autenticación (JWT/OAuth2)
- Validar con los mismos tipos TypeScript (o Zod schemas compartidos)

#### 8. Auth (consideración)

No existe auth actualmente. Con una API REST se necesita:
- Login/logout (página + endpoints)
- Token storage (httpOnly cookie o localStorage)
- Interceptor para agregar `Authorization` header
- Rutas protegidas en frontend (`React Router`)

---

### Orden de implementación sugerido

1. Extraer tipos a `src/types/bsc.ts`
2. Instalar `@tanstack/react-query` + `axios`
3. Crear `src/services/api.ts` (cliente base)
4. Crear `src/services/bscService.ts` (funciones API)
5. Crear custom hooks `src/hooks/usePerspectives.ts`, `useUpdateProgress.ts`, etc.
6. Configurar `QueryClientProvider` en `main.tsx`
7. Migrar página por página (empezando por `DataEntryTab` — la única que escribe)
8. Eliminar `DataContext` cuando todas las páginas migren
9. Crear proyecto backend yuxtaponiendo los tipos
10. Agregar auth

---

### Pregunta para decidir

**Tool: question**

**Input:**
```json
{
  "questions": [
    {
      "question": "Para el backend, que tecnologia prefieres?",
      "header": "Backend",
      "options": [
        {
          "label": "Node.js + Express",
          "description": "TypeScript compartido con el frontend, equipo homogéneo"
        },
        {
          "label": "Node.js + NestJS",
          "description": "Framework estructurado con decoradores, mejor para proyectos grandes"
        },
        {
          "label": "Python + FastAPI",
          "description": "Rápido de desarrollar, tipado automático, si el equipo prefiere Python"
        }
      ]
    },
    {
      "question": "Prefieres una API anidada ( ресурсы nesteados como /perspectives/:id/projects) o plana (entidades independientes con IDs)?",
      "header": "REST design",
      "options": [
        {
          "label": "Anidada (Recommended)",
          "description": "Sigue la jerarquía actual: /perspectives/:pid/projects/:prid/activities — más natural para este modelo"
        },
        {
          "label": "Plana",
          "description": "/perspectives, /projects, /activities como recursos independientes — más flexible, mejor para futuras relaciones cruzadas"
        }
      ]
    },
    {
      "question": "Quieres que genere el backend como un subdirectorio (ej. /backend) dentro de este repo, o como repo separado?",
      "header": "Repo structure",
      "options": [
        {
          "label": "Monorepo (/backend)",
          "description": "Todo en un repo, más fácil compartir tipos entre frontend y backend"
        },
        {
          "label": "Repo separado",
          "description": "Repos independientes, mejor separación de concerns y deployments"
        }
      ]
    }
  ]
}
```

**Output:**
```
User has answered your questions: "Para el backend, que tecnologia prefieres?"="Node.js + Express", "Prefieres una API anidada ( ресурсы nesteados como /perspectives/:id/projects) o plana (entidades independientes con IDs)?"="Anidada (Recommended)", "Quieres que genere el backend como un subdirectorio (ej. /backend) dentro de este repo, o como repo separado?"="Repo separado". You can now continue with the user's answers in mind.
```

---

## Assistant (Plan · GLM-5.1 · 12.2s)

_Thinking:_

The user has chosen:
1. Node.js + Express for backend
2. Nested API design (-following current hierarchy)
3. Separate repo for backend

Now I should provide a comprehensive plan based on these choices.

Perfecto. Con tus elecciones, aquí está el plan definitivo:

---

## Plan definitivo: Migración a API REST

### Stack elegido
- **Backend**: Node.js + Express (repo separado)
- **Diseño API**: Anidada (`/perspectives/:pid/projects/:prid/activities/:aid`)
- **Frontend**: TanStack Query + axios

---

### FASE 1 — Frontend (este repo)

| # | Tarea | Archivos |
|---|-------|----------|
| 1 | Extraer tipos a `src/types/bsc.ts` | `Perspective`, `Project`, `Activity`, `BSCData` |
| 2 | Instalar deps | `@tanstack/react-query`, `axios` |
| 3 | Crear `src/services/api.ts` | Cliente axios con `baseURL`, interceptores (auth), manejo de errores |
| 4 | Crear `src/services/bscService.ts` | Funciones: `fetchPerspectives()`, `fetchPerspective(id)`, `updateProgress(pid, prid, aid, progress)`, `createProject(pid, data)`, etc. |
| 5 | Crear custom hooks en `src/hooks/` | `usePerspectives()`, `usePerspective(id)`, `useUpdateProgress()`, `useCreateProject()`, etc. |
| 6 | Configurar `QueryClientProvider` en `main.tsx` | Reemplazar `DataProvider` por `QueryClientProvider` |
| 7 | Migrar `DataEntryTab.tsx` | La única página que escribe — reemplazar `updateActivityProgress` por `useMutation` |
| 8 | Migrar páginas de solo lectura | `StrategicLinesTab`, `ProjectsTab`, `ActionsTab`, `WeightingsPage` — reemplazar `useBSCData()` por hooks de Query |
| 9 | Agregar `Suspense` + `ErrorBoundary` | Loading spinners y manejo de errores consistente |
| 10 | Eliminar `DataContext.tsx` y `bscData.json` de src | Mover JSON al backend como seed data |

### FASE 2 — Backend (repo nuevo)

| # | Tarea | Detalle |
|---|-------|--------|
| 1 | Inicializar proyecto Express + TypeScript | `express`, `typescript`, `ts-node-dev`, `cors` |
| 2 | Copiar tipos compartidos | Desde `src/types/bsc.ts` + generar schemas Zod para validación |
| 3 | Base de datos (SQLite para empezar) | `better-sqlite3` o `Prisma` con SQLite, migrarlo a PostgreSQL después |
| 4 | Seed script | Importar `bscData.json` como datos iniciales |
| 5 | Definir rutas anidadas | `/api/perspectives`, `/api/perspectives/:pid/projects`, `/api/perspectives/:pid/projects/:prid/activities/:aid/progress` |
| 6 | Auth básica | `bcrypt` + `jsonwebtoken`, endpoints `/auth/login`, `/auth/refresh` |
| 7 | Middleware | `cors`, `express.json()`, auth middleware, error handler centralizado |
| 8 | Tests | `vitest` + `supertest` |

### FASE 3 — Integración frontend

| # | Tarea |
|---|-------|
| 1 | `Vite proxy` en `vite.config.ts` para desarrollo (`/api` → `localhost:3000`) |
| 2 | Página de Login |
| 3 | Interceptor axios para refresh token |
| 4 | Rutas protegidas con `React Router` |

---

### Estructura de carpetas resultante (frontend)

```
src/
  types/
    bsc.ts                    # Tipos compartidos
  services/
    api.ts                    # Cliente axios
    bscService.ts             # Funciones API
  hooks/
    usePerspectives.ts
    useUpdateProgress.ts
    useCreateProject.ts
    ...
  context/
    AuthContext.tsx            # Nuevo (auth state)
  pages/
    ...                        # Mismas páginas, refactorizadas
```

¿Quieres que proceda con la implementación de la Fase 1 (frontend)?

---

