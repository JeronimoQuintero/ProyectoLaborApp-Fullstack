const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ mensaje: "Acceso denegado. No hay token." });

    try {
        const cifrado = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.usuario = cifrado;
        next(); // Si todo está bien, pasa a la siguiente función
    } catch (error) {
        res.status(400).json({ mensaje: "Token no válido" });
    }
};

module.exports = verificarToken;