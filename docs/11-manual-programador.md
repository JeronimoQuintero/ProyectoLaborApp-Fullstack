# Manual de Programador de LaborApp (Formato APA 7)

## Portada (APA 7)

**Manual de Programador de LaborApp: Arquitectura, Mantenimiento y Evolucion de una Aplicacion MERN**

Nombre del estudiante: `[Completar]`  
Programa academico: `[Completar]`  
Institucion: `[Completar]`  
Curso: `[Completar]`  
Docente: `[Completar]`  
Fecha de entrega: `30 de abril de 2026`

Nota de formato APA 7 para version final en Word/PDF:
- Fuente: Times New Roman 12, Arial 11 o Calibri 11.
- Interlineado doble en todo el documento.
- Margenes de 2.54 cm.
- Numero de pagina en esquina superior derecha.
- Sangria de primera linea de 1.27 cm.

## Resumen
Este manual de programador documenta la estructura tecnica de LaborApp, una aplicacion fullstack MERN orientada a la gestion de servicios entre clientes y trabajadores independientes. El documento describe la arquitectura de software, responsabilidades por modulo, flujos de autenticacion, seguridad aplicada, modelos de datos, configuracion de entorno y lineamientos para mantenimiento evolutivo. Adicionalmente, se proporcionan procedimientos para ejecucion local, extension de funcionalidades y control de calidad, con enfoque en buenas practicas de desarrollo web moderno y endurecimiento de API mediante validacion, control de acceso y mitigacion de amenazas frecuentes (Express.js, n.d.; OWASP Foundation, n.d.). El manual busca reducir la dependencia de conocimiento tacito del autor original y facilitar transferencia tecnica para continuidad academica o profesional del proyecto.

**Palabras clave:** manual de programador, MERN, API REST, seguridad web, mantenimiento de software.

## 1. Introduccion
LaborApp fue construido con React + Vite en frontend y Node.js + Express + MongoDB en backend. El sistema implementa autenticacion por roles y CRUD de servicios. Este manual estandariza el conocimiento tecnico requerido para mantener y ampliar el sistema.

## 2. Objetivo y alcance
Objetivo:
- Proveer una guia tecnica completa para desarrollo, mantenimiento y evolucion de LaborApp.

Alcance:
- Arquitectura del repositorio.
- Modulos backend y frontend.
- Seguridad implementada.
- Variables de entorno.
- Procedimientos de extension y operacion.

No abarca:
- Implementacion de infraestructura empresarial avanzada.
- Integraciones externas no presentes en el estado actual.

## 3. Stack tecnologico
Backend:
- Node.js
- Express 5
- MongoDB + Mongoose
- JWT + bcryptjs
- helmet
- cors
- cookie-parser
- express-rate-limit
- express-slow-down
- zod

Frontend:
- React 19
- Vite 8
- react-router-dom
- axios

## 4. Arquitectura del repositorio

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
|   |   |-- data/
|   |   |-- pages/
|   |   |-- App.jsx
|-- docs/
```

Documentos complementarios:
- `docs/04-api.md`
- `docs/05-env.md`
- `docs/07-deployment-guide.md`
- `docs/08-architecture.md`
- `docs/09-troubleshooting.md`

## 5. Backend: diseno y responsabilidades

## 5.1 `index.js`
Responsabilidades:
- Carga de variables de entorno.
- Conexion a MongoDB.
- Configuracion global de middlewares.
- CORS por lista blanca.
- Seguridad HTTP con Helmet.
- Rate limiting global para `/api`.
- Registro de rutas de usuarios y servicios.
- Manejo de errores 404 y errores globales.

## 5.2 `controllers/authController.js`
Funciones principales:
- `registrarUsuario`
- `loginUsuario`
- `obtenerPerfil`
- `logoutUsuario`

Criterios tecnicos:
- Validacion con Zod para login/registro.
- Emision de cookie `accessToken` con `httpOnly`.
- Normalizacion de respuestas para frontend.

## 5.3 `controllers/servicioController.js`
Funciones principales:
- `crearServicio`
- `obtenerServicios` (busqueda, filtros, orden, paginacion)
- `obtenerMisServicios`
- `obtenerMiServicioPorId`
- `actualizarServicio`
- `eliminarServicio`

Criterios tecnicos:
- Validacion de payload con Zod.
- Validacion de propiedad del recurso antes de modificar/eliminar.
- Paginacion con metadatos (`page`, `limit`, `total`, `totalPages`).

## 5.4 `middleware/authMiddleware.js`
- Lee token desde cookie `accessToken`.
- Acepta fallback por header Bearer para compatibilidad.
- Verifica JWT y construye `req.usuario`.

## 5.5 `routes/authRoutes.js`
Endpoints:
- `POST /api/usuarios/registro`
- `POST /api/usuarios/login`
- `POST /api/usuarios/logout`
- `GET /api/usuarios/perfil`

Controles:
- Rate limiting.
- Slow down en login.

## 5.6 `routes/servicioRoutes.js`
Endpoints:
- `POST /api/servicios`
- `GET /api/servicios`
- `GET /api/servicios/mis-servicios`
- `GET /api/servicios/mis-servicios/:id`
- `PUT /api/servicios/:id`
- `DELETE /api/servicios/:id`

## 6. Frontend: diseno y responsabilidades

## 6.1 `src/api/api.js`
- Instancia Axios central con `withCredentials: true`.
- Base URL configurable por `VITE_API_URL`.

## 6.2 `src/context/Authcontext.jsx`
- Gestion de estado de sesion.
- Carga inicial con `/usuarios/perfil`.
- Operaciones `login` y `logout`.

## 6.3 `src/components/RutaProtegida.jsx`
- Bloquea acceso a rutas privadas sin sesion.
- Restringe funcionalidades por rol (`soloTrabajador`).

## 6.4 `src/pages/HomePage.jsx`
- Consulta backend con filtros de busqueda y paginacion.
- Renderiza metadatos de resultados y controles de navegacion.

## 6.5 Vistas de trabajador
- `CrearServicioPage.jsx`
- `EditarServicioPage.jsx`
- `MisServiciosPage.jsx`

Estas vistas consumen API autenticada y respetan permisos de propietario.

## 7. Seguridad implementada
Controles actuales:
- Headers de seguridad con Helmet.
- CORS restringido por variable `CORS_ORIGINS`.
- Rate limiting global y reforzado en autenticacion.
- Cookie `httpOnly` para sesion.
- Validaciones de entrada con Zod.
- Validacion de ownership en recursos privados.

Justificacion:
Estos controles responden a recomendaciones de seguridad para aplicaciones Express y mitigacion de amenazas frecuentes en API web (Express.js, n.d.; OWASP Foundation, n.d.).

## 8. Modelos de datos

## 8.1 Modelo `Usuario`
Campos:
- `nombre`
- `correo` (unico)
- `password` (hash)
- `rol` (`cliente`, `trabajador`)
- `telefono`
- `oficioCategoria`
- `oficio`

## 8.2 Modelo `Servicio`
Campos:
- `titulo`
- `descripcion`
- `precio`
- `categoria`
- `oficioCategoria`
- `oficio`
- `correoContacto`
- `telefonoContacto`
- `usuario` (referencia a `Usuario`)

Indices aplicados:
- `{ categoria: 1, oficio: 1, createdAt: -1 }`
- indice de texto en `titulo`, `descripcion`, `oficio`
- `{ usuario: 1, createdAt: -1 }`

## 9. Configuracion de entorno
Archivos:
- `Backend/.env` (usar base `Backend/.env.example`)
- `frontend/.env` (usar base `frontend/.env.example`)

Variables relevantes backend:
- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_ACCESS_EXPIRES`
- `CORS_ORIGINS`
- `COOKIE_SECURE`
- `RATE_LIMIT_WINDOW_MS`
- `RATE_LIMIT_MAX`

