# Documentacion de la API de LaborApp

Formato APA 7 (trabajo academico)

Nombre del estudiante: [Completar]
Institucion: [Completar]
Programa academico: [Completar]
Asignatura: [Completar]
Docente: [Completar]
Fecha: 21 de mayo de 2026

## Resumen
Este documento presenta la especificacion funcional de la API REST de LaborApp en un formato compatible con APA 7 para uso academico. La API fue implementada en Node.js con Express y organiza su dominio en dos modulos principales: usuarios y servicios. El modulo de usuarios incluye registro, inicio y cierre de sesion, y consulta de perfil autenticado. El modulo de servicios incluye publicacion, consulta publica con filtros, consulta privada de publicaciones propias, actualizacion y eliminacion. En materia de seguridad, la solucion integra autenticacion con JWT y prioriza cookies `httpOnly` para sesion web, junto con soporte de cabecera `Authorization` para compatibilidad. Adicionalmente, incorpora protecciones de capa HTTP mediante `helmet`, politicas de CORS y controles de abuso por medio de `express-rate-limit` y `express-slow-down`. La documentacion reporta rutas, metodos, autenticacion requerida, estructura de entrada y salida, y codigos de estado esperados. El analisis se elaboro a partir del codigo fuente vigente del proyecto y se complementa con referencias tecnicas de los frameworks y estandares utilizados.

Palabras clave: API REST, Express, JWT, documentacion tecnica, seguridad web

## Introduccion
La documentacion de APIs es un componente esencial en proyectos de software orientados a colaboracion, mantenimiento y evaluacion academica. En este caso, la API de LaborApp fue disenada para conectar clientes y trabajadores independientes mediante operaciones de autenticacion y gestion de servicios. En terminos arquitectonicos, el comportamiento de los endpoints sigue el modelo de enrutamiento HTTP de Express, donde cada ruta responde a metodos especificos y aplica middleware para validacion y autorizacion cuando corresponde (Express.js, n.d.).

## Metodo
### Fuente de datos
La informacion tecnica proviene del repositorio local del proyecto, especificamente de rutas, controladores, middleware de autenticacion y configuracion global del servidor (Proyecto LaborApp, 2026).

### Criterios de especificacion
Se documento cada endpoint con los siguientes criterios:
- metodo HTTP.
- ruta relativa bajo `/api`.
- requisito de autenticacion.
- finalidad funcional.
- estructura general de request/response.
- errores frecuentes y codigos de estado.

## Resultados
### Configuracion general de la API
- Base URL en desarrollo: `http://localhost:8080/api`
- Formatos de autenticacion admitidos:
  - cookie `accessToken` (`httpOnly`) para flujo principal web.
  - `Authorization: Bearer <token>` para compatibilidad.
- Seguridad HTTP y operativa:
  - cabeceras seguras con Helmet (Helmet.js, n.d.).
  - validacion de payloads con Zod (Zod, n.d.).
  - control de abuso con `express-rate-limit` y `express-slow-down` (express-rate-limit, n.d.; express-slow-down, n.d.).

### Endpoints del modulo usuarios
| Metodo | Endpoint | Autenticacion | Descripcion |
|---|---|---|---|
| POST | `/usuarios/registro` | No | Registra un usuario (`cliente` o `trabajador`). |
| POST | `/usuarios/login` | No | Valida credenciales y emite cookie `accessToken`. |
| POST | `/usuarios/logout` | Cookie/Bearer | Limpia la cookie de sesion activa. |
| GET | `/usuarios/perfil` | Cookie/Bearer | Retorna perfil del usuario autenticado. |

Campos principales en registro:
- `nombre`, `correo`, `password`, `rol`.
- Para `rol=trabajador`: `telefono`, `oficioCategoria`, `oficio`.

Validaciones clave:
- `password` minimo 8 caracteres.
- `correo` en formato email.
- `telefono` con patron valido.

### Endpoints del modulo servicios
| Metodo | Endpoint | Autenticacion | Descripcion |
|---|---|---|---|
| POST | `/servicios` | Cookie/Bearer | Crea una publicacion de servicio. |
| GET | `/servicios` | No | Lista servicios con filtros, orden y paginacion. |
| GET | `/servicios/mis-servicios` | Cookie/Bearer | Lista servicios del usuario autenticado. |
| GET | `/servicios/mis-servicios/:id` | Cookie/Bearer | Consulta un servicio propio por id. |
| PUT | `/servicios/:id` | Cookie/Bearer | Actualiza un servicio propio. |
| DELETE | `/servicios/:id` | Cookie/Bearer | Elimina un servicio propio. |

Filtros soportados en listado publico (`GET /servicios`):
- `page`, `limit`, `q`, `categoria`, `oficio`, `minPrecio`, `maxPrecio`, `sortBy`, `sortDir`.

Estructura de respuesta para listado:
- `items`: arreglo de servicios.
- `meta`: `page`, `limit`, `total`, `totalPages`, `hasNextPage`, `hasPrevPage`.

## Discusion
La API muestra una evolucion favorable hacia practicas seguras y mantenibles: uso de cookies `httpOnly`, limitacion de solicitudes, validacion declarativa de entradas y separacion modular por rutas/controladores. En el contexto academico, esta especificacion facilita la trazabilidad entre requerimientos funcionales, implementacion y evidencias de prueba. Como mejora futura, se recomienda complementar este documento con una especificacion OpenAPI para pruebas automatizadas e integracion con herramientas de QA.

## Conclusion
La API de LaborApp cumple con las funciones nucleares del sistema: autenticacion y administracion de servicios. Desde un enfoque metodologico, la documentacion en formato APA 7 permite presentar el componente tecnico con estructura formal, claridad terminologica y respaldo bibliografico, lo cual mejora su utilidad para evaluacion de proyecto de grado.

## Referencias
Axios. (n.d.). *Request config*. Recuperado el 21 de mayo de 2026, de https://axios-http.com/docs/req_config

Express.js. (n.d.). *Routing*. Recuperado el 21 de mayo de 2026, de https://expressjs.com/en/guide/routing/

express-rate-limit. (n.d.). *express-rate-limit (npm package)*. Recuperado el 21 de mayo de 2026, de https://www.npmjs.com/package/express-rate-limit

express-slow-down. (n.d.). *express-slow-down (npm package)*. Recuperado el 21 de mayo de 2026, de https://www.npmjs.com/package/express-slow-down

Helmet.js. (n.d.). *Helmet.js*. Recuperado el 21 de mayo de 2026, de https://helmetjs.github.io/

Jones, M. B., Bradley, J., & Sakimura, N. (2015). *RFC 7519: JSON Web Token (JWT)*. Internet Engineering Task Force. https://www.rfc-editor.org/rfc/rfc7519

Proyecto LaborApp. (2026). *ProyectoGrado* [Codigo fuente no publicado].

Zod. (n.d.). *Zod 4 documentation*. Recuperado el 21 de mayo de 2026, de https://zod.dev/
