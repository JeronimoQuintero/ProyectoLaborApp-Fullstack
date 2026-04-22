const jwt = require('jsonwebtoken');

const obtenerToken = (req) => {
    const cookieToken = req.cookies?.accessToken;
    if (cookieToken) {
        return cookieToken;
    }

    const authorization = req.header('Authorization');
    if (authorization?.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '').trim();
    }

    return null;
};

const verificarToken = (req, res, next) => {
    const secret = process.env.JWT_SECRET?.trim();
    if (!secret) {
        return res.status(500).json({ mensaje: 'JWT_SECRET no esta configurado.' });
    }

    const token = obtenerToken(req);
    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado. Token no enviado.' });
    }

    try {
        const cifrado = jwt.verify(token, secret);
        req.usuario = cifrado;
        return next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token invalido o expirado.' });
    }
};

module.exports = verificarToken;
