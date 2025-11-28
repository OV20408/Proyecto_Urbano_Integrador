import { sequelize } from '../config/db.js';
import { Op } from 'sequelize';
import MedicionAire from '../models/MedicionAire.js';
import Zona from '../models/Zona.js';

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

    const mediciones = await MedicionAire.findAll({
      where,
      include: [{
        model: Zona,
        as: 'zona'
      }],
      order: [['fecha_hora', 'DESC']],
      limit: parseInt(limit)
    });

    res.json(mediciones);
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

    res.json(medicion);
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
    res.status(201).json(medicion);
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

    await transaction.commit();
    res.json(medicion);
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

