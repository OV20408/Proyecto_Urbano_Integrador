import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';
import Zona from './Zona.js';

const Reporte = sequelize.define('Reporte', {
  reporte_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  codigo: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  zona_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'zonas',
      key: 'zona_id'
    }
  },
  fecha_reporte: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  fecha_inicio: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  fecha_fin: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  riesgo: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  pm25_promedio: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true
  },
  pm10_promedio: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true
  },
  no2_promedio: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(20),
    defaultValue: 'Pendiente'
  },
  destinatario: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  resumen: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  contenido_completo: {
    type: DataTypes.JSONB,
    allowNull: true
  },
  fecha_envio: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  usuario_creo: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'usuarios',
      key: 'usuario_id'
    }
  }
}, {
  tableName: 'reportes',
  timestamps: false
});

Reporte.belongsTo(User, { foreignKey: 'usuario_creo', as: 'usuario' });
Reporte.belongsTo(Zona, { foreignKey: 'zona_id', as: 'zona' });

export default Reporte;





