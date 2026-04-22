# Priorizacion de Funcionalidades - LaborApp

## Tabla de contenidos
- [Matriz de prioridad](#matriz-de-prioridad)
- [Detalle por funcionalidad](#detalle-por-funcionalidad)
- [Orden recomendado de implementacion](#orden-recomendado-de-implementacion)

## Matriz de prioridad

### CRITICAS para MVP
| Funcionalidad | Prioridad | Complejidad (1-10) | Tiempo estimado | Dependencias | Riesgo tecnico |
|---|---|---:|---|---|---|
| Busqueda y filtrado avanzado | Critica | 5 | 2-3 dias | Indices MongoDB, query parser | Filtros lentos sin indices |
| Paginacion | Critica | 4 | 1-2 dias | Endpoint list robusto | UX inconsistente si no hay meta |
| Perfil editable | Critica | 4 | 2 dias | Auth estable, validacion | Inconsistencia de datos de usuario |
| Recuperacion de contrasena | Critica | 6 | 2-4 dias | Email provider (Resend/SendGrid), tokens | Riesgo de account takeover si se implementa mal |

### IMPORTANTES post-MVP cercano
| Funcionalidad | Prioridad | Complejidad (1-10) | Tiempo estimado | Dependencias | Riesgo tecnico |
|---|---|---:|---|---|---|
| Calificaciones / Reviews | Importante | 6 | 3-4 dias | Modelo review, reglas de negocio | Fraude de reviews |
| Panel de administrador | Importante | 8 | 5-8 dias | RBAC, auditoria, tablas de control | Escalamiento de privilegios |

### NICE-TO-HAVE
| Funcionalidad | Prioridad | Complejidad (1-10) | Tiempo estimado | Dependencias | Riesgo tecnico |
|---|---|---:|---|---|---|
| Notificaciones | Nice-to-have | 7 | 4-6 dias | Cola/eventos, sockets o email | Ruido/duplicidad de eventos |
| Chat entre usuarios | Nice-to-have | 9 | 8-12 dias | WebSocket (Socket.IO), persistencia | Escalabilidad y moderacion |

## Detalle por funcionalidad

## 1) Busqueda y filtrado avanzado
### Diseno de base de datos
No requiere nuevo modelo, pero si indices:
```js
// Service
serviceSchema.index({ titulo: 'text', descripcion: 'text', oficio: 'text' });
serviceSchema.index({ categoria: 1, oficio: 1, precio: 1, createdAt: -1 });
```

### Endpoints API
- `GET /api/servicios?q=&categoria=&oficio=&minPrecio=&maxPrecio=&page=&limit=&sortBy=&sortDir=`
- `GET /api/servicios/facets` (opcional: categorias/oficios disponibles)

### Componentes React
- `ServiceFiltersPanel`
- `PriceRangeFilter`
- `ServicesList`
- `ActiveFiltersChips`

### Flujo de usuario
1. Usuario escribe palabra clave o selecciona filtros.
2. Frontend actualiza query params.
3. Backend responde lista filtrada + metadatos.
4. Usuario ajusta filtros sin recargar la pagina.

## 2) Paginacion
### Diseno de base de datos
No requiere nuevos campos.

### Endpoints API
- `GET /api/servicios?page=1&limit=12`
- Respuesta con `meta: { page, limit, total, totalPages }`

### Componentes React
- `PaginationControls`
- `PageSizeSelector`

### Flujo de usuario
1. Usuario entra al listado.
2. Ve pagina 1 y total de resultados.
3. Cambia a pagina 2 o tamano de pagina.
4. El listado se actualiza manteniendo filtros.

## 3) Calificaciones / Reviews
### Diseno de base de datos
```js
// Review
{
  _id,
  servicio: ObjectId,      // ref Service
  trabajador: ObjectId,    // ref User
  cliente: ObjectId,       // ref User
  rating: Number,          // 1..5
  comentario: String,
  createdAt,
  updatedAt
}
```
Indices:
```js
reviewSchema.index({ servicio: 1, cliente: 1 }, { unique: true });
reviewSchema.index({ trabajador: 1, createdAt: -1 });
```

### Endpoints API
- `POST /api/reviews`
- `GET /api/servicios/:id/reviews`
- `PATCH /api/reviews/:id`
- `DELETE /api/reviews/:id`

### Componentes React
- `ReviewForm`
- `ReviewsList`
- `RatingStars`

### Flujo de usuario
1. Cliente contrata/interactua con servicio.
2. Publica review y rating.
3. Sistema recalcula promedio del trabajador.
4. Otros usuarios ven reputacion antes de contactar.

## 4) Chat entre usuarios
### Diseno de base de datos
```js
// Conversation
{
  _id,
  participantes: [ObjectId],
  servicio: ObjectId,
  lastMessageAt: Date,
  createdAt,
  updatedAt
}

// Message
{
  _id,
  conversationId: ObjectId,
  senderId: ObjectId,
  body: String,
  readBy: [ObjectId],
  createdAt
}
```

### Endpoints API
- `POST /api/chats/conversations`
- `GET /api/chats/conversations`
- `GET /api/chats/conversations/:id/messages?page=&limit=`
- `POST /api/chats/conversations/:id/messages`

### Componentes React
- `InboxPage`
- `ConversationList`
- `ChatWindow`
- `MessageInput`

### Flujo de usuario
1. Cliente pulsa "Contactar" en un servicio.
2. Se crea o reutiliza conversacion.
3. Intercambio de mensajes en tiempo real.
4. Notificacion de nuevos mensajes.

## 5) Perfil de usuario editable
### Diseno de base de datos
Extender `User` con:
```js
bio: String,
avatarUrl: String,
ciudad: String,
available: Boolean,
skills: [String]
```

### Endpoints API
- `GET /api/usuarios/me`
- `PATCH /api/usuarios/me`
- `PATCH /api/usuarios/me/password` (si no se usa recovery)

### Componentes React
- `ProfilePage`
- `ProfileForm`
- `AvatarUploader`

### Flujo de usuario
1. Usuario entra a "Mi perfil".
2. Edita datos visibles para clientes.
3. Guarda cambios y ve preview actualizado.

## 6) Recuperacion de contrasena
### Diseno de base de datos
```js
// PasswordResetToken
{
  _id,
  userId: ObjectId,
  tokenHash: String,
  expiresAt: Date,
  usedAt: Date | null,
  createdAt
}
```

### Endpoints API
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Componentes React
- `ForgotPasswordPage`
- `ResetPasswordPage`

### Flujo de usuario
1. Usuario solicita recuperacion por email.
2. Recibe enlace con token temporal.
3. Define nueva clave.
4. Sistema invalida token usado.

## 7) Notificaciones
### Diseno de base de datos
```js
// Notification
{
  _id,
  userId: ObjectId,
  type: String, // review_created, message_received, service_contacted...
  title: String,
  payload: Object,
  readAt: Date | null,
  createdAt
}
```

### Endpoints API
- `GET /api/notificaciones?page=&limit=`
- `PATCH /api/notificaciones/:id/read`
- `PATCH /api/notificaciones/read-all`

### Componentes React
- `NotificationBell`
- `NotificationsDropdown`
- `NotificationsPage`

### Flujo de usuario
1. Ocurre evento relevante (nuevo mensaje, review, etc.).
2. Se crea notificacion para usuario destino.
3. Usuario abre campana y marca como leida.

## 8) Panel de administrador
### Diseno de base de datos
Reutilizar `User.rol = admin` + auditoria:
```js
// AuditLog
{
  _id,
  actorId: ObjectId,
  action: String,
  resource: String,
  resourceId: ObjectId,
  metadata: Object,
  createdAt
}
```

### Endpoints API
- `GET /api/admin/stats`
- `GET /api/admin/usuarios?page=&limit=`
- `PATCH /api/admin/usuarios/:id/status`
- `GET /api/admin/servicios?page=&limit=`
- `DELETE /api/admin/servicios/:id`

### Componentes React
- `AdminDashboardPage`
- `AdminUsersTable`
- `AdminServicesTable`
- `ModerationActions`

### Flujo de usuario
1. Admin inicia sesion con permisos elevados.
2. Revisa metricas y contenido reportado.
3. Ejecuta acciones de moderacion trazables.

## Orden recomendado de implementacion
1. Busqueda/filtrado avanzado
2. Paginacion
3. Perfil editable
4. Recuperacion de contrasena
5. Reviews
6. Panel admin
7. Notificaciones
8. Chat

Razon: primero mejoras que elevan valor inmediato de MVP y seguridad operativa, luego capacidades de comunidad y tiempo real.
