import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Zona = sequelize.define('Zona', {
  zona_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  codigo: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  latitud: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitud: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  activa: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'zonas',
  timestamps: false
});

export default Zona;





