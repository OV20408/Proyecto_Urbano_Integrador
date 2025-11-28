import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';
import Zona from './Zona.js';
import ReglaAlerta from './ReglaAlerta.js';
import MedicionAire from './MedicionAire.js';

const Alerta = sequelize.define('Alerta', {
  alerta_id: {
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
  zona_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'zonas',
      key: 'zona_id'
    }
  },
  regla_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'reglas_alertas',
      key: 'regla_id'
    }
  },
  medicion_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'mediciones_aire',
      key: 'medicion_id'
    }
  },
  titulo: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  severidad: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  estado: {
    type: DataTypes.STRING(20),
    defaultValue: 'open'
  },
  fuente: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  metrica: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  valor_medido: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  umbral: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  fecha_creacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  fecha_reconocimiento: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fecha_resolucion: {
    type: DataTypes.DATE,
    allowNull: true
  },
  fecha_silenciado: {
    type: DataTypes.DATE,
    allowNull: true
  },
  observaciones: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'alertas',
  timestamps: false
});

Alerta.belongsTo(User, { foreignKey: 'usuario_id', as: 'usuario' });
Alerta.belongsTo(Zona, { foreignKey: 'zona_id', as: 'zona' });
Alerta.belongsTo(ReglaAlerta, { foreignKey: 'regla_id', as: 'regla' });
Alerta.belongsTo(MedicionAire, { foreignKey: 'medicion_id', as: 'medicion' });

export default Alerta;



