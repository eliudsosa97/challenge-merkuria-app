## Gestión de Productos — Frontend (Next.js)

Aplicación de Gestión de Productos para el reto técnico de Merkur.ia (Frontend). Permite listar, crear, editar, eliminar y filtrar productos; incluye paginación, ordenamiento, estadísticas básicas y gráficas dinámicas.

Producción: https://challenge-merkuria-app-qnov-one.vercel.app/

### Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 (UI responsiva)
- Axios (HTTP)
- React Hook Form + Zod (formularios/validaciones)
- Chart.js + react-chartjs-2 (gráficas)
- Vitest + Testing Library (unitarias/UI) y Playwright (E2E)

---

## Funcionalidad principal

- CRUD completo de productos (crear, leer, actualizar, eliminar)
- Filtros por categoría, rango de precios y búsqueda por nombre
- Ordenamiento por nombre y precio (asc/desc)
- Paginación con selector de ítems por página (10/20/50)
- Estadísticas: total mostrado y precio promedio (reactivo a filtros)
- Gráficas (barra y dona) por categoría con datos reactivos

---

## Requisitos previos

- Node.js 18+ y npm
- Backend NestJS corriendo y accesible (ver contrato de API más abajo)

---

## Configuración y ejecución

1. Clonar e instalar dependencias

```bash
git clone https://github.com/eliudsosa97/challenge-merkuria-app.git
cd challenge-merkuria-app
npm install
```

2. Variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` según tu entorno:

- `NEXT_PUBLIC_API_URL`: URL base del backend (NestJS). Ej: `http://localhost:3000/api`
- `PLAYWRIGHT_BASE_URL`: URL que usará Playwright para E2E en desarrollo.

Recomendado en local:

- Backend (NestJS) en `http://localhost:3000`
- Frontend (Next.js) en `http://localhost:3001`

3. Ejecutar en desarrollo (puerto 3001 para evitar conflicto con el backend)

```bash
npm run dev -- -p 3001
```

Luego abre http://localhost:3001

4. Build y producción local

```bash
npm run build
npm start
```

---

## Scripts disponibles

- `npm run dev` — Inicia el servidor de desarrollo (por defecto 3000). Puedes cambiar puerto: `npm run dev -- -p 3001`.
- `npm run build` — Genera build de producción.
- `npm start` — Sirve la build en producción.
- `npm run lint` — Ejecuta ESLint.
- `npm run test` — Pruebas unitarias con Vitest (modo run).
- `npm run test:watch` — Pruebas unitarias en modo watch.
- `npm run test:ui` — UI de Vitest.
- `npm run coverage` — Cobertura (ver reporte en `coverage/`).
- `npm run e2e` — Pruebas E2E con Playwright (requiere servidor corriendo).
- `npm run e2e:ui` — Ejecuta Playwright en modo UI.
- `npm run e2e:codegen` — Asistente para grabar escenarios E2E.

---

## Pruebas

Unitarias/Componentes (Vitest + Testing Library)

```bash
npm run test
```

UI de pruebas y cobertura

```bash
npm run test:ui
npm run coverage
```

End-to-End (Playwright)

```bash
# 1) Asegura backend y frontend activos
#    - Backend: http://localhost:3000
#    - Frontend: http://localhost:3001
# 2) Revisa PLAYWRIGHT_BASE_URL en .env.local
# 0) (primera vez) Instala los navegadores de Playwright
#    npx playwright install

npm run e2e
# o modo UI
npm run e2e:ui
```

---

## Estructura del proyecto (resumen)

- `src/app` — Páginas App Router (Home principal en `page.tsx`)
- `src/components` — Componentes UI, productos y gráficas
- `src/hooks` — Hooks (p.ej. `useProducts` para estado/queries)
- `src/lib` — Tipos, cliente HTTP (`api.ts`), utilidades y validaciones
- `src/services` — Capa de acceso a API (`products.service.ts`)
- `tests` — Pruebas unitarias/componentes
- `e2e` — Pruebas E2E (Playwright)

