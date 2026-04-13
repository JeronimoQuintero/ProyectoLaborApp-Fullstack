const express = require('express');
const router = express.Router();
const { crearServicio, obtenerServicios } = require('../controllers/servicioController');
const verificarToken = require('../middleware/authMiddleware');

// Publicar requiere token, Ver servicios es público
router.post('/', verificarToken, crearServicio);
router.get('/', obtenerServicios);

module.exports = router;