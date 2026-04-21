const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const authorization = req.header('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
        return res.status(401).json({ mensaje: 'Acceso denegado. Token no enviado.' });
    }

    try {
        const token = authorization.replace('Bearer ', '').trim();
        const cifrado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = cifrado;
        next();
    } catch (error) {
        res.status(401).json({ mensaje: 'Token no valido.' });
    }
};

module.exports = verificarToken;
