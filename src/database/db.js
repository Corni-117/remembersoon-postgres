const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  family: 4, // <--  Fuerza el uso de IPv4. Lo forzamos por que no responde bien en IPv6
});

// Probar la conexión. Mensajes en consola para verificar el estado y seguimiento de errores de conexión.
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error conectando a PostgreSQL:', err.stack);
  } else {
    console.log('✅ Conexión exitosa a PostgreSQL');
    release();
  }
});

module.exports = pool;