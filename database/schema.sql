CREATE DATABASE proyecto_urbano_integrador;

CREATE TABLE usuarios (
    usuario_id SERIAL PRIMARY KEY,
    nombre VARCHAR(255),
    email VARCHAR(255),
    password_hash VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: zonas
CREATE TABLE zonas (
    zona_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    codigo VARCHAR(50),
    latitud DECIMAL(10, 8),
    longitud DECIMAL(11, 8),
    descripcion TEXT,
    activa BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mediciones_aire (
    medicion_id SERIAL PRIMARY KEY,
    zona_id INT,
    fecha_hora TIMESTAMP,
    -- Hourly Air Quality Variables
    pm25 DECIMAL(8, 2),  -- Particulate Matter PM2.5 (μg/m³)
    pm10 DECIMAL(8, 2),  -- Particulate Matter PM10 (μg/m³)
    no2 DECIMAL(8, 2),   -- Nitrogen Dioxide NO2 (μg/m³)
    -- Hourly Weather Variables
    temperatura DECIMAL(5, 2),      -- Temperature (2 m) (°C)
    humedad_relativa DECIMAL(5, 2), -- Relative Humidity (2 m) (%)
    precipitacion DECIMAL(8, 2),    -- Precipitation (rain + snow) (mm)
    presion_superficial DECIMAL(7, 2), -- Surface Pressure (hPa)
    velocidad_viento DECIMAL(5, 2),   -- Wind Speed (10 m) (m/s)
    direccion_viento INT,             -- Wind Direction (10 m) (grados 0-360)
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (zona_id) REFERENCES zonas(zona_id)
);

CREATE TABLE reglas_alertas (
    regla_id SERIAL PRIMARY KEY,
    usuario_id INT,
    nombre VARCHAR(255),
    metrica VARCHAR(20),
    umbral DECIMAL(10, 2),
    operador VARCHAR(10) DEFAULT '>',
    severidad VARCHAR(20),
    activa BOOLEAN DEFAULT TRUE,
    zonas_aplicables INT[],
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id)
);

CREATE TABLE alertas (
    alerta_id SERIAL PRIMARY KEY,
    usuario_id INT,
    zona_id INT,
    regla_id INT,
    medicion_id INT,
    titulo VARCHAR(255),
    mensaje TEXT,
    severidad VARCHAR(20),
    estado VARCHAR(20) DEFAULT 'open',
    fuente VARCHAR(20),
    metrica VARCHAR(20),
    valor_medido DECIMAL(10, 2),
    umbral DECIMAL(10, 2),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_reconocimiento TIMESTAMP,
    fecha_resolucion TIMESTAMP,
    fecha_silenciado TIMESTAMP,
    observaciones TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id),
    FOREIGN KEY (zona_id) REFERENCES zonas(zona_id),
    FOREIGN KEY (regla_id) REFERENCES reglas_alertas(regla_id),
    FOREIGN KEY (medicion_id) REFERENCES mediciones_aire(medicion_id)
);

CREATE TABLE workflows (
    workflow_id SERIAL PRIMARY KEY,
    codigo VARCHAR(50),
    nombre VARCHAR(255),
    tipo VARCHAR(50),
    estado VARCHAR(20) DEFAULT 'Habilitado',
    disparador TEXT,
    condicion TEXT,
    acciones TEXT[],
    etiquetas TEXT[],
    ultima_ejecucion TIMESTAMP,
    proxima_ejecucion TIMESTAMP,
    ejecuciones_totales INT DEFAULT 0,
    ejecuciones_exitosas INT DEFAULT 0,
    ejecuciones_errores INT DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE usuario_workflows (
    usuario_workflow_id SERIAL PRIMARY KEY,
    usuario_id INT,
    workflow_id INT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id),
    FOREIGN KEY (workflow_id) REFERENCES workflows(workflow_id)
);

CREATE TABLE logs_workflows (
    log_id SERIAL PRIMARY KEY,
    workflow_id INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nivel VARCHAR(10),
    mensaje TEXT,
    duracion_ms INT,
    exito BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (workflow_id) REFERENCES workflows(workflow_id)
);

-- Tabla: reportes
CREATE TABLE reportes (
    reporte_id SERIAL PRIMARY KEY,
    codigo VARCHAR(50),
    zona_id INT,
    fecha_reporte DATE,
    fecha_inicio DATE,
    fecha_fin DATE,
    riesgo VARCHAR(20),
    pm25_promedio DECIMAL(8, 2),
    pm10_promedio DECIMAL(8, 2),
    no2_promedio DECIMAL(8, 2),
    estado VARCHAR(20) DEFAULT 'Pendiente',
    destinatario VARCHAR(50),
    resumen TEXT,
    contenido_completo JSONB,
    fecha_envio TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_creo INT,
    FOREIGN KEY (zona_id) REFERENCES zonas(zona_id),
    FOREIGN KEY (usuario_creo) REFERENCES usuarios(usuario_id)
);

-- ============================================================================
-- DATOS INICIALES
-- ============================================================================
INSERT INTO usuarios (nombre, email, password_hash) VALUES
('Administrador', 'admin@proyecto.local', '$2a$10$EjemploHashDeBcryptAqui123456789012345678901234567890');

INSERT INTO zonas (nombre, codigo, latitud, longitud, descripcion) VALUES
('Centro', 'CENTRO', -17.8146, -63.1561, 'Zona céntrica de Santa Cruz'),
('Norte', 'NORTE', -17.7500, -63.1500, 'Zona norte de la ciudad'),
('Sur', 'SUR', -17.8500, -63.1600, 'Zona sur de la ciudad'),
('Equipetrol', 'EQUIPETROL', -17.7800, -63.1800, 'Zona industrial Equipetrol'),
('Plan 3,000', 'PLAN3000', -17.8200, -63.1400, 'Plan 3,000'),
('2do anillo Norte', '2ANILLO_N', -17.7600, -63.1400, 'Segundo anillo zona norte'),
('Paila', 'PAILA', -17.7900, -63.1700, 'Zona Paila'),
('Villa 1ro de Mayo', 'VILLA1MAYO', -17.8300, -63.1500, 'Villa 1ro de Mayo');

INSERT INTO reglas_alertas (usuario_id, nombre, metrica, umbral, operador, severidad, descripcion) VALUES
(1, 'PM2.5 Crítico', 'PM2.5', 40.0, '>=', 'critical', 'Alerta cuando PM2.5 supera 40 μg/m³'),
(1, 'PM2.5 Alto', 'PM2.5', 35.0, '>=', 'high', 'Alerta cuando PM2.5 supera 35 μg/m³'),
(1, 'PM10 Elevado', 'PM10', 50.0, '>=', 'high', 'Alerta cuando PM10 supera 50 μg/m³'),
(1, 'NO2 Elevado', 'NO2', 80.0, '>=', 'high', 'Alerta cuando NO2 supera 80 μg/m³');
