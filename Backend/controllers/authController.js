const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Traemos la librería de los tokens

// 1. Registro de Usuario
const registrarUsuario = async (req, res) => {
    try {
        const nuevoUsuario = new Usuario(req.body);
        await nuevoUsuario.save();
        res.status(201).json({ mensaje: "¡Usuario guardado con éxito!" });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al registrar", detalle: error.message });
    }
};

// 2. Inicio de Sesión (Login)
const loginUsuario = async (req, res) => {
    try {
        const { correo, password } = req.body;

        // Buscamos si el correo existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        // Comparamos la contraseña escrita con la encriptada
        const esCorrecta = await bcrypt.compare(password, usuario.password);
        if (!esCorrecta) {
            return res.status(400).json({ mensaje: "Contraseña incorrecta" });
        }

        // SI TODO ESTÁ BIEN, CREAMOS EL TOKEN 
        const token = jwt.sign(
            { id: usuario._id, rol: usuario.rol }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' } // El token expira en un día
        );

        // Respondemos con el mensaje, el token y datos básicos
        res.json({ 
            mensaje: "¡Bienvenido!", 
            token, 
            usuario: { 
                nombre: usuario.nombre, 
                rol: usuario.rol 
            } 
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
};

module.exports = { registrarUsuario, loginUsuario };