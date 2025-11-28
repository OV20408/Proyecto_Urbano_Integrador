import { sequelize } from '../config/db.js';
import Workflow from '../models/Workflow.js';
import LogWorkflow from '../models/LogWorkflow.js';

// GET /api/workflows - Obtener todos los workflows
export const getAllWorkflows = async (req, res) => {
  try {
    const { tipo, estado, activo } = req.query;
    const where = {};

    if (tipo) {
      where.tipo = tipo;
    }

    if (estado) {
      where.estado = estado;
    }

    if (activo !== undefined) {
      where.activo = activo === 'true';
    }

    const workflows = await Workflow.findAll({
      where,
      order: [['fecha_creacion', 'DESC']]
    });

    res.json(workflows);
  } catch (error) {
    console.error('Error al obtener workflows:', error);
    res.status(500).json({ message: 'Error al obtener workflows', error: error.message });
  }
};

// GET /api/workflows/:id - Obtener un workflow por ID
export const getWorkflowById = async (req, res) => {
  try {
    const { id } = req.params;
    const workflow = await Workflow.findByPk(id);

    if (!workflow) {
      return res.status(404).json({ message: 'Workflow no encontrado' });
    }

    res.json(workflow);
  } catch (error) {
    console.error('Error al obtener workflow:', error);
    res.status(500).json({ message: 'Error al obtener workflow', error: error.message });
  }
};

// POST /api/workflows - Crear un nuevo workflow
export const createWorkflow = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      codigo,
      nombre,
      tipo,
      estado,
      disparador,
      condicion,
      acciones,
      etiquetas,
      activo
    } = req.body;

    if (!nombre || !tipo) {
      await transaction.rollback();
      return res.status(400).json({ message: 'nombre y tipo son requeridos' });
    }

    const workflow = await Workflow.create({
      codigo,
      nombre,
      tipo,
      estado: estado || 'Habilitado',
      disparador,
      condicion,
      acciones,
      etiquetas,
      activo: activo !== undefined ? activo : true
    }, { transaction });

    await transaction.commit();
    res.status(201).json(workflow);
  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear workflow:', error);
    res.status(500).json({ message: 'Error al crear workflow', error: error.message });
  }
};

// PUT /api/workflows/:id - Actualizar un workflow
export const updateWorkflow = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const {
      codigo,
      nombre,
      tipo,
      estado,
      disparador,
      condicion,
      acciones,
      etiquetas,
      ultima_ejecucion,
      proxima_ejecucion,
      ejecuciones_totales,
      ejecuciones_exitosas,
      ejecuciones_errores,
      activo
    } = req.body;

    const workflow = await Workflow.findByPk(id, { transaction });

    if (!workflow) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Workflow no encontrado' });
    }

    await workflow.update({
      codigo,
      nombre,
      tipo,
      estado,
      disparador,
      condicion,
      acciones,
      etiquetas,
      ultima_ejecucion,
      proxima_ejecucion,
      ejecuciones_totales,
      ejecuciones_exitosas,
      ejecuciones_errores,
      activo,
      fecha_actualizacion: new Date()
    }, { transaction });

    await transaction.commit();
    res.json(workflow);
  } catch (error) {
    await transaction.rollback();
    console.error('Error al actualizar workflow:', error);
    res.status(500).json({ message: 'Error al actualizar workflow', error: error.message });
  }
};

// DELETE /api/workflows/:id - Eliminar un workflow
export const deleteWorkflow = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const workflow = await Workflow.findByPk(id, { transaction });

    if (!workflow) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Workflow no encontrado' });
    }

    await workflow.destroy({ transaction });
    await transaction.commit();
    
    res.json({ message: 'Workflow eliminado correctamente' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar workflow:', error);
    res.status(500).json({ message: 'Error al eliminar workflow', error: error.message });
  }
};

// GET /api/workflows/:id/logs - Obtener logs de un workflow
export const getWorkflowLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const { nivel, limit = 100 } = req.query;
    const where = { workflow_id: parseInt(id) };

    if (nivel) {
      where.nivel = nivel;
    }

    const logs = await LogWorkflow.findAll({
      where,
      order: [['fecha', 'DESC']],
      limit: parseInt(limit)
    });

    res.json(logs);
  } catch (error) {
    console.error('Error al obtener logs del workflow:', error);
    res.status(500).json({ message: 'Error al obtener logs del workflow', error: error.message });
  }
};



