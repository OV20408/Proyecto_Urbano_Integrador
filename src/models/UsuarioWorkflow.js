import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';
import Workflow from './Workflow.js';

const UsuarioWorkflow = sequelize.define('UsuarioWorkflow', {
  usuario_workflow_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'usuario_id'
    }
  },
  workflow_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'workflows',
      key: 'workflow_id'
    }
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  fecha_asignacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'usuario_workflows',
  timestamps: false
});

UsuarioWorkflow.belongsTo(User, { foreignKey: 'usuario_id', as: 'usuario' });
UsuarioWorkflow.belongsTo(Workflow, { foreignKey: 'workflow_id', as: 'workflow' });

export default UsuarioWorkflow;



