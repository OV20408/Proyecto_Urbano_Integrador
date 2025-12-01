import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Workflow from './Workflow.js';

const LogWorkflow = sequelize.define('LogWorkflow', {
  log_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  workflow_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'workflows',
      key: 'workflow_id'
    }
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  nivel: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  duracion_ms: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  exito: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'logs_workflows',
  timestamps: false
});

LogWorkflow.belongsTo(Workflow, { foreignKey: 'workflow_id', as: 'workflow' });

export default LogWorkflow;





