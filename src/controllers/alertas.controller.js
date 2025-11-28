import { sequelize } from '../config/db.js';
import Alerta from '../models/Alerta.js';
import User from '../models/User.js';
import Zona from '../models/Zona.js';
import ReglaAlerta from '../models/ReglaAlerta.js';
import MedicionAire from '../models/MedicionAire.js';

// GET /api/alertas - Obtener todas las alertas
export const getAllAlertas = async (req, res) => {
  try {
    const { usuario_id, zona_id, estado, severidad, fuente, limit = 100 } = req.query;
    const where = {};

    if (usuario_id) {
      where.usuario_id = parseInt(usuario_id);
    }

    if (zona_id) {
      where.zona_id = parseInt(zona_id);
    }

    if (estado) {
      where.estado = estado;
    }

    if (severidad) {
      where.severidad = severidad;
    }

    if (fuente) {
      where.fuente = fuente;
    }

    const alertas = await Alerta.findAll({
      where,
      include: [
        { model: User, as: 'usuario' },
        { model: Zona, as: 'zona' },
        { model: ReglaAlerta, as: 'regla' },
        { model: MedicionAire, as: 'medicion' }
      ],
      order: [['fecha_creacion', 'DESC']],
      limit: parseInt(limit)
    });

    res.json(alertas);
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    res.status(500).json({ message: 'Error al obtener alertas', error: error.message });
  }
};

// GET /api/alertas/:id - Obtener una alerta por ID
export const getAlertaById = async (req, res) => {
  try {
    const { id } = req.params;
    const alerta = await Alerta.findByPk(id, {
      include: [
        { model: User, as: 'usuario' },
        { model: Zona, as: 'zona' },
        { model: ReglaAlerta, as: 'regla' },
        { model: MedicionAire, as: 'medicion' }
      ]
    });

    if (!alerta) {
      return res.status(404).json({ message: 'Alerta no encontrada' });
    }

    res.json(alerta);
  } catch (error) {
    console.error('Error al obtener alerta:', error);
    res.status(500).json({ message: 'Error al obtener alerta', error: error.message });
  }
};

// POST /api/alertas - Crear una nueva alerta
export const createAlerta = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      usuario_id,
      zona_id,
      regla_id,
      medicion_id,
      titulo,
      mensaje,
      severidad,
      estado,
      fuente,
      metrica,
      valor_medido,
      umbral,
      observaciones
    } = req.body;

    if (!usuario_id || !titulo || !mensaje || !severidad) {
      await transaction.rollback();
      return res.status(400).json({ 
        message: 'usuario_id, titulo, mensaje y severidad son requeridos' 
      });
    }

    const alerta = await Alerta.create({
      usuario_id: parseInt(usuario_id),
      zona_id: zona_id ? parseInt(zona_id) : null,
      regla_id: regla_id ? parseInt(regla_id) : null,
      medicion_id: medicion_id ? parseInt(medicion_id) : null,
      titulo,
      mensaje,
      severidad,
      estado: estado || 'open',
      fuente: fuente || 'api',
      metrica,
      valor_medido: valor_medido ? parseFloat(valor_medido) : null,
      umbral: umbral ? parseFloat(umbral) : null,
      observaciones
    }, { transaction });

    await transaction.commit();
    res.status(201).json(alerta);
  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear alerta:', error);
    res.status(500).json({ message: 'Error al crear alerta', error: error.message });
  }
};

// PUT /api/alertas/:id - Actualizar una alerta
export const updateAlerta = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const {
      estado,
      fecha_reconocimiento,
      fecha_resolucion,
      fecha_silenciado,
      observaciones
    } = req.body;

    const alerta = await Alerta.findByPk(id, { transaction });

    if (!alerta) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Alerta no encontrada' });
    }

    const updateData = {};
    
    if (estado) {
      updateData.estado = estado;
      if (estado === 'ack' && !alerta.fecha_reconocimiento) {
        updateData.fecha_reconocimiento = new Date();
      }
      if (estado === 'resolved' && !alerta.fecha_resolucion) {
        updateData.fecha_resolucion = new Date();
      }
      if (estado === 'muted' && !alerta.fecha_silenciado) {
        updateData.fecha_silenciado = new Date();
      }
    }

    if (observaciones !== undefined) {
      updateData.observaciones = observaciones;
    }

    await alerta.update(updateData, { transaction });

    await transaction.commit();
    res.json(alerta);
  } catch (error) {
    await transaction.rollback();
    console.error('Error al actualizar alerta:', error);
    res.status(500).json({ message: 'Error al actualizar alerta', error: error.message });
  }
};

// DELETE /api/alertas/:id - Eliminar una alerta
export const deleteAlerta = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const alerta = await Alerta.findByPk(id, { transaction });

    if (!alerta) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Alerta no encontrada' });
    }

    await alerta.destroy({ transaction });
    await transaction.commit();
    
    res.json({ message: 'Alerta eliminada correctamente' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar alerta:', error);
    res.status(500).json({ message: 'Error al eliminar alerta', error: error.message });
  }
};



