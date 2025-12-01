import { sequelize } from '../config/db.js';
import Workflow from '../models/Workflow.js';
import LogWorkflow from '../models/LogWorkflow.js';
import UsuarioWorkflow from '../models/UsuarioWorkflow.js';

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

/**
 * Extrae el umbral de PM2.5 de un texto
 * Busca patrones como: "PM2.5 ≥ 40", "PM2.5 > 35", "PM2.5 >= 40 µg/m³", etc.
 */
function extractPM2Threshold(text) {
  if (!text) return null;
  
  // Patrones para buscar umbrales de PM2.5
  const patterns = [
    /PM2\.?5\s*[≥>=]\s*(\d+\.?\d*)/i,  // PM2.5 ≥ 40 o PM2.5 >= 40
    /PM2\.?5\s*>\s*(\d+\.?\d*)/i,      // PM2.5 > 35
    /PM2\.?5\s*:\s*(\d+\.?\d*)/i,      // PM2.5: 40
    /PM2\.?5\s+(\d+\.?\d*)/i,          // PM2.5 40
    /(\d+\.?\d*)\s*µg\/m³.*PM2\.?5/i,  // 40 µg/m³ PM2.5
    /PM2\.?5.*?(\d+\.?\d*)\s*µg/i      // PM2.5 ... 40 µg
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const value = parseFloat(match[1]);
      if (!isNaN(value) && value > 0) {
        return value;
      }
    }
  }
  
  return null;
}

// GET /api/workflows/pm2/users - Obtener usuarios con workflows de PM2.5 y sus umbrales máximos
export const getUsersWithPM2Workflows = async (req, res) => {
  try {
    // Buscar todos los usuario_workflows que tienen workflows activos
    const usuarioWorkflows = await UsuarioWorkflow.findAll({
      where: {
        activo: true
      },
      include: [
        {
          model: Workflow,
          as: 'workflow',
          where: {
            activo: true
          },
          required: true
        }
      ]
    });

    // Procesar resultados: filtrar workflows con PM2.5 y extraer umbrales
    const userThresholds = new Map(); // Map<usuario_id, umbral_maximo>

    for (const uw of usuarioWorkflows) {
      const workflow = uw.workflow;
      const usuarioId = uw.usuario_id;

      if (!workflow) continue;

      // Buscar PM2.5 en disparador o condicion
      const disparador = workflow.disparador || '';
      const condicion = workflow.condicion || '';
      const nombre = workflow.nombre || '';
      
      const textToSearch = `${disparador} ${condicion} ${nombre}`.toLowerCase();
      
      // Verificar si contiene PM2.5 o PM2
      if (textToSearch.includes('pm2.5') || textToSearch.includes('pm2')) {
        // Extraer umbral del disparador
        let threshold = extractPM2Threshold(disparador);
        
        // Si no se encontró en disparador, buscar en condicion
        if (!threshold) {
          threshold = extractPM2Threshold(condicion);
        }
        
        // Si no se encontró en condicion, buscar en nombre
        if (!threshold) {
          threshold = extractPM2Threshold(nombre);
        }

        if (threshold !== null) {
          // Actualizar el umbral máximo para este usuario
          const currentMax = userThresholds.get(usuarioId);
          if (!currentMax || threshold > currentMax) {
            userThresholds.set(usuarioId, threshold);
          }
        }
      }
    }

    // Convertir Map a array de objetos
    const result = Array.from(userThresholds.entries()).map(([usuario_id, umbral_maximo]) => ({
      usuario_id,
      umbral_maximo
    }));

    res.json({
      total: result.length,
      usuarios: result
    });
  } catch (error) {
    console.error('Error al obtener usuarios con workflows PM2.5:', error);
    res.status(500).json({ 
      message: 'Error al obtener usuarios con workflows PM2.5', 
      error: error.message 
    });
  }
};





