# Diagramas UML y Modelo Entidad-Relacion - LaborApp

## 1. Alcance
Este documento describe el sistema **actual** implementado en `Backend/` y `frontend/`.
Incluye:
- diagramas UML completos del flujo funcional y la arquitectura.
- modelo entidad-relacion detallado de la persistencia.

## 2. Diagrama de Casos de Uso (UML)
```mermaid
flowchart LR
    V[Visitante]:::actor
    C[Cliente]:::actor
    T[Trabajador]:::actor

    UC1((Explorar servicios))
    UC2((Registrarse))
    UC3((Iniciar sesion))
    UC4((Cerrar sesion))
    UC5((Ver perfil))
    UC6((Publicar servicio))
    UC7((Editar servicio propio))
    UC8((Eliminar servicio propio))
    UC9((Listar mis servicios))

    V --> UC1
    V --> UC2
    V --> UC3

    C --> UC1
    C --> UC3
    C --> UC4
    C --> UC5

    T --> UC1
    T --> UC3
    T --> UC4
    T --> UC5
    T --> UC6
    T --> UC7
    T --> UC8
    T --> UC9

    classDef actor fill:#f7fbff,stroke:#245b7a,stroke-width:1px;
```

## 3. Diagrama de Componentes (UML)
```mermaid
flowchart TB
    subgraph FE[Frontend React]
        APP[App Router]
        AUTHCTX[AuthContext]
        PAGES[Paginas y Componentes]
        APICLIENT[Axios API Client]
    end

    subgraph BE[Backend Express]
        INDEX[index.js]
        AUTHR[authRoutes]
        SERVR[servicioRoutes]
        AUTHMW[authMiddleware]
        AUTHC[authController]
        SERVC[servicioController]
        USERMODEL[Usuario Model]
        SERVMODEL[Servicio Model]
        MEMSTORE[inMemoryStore]
    end

    DB[(MongoDB)]

    APP --> PAGES
    PAGES --> AUTHCTX
    PAGES --> APICLIENT
    AUTHCTX --> APICLIENT

    APICLIENT --> INDEX
    INDEX --> AUTHR
    INDEX --> SERVR

    AUTHR --> AUTHC
    AUTHR --> AUTHMW

    SERVR --> AUTHMW
    SERVR --> SERVC

    AUTHC --> USERMODEL
    AUTHC --> MEMSTORE

    SERVC --> SERVMODEL
    SERVC --> USERMODEL
    SERVC --> MEMSTORE

    USERMODEL --> DB
    SERVMODEL --> DB
```

## 4. Diagrama de Clases (UML) - Dominio y Aplicacion
```mermaid
classDiagram
    direction LR

    class Usuario {
      +ObjectId _id
      +string nombre
      +string correo
      +string password
      +string rol
      +string telefono
      +string oficioCategoria
      +string oficio
      +Date createdAt
      +Date updatedAt
      +preSaveHashPassword()
    }

    class Servicio {
      +ObjectId _id
      +string titulo
      +string descripcion
      +number precio
      +string categoria
      +string oficioCategoria
      +string oficio
      +string correoContacto
      +string telefonoContacto
      +ObjectId usuario
      +Date createdAt
      +Date updatedAt
    }

    class AuthController {
      +registrarUsuario(req, res)
      +loginUsuario(req, res)
      +obtenerPerfil(req, res)
      +logoutUsuario(req, res)
    }

    class ServicioController {
      +crearServicio(req, res)
      +obtenerServicios(req, res)
      +obtenerMisServicios(req, res)
      +obtenerMiServicioPorId(req, res)
      +actualizarServicio(req, res)
      +eliminarServicio(req, res)
    }

    class AuthMiddleware {
      +obtenerToken(req)
      +verificarToken(req, res, next)
    }

    class InMemoryStore {
      +findUserByEmail(correo)
      +findUserById(id)
      +createUser(payload)
      +listServices()
      +findServiceById(id)
      +createService(payload)
      +updateService(id, payload)
      +removeService(id)
      +listServicesByUser(userId)
    }

    class JWT {
      +sign(payload, secret, options)
      +verify(token, secret)
    }

    Usuario "1" <-- "0..*" Servicio : publica
    AuthController ..> Usuario : consulta y crea
    ServicioController ..> Servicio : CRUD
    ServicioController ..> Usuario : obtiene oficioCategoria
    AuthController ..> InMemoryStore : fallback memoria
    ServicioController ..> InMemoryStore : fallback memoria
    AuthMiddleware ..> JWT : verifica token
    AuthController ..> JWT : firma token
```

## 5. Diagrama de Secuencia (UML) - Login
```mermaid
sequenceDiagram
    actor U as Usuario
    participant FE as Frontend
    participant API as Express API
    participant AC as authController
    participant UM as UsuarioModel o inMemoryStore
    participant JWT as jsonwebtoken

    U->>FE: Ingresa correo y password
    FE->>API: POST /api/usuarios/login
    API->>AC: loginUsuario(req,res)
    AC->>UM: Buscar usuario por correo
    UM-->>AC: Usuario o null

    alt Credenciales validas
        AC->>JWT: sign(payload id+rol, secret)
        JWT-->>AC: token
        AC-->>API: Set-Cookie accessToken
        API-->>FE: 200 + usuario serializado
        FE-->>U: Sesion iniciada
    else Credenciales invalidas
        API-->>FE: 401 Credenciales incorrectas
        FE-->>U: Mostrar error
    end
```

