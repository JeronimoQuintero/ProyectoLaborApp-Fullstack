
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const conectarBaseDeDatos = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Conectar DB
conectarBaseDeDatos();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/usuarios', authRoutes);

// Rutas
app.use('/api/usuarios', require('./routes/authRoutes'));
app.use('/api/servicios', require('./routes/servicioRoutes')); // Agregamos las rutas de servicios

app.get('/', (req, res) => {
    res.send('Servidor en línea ');
});
// Iniciar el servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});