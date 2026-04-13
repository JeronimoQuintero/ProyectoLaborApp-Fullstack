const Servicio = require('../models/servicio.js');

// Crear un nuevo servicio (Publicar oficio)
const crearServicio = async (req, res) => {
    try {
        const nuevoServicio = new Servicio({
            ...req.body,
            usuario: req.usuario.id // Sacamos el ID del Token que validamos en el middleware
        });
        await nuevoServicio.save();
        res.status(201).json(nuevoServicio);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al publicar servicio" });
    }
};

// Obtener todos los servicios disponibles
const obtenerServicios = async (req, res) => {
    try {
        const servicios = await Servicio.find().populate('usuario', 'nombre oficio');
        res.json(servicios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener servicios" });
    }
};

module.exports = { crearServicio, obtenerServicios };