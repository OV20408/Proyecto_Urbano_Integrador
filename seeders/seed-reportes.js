import dotenv from 'dotenv';
import { sequelize } from '../src/config/db.js';
import Reporte from '../src/models/Reporte.js';
import { Op } from 'sequelize';

dotenv.config();

const usuarioId = 1;
const zonaId = 1;

// Función para generar código de reporte
function generarCodigoReporte(fecha, numero) {
  const fechaStr = fecha.toISOString().slice(2, 10).replace(/-/g, '');
  return `R-${fechaStr}${String(numero).padStart(3, '0')}`;
}

// Función para determinar riesgo basado en PM2.5
function determinarRiesgo(pm25) {
  if (pm25 < 25) return 'Bajo';
  if (pm25 < 40) return 'Medio';
  return 'Alto';
}

const reportesData = [
  // Reporte mensual reciente
  {
    codigo: generarCodigoReporte(new Date(), 1),
    zona_id: zonaId,
    usuario_creo: usuarioId,
    fecha_reporte: new Date(),
    fecha_inicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Hace 30 días
    fecha_fin: new Date(),
    riesgo: 'Medio',
    pm25_promedio: 32.5,
    pm10_promedio: 48.3,
    no2_promedio: 28.7,
    estado: 'Pendiente',
    destinatario: 'admin@example.com',
    resumen: 'Reporte mensual de calidad del aire - Enero 2024. Niveles moderados de contaminación con algunas alertas por PM2.5.',
    contenido_completo: {
      resumen_ejecutivo: 'El mes de enero mostró niveles moderados de contaminación del aire.',
      alertas_generadas: 12,
      dias_con_alerta: 8,
      tendencia: 'Estable',
      recomendaciones: [
        'Continuar monitoreo de PM2.5',
        'Implementar medidas preventivas en días de alta contaminación',
        'Mantener comunicación con autoridades ambientales'
      ]
    }
  },
  // Reporte semanal
  {
    codigo: generarCodigoReporte(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 1),
    zona_id: zonaId,
    usuario_creo: usuarioId,
    fecha_reporte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    fecha_inicio: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // Hace 14 días
    fecha_fin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Hace 7 días
    riesgo: 'Alto',
    pm25_promedio: 42.8,
    pm10_promedio: 62.1,
    no2_promedio: 38.5,
    estado: 'Enviado',
    fecha_envio: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    destinatario: 'director@example.com',
    resumen: 'Reporte semanal - Semana del 8 al 14 de enero. Niveles altos de contaminación detectados.',
    contenido_completo: {
      resumen_ejecutivo: 'Semana con niveles elevados de contaminación, especialmente PM2.5 y PM10.',
      alertas_generadas: 5,
      dias_con_alerta: 5,
      pico_maximo: {
        pm25: 48.2,
        pm10: 68.5,
        fecha: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      recomendaciones: [
        'Alertar a la población sobre condiciones de aire',
        'Revisar fuentes de emisión',
        'Coordinar con autoridades para medidas de mitigación'
      ]
    }
  },
  // Reporte mensual anterior
  {
    codigo: generarCodigoReporte(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 1),
    zona_id: zonaId,
    usuario_creo: usuarioId,
    fecha_reporte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    fecha_inicio: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // Hace 60 días
    fecha_fin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Hace 30 días
    riesgo: 'Bajo',
    pm25_promedio: 22.3,
    pm10_promedio: 35.8,
    no2_promedio: 24.1,
    estado: 'Enviado',
    fecha_envio: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
    destinatario: 'admin@example.com',
    resumen: 'Reporte mensual de calidad del aire - Diciembre 2023. Niveles bajos de contaminación.',
    contenido_completo: {
      resumen_ejecutivo: 'Diciembre mostró condiciones favorables de calidad del aire.',
      alertas_generadas: 3,
      dias_con_alerta: 2,
      tendencia: 'Mejora',
      comparacion_mes_anterior: 'Mejora del 15% en PM2.5'
    }
  },
  // Reporte trimestral
  {
    codigo: generarCodigoReporte(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), 1),
    zona_id: zonaId,
    usuario_creo: usuarioId,
    fecha_reporte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    fecha_inicio: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // Hace 180 días
    fecha_fin: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Hace 90 días
    riesgo: 'Medio',
    pm25_promedio: 28.7,
    pm10_promedio: 42.5,
    no2_promedio: 30.2,
    estado: 'Enviado',
    fecha_envio: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000),
    destinatario: 'director@example.com',
    resumen: 'Reporte trimestral Q4 2023. Análisis de tendencias y patrones de contaminación.',
    contenido_completo: {
      resumen_ejecutivo: 'Trimestre con variabilidad en niveles de contaminación.',
      alertas_generadas: 45,
      dias_con_alerta: 28,
      tendencia: 'Variable',
      analisis_estacional: {
        octubre: { pm25: 25.2, riesgo: 'Bajo' },
        noviembre: { pm25: 28.5, riesgo: 'Medio' },
        diciembre: { pm25: 32.4, riesgo: 'Medio' }
      },
      recomendaciones: [
        'Mantener sistema de monitoreo continuo',
        'Analizar factores meteorológicos',
        'Desarrollar plan de contingencia'
      ]
    }
  },
  // Reporte diario reciente
  {
    codigo: generarCodigoReporte(new Date(), 2),
    zona_id: zonaId,
    usuario_creo: usuarioId,
    fecha_reporte: new Date(),
    fecha_inicio: new Date(Date.now() - 24 * 60 * 60 * 1000), // Hace 24 horas
    fecha_fin: new Date(),
    riesgo: 'Alto',
    pm25_promedio: 38.9,
    pm10_promedio: 55.2,
    no2_promedio: 32.4,
    estado: 'Pendiente',
    destinatario: 'operaciones@example.com',
    resumen: 'Reporte diario - Condiciones actuales de calidad del aire.',
    contenido_completo: {
      resumen_ejecutivo: 'Día con niveles elevados de contaminación.',
      alertas_generadas: 2,
      horas_criticas: ['08:00-10:00', '18:00-20:00'],
      condiciones_meteorologicas: 'Viento bajo, alta presión'
    }
  },
  // Reporte con estado pendiente
  {
    codigo: generarCodigoReporte(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), 1),
    zona_id: zonaId,
    usuario_creo: usuarioId,
    fecha_reporte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    fecha_inicio: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Hace 10 días
    fecha_fin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Hace 3 días
    riesgo: 'Medio',
    pm25_promedio: 29.5,
    pm10_promedio: 44.8,
    no2_promedio: 27.3,
    estado: 'Pendiente',
    destinatario: 'analisis@example.com',
    resumen: 'Reporte semanal pendiente de revisión.',
    contenido_completo: {
      resumen_ejecutivo: 'Semana con condiciones normales de calidad del aire.',
      alertas_generadas: 4,
      dias_con_alerta: 3
    }
  }
];

