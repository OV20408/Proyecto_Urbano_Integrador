import { sequelize } from '../config/db.js';
import ReglaAlerta from '../models/ReglaAlerta.js';
import User from '../models/User.js';

// GET /api/reglas-alertas - Obtener todas las reglas de alertas
export const getAllReglasAlertas = async (req, res) => {
  try {
    const { usuario_id, activa } = req.query;
    const where = {};

    if (usuario_id) {
      where.usuario_id = parseInt(usuario_id);
    }

    if (activa !== undefined) {
      where.activa = activa === 'true';
    }

    const reglas = await ReglaAlerta.findAll({
      where,
      include: [{
        model: User,
        as: 'usuario'
      }],
      order: [['fecha_creacion', 'DESC']]
    });

    res.json(reglas);
  } catch (error) {
    console.error('Error al obtener reglas de alertas:', error);
    res.status(500).json({ message: 'Error al obtener reglas de alertas', error: error.message });
  }
};

// GET /api/reglas-alertas/:id - Obtener una regla por ID
export const getReglaAlertaById = async (req, res) => {
  try {
    const { id } = req.params;
    const regla = await ReglaAlerta.findByPk(id, {
      include: [{
        model: User,
        as: 'usuario'
      }]
    });

    if (!regla) {
      return res.status(404).json({ message: 'Regla de alerta no encontrada' });
    }

    res.json(regla);
  } catch (error) {
    console.error('Error al obtener regla de alerta:', error);
    res.status(500).json({ message: 'Error al obtener regla de alerta', error: error.message });
  }
};

// POST /api/reglas-alertas - Crear una nueva regla de alerta
export const createReglaAlerta = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      usuario_id,
      nombre,
      metrica,
      umbral,
      operador,
      severidad,
      activa,
      zonas_aplicables,
      descripcion
    } = req.body;

    if (!usuario_id || !nombre || !metrica || !umbral || !severidad) {
      await transaction.rollback();
      return res.status(400).json({ 
        message: 'usuario_id, nombre, metrica, umbral y severidad son requeridos' 
      });
    }

    const regla = await ReglaAlerta.create({
      usuario_id: parseInt(usuario_id),
      nombre,
      metrica,
      umbral: parseFloat(umbral),
      operador: operador || '>',
      severidad,
      activa: activa !== undefined ? activa : true,
      zonas_aplicables,
      descripcion
    }, { transaction });

    await transaction.commit();
    res.status(201).json(regla);
  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear regla de alerta:', error);
    res.status(500).json({ message: 'Error al crear regla de alerta', error: error.message });
  }
};

// PUT /api/reglas-alertas/:id - Actualizar una regla de alerta
export const updateReglaAlerta = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const {
      nombre,
      metrica,
      umbral,
      operador,
      severidad,
      activa,
      zonas_aplicables,
      descripcion
    } = req.body;

    const regla = await ReglaAlerta.findByPk(id, { transaction });

    if (!regla) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Regla de alerta no encontrada' });
    }

    await regla.update({
      nombre,
      metrica,
      umbral: umbral !== undefined ? parseFloat(umbral) : regla.umbral,
      operador,
      severidad,
      activa,
      zonas_aplicables,
      descripcion,
      fecha_actualizacion: new Date()
    }, { transaction });

    await transaction.commit();
    res.json(regla);
  } catch (error) {
    await transaction.rollback();
    console.error('Error al actualizar regla de alerta:', error);
    res.status(500).json({ message: 'Error al actualizar regla de alerta', error: error.message });
  }
};

// DELETE /api/reglas-alertas/:id - Eliminar una regla de alerta
export const deleteReglaAlerta = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const regla = await ReglaAlerta.findByPk(id, { transaction });

    if (!regla) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Regla de alerta no encontrada' });
    }

    await regla.destroy({ transaction });
    await transaction.commit();
    
    res.json({ message: 'Regla de alerta eliminada correctamente' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar regla de alerta:', error);
    res.status(500).json({ message: 'Error al eliminar regla de alerta', error: error.message });
  }
};





