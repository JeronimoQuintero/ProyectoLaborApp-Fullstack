const mongoose = require('mongoose');
const { z } = require('zod');
const Servicio = require('../models/ServicioModel');
const Usuario = require('../models/Usuario');

const telefonoRegex = /^[0-9+\-\s()]{7,20}$/;

const servicioSchema = z.object({
    titulo: z.string().trim().min(3, 'El titulo es obligatorio.').max(120),
    descripcion: z.string().trim().min(10, 'La descripcion es obligatoria.').max(1000),
    precio: z.coerce.number().min(0, 'El precio debe ser un numero valido.'),
    categoria: z.string().trim().min(2).max(80),
    oficio: z.string().trim().min(2).max(80),
    correoContacto: z.string().trim().toLowerCase().email('El correo de contacto no es valido.'),
    telefonoContacto: z
        .string()
        .trim()
        .min(7)
        .max(20)
        .regex(telefonoRegex, 'El celular de contacto no es valido.'),
});

const parsearParametrosDeListado = (query) => {
    const page = Number.parseInt(query.page, 10);
    const limit = Number.parseInt(query.limit, 10);

    const pagina = Number.isFinite(page) && page > 0 ? page : 1;
    const limite = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 50) : 9;

    const minPrecio = query.minPrecio === undefined ? undefined : Number(query.minPrecio);
    const maxPrecio = query.maxPrecio === undefined ? undefined : Number(query.maxPrecio);

    if (query.minPrecio !== undefined && Number.isNaN(minPrecio)) {
        return { error: 'El parametro minPrecio no es valido.' };
    }

    if (query.maxPrecio !== undefined && Number.isNaN(maxPrecio)) {
        return { error: 'El parametro maxPrecio no es valido.' };
    }

    if (
        minPrecio !== undefined &&
        maxPrecio !== undefined &&
        minPrecio > maxPrecio
    ) {
        return { error: 'El rango de precios no es valido.' };
    }

    const sortByMap = {
        createdAt: 'createdAt',
        precio: 'precio',
        titulo: 'titulo',
    };

    const sortBy = sortByMap[query.sortBy] || 'createdAt';
    const sortDir = query.sortDir === 'asc' ? 1 : -1;

    return {
        pagina,
        limite,
        q: typeof query.q === 'string' ? query.q.trim() : '',
        categoria: typeof query.categoria === 'string' ? query.categoria.trim() : '',
        oficio: typeof query.oficio === 'string' ? query.oficio.trim() : '',
        minPrecio,
        maxPrecio,
        sortBy,
        sortDir,
    };
};

const escaparRegex = (text = '') => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const construirFiltroDeBusqueda = ({ q, categoria, oficio, minPrecio, maxPrecio }) => {
    const filter = {};

    if (categoria) {
        filter.categoria = categoria;
    }

    if (oficio) {
        filter.oficio = oficio;
    }

    if (minPrecio !== undefined || maxPrecio !== undefined) {
        filter.precio = {};

        if (minPrecio !== undefined) {
            filter.precio.$gte = minPrecio;
        }

        if (maxPrecio !== undefined) {
            filter.precio.$lte = maxPrecio;
        }
    }

    if (q) {
        const regex = new RegExp(escaparRegex(q), 'i');
        filter.$or = [
            { titulo: regex },
            { descripcion: regex },
            { categoria: regex },
            { oficio: regex },
        ];
    }

    return filter;
};

const crearServicio = async (req, res) => {
    try {
        const parsed = servicioSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                mensaje: 'Datos del servicio invalidos.',
                errores: parsed.error.flatten().fieldErrors,
            });
        }

        const usuario = await Usuario.findById(req.usuario.id).select('oficioCategoria');
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
        }

        const nuevoServicio = new Servicio({
            ...parsed.data,
            usuario: req.usuario.id,
            oficioCategoria: usuario.oficioCategoria,
        });

        await nuevoServicio.save();
        return res.status(201).json(nuevoServicio);
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al publicar el servicio.' });
    }
};

const obtenerServicios = async (req, res) => {
    try {
        const parsedQuery = parsearParametrosDeListado(req.query);
        if (parsedQuery.error) {
            return res.status(400).json({ mensaje: parsedQuery.error });
        }

        const {
            pagina,
            limite,
            q,
            categoria,
            oficio,
            minPrecio,
            maxPrecio,
            sortBy,
            sortDir,
        } = parsedQuery;

        const filter = construirFiltroDeBusqueda({
            q,
            categoria,
            oficio,
            minPrecio,
            maxPrecio,
        });

        const skip = (pagina - 1) * limite;
        const sort = { [sortBy]: sortDir };

        const [servicios, total] = await Promise.all([
            Servicio.find(filter)
                .populate('usuario', 'nombre oficio oficioCategoria correo telefono')
                .sort(sort)
                .skip(skip)
                .limit(limite),
            Servicio.countDocuments(filter),
        ]);

        const totalPages = Math.max(Math.ceil(total / limite), 1);

        return res.json({
            items: servicios,
            meta: {
                page: pagina,
                limit: limite,
                total,
                totalPages,
                hasNextPage: pagina < totalPages,
                hasPrevPage: pagina > 1,
            },
        });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al obtener los servicios.' });
    }
};

const obtenerMisServicios = async (req, res) => {
    try {
        const servicios = await Servicio.find({ usuario: req.usuario.id }).sort({ createdAt: -1 });
        return res.json(servicios);
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al obtener tus servicios.' });
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

        return res.json(servicio);
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al obtener el servicio.' });
    }
};

const actualizarServicio = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ mensaje: 'El identificador del servicio no es valido.' });
        }

        const parsed = servicioSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                mensaje: 'Datos del servicio invalidos.',
                errores: parsed.error.flatten().fieldErrors,
            });
        }

        const servicio = await Servicio.findById(req.params.id);
        if (!servicio) {
            return res.status(404).json({ mensaje: 'Servicio no encontrado.' });
        }

        if (servicio.usuario.toString() !== req.usuario.id) {
            return res.status(403).json({ mensaje: 'No autorizado para editar este servicio.' });
        }

        Object.assign(servicio, parsed.data);

        await servicio.save();
        return res.json({ mensaje: 'Servicio actualizado correctamente.', servicio });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al actualizar el servicio.' });
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
        return res.json({ mensaje: 'Servicio eliminado correctamente.' });
    } catch (error) {
        return res.status(500).json({ mensaje: 'Error al eliminar el servicio.' });
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
