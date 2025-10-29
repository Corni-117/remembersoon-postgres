const pool = require('../database/db');

class Recordatorio {
  // Crear nuevo recordatorio
  static async crear(recordatorioData) {
    const { titulo, descripcion, fecha, hora, repetir, prioridad, paciente_id } = recordatorioData;
    
    try {
      const query = `
        INSERT INTO recordatorios (titulo, descripcion, fecha, hora, repetir, prioridad, paciente_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      
      const values = [titulo, descripcion, fecha, hora, repetir, prioridad, paciente_id];
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
  // DOW = Day of Week (Día de la Semana en PostgreSQL, donde 0=Domingo, 1=Lunes, etc.)
  const query = `
    WITH current_time AS (
      SELECT NOW() AT TIME ZONE 'America/Mexico_City' AS now_mexico
    )
    SELECT r.titulo, r.descripcion
    FROM recordatorios r, current_time ct
    WHERE
      r.paciente_id = $1
      -- 1. La HORA siempre debe coincidir (dentro del último minuto)
      AND r.hora BETWEEN (ct.now_mexico - interval '1 minute')::time AND ct.now_mexico::time
      -- 2. Ahora revisamos la FECHA según el tipo de repetición
      AND (
        -- Caso A: Para recordatorios de 'una_vez', la fecha debe ser hoy.
        (r.repetir = 'una_vez' AND r.fecha = ct.now_mexico::date)
        OR
        -- Caso B: Para recordatorios 'diarios', la fecha de inicio debe ser hoy o anterior.
        (r.repetir = 'diario' AND r.fecha <= ct.now_mexico::date)
        OR
        -- Caso C: Para recordatorios 'semanales', la fecha de inicio debe ser hoy o anterior
        -- Y el día de la semana debe coincidir con el día de la semana de hoy.
        (r.repetir = 'semanal' AND r.fecha <= ct.now_mexico::date AND EXTRACT(DOW FROM ct.now_mexico) = EXTRACT(DOW FROM r.fecha + interval '1 day'))
      )
  `;
  const result = await pool.query(query, [pacienteId]);
  return result.rows;
}


}

module.exports = Recordatorio;