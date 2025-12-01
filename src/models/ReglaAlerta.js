import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';

const ReglaAlerta = sequelize.define('ReglaAlerta', {
  regla_id: {
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
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  metrica: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  umbral: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  operador: {
    type: DataTypes.STRING(10),
    defaultValue: '>'
  },
  severidad: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  activa: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  zonas_aplicables: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fecha_actualizacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'reglas_alertas',
  timestamps: false
});

ReglaAlerta.belongsTo(User, { foreignKey: 'usuario_id', as: 'usuario' });

export default ReglaAlerta;





