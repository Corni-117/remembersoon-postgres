// api/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Importar rutas (ajustadas a la nueva estructura)
const authRoutes = require('../src/routes/auth');
const recordatorioRoutes = require('../src/routes/recordatorios');
const pacienteRoutes = require('../src/routes/pacientes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/recordatorios', recordatorioRoutes);
app.use('/api/pacientes', pacienteRoutes);

// Manejador de rutas de frontend
// Esto asegura que si recargas una página como /listaderecordatorios.html, siga funcionando.
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, '../public', req.path));
  }
});

// Arrancar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});