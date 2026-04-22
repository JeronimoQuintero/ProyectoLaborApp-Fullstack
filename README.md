# LaborApp - Proyecto de Grado Fullstack MERN

![Node](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue)

Plataforma para conectar clientes y trabajadores independientes.
Este repositorio contiene una app **MERN** con autenticacion, CRUD de servicios y panel por rol.

## Tabla de contenidos
- [Vision general](#vision-general)
- [Estado actual](#estado-actual)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Inicio rapido](#inicio-rapido)
- [Scripts](#scripts)
- [Documentacion completa](#documentacion-completa)
- [Roadmap sugerido](#roadmap-sugerido)

## Vision general
LaborApp permite:
- Registro/Login por rol (`cliente`, `trabajador`)
- Publicacion y administracion de servicios por trabajadores
- Listado de servicios para clientes
- Rutas privadas en frontend + backend

## Estado actual
Auditoria (Abril 2026):
- Hay archivos duplicados y legado (`*Clean`, `*Page`, modelos viejos)
- JWT se consume desde `localStorage` (riesgo XSS)
- Faltan `helmet`, `rate limiting`, paginacion backend y testing automatizado
- CORS esta abierto globalmente

Detalle completo en:
- [Plan de refactorizacion](./docs/01-refactor-plan.md)
- [Revision de seguridad](./docs/02-security-review.md)
- [Priorizacion de funcionalidades](./docs/03-feature-prioritization.md)

## Estructura del proyecto
```text
ProyectoGrado/
|-- Backend/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- index.js
|-- frontend/
|   |-- src/
|   |   |-- api/
|   |   |-- components/
|   |   |-- context/
|   |   |-- pages/
|   |   |-- App.jsx
|-- docs/
```

## Inicio rapido
### 1) Instalar dependencias
```bash
cd Backend
npm install

cd ../frontend
npm install
```

### 2) Configurar variables de entorno
- Backend: `Backend/.env` (basado en `Backend/.env.example`)
- Frontend: `frontend/.env` (basado en `frontend/.env.example`)

Guia completa: [Variables de entorno](./docs/05-env.md)

### 3) Ejecutar en desarrollo
```bash
# terminal 1
cd Backend
npm start

# terminal 2
cd frontend
npm run dev
```

- API backend: `http://localhost:8080`
- Frontend: `http://localhost:5173`

## Scripts
### Backend
- `npm start`: inicia API Express
- `npm test`: placeholder (migrar a Jest + Supertest)

### Frontend
- `npm run dev`: servidor Vite
- `npm run build`: build produccion
- `npm run preview`: preview build
- `npm run lint`: lint

## Documentacion completa
- [01 - Plan de refactorizacion](./docs/01-refactor-plan.md)
- [02 - Revision de seguridad](./docs/02-security-review.md)
- [03 - Priorizacion de funcionalidades](./docs/03-feature-prioritization.md)
- [04 - API](./docs/04-api.md)
- [05 - Variables de entorno](./docs/05-env.md)
- [06 - Guia de desarrollo](./docs/06-development-guide.md)
- [07 - Guia de deployment](./docs/07-deployment-guide.md)
- [08 - Arquitectura y base de datos](./docs/08-architecture.md)
- [09 - Troubleshooting](./docs/09-troubleshooting.md)

## Roadmap sugerido
1. Endurecer seguridad (cookies `httpOnly`, CORS estricto, rate limiting, helmet)
2. Eliminar duplicados y aplicar arquitectura modular
3. Implementar busqueda avanzada + paginacion backend
4. Agregar testing base (backend y frontend)
5. Construir features MVP pendientes (perfil, recuperacion password, reviews)

---

Si quieres, en el siguiente paso puedo convertir estos planes en tareas tecnicas con checklist por sprint (S1/S2/S3) y estimacion por horas.
