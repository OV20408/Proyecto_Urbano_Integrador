import dotenv from 'dotenv';
import { sequelize } from '../src/config/db.js';
import Alerta from '../src/models/Alerta.js';

dotenv.config();

const usuarioId = 1;
const zonaId = 1;

const alertasData = [
  // Alertas críticas de PM2.5
  {
    usuario_id: usuarioId,
    zona_id: zonaId,
    titulo: 'Alerta Crítica: PM2.5 Supera Umbral',
    mensaje: 'El nivel de PM2.5 ha alcanzado 45.8 μg/m³, superando el umbral crítico de 40 μg/m³. Se recomienda evitar actividades al aire libre.',
    severidad: 'critical',
    estado: 'open',
    fuente: 'sistema',
    metrica: 'PM2.5',
    valor_medido: 45.8,
    umbral: 40.0,
    fecha_creacion: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 horas atrás
  },
  {
    usuario_id: usuarioId,
    zona_id: zonaId,
    titulo: 'Alerta Alta: PM2.5 Elevado',
    mensaje: 'PM2.5 registrado en 38.5 μg/m³. Nivel cercano al umbral crítico.',
    severidad: 'high',
    estado: 'ack',
    fuente: 'sistema',
    metrica: 'PM2.5',
    valor_medido: 38.5,
    umbral: 40.0,
    fecha_creacion: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 horas atrás
    fecha_reconocimiento: new Date(Date.now() - 4 * 60 * 60 * 1000)
  },
  {
    usuario_id: usuarioId,
    zona_id: zonaId,
    titulo: 'Alerta Media: PM2.5 Moderado',
    mensaje: 'PM2.5 en 32.1 μg/m³. Monitorear condiciones.',
    severidad: 'medium',
    estado: 'resolved',
    fuente: 'sistema',
    metrica: 'PM2.5',
    valor_medido: 32.1,
    umbral: 30.0,
    fecha_creacion: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 día atrás
    fecha_resolucion: new Date(Date.now() - 20 * 60 * 60 * 1000)
  },
  // Alertas de PM10
  {
    usuario_id: usuarioId,
    zona_id: zonaId,
    titulo: 'Alerta Crítica: PM10 Muy Elevado',
    mensaje: 'PM10 ha alcanzado 65.3 μg/m³, superando significativamente el umbral recomendado.',
    severidad: 'critical',
    estado: 'open',
    fuente: 'sistema',
    metrica: 'PM10',
    valor_medido: 65.3,
    umbral: 50.0,
    fecha_creacion: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hora atrás
  },
  {
    usuario_id: usuarioId,
    zona_id: zonaId,
    titulo: 'Alerta Alta: PM10 Elevado',
    mensaje: 'PM10 registrado en 52.8 μg/m³. Nivel por encima del umbral.',
    severidad: 'high',
    estado: 'ack',
    fuente: 'sistema',
    metrica: 'PM10',
    valor_medido: 52.8,
    umbral: 50.0,
    fecha_creacion: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 horas atrás
    fecha_reconocimiento: new Date(Date.now() - 5 * 60 * 60 * 1000)
  },
  // Alertas de NO2
  {
    usuario_id: usuarioId,
    zona_id: zonaId,
    titulo: 'Alerta Media: NO2 Elevado',
    mensaje: 'Dióxido de nitrógeno en 45.2 μg/m³. Monitorear tendencias.',
    severidad: 'medium',
    estado: 'open',
    fuente: 'sistema',
    metrica: 'NO2',
    valor_medido: 45.2,
    umbral: 40.0,
    fecha_creacion: new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 horas atrás
  },
  {
    usuario_id: usuarioId,
    zona_id: zonaId,
    titulo: 'Alerta Baja: NO2 Moderado',
    mensaje: 'NO2 en 35.7 μg/m³. Condiciones dentro de parámetros aceptables.',
    severidad: 'low',
    estado: 'resolved',
    fuente: 'sistema',
    metrica: 'NO2',
    valor_medido: 35.7,
    umbral: 40.0,
    fecha_creacion: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 días atrás
    fecha_resolucion: new Date(Date.now() - 46 * 60 * 60 * 1000)
  },
  // Alertas silenciadas
  {
    usuario_id: usuarioId,
    zona_id: zonaId,
    titulo: 'Alerta Silenciada: PM2.5 Temporal',
    mensaje: 'PM2.5 temporalmente elevado debido a condiciones meteorológicas.',
    severidad: 'medium',
    estado: 'muted',
    fuente: 'sistema',
    metrica: 'PM2.5',
    valor_medido: 36.2,
    umbral: 35.0,
    fecha_creacion: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 horas atrás
    fecha_silenciado: new Date(Date.now() - 11 * 60 * 60 * 1000),
    observaciones: 'Alerta silenciada por el usuario debido a condiciones temporales conocidas.'
  },
  // Alertas resueltas
  {
    usuario_id: usuarioId,
    zona_id: zonaId,
    titulo: 'Alerta Resuelta: PM2.5 Normalizado',
    mensaje: 'PM2.5 ha vuelto a niveles normales después del evento.',
    severidad: 'high',
    estado: 'resolved',
    fuente: 'sistema',
    metrica: 'PM2.5',
    valor_medido: 28.5,
    umbral: 40.0,
    fecha_creacion: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 días atrás
    fecha_resolucion: new Date(Date.now() - 70 * 60 * 60 * 1000),
    observaciones: 'Niveles normalizados después de implementar medidas correctivas.'
  },
  // Más alertas variadas
  {
    usuario_id: usuarioId,
    zona_id: zonaId,
    titulo: 'Alerta: Combinación de Contaminantes',
    mensaje: 'Múltiples contaminantes elevados simultáneamente. PM2.5: 42.1, PM10: 58.3',
    severidad: 'critical',
    estado: 'open',
    fuente: 'sistema',
    metrica: 'Combinado',
    valor_medido: 50.2,
    umbral: 45.0,
    fecha_creacion: new Date(Date.now() - 30 * 60 * 1000) // 30 minutos atrás
  },
  {
    usuario_id: usuarioId,
    zona_id: zonaId,
    titulo: 'Alerta Preventiva: Tendencia Creciente',
    mensaje: 'PM2.5 muestra tendencia creciente. Actual: 34.8 μg/m³. Monitorear de cerca.',
    severidad: 'medium',
    estado: 'open',
    fuente: 'sistema',
    metrica: 'PM2.5',
    valor_medido: 34.8,
    umbral: 40.0,
    fecha_creacion: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 horas atrás
  }
];

