import { sequelize } from '../config/db.js';
import { Op } from 'sequelize';
import Reporte from '../models/Reporte.js';
import User from '../models/User.js';
import Zona from '../models/Zona.js';
import MedicionAire from '../models/MedicionAire.js';

// GET /api/reportes - Obtener todos los reportes
export const getAllReportes = async (req, res) => {
  try {
    const { zona_id, usuario_creo, estado, fecha_inicio, fecha_fin, limit = 100 } = req.query;
    const where = {};

    if (zona_id) {
      where.zona_id = parseInt(zona_id);
    }

    if (usuario_creo) {
      where.usuario_creo = parseInt(usuario_creo);
    }

    if (estado) {
      where.estado = estado;
    }

    if (fecha_inicio || fecha_fin) {
      where.fecha_reporte = {};
      if (fecha_inicio) {
        where.fecha_reporte[Op.gte] = new Date(fecha_inicio);
      }
      if (fecha_fin) {
        where.fecha_reporte[Op.lte] = new Date(fecha_fin);
      }
    }

    const reportes = await Reporte.findAll({
      where,
      include: [
        { model: User, as: 'usuario' },
        { model: Zona, as: 'zona' }
      ],
      order: [['fecha_creacion', 'DESC']],
      limit: parseInt(limit)
    });

    res.json(reportes);
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    res.status(500).json({ message: 'Error al obtener reportes', error: error.message });
  }
};

// GET /api/reportes/:id - Obtener un reporte por ID
export const getReporteById = async (req, res) => {
  try {
    const { id } = req.params;
    const reporte = await Reporte.findByPk(id, {
      include: [
        { model: User, as: 'usuario' },
        { model: Zona, as: 'zona' }
      ]
    });

    if (!reporte) {
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }

    res.json(reporte);
  } catch (error) {
    console.error('Error al obtener reporte:', error);
    res.status(500).json({ message: 'Error al obtener reporte', error: error.message });
  }
};

// POST /api/reportes - Crear un nuevo reporte
export const createReporte = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      codigo,
      zona_id,
      usuario_creo,
      fecha_reporte,
      fecha_inicio,
      fecha_fin,
      riesgo,
      pm25_promedio,
      pm10_promedio,
      no2_promedio,
      estado,
      destinatario,
      resumen,
      contenido_completo
    } = req.body;

    if (!zona_id || !usuario_creo || !fecha_inicio || !fecha_fin) {
      await transaction.rollback();
      return res.status(400).json({ 
        message: 'zona_id, usuario_creo, fecha_inicio y fecha_fin son requeridos' 
      });
    }

    // Generar código si no se proporciona
    let codigoFinal = codigo;
    if (!codigoFinal) {
      const fecha = new Date();
      const fechaStr = fecha.toISOString().slice(2, 10).replace(/-/g, '');
      const count = await Reporte.count({
        where: {
          fecha_creacion: {
            [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
          }
        },
        transaction
      });
      codigoFinal = `R-${fechaStr}${String(count + 1).padStart(3, '0')}`;
    }

    // Calcular promedios si no se proporcionan
    let pm25Promedio = pm25_promedio;
    let pm10Promedio = pm10_promedio;
    let no2Promedio = no2_promedio;

    if (!pm25Promedio || !pm10Promedio || !no2Promedio) {
      const MedicionAire = (await import('../models/MedicionAire.js')).default;
      const mediciones = await MedicionAire.findAll({
        where: {
          zona_id: parseInt(zona_id),
          fecha_hora: {
            [Op.between]: [new Date(fecha_inicio), new Date(fecha_fin)]
          }
        },
        transaction
      });

      if (mediciones.length > 0) {
        const sumaPM25 = mediciones.reduce((sum, m) => sum + (parseFloat(m.pm25) || 0), 0);
        const sumaPM10 = mediciones.reduce((sum, m) => sum + (parseFloat(m.pm10) || 0), 0);
        const sumaNO2 = mediciones.reduce((sum, m) => sum + (parseFloat(m.no2) || 0), 0);
        
        pm25Promedio = pm25Promedio || (sumaPM25 / mediciones.length);
        pm10Promedio = pm10Promedio || (sumaPM10 / mediciones.length);
        no2Promedio = no2Promedio || (sumaNO2 / mediciones.length);
      }
    }

    // Determinar riesgo basado en PM2.5
    let riesgoFinal = riesgo;
    if (!riesgoFinal && pm25Promedio !== null) {
      if (pm25Promedio < 25) {
        riesgoFinal = 'Bajo';
      } else if (pm25Promedio < 40) {
        riesgoFinal = 'Medio';
      } else {
        riesgoFinal = 'Alto';
      }
    }

    const reporte = await Reporte.create({
      codigo: codigoFinal,
      zona_id: parseInt(zona_id),
      usuario_creo: parseInt(usuario_creo),
      fecha_reporte: fecha_reporte || new Date(),
      fecha_inicio,
      fecha_fin,
      riesgo: riesgoFinal || 'Bajo',
      pm25_promedio: pm25Promedio,
      pm10_promedio: pm10Promedio,
      no2_promedio: no2Promedio,
      estado: estado || 'Pendiente',
      destinatario,
      resumen,
      contenido_completo
    }, { transaction });

    await transaction.commit();
    res.status(201).json(reporte);
  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear reporte:', error);
    res.status(500).json({ message: 'Error al crear reporte', error: error.message });
  }
};

// PUT /api/reportes/:id - Actualizar un reporte
export const updateReporte = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const {
      estado,
      fecha_envio,
      resumen,
      contenido_completo
    } = req.body;

    const reporte = await Reporte.findByPk(id, { transaction });

    if (!reporte) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }

    const updateData = {};
    
    if (estado) {
      updateData.estado = estado;
      if (estado === 'Enviado' && !reporte.fecha_envio) {
        updateData.fecha_envio = new Date();
      }
    }

    if (fecha_envio !== undefined) {
      updateData.fecha_envio = fecha_envio;
    }

    if (resumen !== undefined) {
      updateData.resumen = resumen;
    }

    if (contenido_completo !== undefined) {
      updateData.contenido_completo = contenido_completo;
    }

    await reporte.update(updateData, { transaction });

    await transaction.commit();
    res.json(reporte);
  } catch (error) {
    await transaction.rollback();
    console.error('Error al actualizar reporte:', error);
    res.status(500).json({ message: 'Error al actualizar reporte', error: error.message });
  }
};

// DELETE /api/reportes/:id - Eliminar un reporte
export const deleteReporte = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const reporte = await Reporte.findByPk(id, { transaction });

    if (!reporte) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Reporte no encontrado' });
    }

    await reporte.destroy({ transaction });
    await transaction.commit();
    
    res.json({ message: 'Reporte eliminado correctamente' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar reporte:', error);
    res.status(500).json({ message: 'Error al eliminar reporte', error: error.message });
  }
};

