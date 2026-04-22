# API Documentation - LaborApp

## Tabla de contenidos
- [Base URL](#base-url)
- [Autenticacion](#autenticacion)
- [Endpoints actuales](#endpoints-actuales)
- [Endpoints recomendados (proxima iteracion)](#endpoints-recomendados-proxima-iteracion)
- [Ejemplos de request/response](#ejemplos-de-requestresponse)
- [Codigos de estado](#codigos-de-estado)

## Base URL
- Desarrollo local: `http://localhost:8080/api`

## Autenticacion
### Estado actual
- JWT enviado por header: `Authorization: Bearer <token>`.

### Recomendacion
- Migrar a cookies `httpOnly` con `withCredentials`.

## Endpoints actuales

## Auth
### `POST /usuarios/registro`
Registra usuario.

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

Respuesta 201:
```json
{ "mensaje": "Usuario guardado con exito." }
```

### `POST /usuarios/login`
Inicia sesion.

Body:
```json
{
  "correo": "ana@mail.com",
  "password": "Password123"
}
```

Respuesta 200:
```json
{
  "mensaje": "Bienvenido.",
  "token": "jwt-token",
  "usuario": {
    "id": "...",
    "nombre": "Ana Lopez",
    "correo": "ana@mail.com",
    "rol": "trabajador"
  }
}
```

### `GET /usuarios/perfil`
Ruta protegida, requiere token.

## Servicios
### `POST /servicios`
Crea servicio (trabajador autenticado).

Headers:
```http
Authorization: Bearer <token>
```

Body:
```json
{
  "titulo": "Reparacion de lavadoras",
  "descripcion": "Servicio a domicilio",
  "precio": 80000,
  "categoria": "Hogar",
  "oficio": "Electricidad",
  "correoContacto": "ana@mail.com",
  "telefonoContacto": "3001234567"
}
```

### `GET /servicios`
Lista servicios (actualmente sin paginacion).

### `GET /servicios/mis-servicios`
Lista servicios del usuario autenticado.

### `GET /servicios/mis-servicios/:id`
Obtiene un servicio propio por id.

### `PUT /servicios/:id`
Actualiza un servicio propio.

### `DELETE /servicios/:id`
Elimina un servicio propio.

## Endpoints recomendados (proxima iteracion)

## Auth
- `POST /auth/login` (set cookies)
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

## Servicios
- `GET /servicios?page=&limit=&q=&categoria=&oficio=&minPrecio=&maxPrecio=&sortBy=&sortDir=`
- `GET /servicios/:id`
- `POST /servicios`
- `PATCH /servicios/:id`
- `DELETE /servicios/:id`

## Perfil
- `GET /usuarios/me`
- `PATCH /usuarios/me`
- `PATCH /usuarios/me/password`

## Reviews
- `POST /reviews`
- `GET /servicios/:id/reviews`
- `PATCH /reviews/:id`
- `DELETE /reviews/:id`

## Ejemplos de request/response

### Ejemplo de listado con paginacion
`GET /api/servicios?q=plomeria&categoria=Hogar&page=1&limit=12`

Respuesta:
```json
{
  "items": [
    {
      "_id": "...",
      "titulo": "Plomeria express",
      "precio": 50000,
      "categoria": "Hogar"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 37,
    "totalPages": 4
  }
}
```

### Ejemplo de error de validacion
```json
{
  "message": "Datos invalidos",
  "errors": {
    "fieldErrors": {
      "correo": ["Correo invalido"]
    }
  }
}
```

## Codigos de estado
- `200`: OK
- `201`: Creado
- `400`: Error de validacion
- `401`: No autenticado
- `403`: No autorizado
- `404`: Recurso no encontrado
- `409`: Conflicto (ej. correo duplicado)
- `429`: Demasiadas solicitudes
- `500`: Error interno
