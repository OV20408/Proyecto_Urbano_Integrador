import { sequelize } from '../config/db.js';
import UsuarioWorkflow from '../models/UsuarioWorkflow.js';
import User from '../models/User.js';
import Workflow from '../models/Workflow.js';

// GET /api/usuario-workflows - Obtener todas las relaciones usuario-workflow
export const getAllUsuarioWorkflows = async (req, res) => {
  try {
    const { usuario_id, workflow_id, activo } = req.query;
    const where = {};

    if (usuario_id) {
      where.usuario_id = parseInt(usuario_id);
    }

    if (workflow_id) {
      where.workflow_id = parseInt(workflow_id);
    }

    if (activo !== undefined) {
      where.activo = activo === 'true';
    }

    const usuarioWorkflows = await UsuarioWorkflow.findAll({
      where,
      include: [
        { model: User, as: 'usuario' },
        { model: Workflow, as: 'workflow' }
      ],
      order: [['fecha_asignacion', 'DESC']]
    });

    res.json(usuarioWorkflows);
  } catch (error) {
    console.error('Error al obtener usuario-workflows:', error);
    res.status(500).json({ message: 'Error al obtener usuario-workflows', error: error.message });
  }
};

// GET /api/usuario-workflows/:id - Obtener una relación por ID
export const getUsuarioWorkflowById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioWorkflow = await UsuarioWorkflow.findByPk(id, {
      include: [
        { model: User, as: 'usuario' },
        { model: Workflow, as: 'workflow' }
      ]
    });

    if (!usuarioWorkflow) {
      return res.status(404).json({ message: 'Relación usuario-workflow no encontrada' });
    }

    res.json(usuarioWorkflow);
  } catch (error) {
    console.error('Error al obtener usuario-workflow:', error);
    res.status(500).json({ message: 'Error al obtener usuario-workflow', error: error.message });
  }
};

// POST /api/usuario-workflows - Crear una nueva relación usuario-workflow
export const createUsuarioWorkflow = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { usuario_id, workflow_id, activo } = req.body;

    if (!usuario_id || !workflow_id) {
      await transaction.rollback();
      return res.status(400).json({ message: 'usuario_id y workflow_id son requeridos' });
    }

    // Verificar si ya existe la relación
    const existe = await UsuarioWorkflow.findOne({
      where: {
        usuario_id: parseInt(usuario_id),
        workflow_id: parseInt(workflow_id)
      },
      transaction
    });

    if (existe) {
      await transaction.rollback();
      return res.status(409).json({ message: 'El usuario ya tiene asignado este workflow' });
    }

    const usuarioWorkflow = await UsuarioWorkflow.create({
      usuario_id: parseInt(usuario_id),
      workflow_id: parseInt(workflow_id),
      activo: activo !== undefined ? activo : true
    }, { transaction });

    await transaction.commit();
    res.status(201).json(usuarioWorkflow);
  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear usuario-workflow:', error);
    res.status(500).json({ message: 'Error al crear usuario-workflow', error: error.message });
  }
};

// PUT /api/usuario-workflows/:id - Actualizar una relación usuario-workflow
export const updateUsuarioWorkflow = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { activo } = req.body;

    const usuarioWorkflow = await UsuarioWorkflow.findByPk(id, { transaction });

    if (!usuarioWorkflow) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Relación usuario-workflow no encontrada' });
    }

    await usuarioWorkflow.update({
      activo: activo !== undefined ? activo : usuarioWorkflow.activo
    }, { transaction });

    await transaction.commit();
    res.json(usuarioWorkflow);
  } catch (error) {
    await transaction.rollback();
    console.error('Error al actualizar usuario-workflow:', error);
    res.status(500).json({ message: 'Error al actualizar usuario-workflow', error: error.message });
  }
};

// DELETE /api/usuario-workflows/:id - Eliminar una relación usuario-workflow
export const deleteUsuarioWorkflow = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const usuarioWorkflow = await UsuarioWorkflow.findByPk(id, { transaction });

    if (!usuarioWorkflow) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Relación usuario-workflow no encontrada' });
    }

    await usuarioWorkflow.destroy({ transaction });
    await transaction.commit();
    
    res.json({ message: 'Relación usuario-workflow eliminada correctamente' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar usuario-workflow:', error);
    res.status(500).json({ message: 'Error al eliminar usuario-workflow', error: error.message });
  }
};