async function seedAlertas() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión establecida correctamente.');

    console.log('🗑️  Limpiando alertas existentes para usuario_id=1 y zona_id=1...');
    await Alerta.destroy({
      where: {
        usuario_id: usuarioId,
        zona_id: zonaId
      },
      force: true
    });

    console.log('📝 Creando alertas de prueba...');
    const alertasCreadas = await Alerta.bulkCreate(alertasData, {
      returning: true
    });

    console.log(`✅ ${alertasCreadas.length} alertas creadas exitosamente!`);
    console.log('\n📊 Resumen de alertas creadas:');
    
    const porEstado = {};
    const porSeveridad = {};
    
    alertasCreadas.forEach(alerta => {
      porEstado[alerta.estado] = (porEstado[alerta.estado] || 0) + 1;
      porSeveridad[alerta.severidad] = (porSeveridad[alerta.severidad] || 0) + 1;
    });

    console.log('\nPor estado:');
    Object.entries(porEstado).forEach(([estado, count]) => {
      console.log(`  ${estado}: ${count}`);
    });

    console.log('\nPor severidad:');
    Object.entries(porSeveridad).forEach(([severidad, count]) => {
      console.log(`  ${severidad}: ${count}`);
    });

    console.log('\n✨ Seed completado exitosamente!');
  } catch (error) {
    console.error('❌ Error al ejecutar el seed:', error);
    throw error;
  } finally {
    await sequelize.close();
    console.log('🔌 Conexión cerrada.');
  }
}

// Ejecutar el seed
seedAlertas()
  .then(() => {
    console.log('🎉 Proceso finalizado.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });

