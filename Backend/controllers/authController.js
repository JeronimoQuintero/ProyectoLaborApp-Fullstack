const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const Usuario = require('../models/Usuario');

const telefonoRegex = /^[0-9+\-\s()]{7,20}$/;
const emailSchema = z.string().trim().toLowerCase().email('Correo invalido.').max(120);
const passwordSchema = z.string().min(8, 'La contrasena debe tener al menos 8 caracteres.').max(72);

const registroSchema = z
    .object({
        nombre: z.string().trim().min(2, 'El nombre es obligatorio.').max(80),
        correo: emailSchema,
        password: passwordSchema,
        rol: z.enum(['cliente', 'trabajador']),
        telefono: z.string().trim().optional(),
        oficioCategoria: z.string().trim().optional(),
        oficio: z.string().trim().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.rol === 'trabajador') {
            if (!data.telefono) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'El celular es obligatorio para trabajadores.',
                    path: ['telefono'],
                });
            }

            if (!data.oficioCategoria) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'La categoria del oficio es obligatoria para trabajadores.',
                    path: ['oficioCategoria'],
                });
            }

            if (!data.oficio) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'El oficio es obligatorio para trabajadores.',
                    path: ['oficio'],
                });
            }
        }

        if (data.telefono && !telefonoRegex.test(data.telefono)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'El numero de celular no es valido.',
                path: ['telefono'],
            });
        }
    });

const loginSchema = z.object({
    correo: emailSchema,
    password: z.string().min(1, 'La contrasena es obligatoria.').max(72),
});

const obtenerSecret = () => process.env.JWT_SECRET?.trim();

const obtenerCookieOptions = () => {
    const secure = process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production';

    return {
        httpOnly: true,
        secure,
        sameSite: secure ? 'none' : 'lax',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
    };
};

const serializarUsuario = (usuario) => ({
    id: usuario._id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    telefono: usuario.telefono,
    rol: usuario.rol,
    oficioCategoria: usuario.oficioCategoria,
    oficio: usuario.oficio,
});

const registrarUsuario = async (req, res) => {
    try {
        const parsed = registroSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                mensaje: 'Datos de registro invalidos.',
                errores: parsed.error.flatten().fieldErrors,
            });
        }

        const { nombre, correo, password, rol, telefono, oficioCategoria, oficio } = parsed.data;

        const usuarioExistente = await Usuario.findOne({ correo });
        if (usuarioExistente) {
            return res.status(409).json({ mensaje: 'Ya existe un usuario con ese correo.' });
        }

        const nuevoUsuario = new Usuario({
            nombre,
            correo,
            password,
            rol,
            telefono: rol === 'trabajador' ? telefono : '',
            oficioCategoria: rol === 'trabajador' ? oficioCategoria : 'General',
            oficio: rol === 'trabajador' ? oficio : 'Ninguno',
        });

        await nuevoUsuario.save();

        return res.status(201).json({
            mensaje: 'Usuario guardado con exito.',
            usuario: serializarUsuario(nuevoUsuario),
        });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al registrar el usuario.' });
    }
};

const loginUsuario = async (req, res) => {
    try {
        const secret = obtenerSecret();
        if (!secret) {
            return res.status(500).json({ mensaje: 'JWT_SECRET no esta configurado.' });
        }

        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                mensaje: 'Datos de inicio de sesion invalidos.',
                errores: parsed.error.flatten().fieldErrors,
            });
        }

        const { correo, password } = parsed.data;

        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
        }

        const esCorrecta = await bcrypt.compare(password, usuario.password);
        if (!esCorrecta) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas.' });
        }

        const token = jwt.sign(
            { id: usuario._id.toString(), rol: usuario.rol },
            secret,
            { expiresIn: process.env.JWT_ACCESS_EXPIRES || '24h' }
        );

        res.cookie('accessToken', token, obtenerCookieOptions());

        return res.json({
            mensaje: 'Bienvenido.',
            usuario: serializarUsuario(usuario),
        });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error en el servidor.' });
    }
};

const obtenerPerfil = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select(
            'nombre correo telefono rol oficioCategoria oficio'
        );

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
        }

        return res.json({ usuario: serializarUsuario(usuario) });
    } catch (error) {
        return res.status(500).json({ mensaje: 'No fue posible cargar el perfil.' });
    }
};

const logoutUsuario = (req, res) => {
    res.clearCookie('accessToken', {
        ...obtenerCookieOptions(),
        maxAge: 0,
    });

    return res.json({ mensaje: 'Sesion cerrada correctamente.' });
};

module.exports = {
    registrarUsuario,
    loginUsuario,
    obtenerPerfil,
    logoutUsuario,
};