## 6. Diagrama de Secuencia (UML) - Crear Servicio
```mermaid
sequenceDiagram
    actor T as Trabajador
    participant FE as Frontend
    participant API as Express API
    participant MW as authMiddleware
    participant SC as servicioController
    participant UM as UsuarioModel o inMemoryStore
    participant SM as ServicioModel o inMemoryStore

    T->>FE: Completa formulario de servicio
    FE->>API: POST /api/servicios (cookie o bearer)
    API->>MW: verificarToken(req,res,next)

    alt Token valido
        MW-->>SC: next() con req.usuario
        SC->>UM: Obtener usuario autenticado
        UM-->>SC: Usuario con oficioCategoria
        SC->>SM: Guardar nuevo servicio
        SM-->>SC: Servicio creado
        SC-->>FE: 201 Servicio
        FE-->>T: Confirmacion de publicacion
    else Token invalido o ausente
        MW-->>FE: 401 No autenticado
        FE-->>T: Redirigir a login
    end
```

## 7. Diagrama de Estados (UML) - Sesion de Usuario
```mermaid
stateDiagram-v2
    [*] --> NoAutenticado

    NoAutenticado --> Autenticado: Login exitoso
    NoAutenticado --> NoAutenticado: Login fallido

    Autenticado --> NoAutenticado: Logout exitoso
    Autenticado --> TokenExpirado: Expira JWT
    TokenExpirado --> NoAutenticado: 401 en endpoint protegido

    Autenticado --> Autenticado: Uso de endpoints protegidos
```

## 8. Diagrama de Despliegue (UML)
```mermaid
flowchart LR
    USER[Usuario en navegador]
    FE[SPA React Vite]
    API[Servidor Node.js Express]
    DB[(MongoDB)]
    MEM[(InMemoryStore opcional)]

    USER --> FE
    FE -->|HTTP/JSON + cookies| API
    API --> DB
    API --> MEM
```

## 9. Modelo Entidad-Relacion (Detallado)

### 9.1. ER Logico
```mermaid
erDiagram
    USUARIO ||--o{ SERVICIO : publica

    USUARIO {
        objectId _id PK
        string nombre
        string correo UK
        string password
        string rol
        string telefono
        string oficioCategoria
        string oficio
        date createdAt
        date updatedAt
    }

    SERVICIO {
        objectId _id PK
        string titulo
        string descripcion
        number precio
        string categoria
        string oficioCategoria
        string oficio
        string correoContacto
        string telefonoContacto
        objectId usuario FK
        date createdAt
        date updatedAt
    }
```

### 9.2. Cardinalidades y reglas
- Un `USUARIO` puede tener **cero o muchos** `SERVICIO`.
- Un `SERVICIO` pertenece a **exactamente un** `USUARIO`.
- `USUARIO.correo` es unico.
- Si `USUARIO.rol = trabajador`, los campos `telefono`, `oficioCategoria` y `oficio` son obligatorios por regla de negocio.
- `SERVICIO.precio` debe ser mayor o igual a 0.
- `SERVICIO.usuario` es FK hacia `USUARIO._id` (referencia Mongoose).

### 9.3. Diccionario de datos

#### Entidad: USUARIO
| Campo | Tipo | Requerido | Restricciones | Descripcion |
|---|---|---|---|---|
| `_id` | ObjectId | Si | PK | Identificador unico |
| `nombre` | String | Si | trim | Nombre del usuario |
| `correo` | String | Si | unique, lowercase, email | Correo de acceso |
| `password` | String | Si | hash bcrypt | Contrasena cifrada |
| `rol` | String | Si | `cliente` o `trabajador` | Tipo de usuario |
| `telefono` | String | Condicional | regex telefono | Contacto del trabajador |
| `oficioCategoria` | String | Condicional | trim | Categoria laboral |
| `oficio` | String | Condicional | trim | Especialidad |
| `createdAt` | Date | Si | auto timestamp | Fecha creacion |
| `updatedAt` | Date | Si | auto timestamp | Fecha actualizacion |

#### Entidad: SERVICIO
| Campo | Tipo | Requerido | Restricciones | Descripcion |
|---|---|---|---|---|
| `_id` | ObjectId | Si | PK | Identificador unico |
| `titulo` | String | Si | 3-120 chars | Titulo de la oferta |
| `descripcion` | String | Si | 10-1000 chars | Detalle del servicio |
| `precio` | Number | Si | min 0 | Precio ofertado |
| `categoria` | String | Si | trim | Categoria principal |
| `oficioCategoria` | String | Si | default `General` | Categoria del oficio |
| `oficio` | String | Si | trim | Especialidad ofrecida |
| `correoContacto` | String | Si | lowercase, email | Correo visible en oferta |
| `telefonoContacto` | String | Si | regex telefono | Celular visible en oferta |
| `usuario` | ObjectId | Si | FK -> `USUARIO._id` | Propietario del servicio |
| `createdAt` | Date | Si | auto timestamp | Fecha creacion |
| `updatedAt` | Date | Si | auto timestamp | Fecha actualizacion |

### 9.4. Indices implementados
- En `USUARIO`:
  - indice unico en `correo` (por `unique: true`).
- En `SERVICIO`:
  - indice compuesto: `{ categoria: 1, oficio: 1, createdAt: -1 }`.
  - indice de texto: `{ titulo: "text", descripcion: "text", oficio: "text" }`.
  - indice compuesto: `{ usuario: 1, createdAt: -1 }`.

## 10. Notas tecnicas
- El sistema soporta persistencia dual:
  - MongoDB (modo normal).
  - almacenes en memoria (`USE_IN_MEMORY_DB=true`) para demo/desarrollo.
- El modelo ER representa el esquema de persistencia principal (MongoDB), manteniendo equivalencia funcional con el store en memoria.
