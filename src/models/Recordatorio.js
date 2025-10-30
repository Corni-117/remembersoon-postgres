const pool = require('../database/db');

class Recordatorio {
  // Crear nuevo recordatorio

static async crear(recordatorioData) {
  // Nos aseguramos de incluir 'dias_semana' en la lista
  const { titulo, descripcion, fecha, hora, repetir, prioridad, paciente_id, dias_semana } = recordatorioData;

  const query = `
    INSERT INTO recordatorios (titulo, descripcion, fecha, hora, repetir, prioridad, paciente_id, dias_semana)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
  `;
  // Pasamos 'dias_semana' como el octavo valor
  const values = [titulo, descripcion, fecha, hora, repetir, prioridad, paciente_id, dias_semana];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

  // Obtener recordatorios por paciente
  static async obtenerPorPaciente(pacienteId) {
    const query = `
      SELECT r.*, p.nombre as paciente_nombre, p.color_hex
      FROM recordatorios r
      JOIN pacientes p ON r.paciente_id = p.id
      WHERE r.paciente_id = $1
      ORDER BY r.fecha, r.hora
    `;
    const result = await pool.query(query, [pacienteId]);
    return result.rows;
  }

  // Obtener recordatorios por cuidador (todos sus pacientes)
  static async obtenerPorCuidador(cuidadorId) {
    const query = `
      SELECT r.*, p.nombre as paciente_nombre, p.color_hex
      FROM recordatorios r
      JOIN pacientes p ON r.paciente_id = p.id
      WHERE p.cuidador_id = $1
      ORDER BY r.fecha, r.hora
    `;
    const result = await pool.query(query, [cuidadorId]);
    return result.rows;
  }

  // Actualizar recordatorio
  static async actualizar(id, recordatorioData) {
    const { titulo, descripcion, fecha, hora, repetir, prioridad } = recordatorioData;
    
    const query = `
      UPDATE recordatorios 
      SET titulo = $1, descripcion = $2, fecha = $3, hora = $4, repetir = $5, prioridad = $6
      WHERE id = $7
      RETURNING *
    `;
    
    const values = [titulo, descripcion, fecha, hora, repetir, prioridad, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Eliminar recordatorio
  static async eliminar(id) {
    const query = 'DELETE FROM recordatorios WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Obtener recordatorio por ID
  static async obtenerPorId(id) {
    const query = 'SELECT * FROM recordatorios WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  // Obtener recordatorio por ID con información del paciente
  static async obtenerPorIdCompleto(id) {
    const query = `
    SELECT r.*, p.nombre as paciente_nombre, p.color_hex, p.id as paciente_id
    FROM recordatorios r
    JOIN pacientes p ON r.paciente_id = p.id
    WHERE r.id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
 }
  
// Esta consulta es más inteligente y maneja los 3 tipos de recordatorios.
  // DOW = Day of Week (Día de la Semana en PostgreSQL, donde 0=Domingo, 1=Lunes, etc.)

static async obtenerProximos(pacienteId) {
  // Esta consulta es simple: trae TODOS los recordatorios para este paciente
  // que coincidan con la hora actual, sin importar la fecha.
  // También trae la fecha y el tipo de repetición para que la Raspberry Pi pueda decidir.
  const query = `
    SELECT titulo, descripcion, fecha, repetir, dias_semana 
    FROM recordatorios
    WHERE 
      paciente_id = $1 AND
      hora BETWEEN (NOW() AT TIME ZONE 'America/Mexico_City' - interval '1 minute')::time AND (NOW() AT TIME ZONE 'America/Mexico_City')::time
  `;
  const result = await pool.query(query, [pacienteId]);
  return result.rows;
}


}

module.exports = Recordatorio;