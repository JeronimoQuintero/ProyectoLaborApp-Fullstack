# Variables de Entorno - LaborApp

## Tabla de contenidos
- [Backend](#backend)
- [Frontend](#frontend)
- [Buenas practicas](#buenas-practicas)

## Backend
Crear archivo `Backend/.env` basado en `Backend/.env.example`.

Variables:

| Variable | Obligatoria | Ejemplo | Descripcion |
|---|---|---|---|
| `NODE_ENV` | Si | `development` | Entorno de ejecucion |
| `PORT` | Si | `8080` | Puerto API |
| `MONGO_URI` | Si | `mongodb://localhost:27017/plataforma_servicios` | Conexion MongoDB |
| `JWT_ACCESS_SECRET` | Si | `super-secret-access` | Secreto para access token |
| `JWT_REFRESH_SECRET` | Si | `super-secret-refresh` | Secreto para refresh token |
| `JWT_ACCESS_EXPIRES` | Si | `15m` | Duracion access token |
| `JWT_REFRESH_EXPIRES` | Si | `7d` | Duracion refresh token |
| `CORS_ORIGINS` | Si | `http://localhost:5173` | Origenes permitidos separados por coma |
| `COOKIE_SECURE` | Si | `false` | `true` en produccion HTTPS |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Ventana rate limit (ms) |
| `RATE_LIMIT_MAX` | No | `100` | Max requests por ventana |
| `BCRYPT_SALT_ROUNDS` | No | `12` | Rondas de hash |

## Frontend
Crear archivo `frontend/.env` basado en `frontend/.env.example`.

| Variable | Obligatoria | Ejemplo | Descripcion |
|---|---|---|---|
| `VITE_API_URL` | Si | `http://localhost:8080/api` | Base URL del backend |

Si usas cookies `httpOnly`, recuerda configurar Axios:

```js
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
```

## Buenas practicas
- Nunca commitear archivos `.env` reales.
- Usar secretos largos y aleatorios.
- Separar secretos por ambiente (`dev`, `staging`, `prod`).
- Rotar secretos periodicamente.
- Usar gestor de secretos en despliegue (Render/Railway/Vercel/1Password/AWS Secrets Manager).
