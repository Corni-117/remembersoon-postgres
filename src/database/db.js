const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  family: 4, // <-- AÑADE ESTA LÍNEA. Fuerza el uso de IPv4.
});

// Probar la conexión
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error conectando a PostgreSQL:', err.stack);
  } else {
    console.log('✅ Conexión exitosa a PostgreSQL');
    release();
  }
});

module.exports = pool;