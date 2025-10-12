const express = require('express');
const Recordatorio = require('../models/Recordatorio');
const Paciente = require('../models/Paciente');
const router = express.Router();
const { verificarCuidador } = require('../middleware/auth');

// Aplicar middleware a rutas que necesitan autenticación
router.get('/cuidador/:cuidadorId', verificarCuidador, async (req, res) => {
  // ... código existente
});

// Obtener recordatorios del cuidador (todos sus pacientes)
router.get('/cuidador/:cuidadorId', async (req, res) => {
  try {
    const { cuidadorId } = req.params;
    
    const recordatorios = await Recordatorio.obtenerPorCuidador(cuidadorId);
    
    res.json({
      success: true,
      recordatorios: recordatorios
    });
  } catch (error) {
    console.error('Error obteniendo recordatorios:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo recordatorios'
    });
  }
});

// Obtener recordatorios de un paciente específico
router.get('/paciente/:pacienteId', async (req, res) => {
  try {
    const { pacienteId } = req.params;
    
    const recordatorios = await Recordatorio.obtenerPorPaciente(pacienteId);
    
    res.json({
      success: true,
      recordatorios: recordatorios
    });
  } catch (error) {
    console.error('Error obteniendo recordatorios:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo recordatorios'
    });
  }
});

// Crear nuevo recordatorio
router.post('/', async (req, res) => {
  try {
    const { titulo, descripcion, fecha, hora, repetir, prioridad, paciente_id } = req.body;

    // Validaciones básicas
    if (!titulo || !fecha || !hora || !paciente_id) {
      return res.status(400).json({
        success: false,
        message: 'Título, fecha, hora y paciente son requeridos'
      });
    }

    const recordatorioData = {
      titulo,
      descripcion,
      fecha,
      hora,
      repetir: repetir || 'una_vez',
      prioridad: prioridad || 'media',
      paciente_id
    };

    const recordatorio = await Recordatorio.crear(recordatorioData);

    res.status(201).json({
      success: true,
      message: 'Recordatorio creado exitosamente',
      recordatorio: recordatorio
    });

  } catch (error) {
    console.error('Error creando recordatorio:', error);
    res.status(500).json({
      success: false,
      message: 'Error creando recordatorio'
    });
  }
});

// Actualizar recordatorio
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const recordatorioData = req.body;

    const recordatorio = await Recordatorio.actualizar(id, recordatorioData);

    if (!recordatorio) {
      return res.status(404).json({
        success: false,
        message: 'Recordatorio no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Recordatorio actualizado exitosamente',
      recordatorio: recordatorio
    });

  } catch (error) {
    console.error('Error actualizando recordatorio:', error);
    res.status(500).json({
      success: false,
      message: 'Error actualizando recordatorio'
    });
  }
});

// Eliminar recordatorio
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const recordatorio = await Recordatorio.eliminar(id);

    if (!recordatorio) {
      return res.status(404).json({
        success: false,
        message: 'Recordatorio no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Recordatorio eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando recordatorio:', error);
    res.status(500).json({
      success: false,
      message: 'Error eliminando recordatorio'
    });
  }
});

// Obtener un recordatorio específico por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const recordatorio = await Recordatorio.obtenerPorIdCompleto(id);

    if (!recordatorio) {
      return res.status(404).json({
        success: false,
        message: 'Recordatorio no encontrado'
      });
    }

    res.json({
      success: true,
      recordatorio: recordatorio
    });

  } catch (error) {
    console.error('Error obteniendo recordatorio:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo recordatorio'
    });
  }
});


module.exports = router;