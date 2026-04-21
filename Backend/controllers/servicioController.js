const mongoose = require('mongoose');
const Servicio = require('../models/ServicioModel');
const Usuario = require('../models/Usuario');

const validarServicio = ({ titulo, descripcion, precio, categoria, oficio, correoContacto, telefonoContacto }) => {
    if (
        !titulo?.trim() ||
        !descripcion?.trim() ||
        !categoria?.trim() ||
        !oficio?.trim() ||
        !correoContacto?.trim() ||
        !telefonoContacto?.trim()
    ) {
        return 'Todos los campos del servicio son obligatorios.';
    }

    const precioNumerico = Number(precio);
    if (Number.isNaN(precioNumerico) || precioNumerico < 0) {
        return 'El precio debe ser un numero valido.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoContacto.trim())) {
        return 'El correo de contacto no es valido.';
    }

    if (!/^[0-9+\-\s()]{7,20}$/.test(telefonoContacto.trim())) {
        return 'El celular de contacto no es valido.';
    }

    return null;
};

// Crear un nuevo servicio (Publicar oficio)
const crearServicio = async (req, res) => {
    try {
        const errorValidacion = validarServicio(req.body);
        if (errorValidacion) {
            return res.status(400).json({ mensaje: errorValidacion });
        }

        const usuario = await Usuario.findById(req.usuario.id).select('oficioCategoria correo telefono');
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
        }

        const nuevoServicio = new Servicio({
            titulo: req.body.titulo.trim(),
            descripcion: req.body.descripcion.trim(),
            categoria: req.body.categoria.trim(),
            oficio: req.body.oficio.trim(),
            correoContacto: req.body.correoContacto.trim().toLowerCase(),
            telefonoContacto: req.body.telefonoContacto.trim(),
            precio: Number(req.body.precio),
            usuario: req.usuario.id,
            oficioCategoria: usuario.oficioCategoria,
        });

        await nuevoServicio.save();
        res.status(201).json(nuevoServicio);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al publicar el servicio.' });
    }
};

// Obtener todos los servicios disponibles
const obtenerServicios = async (req, res) => {
    try {
        const servicios = await Servicio.find()
            .populate('usuario', 'nombre oficio oficioCategoria correo telefono')
            .sort({ createdAt: -1 });

        res.json(servicios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los servicios.' });
    }
};

const obtenerMisServicios = async (req, res) => {
    try {
        const servicios = await Servicio.find({ usuario: req.usuario.id }).sort({ createdAt: -1 });
        res.json(servicios);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener tus servicios.' });
    }
};

const obtenerMiServicioPorId = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ mensaje: 'El identificador del servicio no es valido.' });
        }

        const servicio = await Servicio.findById(req.params.id);
        if (!servicio) {
            return res.status(404).json({ mensaje: 'Servicio no encontrado.' });
        }

        if (servicio.usuario.toString() !== req.usuario.id) {
            return res.status(403).json({ mensaje: 'No autorizado para ver este servicio.' });
        }

        res.json(servicio);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el servicio.' });
    }
};

const actualizarServicio = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ mensaje: 'El identificador del servicio no es valido.' });
        }

        const errorValidacion = validarServicio(req.body);
        if (errorValidacion) {
            return res.status(400).json({ mensaje: errorValidacion });
        }

        const servicio = await Servicio.findById(req.params.id);
        if (!servicio) {
            return res.status(404).json({ mensaje: 'Servicio no encontrado.' });
        }

        if (servicio.usuario.toString() !== req.usuario.id) {
            return res.status(403).json({ mensaje: 'No autorizado para editar este servicio.' });
        }

        servicio.titulo = req.body.titulo.trim();
        servicio.descripcion = req.body.descripcion.trim();
        servicio.categoria = req.body.categoria.trim();
        servicio.oficio = req.body.oficio.trim();
        servicio.correoContacto = req.body.correoContacto.trim().toLowerCase();
        servicio.telefonoContacto = req.body.telefonoContacto.trim();
        servicio.precio = Number(req.body.precio);

        await servicio.save();
        res.json({ mensaje: 'Servicio actualizado correctamente.', servicio });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el servicio.' });
    }
};

const eliminarServicio = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ mensaje: 'El identificador del servicio no es valido.' });
        }

        const servicio = await Servicio.findById(req.params.id);
        if (!servicio) {
            return res.status(404).json({ mensaje: 'Servicio no encontrado.' });
        }

        if (servicio.usuario.toString() !== req.usuario.id) {
            return res.status(403).json({ mensaje: 'No autorizado para eliminar este servicio.' });
        }

        await servicio.deleteOne();
        res.json({ mensaje: 'Servicio eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el servicio.' });
    }
};

module.exports = {
    crearServicio,
    obtenerServicios,
    obtenerMisServicios,
    obtenerMiServicioPorId,
    actualizarServicio,
    eliminarServicio,
};
