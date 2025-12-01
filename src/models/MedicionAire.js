import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Zona from './Zona.js';

const MedicionAire = sequelize.define('MedicionAire', {
  medicion_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  zona_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'zonas',
      key: 'zona_id'
    }
  },
  fecha_hora: {
    type: DataTypes.DATE,
    allowNull: true
  },
  pm25: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true
  },
  pm10: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true
  },
  no2: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true
  },
  temperatura: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  humedad_relativa: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  precipitacion: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true
  },
  presion_superficial: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: true
  },
  velocidad_viento: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  direccion_viento: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'mediciones_aire',
  timestamps: false
});

MedicionAire.belongsTo(Zona, { foreignKey: 'zona_id', as: 'zona' });

export default MedicionAire;





