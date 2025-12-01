import { sequelize } from '../config/db.js';
import { Op } from 'sequelize';
import MedicionAire from '../models/MedicionAire.js';
import Zona from '../models/Zona.js';

/**
 * Convierte valores DECIMAL de Sequelize a números (floats)
 * Los valores DECIMAL pueden venir como objetos, strings o null
 */
function formatMedicion(medicion) {
  if (!medicion) return null;
  
  // Convertir a objeto plano si es una instancia de Sequelize
  // Usar get({ plain: true }) para incluir relaciones
  const plain = medicion.get ? medicion.get({ plain: true }) : medicion;
  
  // Función helper para convertir DECIMAL a número
  const toFloat = (value) => {
    if (value === null || value === undefined) return null;
    // Si es un objeto (Decimal de Sequelize), convertir a string y luego a número
    if (typeof value === 'object' && value.toString) {
      const str = value.toString();
      const num = parseFloat(str);
      return isNaN(num) ? null : num;
    }
    // Si es string, convertir a número
    if (typeof value === 'string') {
      const num = parseFloat(value);
      return isNaN(num) ? null : num;
    }
    // Si ya es número, devolverlo
    if (typeof value === 'number') {
      return isNaN(value) ? null : value;
    }
    return null;
  };

  // Crear objeto formateado preservando todas las propiedades originales
  const formatted = {
    ...plain,
    pm25: toFloat(plain.pm25),
    pm10: toFloat(plain.pm10),
    no2: toFloat(plain.no2),
    temperatura: toFloat(plain.temperatura),
    humedad_relativa: toFloat(plain.humedad_relativa),
    precipitacion: toFloat(plain.precipitacion),
    presion_superficial: toFloat(plain.presion_superficial),
    velocidad_viento: toFloat(plain.velocidad_viento),
    direccion_viento: plain.direccion_viento !== null && plain.direccion_viento !== undefined 
      ? parseInt(plain.direccion_viento) 
      : null
  };

  // Preservar relaciones incluidas (como 'zona')
  if (plain.zona) {
    formatted.zona = plain.zona;
  }

  return formatted;
}

// GET /api/mediciones - Obtener todas las mediciones
export const getAllMediciones = async (req, res) => {
  try {
    const { zona_id, fecha_inicio, fecha_fin, limit = 100 } = req.query;
    const where = {};

    if (zona_id) {
      where.zona_id = parseInt(zona_id);
    }

    if (fecha_inicio || fecha_fin) {
      where.fecha_hora = {};
      if (fecha_inicio) {
        where.fecha_hora[Op.gte] = new Date(fecha_inicio);
      }
      if (fecha_fin) {
        where.fecha_hora[Op.lte] = new Date(fecha_fin);
      }
    }

    // Si no hay filtros específicos, priorizar mediciones con datos de calidad del aire
    // (igual que hace el endpoint /sync)
    if (!zona_id && !fecha_inicio && !fecha_fin) {
      // Agregar filtro para priorizar mediciones con datos de calidad del aire
      where[Op.or] = [
        { pm10: { [Op.ne]: null } },
        { pm25: { [Op.ne]: null } },
        { no2: { [Op.ne]: null } }
      ];
    }

    const mediciones = await MedicionAire.findAll({
      where,
      include: [{
        model: Zona,
        as: 'zona'
      }],
      order: [['fecha_hora', 'DESC']],
      limit: parseInt(limit)
    });

    // Formatear mediciones para convertir DECIMAL a números (igual que /sync)
    const medicionesFormateadas = mediciones.map(medicion => formatMedicion(medicion));

    res.json(medicionesFormateadas);
  } catch (error) {
    console.error('Error al obtener mediciones:', error);
    res.status(500).json({ message: 'Error al obtener mediciones', error: error.message });
  }
};

// GET /api/mediciones/:id - Obtener una medición por ID
export const getMedicionById = async (req, res) => {
  try {
    const { id } = req.params;
    const medicion = await MedicionAire.findByPk(id, {
      include: [{
        model: Zona,
        as: 'zona'
      }]
    });

    if (!medicion) {
      return res.status(404).json({ message: 'Medición no encontrada' });
    }

    // Formatear medición para convertir DECIMAL a números
    const medicionFormateada = formatMedicion(medicion);

    res.json(medicionFormateada);
  } catch (error) {
    console.error('Error al obtener medición:', error);
    res.status(500).json({ message: 'Error al obtener medición', error: error.message });
  }
};

// POST /api/mediciones - Crear una nueva medición
export const createMedicion = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      zona_id,
      fecha_hora,
      pm25,
      pm10,
      no2,
      temperatura,
      humedad_relativa,
      precipitacion,
      presion_superficial,
      velocidad_viento,
      direccion_viento
    } = req.body;

    if (!zona_id) {
      await transaction.rollback();
      return res.status(400).json({ message: 'zona_id es requerido' });
    }

    const medicion = await MedicionAire.create({
      zona_id: parseInt(zona_id),
      fecha_hora: fecha_hora || new Date(),
      pm25,
      pm10,
      no2,
      temperatura,
      humedad_relativa,
      precipitacion,
      presion_superficial,
      velocidad_viento,
      direccion_viento
    }, { transaction });

    await transaction.commit();
    
    // Formatear medición para convertir DECIMAL a números
    const medicionFormateada = formatMedicion(medicion);
    res.status(201).json(medicionFormateada);
  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear medición:', error);
    res.status(500).json({ message: 'Error al crear medición', error: error.message });
  }
};

// PUT /api/mediciones/:id - Actualizar una medición
export const updateMedicion = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const {
      zona_id,
      fecha_hora,
      pm25,
      pm10,
      no2,
      temperatura,
      humedad_relativa,
      precipitacion,
      presion_superficial,
      velocidad_viento,
      direccion_viento
    } = req.body;

    const medicion = await MedicionAire.findByPk(id, { transaction });

    if (!medicion) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Medición no encontrada' });
    }

    await medicion.update({
      zona_id,
      fecha_hora,
      pm25,
      pm10,
      no2,
      temperatura,
      humedad_relativa,
      precipitacion,
      presion_superficial,
      velocidad_viento,
      direccion_viento
    }, { transaction });

    // Recargar la medición para obtener los valores actualizados
    await medicion.reload({ transaction });
    
    await transaction.commit();
    
    // Formatear medición para convertir DECIMAL a números
    const medicionFormateada = formatMedicion(medicion);
    res.json(medicionFormateada);
  } catch (error) {
    await transaction.rollback();
    console.error('Error al actualizar medición:', error);
    res.status(500).json({ message: 'Error al actualizar medición', error: error.message });
  }
};

// DELETE /api/mediciones/:id - Eliminar una medición
export const deleteMedicion = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const medicion = await MedicionAire.findByPk(id, { transaction });

    if (!medicion) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Medición no encontrada' });
    }

    await medicion.destroy({ transaction });
    await transaction.commit();
    
    res.json({ message: 'Medición eliminada correctamente' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar medición:', error);
    res.status(500).json({ message: 'Error al eliminar medición', error: error.message });
  }
};

