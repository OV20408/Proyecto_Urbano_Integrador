import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Workflow = sequelize.define('Workflow', {
  workflow_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  tipo: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(20),
    defaultValue: 'Habilitado'
  },
  disparador: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  condicion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  acciones: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true
  },
  etiquetas: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: true
  },
  ultima_ejecucion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  proxima_ejecucion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  ejecuciones_totales: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  ejecuciones_exitosas: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  ejecuciones_errores: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fecha_actualizacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'workflows',
  timestamps: false
});

export default Workflow;



