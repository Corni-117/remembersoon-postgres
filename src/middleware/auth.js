const pool = require('../database/db');

const verificarCuidador = async (req, res, next) => {
  try {
    // En una aplicación real, aquí verificarías JWT tokens
    // Por ahora, asumimos que el ID viene en los parámetros
    const { cuidadorId } = req.params;
    
    if (!cuidadorId) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado'
      });
    }

    // Verificar que el cuidador existe
    const result = await pool.query('SELECT id FROM cuidadores WHERE id = $1', [cuidadorId]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Cuidador no encontrado'
      });
    }

    next();
  } catch (error) {
    console.error('Error en middleware auth:', error);
    res.status(500).json({
      success: false,
      message: 'Error de autenticación'
    });
  }
};

module.exports = { verificarCuidador };