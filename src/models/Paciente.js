const pool = require('../database/db');

class Paciente {
  // Generar código único para paciente
  static generarCodigo() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let codigo = 'P-';
    for (let i = 0; i < 8; i++) {
      codigo += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return codigo;
  }

  // Crear nuevo paciente
  static async crear(pacienteData) {
    const { nombre, fecha_nacimiento, condiciones_medicas, nivel_demencia, color_hex, cuidador_id } = pacienteData;
    
    try {
      const codigo_acceso = this.generarCodigo();
      
      const query = `
        INSERT INTO pacientes (nombre, fecha_nacimiento, condiciones_medicas, nivel_demencia, color_hex, codigo_acceso, cuidador_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      
      const values = [nombre, fecha_nacimiento, condiciones_medicas, nivel_demencia, color_hex, codigo_acceso, cuidador_id];
      const result = await pool.query(query, values);
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Buscar paciente por código de acceso
  static async buscarPorCodigo(codigo) {
    const query = `
      SELECT p.*, c.nombre as cuidador_nombre, c.celular as cuidador_celular
      FROM pacientes p
      JOIN cuidadores c ON p.cuidador_id = c.id
      WHERE p.codigo_acceso = $1
    `;
    const result = await pool.query(query, [codigo]);
    return result.rows[0];
  }

  // Obtener pacientes de un cuidador
  static async obtenerPorCuidador(cuidadorId) {
    const query = 'SELECT * FROM pacientes WHERE cuidador_id = $1 ORDER BY nombre';
    const result = await pool.query(query, [cuidadorId]);
    return result.rows;
  }
}

module.exports = Paciente;