async function seedReportes() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión establecida correctamente.');

    console.log('🗑️  Limpiando reportes existentes para usuario_creo=1 y zona_id=1...');
    await Reporte.destroy({
      where: {
        usuario_creo: usuarioId,
        zona_id: zonaId
      },
      force: true
    });

    console.log('📝 Creando reportes de prueba...');
    const reportesCreados = await Reporte.bulkCreate(reportesData, {
      returning: true
    });

    console.log(`✅ ${reportesCreados.length} reportes creados exitosamente!`);
    console.log('\n📊 Resumen de reportes creados:');
    
    const porEstado = {};
    const porRiesgo = {};
    
    reportesCreados.forEach(reporte => {
      porEstado[reporte.estado] = (porEstado[reporte.estado] || 0) + 1;
      porRiesgo[reporte.riesgo] = (porRiesgo[reporte.riesgo] || 0) + 1;
    });

    console.log('\nPor estado:');
    Object.entries(porEstado).forEach(([estado, count]) => {
      console.log(`  ${estado}: ${count}`);
    });

    console.log('\nPor riesgo:');
    Object.entries(porRiesgo).forEach(([riesgo, count]) => {
      console.log(`  ${riesgo}: ${count}`);
    });

    console.log('\n📋 Lista de reportes creados:');
    reportesCreados.forEach((reporte, index) => {
      console.log(`  ${index + 1}. ${reporte.codigo} - ${reporte.resumen?.substring(0, 50)}... - ${reporte.estado}`);
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
seedReportes()
  .then(() => {
    console.log('🎉 Proceso finalizado.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });

