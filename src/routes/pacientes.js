const express = require('express');
const Paciente = require('../models/Paciente');
const router = express.Router();

// Agregar nuevo paciente
router.post('/', async (req, res) => {
  try {
    const { nombre, fecha_nacimiento, condiciones_medicas, nivel_demencia, color_hex, cuidador_id } = req.body;

    if (!nombre || !cuidador_id) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y cuidador_id son requeridos'
      });
    }

    const pacienteData = {
      nombre,
      fecha_nacimiento,
      condiciones_medicas,
      nivel_demencia,
      color_hex,
      cuidador_id
    };

    const paciente = await Paciente.crear(pacienteData);

    res.status(201).json({
      success: true,
      message: 'Paciente creado exitosamente',
      paciente: paciente,
      codigoPaciente: paciente.codigo_acceso
    });

  } catch (error) {
    console.error('Error creando paciente:', error);
    res.status(500).json({
      success: false,
      message: 'Error creando paciente'
    });
  }
});

module.exports = router;