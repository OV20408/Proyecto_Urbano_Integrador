import { sequelize } from '../config/db.js';
import Zona from '../models/Zona.js';

// GET /api/zonas - Obtener todas las zonas
export const getAllZonas = async (req, res) => {
  try {
    const { activa } = req.query;
    const where = {};
    
    if (activa !== undefined) {
      where.activa = activa === 'true';
    }

    const zonas = await Zona.findAll({
      where,
      order: [['nombre', 'ASC']]
    });

    res.json(zonas);
  } catch (error) {
    console.error('Error al obtener zonas:', error);
    res.status(500).json({ message: 'Error al obtener zonas', error: error.message });
  }
};

// GET /api/zonas/:id - Obtener una zona por ID
export const getZonaById = async (req, res) => {
  try {
    const { id } = req.params;
    const zona = await Zona.findByPk(id);

    if (!zona) {
      return res.status(404).json({ message: 'Zona no encontrada' });
    }

    res.json(zona);
  } catch (error) {
    console.error('Error al obtener zona:', error);
    res.status(500).json({ message: 'Error al obtener zona', error: error.message });
  }
};

// POST /api/zonas - Crear una nueva zona
export const createZona = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { nombre, codigo, latitud, longitud, descripcion, activa } = req.body;

    const zona = await Zona.create({
      nombre,
      codigo,
      latitud,
      longitud,
      descripcion,
      activa: activa !== undefined ? activa : true
    }, { transaction });

    await transaction.commit();
    res.status(201).json(zona);
  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear zona:', error);
    res.status(500).json({ message: 'Error al crear zona', error: error.message });
  }
};

// PUT /api/zonas/:id - Actualizar una zona
export const updateZona = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { nombre, codigo, latitud, longitud, descripcion, activa } = req.body;

    const zona = await Zona.findByPk(id, { transaction });

    if (!zona) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Zona no encontrada' });
    }

    await zona.update({
      nombre,
      codigo,
      latitud,
      longitud,
      descripcion,
      activa
    }, { transaction });

    await transaction.commit();
    res.json(zona);
  } catch (error) {
    await transaction.rollback();
    console.error('Error al actualizar zona:', error);
    res.status(500).json({ message: 'Error al actualizar zona', error: error.message });
  }
};

// DELETE /api/zonas/:id - Eliminar una zona
export const deleteZona = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const zona = await Zona.findByPk(id, { transaction });

    if (!zona) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Zona no encontrada' });
    }

    await zona.destroy({ transaction });
    await transaction.commit();
    
    res.json({ message: 'Zona eliminada correctamente' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar zona:', error);
    res.status(500).json({ message: 'Error al eliminar zona', error: error.message });
  }
};



