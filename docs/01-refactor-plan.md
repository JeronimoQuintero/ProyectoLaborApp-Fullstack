# Plan de Refactorizacion - LaborApp

## Tabla de contenidos
- [Resumen ejecutivo](#resumen-ejecutivo)
- [Inventario de duplicados y deprecacion](#inventario-de-duplicados-y-deprecacion)
- [Prioridades](#prioridades)
- [Arquitectura de carpetas propuesta](#arquitectura-de-carpetas-propuesta)
- [Middleware de autenticacion y autorizacion](#middleware-de-autenticacion-y-autorizacion)
- [Busqueda, filtrado y paginacion en MongoDB](#busqueda-filtrado-y-paginacion-en-mongodb)
- [Validacion mejorada](#validacion-mejorada)
- [Componentes React optimizados](#componentes-react-optimizados)
- [Testing recomendado](#testing-recomendado)
- [Herramientas complementarias](#herramientas-complementarias)
- [Plan de ejecucion por fases](#plan-de-ejecucion-por-fases)

## Resumen ejecutivo
Hallazgos principales del repo actual:
- El flujo activo usa archivos `*Clean` en backend y `*Page` en frontend.
- Existen archivos legacy no usados que elevan deuda tecnica.
- Seguridad mejorable: token en `localStorage`, CORS abierto, sin rate limit y sin helmet.
- No hay paginacion backend ni estrategia de testing automatizado.

## Inventario de duplicados y deprecacion
Estado detectado en codigo actual:

| Estado | Archivo | Accion recomendada | Impacto |
|---|---|---|---|
| Activo | `Backend/routes/authRoutesClean.js` | Conservar (renombrar a `auth.routes.js`) | Base actual de auth |
| Legacy | `Backend/routes/authRoutes.js` | Deprecar y eliminar tras migracion | Evita confusion de rutas |
| Activo | `Backend/controllers/authControllerClean.js` | Conservar (renombrar a `auth.controller.js`) | Controlador principal |
| Legacy | `Backend/controllers/authController.js` | Deprecar y eliminar | Evita divergencia de logica |
| Activo | `Backend/middleware/authMiddlewareClean.js` | Conservar (renombrar a `authenticate.js`) | Token guard |
| Legacy | `Backend/middleware/authMiddleware.js` | Deprecar y eliminar | Duplicidad de middleware |
| Activo | `Backend/models/ServicioModel.js` | Conservar (renombrar a `service.model.js`) | Modelo usado por controller |
| Legacy/Roto | `Backend/models/Servicio.js` | Eliminar inmediato | Archivo inconsistente (no es modelo) |
| Activo | `frontend/src/pages/*Page.jsx` | Conservar | Vistas actuales en `App.jsx` |
| Legacy | `frontend/src/pages/Home.jsx`, `Login.jsx`, `Registro.jsx`, `CrearServicio.jsx`, `MisServicios.jsx` | Deprecar y eliminar | Reduce codigo muerto |
| Legacy | `frontend/src/components/RutaProtegida.jsx` | Eliminar | Ya existe `RutaProtegidaClean.jsx` |
| Legacy | `frontend/src/components/CardServicio.jsx` | Eliminar tras borrar paginas legacy | Componente no usado por flujo actual |

## Prioridades

### CRITICO (hacer primero)
1. Seguridad de autenticacion y sesiones.
- Migrar de `localStorage` a cookies `httpOnly` para token de sesion.
- Agregar `helmet`, `cors` estricto, `rate limiting` en `/api/usuarios/login`.
- Normalizar validaciones de entrada con Zod/Joi.

2. Limpieza de duplicados y ruta unica de codigo.
- Congelar archivos legacy y consolidar nombres modulares.
- Documentar oficialmente que rama de codigo queda vigente.

3. Paginacion + filtro backend.
- Evitar `find()` sin limites en listado de servicios.
- Mover busqueda del frontend al backend con indices.

### IMPORTANTE
1. Rutas privadas completas en frontend.
- Guard de autenticacion + guard por rol en un solo lugar.
- Manejo de redireccion post-login y expiracion de sesion.

2. Validacion cliente unificada.
- React Hook Form + Zod.
- Mostrar errores por campo y feedback consistente.

3. Base de testing.
- Backend: Jest + Supertest + mongodb-memory-server.
- Frontend: Vitest + RTL + MSW.

### MEJORA
1. Arquitectura DDD ligera/modular por feature.
2. Observabilidad (logs estructurados y request id).
3. CI/CD con pruebas + lint en pull requests.

## Arquitectura de carpetas propuesta

### Backend
```text
Backend/src/
|-- app.js
|-- server.js
|-- config/
|   |-- env.js
|   |-- db.js
|-- modules/
|   |-- auth/
|   |   |-- auth.routes.js
|   |   |-- auth.controller.js
|   |   |-- auth.service.js
|   |   |-- auth.schema.js
|   |-- services/
|   |   |-- service.routes.js
|   |   |-- service.controller.js
|   |   |-- service.service.js
|   |   |-- service.schema.js
|   |   |-- service.model.js
|   |-- users/
|       |-- user.model.js
|       |-- user.schema.js
|-- middlewares/
|   |-- authenticate.js
|   |-- authorize.js
|   |-- validate.js
|   |-- rateLimiters.js
|   |-- errorHandler.js
|-- utils/
|   |-- apiResponse.js
|   |-- pagination.js
|   |-- logger.js
|-- tests/
```

### Frontend
```text
frontend/src/
|-- app/
|   |-- router.jsx
|   |-- providers.jsx
|-- features/
|   |-- auth/
|   |   |-- api.js
|   |   |-- hooks/
|   |   |-- pages/
|   |   |-- components/
|   |-- services/
|       |-- api.js
|       |-- pages/
|       |-- components/
|-- shared/
|   |-- components/
|   |-- hooks/
|   |-- utils/
|   |-- constants/
|-- styles/
```

## Middleware de autenticacion y autorizacion

### `middlewares/authenticate.js`
```js
const jwt = require('jsonwebtoken');

function extractToken(req) {
  const cookieToken = req.cookies?.accessToken;
  if (cookieToken) return cookieToken;

  const auth = req.header('Authorization');
  if (auth?.startsWith('Bearer ')) return auth.replace('Bearer ', '').trim();

  return null;
}

function authenticate(req, res, next) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ message: 'No autenticado' });

  try {
    req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Token invalido o expirado' });
  }
}

module.exports = { authenticate };
```

### `middlewares/authorize.js`
```js
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ message: 'No autorizado para esta accion' });
    }
    next();
  };
}

module.exports = { authorize };
```

### `middlewares/validate.js`
```js
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      return res.status(400).json({
        message: 'Datos invalidos',
        errors: result.error.flatten(),
      });
    }

    req.validated = result.data;
    next();
  };
}

module.exports = { validate };
```

## Busqueda, filtrado y paginacion en MongoDB

### Indices recomendados (`service.model.js`)
```js
serviceSchema.index({ categoria: 1, oficio: 1, createdAt: -1 });
serviceSchema.index({ titulo: 'text', descripcion: 'text', oficio: 'text' });
serviceSchema.index({ usuario: 1, createdAt: -1 });
```

### Endpoint de listado robusto (`GET /api/servicios`)
```js
async function listServices(req, res) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 50);
  const skip = (page - 1) * limit;

  const {
    q,
    categoria,
    oficio,
    minPrecio,
    maxPrecio,
    sortBy = 'createdAt',
    sortDir = 'desc',
  } = req.query;

  const filter = {};

  if (categoria) filter.categoria = categoria;
  if (oficio) filter.oficio = oficio;

  if (minPrecio || maxPrecio) {
    filter.precio = {};
    if (minPrecio) filter.precio.$gte = Number(minPrecio);
    if (maxPrecio) filter.precio.$lte = Number(maxPrecio);
  }

  if (q) {
    filter.$text = { $search: q };
  }

  const sort = { [sortBy]: sortDir === 'asc' ? 1 : -1 };

  const [items, total] = await Promise.all([
    Service.find(filter)
      .populate('usuario', 'nombre oficio oficioCategoria correo telefono')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Service.countDocuments(filter),
  ]);

  return res.json({
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
```

## Validacion mejorada

### Backend con Zod (`auth.schema.js`)
```js
const { z } = require('zod');

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Correo invalido')
  .max(120);

const passwordSchema = z
  .string()
  .min(8, 'Minimo 8 caracteres')
  .max(72, 'Maximo 72 caracteres')
  .regex(/[A-Z]/, 'Debe incluir una mayuscula')
  .regex(/[a-z]/, 'Debe incluir una minuscula')
  .regex(/[0-9]/, 'Debe incluir un numero');

const registerSchema = z.object({
  body: z.object({
    nombre: z.string().trim().min(2).max(80),
    correo: emailSchema,
    password: passwordSchema,
    rol: z.enum(['cliente', 'trabajador']),
    telefono: z.string().trim().min(7).max(20).optional(),
    oficioCategoria: z.string().trim().min(2).max(50).optional(),
    oficio: z.string().trim().min(2).max(80).optional(),
  }),
  query: z.object({}).passthrough(),
  params: z.object({}).passthrough(),
});

module.exports = { registerSchema };
```

### Frontend con React Hook Form + Zod
```tsx
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  correo: z.string().email('Correo invalido'),
  password: z.string().min(8, 'Minimo 8 caracteres'),
});

export function LoginForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('correo')} type="email" />
      {errors.correo && <p>{errors.correo.message}</p>}

      <input {...register('password')} type="password" />
      {errors.password && <p>{errors.password.message}</p>}

      <button disabled={isSubmitting}>Entrar</button>
    </form>
  );
}
```

## Componentes React optimizados

### Ruta privada unificada
```jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';

export function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando sesion...</p>;
  if (!user) return <Navigate to="/login" replace />;

  if (roles?.length && !roles.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
```

### Busqueda con debounce y parametros URL
```jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function ServiceFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (q.trim()) next.set('q', q.trim());
      else next.delete('q');
      next.set('page', '1');
      setSearchParams(next, { replace: true });
    }, 350);

    return () => clearTimeout(t);
  }, [q, searchParams, setSearchParams]);

  return <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar servicio" />;
}
```

## Testing recomendado

### Backend
- Framework: `Jest`
- HTTP testing: `Supertest`
- DB aislada: `mongodb-memory-server`
- Cobertura minima objetivo: `70%` inicial (controllers + middlewares criticos)

Scripts sugeridos:
```json
{
  "scripts": {
    "test": "jest --runInBand",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage"
  }
}
```

### Frontend
- Runner: `Vitest`
- UI testing: `@testing-library/react` + `@testing-library/user-event`
- Mock API: `msw`

Scripts sugeridos:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:cov": "vitest run --coverage"
  }
}
```

## Herramientas complementarias
- `eslint + prettier + eslint-config-prettier`
- `husky + lint-staged` (pre-commit)
- `helmet`, `express-rate-limit`, `express-slow-down`
- `cookie-parser`
- `pino` o `winston` para logs estructurados
- `swagger-jsdoc + swagger-ui-express` para API docs vivas

## Plan de ejecucion por fases

### Fase 0 (0.5 dia)
- Congelar duplicados y crear rama de refactor.
- Definir convenciones de nombres/estructura.

### Fase 1 - Seguridad (1.5 a 2 dias)
- Cookies `httpOnly`, CORS estricto, helmet, rate limit.
- Validacion Zod en auth y servicios.

### Fase 2 - Datos y performance (1 a 1.5 dias)
- Paginacion backend, filtros avanzados, indices MongoDB.
- Ajustes frontend para consumir metadatos de paginacion.

### Fase 3 - Limpieza estructural (1 dia)
- Remover archivos legacy y mover a arquitectura modular.
- Actualizar imports y rutas.

### Fase 4 - Calidad (1.5 dias)
- Setup de Jest/Vitest.
- Pruebas de smoke criticas (auth, CRUD servicios, rutas privadas).

Resultado esperado: codigo mas mantenible, seguro y listo para crecer hacia features de producto (reviews, perfil, recuperacion de cuenta, etc.).
