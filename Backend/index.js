const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const conectarBaseDeDatos = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const servicioRoutes = require('./routes/servicioRoutes');

const app = express();
app.set('trust proxy', 1);

const DEFAULT_CORS_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
];
const corsOrigins = (process.env.CORS_ORIGINS || DEFAULT_CORS_ORIGINS.join(','))
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || corsOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Origen no permitido por CORS.'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
};

const apiRateLimiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { mensaje: 'Demasiadas solicitudes. Intenta nuevamente en unos minutos.' },
});

conectarBaseDeDatos();

app.use(helmet());
app.use((req, res, next) => {
    const origin = req.get('origin');
    const host = req.get('host');

    // Las solicitudes del mismo dominio no requieren cabeceras CORS. Esto permite
    // servir frontend y API desde un único proyecto de Vercel sin abrir CORS.
    if (origin && host) {
        try {
            if (new URL(origin).host === host) {
                return next();
            }
        } catch {
            // Si Origin no es una URL válida, el middleware CORS lo rechazará.
        }
    }

    return cors(corsOptions)(req, res, next);
});
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use('/api', apiRateLimiter);

app.use('/api/usuarios', authRoutes);
app.use('/api/servicios', servicioRoutes);

app.get('/', (req, res) => {
    res.json({
        estado: 'ok',
        servicio: 'laborapp-api',
        modoMemoria: process.env.USE_IN_MEMORY_DB === 'true',
        jwtConfigurado: Boolean(process.env.JWT_SECRET),
        fecha: new Date().toISOString(),
    });
});

app.use((req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada.' });
});

app.use((error, req, res, next) => {
    if (error.message === 'Origen no permitido por CORS.') {
        return res.status(403).json({ mensaje: error.message });
    }

    return next(error);
});

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
});

if (require.main === module) {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
}

module.exports = app;
