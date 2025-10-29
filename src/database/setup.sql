-- =============================================
-- BASE DE DATOS: REMEMBERSOON
-- =============================================

-- Tabla de CUIDADORES
CREATE TABLE IF NOT EXISTS cuidadores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE,
    parentesco VARCHAR(50),
    celular VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de PACIENTES
CREATE TABLE IF NOT EXISTS pacientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    condiciones_medicas TEXT,
    nivel_demencia VARCHAR(20) CHECK (nivel_demencia IN ('leve', 'moderada', 'severa', 'otra')),
    color_hex VARCHAR(7) NOT NULL,
    codigo_acceso VARCHAR(10) UNIQUE NOT NULL,
    cuidador_id INTEGER NOT NULL REFERENCES cuidadores(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de RECORDATORIOS
CREATE TABLE IF NOT EXISTS recordatorios (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    repetir VARCHAR(20) DEFAULT 'una_vez' CHECK (repetir IN ('una_vez', 'diario', 'semanal')),
    prioridad VARCHAR(20) DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta')),
    paciente_id INTEGER NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de CONTACTOS_EMERGENCIA
CREATE TABLE IF NOT EXISTS contactos_emergencia (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    numero_telefono VARCHAR(20) NOT NULL,
    paciente_id INTEGER NOT NULL REFERENCES pacientes(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ÍNDICES PARA MEJOR RENDIMIENTO
-- =============================================

-- Índices para CUIDADORES
CREATE INDEX IF NOT EXISTS idx_cuidadores_email ON cuidadores(email);
CREATE INDEX IF NOT EXISTS idx_cuidadores_created ON cuidadores(created_at);

-- Índices para PACIENTES
CREATE INDEX IF NOT EXISTS idx_pacientes_cuidador ON pacientes(cuidador_id);
CREATE INDEX IF NOT EXISTS idx_pacientes_codigo ON pacientes(codigo_acceso);

-- Índices para RECORDATORIOS
CREATE INDEX IF NOT EXISTS idx_recordatorios_paciente ON recordatorios(paciente_id);
CREATE INDEX IF NOT EXISTS idx_recordatorios_fecha ON recordatorios(fecha);
CREATE INDEX IF NOT EXISTS idx_recordatorios_prioridad ON recordatorios(prioridad);

-- Índices para CONTACTOS_EMERGENCIA
CREATE INDEX IF NOT EXISTS idx_contactos_paciente ON contactos_emergencia(paciente_id);

ALTER TABLE recordatorios ADD COLUMN dias_semana TEXT;

-- =============================================
-- MENSAJE DE CONFIRMACIÓN
-- =============================================
SELECT '✅ Tablas creadas exitosamente' as mensaje;