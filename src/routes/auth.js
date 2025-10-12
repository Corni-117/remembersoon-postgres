const express = require('express');
const Cuidador = require('../models/Cuidador');
const Paciente = require('../models/Paciente');
const router = express.Router();

// REGISTRO: Cuidador + Paciente (SIN VALIDACIONES)
router.post('/registro', async (req, res) => {
  try {
    const { cuidador, paciente } = req.body;

    // Validaciones básicas simples
    if (!cuidador.email || !cuidador.password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email y contraseña son requeridos' 
      });
    }

    // 1. Registrar cuidador
    const cuidadorCreado = await Cuidador.crear(cuidador);
    
    // 2. Registrar paciente asociado
    const pacienteData = {
      ...paciente,
      cuidador_id: cuidadorCreado.id
    };
    
    const pacienteCreado = await Paciente.crear(pacienteData);

    // Respuesta exitosa
    res.status(201).json({
      success: true,
      message: 'Registro exitoso',
      cuidador: {
        id: cuidadorCreado.id,
        nombre: cuidadorCreado.nombre,
        email: cuidadorCreado.email
      },
      paciente: {
        id: pacienteCreado.id,
        nombre: pacienteCreado.nombre,
        codigo_acceso: pacienteCreado.codigo_acceso
      },
      codigoPaciente: pacienteCreado.codigo_acceso
    });

  } catch (error) {
    console.error('Error en registro:', error);
    
    if (error.message === 'El email ya está registrado') {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// LOGIN de cuidador (SIN VALIDACIONES)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones simples
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Buscar cuidador
    const cuidador = await Cuidador.buscarPorEmail(email);
    if (!cuidador) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    // Verificar contraseña
    const passwordValida = await Cuidador.verificarPassword(password, cuidador.password_hash);
    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas'
      });
    }

    // Login exitoso
    res.json({
      success: true,
      message: 'Login exitoso',
      user: {
        id: cuidador.id,
        nombre: cuidador.nombre,
        email: cuidador.email,
        parentesco: cuidador.parentesco,
        celular: cuidador.celular
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// ACCESO PACIENTE por código
router.post('/acceso-paciente', async (req, res) => {
  try {
    const { codigo } = req.body;

    if (!codigo) {
      return res.status(400).json({
        success: false,
        message: 'Código es requerido'
      });
    }

    const paciente = await Paciente.buscarPorCodigo(codigo.toUpperCase());

    if (!paciente) {
      return res.status(404).json({
        success: false,
        message: 'Código inválido o no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Acceso concedido',
      paciente: {
        id: paciente.id,
        nombre: paciente.nombre,
        codigo_acceso: paciente.codigo_acceso,
        color_hex: paciente.color_hex,
        cuidador_nombre: paciente.cuidador_nombre,
        cuidador_celular: paciente.cuidador_celular
      }
    });

  } catch (error) {
    console.error('Error en acceso paciente:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener pacientes de un cuidador
router.get('/pacientes/:cuidadorId', async (req, res) => {
  try {
    const { cuidadorId } = req.params;
    const pacientes = await Paciente.obtenerPorCuidador(cuidadorId);
    
    res.json({
      success: true,
      pacientes: pacientes
    });
  } catch (error) {
    console.error('Error obteniendo pacientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo pacientes'
    });
  }
});

module.exports = router;