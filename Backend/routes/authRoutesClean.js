const express = require('express');
const { registrarUsuario, loginUsuario } = require('../controllers/authControllerClean');
const verificarToken = require('../middleware/authMiddlewareClean');

const router = express.Router();

router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);
router.get('/perfil', verificarToken, (req, res) => {
    res.json({ usuario: req.usuario });
});

module.exports = router;