Variable relevante frontend:
- `VITE_API_URL`

## 10. Ejecucion local
1. Instalar dependencias en ambos proyectos.
2. Levantar backend con `npm start`.
3. Levantar frontend con `npm run dev`.
4. Verificar funcionamiento con login y consulta de servicios.

Comandos:
```bash
cd Backend
npm install
npm start

cd ../frontend
npm install
npm run dev
```

## 11. Guia de mantenimiento evolutivo
Para agregar funcionalidades nuevas:
1. Definir caso de uso y endpoint.
2. Diseñar validacion Zod.
3. Implementar logica en controller.
4. Exponer ruta y protegerla segun rol.
5. Integrar consumo en frontend.
6. Actualizar documentacion tecnica y funcional.

## 12. Control de calidad y pruebas
Estado actual:
- No existe suite de pruebas automatizada consolidada.

Recomendacion minima:
- Backend: Jest + Supertest.
- Frontend: Vitest + React Testing Library.
- Integrar lint + test en pipeline CI.

Pruebas prioritarias:
- Registro y login.
- Acceso a rutas privadas.
- CRUD de servicios.
- Filtros y paginacion.

## 13. Lineamientos para despliegue
Consideraciones para produccion:
- Activar HTTPS.
- Definir `COOKIE_SECURE=true`.
- Restringir `CORS_ORIGINS` al dominio real del frontend.
- Establecer secretos robustos y rotacion periodica.
- Activar observabilidad (logs y monitoreo de errores).

Referencia: `docs/07-deployment-guide.md`.

## 14. Conclusiones
El manual de programador consolida la base tecnica de LaborApp y facilita su continuidad por parte de nuevos desarrolladores. La documentacion de arquitectura, seguridad y operaciones permite reducir deuda de conocimiento, mejorar trazabilidad tecnica y sostener una evolucion controlada del sistema en escenarios academicos o de prototipo avanzado.

## Referencias (APA 7)
American Psychological Association. (2020). *Publication manual of the American Psychological Association* (7th ed.). https://doi.org/10.1037/0000165-000

Express.js. (n.d.). *Security best practices for Express in production*. Recuperado el 30 de abril de 2026, de https://expressjs.com/en/advanced/best-practice-security.html

Helmet. (n.d.). *Helmet.js*. Recuperado el 30 de abril de 2026, de https://helmetjs.github.io/

Mongoose. (n.d.). *Mongoose ODM documentation*. Recuperado el 30 de abril de 2026, de https://mongoosejs.com/docs/

OWASP Foundation. (n.d.). *Cross site scripting prevention cheat sheet*. Recuperado el 30 de abril de 2026, de https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html

React. (n.d.). *React documentation*. Recuperado el 30 de abril de 2026, de https://react.dev/

Vite. (n.d.). *Vite guide*. Recuperado el 30 de abril de 2026, de https://vite.dev/guide/
