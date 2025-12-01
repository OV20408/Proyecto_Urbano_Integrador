import { sequelize } from '../config/db.js';
import LogWorkflow from '../models/LogWorkflow.js';
import Workflow from '../models/Workflow.js';

// GET /api/logs-workflows - Obtener todos los logs
export const getAllLogsWorkflows = async (req, res) => {
  try {
    const { workflow_id, nivel, exito, limit = 100 } = req.query;
    const where = {};

    if (workflow_id) {
      where.workflow_id = parseInt(workflow_id);
    }

    if (nivel) {
      where.nivel = nivel;
    }

    if (exito !== undefined) {
      where.exito = exito === 'true';
    }

    const logs = await LogWorkflow.findAll({
      where,
      include: [{
        model: Workflow,
        as: 'workflow'
      }],
      order: [['fecha', 'DESC']],
      limit: parseInt(limit)
    });

    res.json(logs);
  } catch (error) {
    console.error('Error al obtener logs de workflows:', error);
    res.status(500).json({ message: 'Error al obtener logs de workflows', error: error.message });
  }
};

// GET /api/logs-workflows/:id - Obtener un log por ID
export const getLogWorkflowById = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await LogWorkflow.findByPk(id, {
      include: [{
        model: Workflow,
        as: 'workflow'
      }]
    });

    if (!log) {
      return res.status(404).json({ message: 'Log no encontrado' });
    }

    res.json(log);
  } catch (error) {
    console.error('Error al obtener log:', error);
    res.status(500).json({ message: 'Error al obtener log', error: error.message });
  }
};

// POST /api/logs-workflows - Crear un nuevo log
export const createLogWorkflow = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { workflow_id, nivel, mensaje, duracion_ms, exito } = req.body;

    if (!workflow_id || !nivel || !mensaje) {
      await transaction.rollback();
      return res.status(400).json({ 
        message: 'workflow_id, nivel y mensaje son requeridos' 
      });
    }

    const log = await LogWorkflow.create({
      workflow_id: parseInt(workflow_id),
      nivel,
      mensaje,
      duracion_ms: duracion_ms ? parseInt(duracion_ms) : null,
      exito: exito !== undefined ? exito : true
    }, { transaction });

    // Actualizar estadísticas del workflow
    if (workflow_id) {
      const Workflow = (await import('../models/Workflow.js')).default;
      const workflow = await Workflow.findByPk(workflow_id, { transaction });
      if (workflow) {
        await workflow.update({
          ejecuciones_totales: (workflow.ejecuciones_totales || 0) + 1,
          ejecuciones_exitosas: (workflow.ejecuciones_exitosas || 0) + (exito ? 1 : 0),
          ejecuciones_errores: (workflow.ejecuciones_errores || 0) + (exito ? 0 : 1),
          ultima_ejecucion: new Date(),
          fecha_actualizacion: new Date()
        }, { transaction });
      }
    }

    await transaction.commit();
    res.status(201).json(log);
  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear log:', error);
    res.status(500).json({ message: 'Error al crear log', error: error.message });
  }
};

// DELETE /api/logs-workflows/:id - Eliminar un log
export const deleteLogWorkflow = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const log = await LogWorkflow.findByPk(id, { transaction });

    if (!log) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Log no encontrado' });
    }

    await log.destroy({ transaction });
    await transaction.commit();
    
    res.json({ message: 'Log eliminado correctamente' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar log:', error);
    res.status(500).json({ message: 'Error al eliminar log', error: error.message });
  }
};





