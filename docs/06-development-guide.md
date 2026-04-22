# Guia de Desarrollo - LaborApp

## Tabla de contenidos
- [Requisitos](#requisitos)
- [Ejecucion local](#ejecucion-local)
- [Convenciones de codigo](#convenciones-de-codigo)
- [Como agregar una feature](#como-agregar-una-feature)
- [Checklist de pull request](#checklist-de-pull-request)

## Requisitos
- Node.js LTS
- MongoDB local o Atlas
- npm 10+

## Ejecucion local
```bash
cd Backend
npm install
npm start

cd ../frontend
npm install
npm run dev
```

## Convenciones de codigo
### Backend
- Separar `routes`, `controllers`, `services`, `schemas`, `models`.
- No acceder a `req.body` directamente en controllers: usar `req.validated`.
- Toda ruta privada debe tener `authenticate`.
- Toda accion por rol debe tener `authorize(...)`.

### Frontend
- Estructura por feature (`features/auth`, `features/services`, etc.).
- Formularios con React Hook Form + Zod.
- No usar `localStorage` para tokens si ya se migro a cookies.
- Manejar estado async con TanStack Query (recomendado).

### Nombres
- Archivos backend: `kebab-case` o `dot notation` (`auth.controller.js`).
- Componentes React: `PascalCase`.
- Hooks: `useXxx`.

## Como agregar una feature
1. Definir alcance (endpoint + UI + reglas de negocio).
2. Crear schema de validacion.
3. Crear/editar modelo Mongo si aplica.
4. Implementar servicio de negocio.
5. Exponer controller + ruta.
6. Escribir pruebas backend.
7. Integrar en frontend (API hook + pagina/componente).
8. Escribir pruebas frontend.
9. Actualizar documentacion (`docs/04-api.md`, `docs/08-architecture.md`).

## Checklist de pull request
- [ ] Lint sin errores
- [ ] Tests backend pasan
- [ ] Tests frontend pasan
- [ ] Endpoint documentado
- [ ] Manejo de errores consistente
- [ ] Sin secretos hardcodeados
- [ ] Sin archivos duplicados o dead code

Adicional recomendado:
- Pre-commit con `husky` + `lint-staged`.
