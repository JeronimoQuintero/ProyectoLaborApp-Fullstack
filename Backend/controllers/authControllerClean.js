const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const validarRegistro = ({ nombre, correo, password, rol, oficio, oficioCategoria, telefono }) => {
    if (!nombre?.trim() || !correo?.trim() || !password?.trim()) {
        return 'Nombre, correo y contrasena son obligatorios.';
    }

    if (password.trim().length < 6) {
        return 'La contrasena debe tener al menos 6 caracteres.';
    }

    if (!['cliente', 'trabajador'].includes(rol)) {
        return 'El rol seleccionado no es valido.';
    }

    if (rol === 'trabajador' && (!oficio?.trim() || !oficioCategoria?.trim() || !telefono?.trim())) {
        return 'El oficio, su categoria y el celular son obligatorios para los trabajadores.';
    }

    if (telefono?.trim() && !/^[0-9+\-\s()]{7,20}$/.test(telefono.trim())) {
        return 'El numero de celular no es valido.';
    }

    return null;
};

const registrarUsuario = async (req, res) => {
    try {
        const errorValidacion = validarRegistro(req.body);
        if (errorValidacion) {
            return res.status(400).json({ mensaje: errorValidacion });
        }

        const correo = req.body.correo.trim().toLowerCase();
        const usuarioExistente = await Usuario.findOne({ correo });
        if (usuarioExistente) {
            return res.status(409).json({ mensaje: 'Ya existe un usuario con ese correo.' });
        }

        const nuevoUsuario = new Usuario({
            nombre: req.body.nombre.trim(),
            correo,
            password: req.body.password,
            rol: req.body.rol,
            telefono: req.body.rol === 'trabajador' ? req.body.telefono.trim() : '',
            oficioCategoria: req.body.rol === 'trabajador' ? req.body.oficioCategoria.trim() : 'General',
            oficio: req.body.rol === 'trabajador' ? req.body.oficio.trim() : 'Ninguno',
        });

        await nuevoUsuario.save();
        res.status(201).json({ mensaje: 'Usuario guardado con exito.' });
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al registrar el usuario.' });
    }
};

const loginUsuario = async (req, res) => {
    try {
        const { correo, password } = req.body;
        if (!correo?.trim() || !password?.trim()) {
            return res.status(400).json({ mensaje: 'Correo y contrasena son obligatorios.' });
        }

        const usuario = await Usuario.findOne({ correo: correo.trim().toLowerCase() });
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
        }

        const esCorrecta = await bcrypt.compare(password, usuario.password);
        if (!esCorrecta) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
        }

        const token = jwt.sign(
            { id: usuario._id.toString(), rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            mensaje: 'Bienvenido.',
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                telefono: usuario.telefono,
                rol: usuario.rol,
                oficioCategoria: usuario.oficioCategoria,
                oficio: usuario.oficio,
            },
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor.' });
    }
};

module.exports = { registrarUsuario, loginUsuario };
