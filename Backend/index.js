
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const conectarBaseDeDatos = require('./config/db');
const authRoutes = require('./routes/authRoutesClean');
const servicioRoutes = require('./routes/servicioRoutes');

const app = express();

// Conectar DB
conectarBaseDeDatos();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Rutas
app.use('/api/usuarios', authRoutes);
app.use('/api/servicios', servicioRoutes);

app.get('/', (req, res) => {
    res.send('Servidor en línea ');
});
// Iniciar el servidor
app.use((req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada.' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
