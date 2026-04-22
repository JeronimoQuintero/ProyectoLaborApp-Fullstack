# Guia de Deployment - LaborApp

## Tabla de contenidos
- [Arquitectura de despliegue sugerida](#arquitectura-de-despliegue-sugerida)
- [Opcion recomendada (simple)](#opcion-recomendada-simple)
- [Pasos backend (Render/Railway)](#pasos-backend-renderrrailway)
- [Pasos frontend (Vercel/Netlify)](#pasos-frontend-vercelnetlify)
- [Checklist de salida a produccion](#checklist-de-salida-a-produccion)

## Arquitectura de despliegue sugerida
- Frontend: Vercel (React + Vite)
- Backend: Render o Railway (Node + Express)
- Base de datos: MongoDB Atlas

## Opcion recomendada (simple)
1. MongoDB Atlas (cluster M0 para tesis/demo)
2. Backend en Render (Web Service)
3. Frontend en Vercel
4. Configurar CORS para dominio frontend real

## Pasos backend (Render/Railway)
1. Conectar repo GitHub.
2. Root directory: `Backend`.
3. Build command: `npm install`.
4. Start command: `npm start`.
5. Configurar variables de entorno:
   - `NODE_ENV=production`
   - `PORT=8080` (si aplica)
   - `MONGO_URI`
   - `JWT_ACCESS_SECRET`
   - `JWT_REFRESH_SECRET`
   - `CORS_ORIGINS=https://tu-frontend.vercel.app`
   - `COOKIE_SECURE=true`
6. Verificar health endpoint (`GET /`).

## Pasos frontend (Vercel/Netlify)
1. Conectar repo.
2. Root directory: `frontend`.
3. Build command: `npm run build`.
4. Output dir: `dist`.
5. Variable:
   - `VITE_API_URL=https://tu-backend.onrender.com/api`

## Checklist de salida a produccion
- [ ] HTTPS habilitado en frontend y backend
- [ ] Cookies seguras (`Secure`, `HttpOnly`, `SameSite`)
- [ ] CORS solo con origenes permitidos
- [ ] Helmet activo
- [ ] Rate limiting en auth y global
- [ ] Logs y monitoreo basico
- [ ] Backups MongoDB Atlas habilitados
- [ ] Pruebas de humo post-deploy

Pruebas de humo minimas:
1. Registro de usuario
2. Login
3. Crear servicio autenticado
4. Listar servicios con filtros
5. Editar/eliminar servicio propio
