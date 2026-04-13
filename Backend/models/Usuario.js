const mongoose = require('mongoose'); // Importamos Mongoose para definir el esquema de usuario
const bcrypt = require('bcryptjs'); // Importamos bcryptjs para encriptar las contraseñas

// Definimos el esquema de usuario con los campos necesarios

const UsuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, enum: ['cliente', 'trabajador'], default: 'cliente' },
    oficio: { type: String, default: 'Ninguno' }
});

// USAMOS ASYNC 
UsuarioSchema.pre('save', async function() {
    // Si la contraseña no ha sido cambiada, no hacemos nada
    if (!this.isModified('password')) return;

    // Encriptamos
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('Usuario', UsuarioSchema); // Exportamos el modelo de usuario para usarlo en otras partes de la aplicación