# API - LaborApp

## Tabla de contenidos
- [Resumen](#resumen)
- [Base URL](#base-url)
- [Autenticacion](#autenticacion)
- [Rate limiting](#rate-limiting)
- [Formato de errores](#formato-de-errores)
- [Endpoints de usuarios](#endpoints-de-usuarios)
- [Endpoints de servicios](#endpoints-de-servicios)
- [Endpoint de salud](#endpoint-de-salud)
- [Codigos de estado](#codigos-de-estado)

## Resumen
La API esta construida con Express y expone rutas bajo `/api` para:
- autenticacion y perfil de usuario.
- CRUD de servicios.
- listado de servicios con filtros y paginacion.

## Base URL
- Desarrollo local: `http://localhost:8080/api`

Ejemplos:
- Registro: `POST http://localhost:8080/api/usuarios/registro`
- Listado: `GET http://localhost:8080/api/servicios`

## Autenticacion
La API acepta token JWT de 2 formas:
- Cookie `httpOnly` llamada `accessToken` (flujo principal).
- Header `Authorization: Bearer <token>` (compatibilidad).

### Cookie de sesion en login
En `POST /usuarios/login` el backend devuelve cookie con:
- `httpOnly: true`
- `path: /`
- `maxAge: 24h`
- `sameSite: lax` en desarrollo y `none` en produccion segura
- `secure: true` si `COOKIE_SECURE=true` o `NODE_ENV=production`

Para frontend con Axios:
```js
const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true,
});
```

## Rate limiting
Hay dos limites activos:
- Global API (`/api`): 300 requests / 15 min por IP (configurable por `.env`).
- Auth (`/api/usuarios/registro` y `/api/usuarios/login`): 12 requests / 15 min por IP.

Adicionalmente, `POST /usuarios/login` aplica `slow-down` despues del intento 4.

## Formato de errores
Errores de validacion (Zod):
```json
{
  "mensaje": "Datos del servicio invalidos.",
  "errores": {
    "titulo": ["El titulo es obligatorio."],
    "precio": ["El precio debe ser un numero valido."]
  }
}
```

Errores simples:
```json
{ "mensaje": "Credenciales incorrectas." }
```

## Endpoints de usuarios

### `POST /usuarios/registro`
Registra un usuario.

Body:
```json
{
  "nombre": "Ana Lopez",
  "correo": "ana@mail.com",
  "password": "Password123",
  "rol": "trabajador",
  "telefono": "3001234567",
  "oficioCategoria": "Hogar",
  "oficio": "Plomeria"
}
```

Reglas:
- `rol` permitido: `cliente | trabajador`.
- Si `rol=trabajador`, son obligatorios `telefono`, `oficioCategoria`, `oficio`.
- `password` minimo 8 caracteres.

Respuesta `201`:
```json
{
  "mensaje": "Usuario guardado con exito.",
  "usuario": {
    "id": "664f...",
    "_id": "664f...",
    "nombre": "Ana Lopez",
    "correo": "ana@mail.com",
    "telefono": "3001234567",
    "rol": "trabajador",
    "oficioCategoria": "Hogar",
    "oficio": "Plomeria"
  }
}
```

Errores comunes:
- `400` datos invalidos.
- `409` correo ya registrado.

### `POST /usuarios/login`
Inicia sesion y crea cookie `accessToken`.

Body:
```json
{
  "correo": "ana@mail.com",
  "password": "Password123"
}
```

Respuesta `200`:
```json
{
  "mensaje": "Bienvenido.",
  "usuario": {
    "id": "664f...",
    "_id": "664f...",
    "nombre": "Ana Lopez",
    "correo": "ana@mail.com",
    "telefono": "3001234567",
    "rol": "trabajador",
    "oficioCategoria": "Hogar",
    "oficio": "Plomeria"
  }
}
```

Nota:
- El token no se devuelve en el body.
- El token queda en cookie `httpOnly`.

Errores comunes:
- `400` body invalido.
- `401` credenciales incorrectas.
- `500` si falta `JWT_SECRET`.

### `POST /usuarios/logout`
Cierra sesion limpiando cookie `accessToken`.

Respuesta `200`:
```json
{ "mensaje": "Sesion cerrada correctamente." }
```

### `GET /usuarios/perfil`
Devuelve perfil del usuario autenticado.

Requiere autenticacion por cookie o Bearer.

Respuesta `200`:
```json
{
  "usuario": {
    "id": "664f...",
    "_id": "664f...",
    "nombre": "Ana Lopez",
    "correo": "ana@mail.com",
    "telefono": "3001234567",
    "rol": "trabajador",
    "oficioCategoria": "Hogar",
    "oficio": "Plomeria"
  }
}
```

Errores comunes:
- `401` token ausente, invalido o expirado.
- `404` usuario no encontrado.

## Endpoints de servicios

### `POST /servicios`
Crea un servicio del usuario autenticado.

Requiere autenticacion por cookie o Bearer.

Body:
```json
{
  "titulo": "Reparacion de lavadoras",
  "descripcion": "Servicio tecnico a domicilio con diagnostico inicial.",
  "precio": 80000,
  "categoria": "Hogar",
  "oficio": "Electricidad",
  "correoContacto": "ana@mail.com",
  "telefonoContacto": "3001234567"
}
```

Reglas:
- `titulo`: 3-120 caracteres.
- `descripcion`: 10-1000 caracteres.
- `precio`: numero >= 0.
- `correoContacto`: email valido.
- `telefonoContacto`: 7-20 caracteres con formato de telefono valido.

Respuesta `201` (ejemplo):
```json
{
  "_id": "6650...",
  "titulo": "Reparacion de lavadoras",
  "descripcion": "Servicio tecnico a domicilio con diagnostico inicial.",
  "precio": 80000,
  "categoria": "Hogar",
  "oficioCategoria": "Hogar",
  "oficio": "Electricidad",
  "correoContacto": "ana@mail.com",
  "telefonoContacto": "3001234567",
  "usuario": "664f...",
  "createdAt": "2026-05-21T18:10:00.000Z",
  "updatedAt": "2026-05-21T18:10:00.000Z"
}
```

### `GET /servicios`
Lista servicios con paginacion y filtros.

Query params:
- `page` (opcional): por defecto `1`.
- `limit` (opcional): por defecto `9`, maximo `50`.
- `q` (opcional): busqueda parcial en `titulo`, `descripcion`, `categoria`, `oficio`.
- `categoria` (opcional): match exacto.
- `oficio` (opcional): match exacto.
- `minPrecio` (opcional): numero.
- `maxPrecio` (opcional): numero.
- `sortBy` (opcional): `createdAt | precio | titulo` (default `createdAt`).
- `sortDir` (opcional): `asc | desc` (default `desc`).

Ejemplo:
`GET /api/servicios?q=plomeria&categoria=Hogar&page=1&limit=9&sortBy=precio&sortDir=asc`

Respuesta `200`:
```json
{
  "items": [
    {
      "_id": "6650...",
      "titulo": "Plomeria express",
      "precio": 50000,
      "categoria": "Hogar",
      "oficio": "Plomeria",
      "usuario": {
        "_id": "664f...",
        "nombre": "Ana Lopez",
        "oficio": "Plomeria",
        "oficioCategoria": "Hogar",
        "correo": "ana@mail.com",
        "telefono": "3001234567"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 9,
    "total": 37,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

Errores comunes:
- `400` parametros invalidos (ej. `minPrecio` no numerico o rango invalido).

### `GET /servicios/mis-servicios`
Lista servicios del usuario autenticado, ordenados por fecha descendente.

Requiere autenticacion por cookie o Bearer.

Respuesta `200`:
```json
[
  {
    "_id": "6650...",
    "titulo": "Plomeria express",
    "precio": 50000
  }
]
```

### `GET /servicios/mis-servicios/:id`
Obtiene un servicio propio por ID.

Requiere autenticacion por cookie o Bearer.

Errores comunes:
- `400` ID invalido (modo MongoDB).
- `403` no autorizado para ver ese servicio.
- `404` servicio no encontrado.

### `PUT /servicios/:id`
Actualiza un servicio propio.

Requiere autenticacion por cookie o Bearer.
Body: mismo esquema de `POST /servicios`.

Respuesta `200`:
```json
{
  "mensaje": "Servicio actualizado correctamente.",
  "servicio": {
    "_id": "6650...",
    "titulo": "Plomeria express premium"
  }
}
```

Errores comunes:
- `400` ID o body invalidos.
- `403` no autorizado para editar ese servicio.
- `404` servicio no encontrado.

### `DELETE /servicios/:id`
Elimina un servicio propio.

Requiere autenticacion por cookie o Bearer.

Respuesta `200`:
```json
{ "mensaje": "Servicio eliminado correctamente." }
```

Errores comunes:
- `400` ID invalido (modo MongoDB).
- `403` no autorizado para eliminar ese servicio.
- `404` servicio no encontrado.

## Endpoint de salud
### `GET /`
Endpoint fuera de `/api` para verificar estado del backend.

Ejemplo de respuesta `200`:
```json
{
  "estado": "ok",
  "servicio": "laborapp-api",
  "modoMemoria": false,
  "jwtConfigurado": true,
  "fecha": "2026-05-21T18:00:00.000Z"
}
```

## Codigos de estado
- `200`: OK
- `201`: Creado
- `400`: Error de validacion o parametros
- `401`: No autenticado / token invalido
- `403`: No autorizado
- `404`: Recurso no encontrado
- `409`: Conflicto (correo duplicado)
- `429`: Demasiadas solicitudes
- `500`: Error interno del servidor
