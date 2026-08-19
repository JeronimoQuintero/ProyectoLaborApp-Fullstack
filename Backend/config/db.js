const mongoose = require('mongoose');
const { useInMemoryStore } = require('./inMemoryStore');

const conectarBaseDeDatos = async () => {
    if (useInMemoryStore()) {
        console.log(' InMemory DB activo (sin MongoDB externo)');
        return;
    }

    if (!process.env.MONGO_URI) {
        console.log(' MONGO_URI no configurado.');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(' MongoDB conectado');
    } catch (error) {
        console.log(' Error en la conexion:', error.message);
        process.exit(1);
    }
};

module.exports = conectarBaseDeDatos;
