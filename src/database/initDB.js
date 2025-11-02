const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function initializeDatabase() {
  try {
    console.log('🔄 Inicializando base de datos...');
    
    // Leer el archivo SQL
    const sqlFilePath = path.join(__dirname, 'setup.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Ejecutar el SQL y seguimiento de errores para la inicialización de cada tabla 
    await pool.query(sql);
    
    console.log('✅ Base de datos inicializada correctamente');
    console.log('📊 Tablas creadas:');
    console.log('   - cuidadores');
    console.log('   - pacientes'); 
    console.log('   - recordatorios');
    console.log('   - contactos_emergencia');
    
  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error);
  } finally {
    // Cerrar la conexión
    await pool.end();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;