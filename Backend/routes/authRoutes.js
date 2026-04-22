const express = require('express');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

const {
    registrarUsuario,
    loginUsuario,
    obtenerPerfil,
    logoutUsuario,
} = require('../controllers/authController');
const verificarToken = require('../middleware/authMiddleware');

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 8,
    standardHeaders: true,
    legacyHeaders: false,
    message: { mensaje: 'Demasiados intentos. Intenta nuevamente en unos minutos.' },
});

const authSlowDown = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 4,
    delayMs: () => 500,
});

router.post('/registro', authLimiter, registrarUsuario);
router.post('/login', authLimiter, authSlowDown, loginUsuario);
router.post('/logout', logoutUsuario);
router.get('/perfil', verificarToken, obtenerPerfil);

module.exports = router;
