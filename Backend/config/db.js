const mongoose = require('mongoose');

const conectarBaseDeDatos = async () => {
    try {
        // Conexión a la base de datos+
        await mongoose.connect(process.env.MONGO_URI);
        console.log(' MongoDB Conectado');
    } catch (error) {
        console.log(' Error en la conexión:', error.message);
        process.exit(1);
    }
};

module.exports = conectarBaseDeDatos;