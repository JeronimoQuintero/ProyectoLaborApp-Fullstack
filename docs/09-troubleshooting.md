# Troubleshooting - LaborApp

## Tabla de contenidos
- [Backend no inicia](#backend-no-inicia)
- [Frontend no conecta al backend](#frontend-no-conecta-al-backend)
- [Error CORS](#error-cors)
- [Token invalido o sesion perdida](#token-invalido-o-sesion-perdida)
- [MongoDB connection error](#mongodb-connection-error)
- [Build falla en frontend](#build-falla-en-frontend)

## Backend no inicia
### Sintoma
`Error en la conexion` o proceso finaliza.

### Verificar
- `Backend/.env` existe y tiene `MONGO_URI` valida.
- Puerto libre (`PORT=8080`).
- Dependencias instaladas: `npm install`.

## Frontend no conecta al backend
### Sintoma
Axios retorna `Network Error`.

### Verificar
- Backend corriendo en `http://localhost:8080`.
- `frontend/.env` con `VITE_API_URL=http://localhost:8080/api`.
- Reiniciar Vite tras cambiar `.env`.

## Error CORS
### Sintoma
`Blocked by CORS policy` en navegador.

### Verificar
- `CORS_ORIGINS` incluye dominio frontend exacto.
- Si usas cookies, Axios debe incluir `withCredentials: true`.
- Backend debe tener `credentials: true` en `cors()`.

## Token invalido o sesion perdida
### Sintoma
401 en rutas privadas.

### Verificar
- Si usas header Bearer, token presente y no expirado.
- Si usas cookies, flags correctos (`Secure`, `SameSite`, `HttpOnly`).
- Endpoint `/auth/refresh` funcionando.

## MongoDB connection error
### Sintoma
`MongooseServerSelectionError`.

### Verificar
- IP permitida en Atlas.
- Usuario/password correctos en URI.
- Cadena URI sin espacios extra.

## Build falla en frontend
### Sintoma
Errores de import o lint.

### Verificar
- Imports con rutas correctas.
- Eliminar codigo legacy no referenciado.
- Correr `npm run lint` para detectar problemas antes de build.

Si persiste, ejecutar build local con logs:
```bash
cd frontend
npm run build
```
