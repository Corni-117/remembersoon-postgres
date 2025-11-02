const pool = require('../database/db');
const bcrypt = require('bcryptjs');

class Cuidador {
  // Registrar nuevo cuidador
  static async crear(cuidadorData) {
    const { nombre, email, password, fecha_nacimiento, parentesco, celular } = cuidadorData;
    
    try {
      // Encriptar contraseña
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      
      // Insertar en la base de datos
      const query = `
        INSERT INTO cuidadores (nombre, email, password_hash, fecha_nacimiento, parentesco, celular)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, nombre, email, fecha_nacimiento, parentesco, celular, created_at
      `;
      
      const values = [nombre, email, passwordHash, fecha_nacimiento, parentesco, celular];
      const result = await pool.query(query, values);
      
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Violación de unique constraint
        throw new Error('El email ya está registrado');
      }
      throw error;
    }
  }

  // Buscar cuidador por email, identificador único
  static async buscarPorEmail(email) {
    const query = 'SELECT * FROM cuidadores WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  // Verificar contraseña
  static async verificarPassword(passwordPlain, passwordHash) {
    return await bcrypt.compare(passwordPlain, passwordHash);
  }

  // Obtener cuidador por ID
  static async buscarPorId(id) {
    const query = 'SELECT id, nombre, email, fecha_nacimiento, parentesco, celular FROM cuidadores WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Cuidador;