---

## Contrato de API esperado (Backend NestJS)

Base: `${NEXT_PUBLIC_API_URL}` (ej. `http://localhost:3000/api`)

- GET `/products`

  - Query params: `category`, `minPrice`, `maxPrice`, `search`, `sortBy=name|price`, `sortOrder=ASC|DESC`, `page`, `limit`
  - Respuesta: `{ data: Product[]; total: number }`

- GET `/products/:id`

  - Respuesta: `Product`

- POST `/products`

  - Body: `CreateProductDto`
  - Respuesta: `Product`

- PATCH `/products/:id`

  - Body: `Partial<CreateProductDto>`
  - Respuesta: `Product`

- DELETE `/products/:id`

  - Respuesta: `204 No Content`

- GET `/products/categories`

  - Respuesta: `string[]`

- GET `/products/statistics`
  - Query params: mismos filtros básicos
  - Respuesta: `ProductStats`

Tipos usados por el frontend (resumen):

```ts
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface CreateProductDto {
  name: string;
  category: string;
  price: number;
  rating?: number;
  stock?: number;
}

export interface ProductStats {
  totalProducts: number;
  averagePrice: number;
  byCategory: { category: string; count: number; percentage: string }[];
}
```

Seguridad (esperada en el backend):

- Lectura pública (GET)
- Escritura autenticada (POST/PATCH/DELETE)
- CORS habilitado para el dominio del frontend (localhost y producción)
- Si tu backend exige JWT, añade un interceptor de `Authorization: Bearer <token>` en `src/lib/api.ts` (no incluido por defecto).

---

## Despliegue

Recomendado: Vercel

1. Importa el repositorio en Vercel
2. Variables de entorno en el proyecto (Producción/Preview):
   - `NEXT_PUBLIC_API_URL` apuntando a tu backend desplegado (ej. `https://challenge-merkuria-api-215ba9385fca.herokuapp.com/api/`)
3. Despliega. Verifica CORS en el backend para el dominio de Vercel.

---

## Uso de asistentes de IA (ejemplos)

Durante el desarrollo se emplearon asistentes de IA de forma responsable para acelerar tareas puntuales. Siempre con revisión y ajustes manuales.

- Gemini Pro (chat)

  - Uso: resolver dudas variadas, explicar mensajes de error/stack traces y validar enfoques.
  - Ejemplos de prompts:
    - “Lee este stack trace de Next.js y dime la causa probable y el fix mínimo.”
    - “¿Qué implica este warning de React 19 y cómo mitigarlo?”
    - “¿Ves algún riesgo en este flujo de filtros y paginación?”

- Copilot con GPT-5 (en el editor)
  - Uso: completaciones de código, fixes sencillos de bugs, creación de tests (Vitest/Testing Library) y generación de comentarios en algunas ocasiones.
  - Ejemplos de prompts/completaciones:
    - “Completa pruebas para ProductGrid con paginación y estado loading.”
    - “Sugiere un refactor pequeño para este hook evitando renders extra.”
    - “Agrega comentarios JSDoc a este servicio de productos.”

Otras tareas asistidas:

- Generación de esqueletos de componentes, tipados y utilidades.
- Borrador de este README y guías de ejecución, luego ajustado manualmente.

Todo con revisión humana.
Todas las salidas de IA se verificaron con linters, pruebas y pruebas manuales antes de integrarlas.

---

## Solución de problemas

- “Error de Conexión”: verifica que el backend esté activo y `NEXT_PUBLIC_API_URL` sea correcto. Revisa CORS en el backend.
- Conflicto de puertos: ejecuta el frontend en `3001` y el backend en `3000`.
- E2E no encuentra la app: asegúrate de que `PLAYWRIGHT_BASE_URL` coincida con el puerto del frontend y que el servidor esté corriendo.

---

Eliud Sosa | 2025
