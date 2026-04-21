const express = require('express');
const router = express.Router();
const {
    crearServicio,
    obtenerServicios,
    obtenerMisServicios,
    obtenerMiServicioPorId,
    actualizarServicio,
    eliminarServicio,
} = require('../controllers/servicioController');
const verificarToken = require('../middleware/authMiddlewareClean');

// Publicar requiere token, Ver servicios es público
router.post('/', verificarToken, crearServicio);
router.get('/', obtenerServicios);
router.get('/mis-servicios', verificarToken, obtenerMisServicios);
router.get('/mis-servicios/:id', verificarToken, obtenerMiServicioPorId);
router.put('/:id', verificarToken, actualizarServicio);
router.delete('/:id', verificarToken, eliminarServicio);

module.exports = router;
