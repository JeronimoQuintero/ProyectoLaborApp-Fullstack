const mongoose = require('mongoose');

const ServicioSchema = new mongoose.Schema(
    {
        titulo: {
            type: String,
            required: true,
            trim: true,
        },
        descripcion: {
            type: String,
            required: true,
            trim: true,
        },
        precio: {
            type: Number,
            required: true,
            min: 0,
        },
        categoria: {
            type: String,
            required: true,
            trim: true,
        },
        oficioCategoria: {
            type: String,
            default: 'General',
            trim: true,
        },
        oficio: {
            type: String,
            required: true,
            trim: true,
        },
        correoContacto: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        telefonoContacto: {
            type: String,
            required: true,
            trim: true,
        },
        usuario: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Usuario',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Servicio', ServicioSchema);
