const express = require('express'); // Importamos Express para crear el router
const router = express.Router(); // Creamos un router para manejar las rutas de autenticación
const { registrarUsuario, loginUsuario } = require('../controllers/authController'); // Importamos las funciones del controlador de autenticación

router.post('/registro', registrarUsuario); // Ruta para el registro de usuarios
router.post('/login', loginUsuario); // Ruta para el login (inicio de sesión)

module.exports = router; // Exportamos el router para usarlo en index.js 

const verificarToken = require('../middleware/authMiddleware');

// Ruta protegida
router.get('/perfil', verificarToken, (req, res) => {
    res.json({ mensaje: "Este es tu perfil privado", usuario: req.usuario });
});
