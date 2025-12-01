import { sequelize } from '../config/db.js';
import { Op } from 'sequelize';
import Zona from '../models/Zona.js';
import MedicionAire from '../models/MedicionAire.js';
import { getCombinedData, processOpenMeteoData } from '../services/openMeteo.service.js';

/**
 * Convierte valores DECIMAL de Sequelize a números (floats)
 * Los valores DECIMAL pueden venir como objetos, strings o null
 */
function formatMedicion(medicion) {
  if (!medicion) return null;
  
  // Convertir a objeto plano si es una instancia de Sequelize
  const plain = medicion.get ? medicion.get({ plain: true }) : medicion;
  
  // Función helper para convertir DECIMAL a número
  const toFloat = (value) => {
    if (value === null || value === undefined) return null;
    // Si es un objeto (Decimal de Sequelize), convertir a string y luego a número
    if (typeof value === 'object' && value.toString) {
      const str = value.toString();
      const num = parseFloat(str);
      return isNaN(num) ? null : num;
    }
    // Si es string, convertir a número
    if (typeof value === 'string') {
      const num = parseFloat(value);
      return isNaN(num) ? null : num;
    }
    // Si ya es número, devolverlo
    if (typeof value === 'number') {
      return isNaN(value) ? null : value;
    }
    return null;
  };

  return {
    ...plain,
    pm25: toFloat(plain.pm25),
    pm10: toFloat(plain.pm10),
    no2: toFloat(plain.no2),
    temperatura: toFloat(plain.temperatura),
    humedad_relativa: toFloat(plain.humedad_relativa),
    precipitacion: toFloat(plain.precipitacion),
    presion_superficial: toFloat(plain.presion_superficial),
    velocidad_viento: toFloat(plain.velocidad_viento),
    direccion_viento: plain.direccion_viento !== null && plain.direccion_viento !== undefined 
      ? parseInt(plain.direccion_viento) 
      : null
  };
}

/**
 * GET /api/open-meteo/sync
 * Obtiene datos de Open-Meteo para todas las zonas activas y los guarda automáticamente
 * Este es el endpoint principal que hace todo: obtiene y guarda
 */
export const syncAndGetData = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Obtener todas las zonas activas
    const zonas = await Zona.findAll({
      where: { activa: true },
      transaction
    });

    if (zonas.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ message: 'No hay zonas activas configuradas' });
    }

    const results = [];
    const errors = [];

    // Procesar cada zona
    for (const zona of zonas) {
      if (!zona.latitud || !zona.longitud) {
        errors.push({
          zona_id: zona.zona_id,
          nombre: zona.nombre,
          error: 'Zona sin coordenadas (latitud/longitud)'
        });
        continue;
      }

      try {
        // Validar y convertir coordenadas
        let lat = zona.latitud;
        let lon = zona.longitud;
        
        if (lat && typeof lat === 'object' && lat.toString) {
          lat = lat.toString();
        }
        if (lon && typeof lon === 'object' && lon.toString) {
          lon = lon.toString();
        }
        
        lat = parseFloat(lat);
        lon = parseFloat(lon);
        
        if (isNaN(lat) || isNaN(lon)) {
          errors.push({
            zona_id: zona.zona_id,
            nombre: zona.nombre,
            error: `Coordenadas inválidas: lat=${zona.latitud}, lon=${zona.longitud}`
          });
          continue;
        }

        console.log(`🔄 Obteniendo y guardando datos de Open-Meteo para zona: ${zona.nombre} (${lat}, ${lon})`);
        
        // Obtener datos de Open-Meteo
        const combinedData = await getCombinedData(lat, lon);

        // Si el pronóstico funciona pero la calidad del aire falla, continuar con datos parciales
        if (!combinedData.forecast.success) {
          const errorMsg = `Error al obtener pronóstico: ${combinedData.forecast.error}`;
          console.error(`❌ ${errorMsg} para zona ${zona.nombre}`);
          errors.push({
            zona_id: zona.zona_id,
            nombre: zona.nombre,
            error: errorMsg
          });
          continue;
        }

        if (!combinedData.airQuality.success) {
          console.warn(`⚠️ Calidad del aire falló para ${zona.nombre}, pero continuando con datos de pronóstico`);
        }

        // Procesar y formatear datos
        const measurements = processOpenMeteoData(
          combinedData.airQuality.data,
          combinedData.forecast.data
        );

        if (measurements.length === 0) {
          console.warn(`⚠️ No se obtuvieron datos válidos para ${zona.nombre}`);
          errors.push({
            zona_id: zona.zona_id,
            nombre: zona.nombre,
            error: 'No se obtuvieron datos válidos'
          });
          continue;
        }

        console.log(`📦 ${measurements.length} mediciones procesadas para ${zona.nombre}`);

        // Guardar mediciones en la base de datos
        let savedCount = 0;
        let updatedCount = 0;
        let errorCount = 0;

        for (const measurement of measurements) {
          try {
            const fechaHoraNormalizada = new Date(measurement.fecha_hora);
            fechaHoraNormalizada.setSeconds(0, 0);

            const existing = await MedicionAire.findOne({
              where: {
                zona_id: zona.zona_id,
                fecha_hora: {
                  [Op.between]: [
                    new Date(fechaHoraNormalizada.getTime() - 30 * 60 * 1000),
                    new Date(fechaHoraNormalizada.getTime() + 30 * 60 * 1000)
                  ]
                }
              },
              transaction
            });

            if (existing) {
              // Log para debug antes de actualizar
              if (updatedCount < 3) {
                console.log(`🔄 Actualizando medición existente ID ${existing.medicion_id} para ${zona.nombre}:`, {
                  valores_existentes: {
                    pm10: existing.pm10,
                    pm25: existing.pm25,
                    no2: existing.no2
                  },
                  valores_nuevos: {
                    pm10: measurement.pm10,
                    pm25: measurement.pm25,
                    no2: measurement.no2
                  }
                });
              }

              // Preparar objeto de actualización
              const updateData = {
                temperatura: measurement.temperatura,
                humedad_relativa: measurement.humedad_relativa,
                precipitacion: measurement.precipitacion,
                presion_superficial: measurement.presion_superficial,
                velocidad_viento: measurement.velocidad_viento,
                direccion_viento: measurement.direccion_viento
              };

              // Actualizar valores de calidad del aire si vienen valores válidos
              // Si el valor existente es null y viene un valor válido, actualizar
              if (measurement.pm10 !== null && measurement.pm10 !== undefined) {
                updateData.pm10 = measurement.pm10;
              }
              if (measurement.pm25 !== null && measurement.pm25 !== undefined) {
                updateData.pm25 = measurement.pm25;
              }
              if (measurement.no2 !== null && measurement.no2 !== undefined) {
                updateData.no2 = measurement.no2;
              }

              await existing.update(updateData, { transaction });
              
              // Recargar para verificar valores guardados
              await existing.reload({ transaction });
              
              if (updatedCount < 3) {
                console.log(`✅ Después de actualizar medición ID ${existing.medicion_id}:`, {
                  pm10: existing.pm10,
                  pm25: existing.pm25,
                  no2: existing.no2
                });
              }
              
              updatedCount++;
            } else {
              // Log para debug antes de crear
              if (savedCount < 3) {
                console.log(`➕ Creando nueva medición para ${zona.nombre} (${fechaHoraNormalizada.toISOString()}):`, {
                  pm10: measurement.pm10,
                  pm25: measurement.pm25,
                  no2: measurement.no2,
                  temperatura: measurement.temperatura
                });
              }

              const nuevaMedicion = await MedicionAire.create({
                zona_id: zona.zona_id,
                fecha_hora: fechaHoraNormalizada,
                pm10: measurement.pm10,
                pm25: measurement.pm25,
                no2: measurement.no2,
                temperatura: measurement.temperatura,
                humedad_relativa: measurement.humedad_relativa,
                precipitacion: measurement.precipitacion,
                presion_superficial: measurement.presion_superficial,
                velocidad_viento: measurement.velocidad_viento,
                direccion_viento: measurement.direccion_viento
              }, { transaction });
              
              if (savedCount < 3) {
                console.log(`✅ Después de crear medición ID ${nuevaMedicion.medicion_id}:`, {
                  pm10: nuevaMedicion.pm10,
                  pm25: nuevaMedicion.pm25,
                  no2: nuevaMedicion.no2
                });
              }
              
              savedCount++;
            }
          } catch (measurementError) {
            errorCount++;
            console.error(`❌ Error al guardar medición para ${zona.nombre}:`, measurementError.message);
          }
        }

        results.push({
          zona_id: zona.zona_id,
          nombre: zona.nombre,
          mediciones_procesadas: measurements.length,
          mediciones_nuevas: savedCount,
          mediciones_actualizadas: updatedCount,
          mediciones_con_error: errorCount,
          calidad_aire_ok: combinedData.airQuality.success,
          pronostico_ok: combinedData.forecast.success,
          success: true
        });

      } catch (error) {
        console.error(`Error al procesar zona ${zona.nombre}:`, error);
        errors.push({
          zona_id: zona.zona_id,
          nombre: zona.nombre,
          error: error.message
        });
      }
    }

    await transaction.commit();
    console.log(`✅ Proceso completado. ${results.length} zonas exitosas, ${errors.length} con errores`);

    // Obtener los últimos datos guardados para retornarlos
    // Priorizar mediciones con datos de calidad del aire
    const realtimeData = [];
    for (const zona of zonas) {
      // Primero intentar obtener la última medición con datos de calidad del aire
      let medicion = await MedicionAire.findOne({
        where: {
          zona_id: zona.zona_id,
          [Op.or]: [
            { pm10: { [Op.ne]: null } },
            { pm25: { [Op.ne]: null } },
            { no2: { [Op.ne]: null } }
          ]
        },
        order: [['fecha_hora', 'DESC']],
        limit: 1
      });

      // Si no hay medición con datos de calidad del aire, obtener la última en general
      if (!medicion) {
        medicion = await MedicionAire.findOne({
          where: { zona_id: zona.zona_id },
          order: [['fecha_hora', 'DESC']],
          limit: 1
        });
      }

      if (medicion) {
        // Formatear medición para convertir DECIMAL a números
        const medicionFormateada = formatMedicion(medicion);
        console.log(`📊 Última medición para ${zona.nombre}: fecha=${medicionFormateada.fecha_hora}, pm10=${medicionFormateada.pm10}, pm25=${medicionFormateada.pm25}, no2=${medicionFormateada.no2}`);
        realtimeData.push({
          zona: {
            zona_id: zona.zona_id,
            nombre: zona.nombre,
            codigo: zona.codigo
          },
          ultima_medicion: {
            fecha_hora: medicionFormateada.fecha_hora,
            pm25: medicionFormateada.pm25,
            pm10: medicionFormateada.pm10,
            no2: medicionFormateada.no2,
            temperatura: medicionFormateada.temperatura,
            humedad_relativa: medicionFormateada.humedad_relativa,
            precipitacion: medicionFormateada.precipitacion,
            presion_superficial: medicionFormateada.presion_superficial,
            velocidad_viento: medicionFormateada.velocidad_viento,
            direccion_viento: medicionFormateada.direccion_viento
          }
        });
      }
    }

    res.json({
      message: 'Datos obtenidos y guardados correctamente',
      timestamp: new Date().toISOString(),
      total_zonas: zonas.length,
      exitosas: results.length,
      errores: errors.length,
      resultados: results,
      errores_detalle: errors.length > 0 ? errors : undefined,
      datos_guardados: realtimeData
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error en syncAndGetData:', error);
    res.status(500).json({
      message: 'Error al obtener y guardar datos',
      error: error.message
    });
  }
};

/**
 * GET /api/open-meteo/status
 * Endpoint de diagnóstico para verificar el estado de la sincronización
 */
export const getSyncStatus = async (req, res) => {
  try {
    console.log('🔍 Verificando estado de sincronización...');

    // Obtener todas las zonas activas
    const zonas = await Zona.findAll({
      where: { activa: true }
    });

    const status = {
      timestamp: new Date().toISOString(),
      total_zonas_activas: zonas.length,
      zonas: []
    };

    // Para cada zona, verificar si tiene datos
    for (const zona of zonas) {
      const count = await MedicionAire.count({
        where: { zona_id: zona.zona_id }
      });

      const ultimaMedicion = await MedicionAire.findOne({
        where: { zona_id: zona.zona_id },
        order: [['fecha_hora', 'DESC']]
      });

      status.zonas.push({
        zona_id: zona.zona_id,
        nombre: zona.nombre,
        codigo: zona.codigo,
        latitud: zona.latitud,
        longitud: zona.longitud,
        total_mediciones: count,
        ultima_medicion: ultimaMedicion ? {
          medicion_id: ultimaMedicion.medicion_id,
          fecha_hora: ultimaMedicion.fecha_hora,
          fecha_creacion: ultimaMedicion.fecha_creacion
        } : null,
        tiene_datos: count > 0
      });
    }

    // Contar total de mediciones
    const totalMediciones = await MedicionAire.count();
    status.total_mediciones_en_bd = totalMediciones;

    res.json(status);
  } catch (error) {
    console.error('Error al verificar estado:', error);
    res.status(500).json({
      message: 'Error al verificar estado',
      error: error.message
    });
  }
};

/**
 * POST /api/open-meteo/sync
 * Obtiene datos de Open-Meteo para todas las zonas activas y los guarda en la base de datos
 */
export const syncAllZonas = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    // Obtener todas las zonas activas
    const zonas = await Zona.findAll({
      where: { activa: true },
      transaction
    });

    if (zonas.length === 0) {
      await transaction.rollback();
      return res.status(404).json({ message: 'No hay zonas activas configuradas' });
    }

    const results = [];
    const errors = [];

    // Procesar cada zona
    for (const zona of zonas) {
      if (!zona.latitud || !zona.longitud) {
        errors.push({
          zona_id: zona.zona_id,
          nombre: zona.nombre,
          error: 'Zona sin coordenadas (latitud/longitud)'
        });
        continue;
      }

      try {
        console.log(`🔄 Obteniendo datos de Open-Meteo para zona: ${zona.nombre} (${zona.latitud}, ${zona.longitud})`);
        
        // Validar y convertir coordenadas
        // Sequelize puede devolver DECIMAL como string o objeto, necesitamos convertirlo a número
        let lat = zona.latitud;
        let lon = zona.longitud;
        
        // Si viene como objeto Decimal de Sequelize, convertir a string primero
        if (lat && typeof lat === 'object' && lat.toString) {
          lat = lat.toString();
        }
        if (lon && typeof lon === 'object' && lon.toString) {
          lon = lon.toString();
        }
        
        // Convertir a número
        lat = parseFloat(lat);
        lon = parseFloat(lon);
        
        console.log(`📍 Coordenadas originales para ${zona.nombre}: lat=${zona.latitud} (tipo: ${typeof zona.latitud}), lon=${zona.longitud} (tipo: ${typeof zona.longitud})`);
        console.log(`📍 Coordenadas convertidas para ${zona.nombre}: lat=${lat}, lon=${lon}`);
        
        if (isNaN(lat) || isNaN(lon)) {
          const errorMsg = `Coordenadas inválidas: lat=${zona.latitud} (convertido: ${lat}), lon=${zona.longitud} (convertido: ${lon})`;
          console.error(`❌ ${errorMsg} para zona ${zona.nombre}`);
          errors.push({
            zona_id: zona.zona_id,
            nombre: zona.nombre,
            error: errorMsg
          });
          continue;
        }

        // Validar rango de coordenadas (Santa Cruz está aproximadamente entre -18 y -17 lat, -64 y -63 lon)
        if (lat < -20 || lat > -15 || lon < -65 || lon > -60) {
          console.warn(`⚠️ Coordenadas fuera del rango esperado para Santa Cruz: lat=${lat}, lon=${lon}`);
        }

        // Obtener datos de Open-Meteo
        const combinedData = await getCombinedData(lat, lon);

        // Si el pronóstico funciona pero la calidad del aire falla, aún podemos guardar datos parciales
        if (!combinedData.forecast.success) {
          const airQualityError = combinedData.airQuality?.error || 'Error desconocido en calidad del aire';
          const forecastError = combinedData.forecast?.error || 'Error desconocido en pronóstico';
          const errorMsg = `Calidad del aire: ${airQualityError} | Pronóstico: ${forecastError}`;
          console.error(`❌ ${errorMsg} para zona ${zona.nombre}`);
          errors.push({
            zona_id: zona.zona_id,
            nombre: zona.nombre,
            error: errorMsg,
            detalle: {
              airQuality: combinedData.airQuality?.error,
              forecast: combinedData.forecast?.error
            }
          });
          continue;
        }

        // Si el pronóstico funciona pero la calidad del aire falla, continuar con datos parciales
        if (!combinedData.airQuality.success) {
          console.warn(`⚠️ Calidad del aire falló para ${zona.nombre}, pero continuando con datos de pronóstico`);
        }

        console.log(`✅ Datos obtenidos de Open-Meteo para ${zona.nombre}`);

        // Procesar y formatear datos
        const measurements = processOpenMeteoData(
          combinedData.airQuality.data,
          combinedData.forecast.data
        );

        if (measurements.length === 0) {
          console.warn(`⚠️ No se obtuvieron datos válidos para ${zona.nombre}`);
          errors.push({
            zona_id: zona.zona_id,
            nombre: zona.nombre,
            error: 'No se obtuvieron datos válidos'
          });
          continue;
        }

        console.log(`📦 ${measurements.length} mediciones procesadas para ${zona.nombre}`);

        // Guardar mediciones en la base de datos
        let savedCount = 0;
        let updatedCount = 0;
        let errorCount = 0;

        console.log(`📊 Procesando ${measurements.length} mediciones para zona ${zona.nombre} (ID: ${zona.zona_id})`);

        for (const measurement of measurements) {
          try {
            // Normalizar fecha_hora para comparación (sin milisegundos)
            const fechaHoraNormalizada = new Date(measurement.fecha_hora);
            fechaHoraNormalizada.setSeconds(0, 0);

            // Verificar si ya existe una medición para esta zona y fecha/hora
            const existing = await MedicionAire.findOne({
              where: {
                zona_id: zona.zona_id,
                fecha_hora: {
                  [Op.between]: [
                    new Date(fechaHoraNormalizada.getTime() - 30 * 60 * 1000), // 30 minutos antes
                    new Date(fechaHoraNormalizada.getTime() + 30 * 60 * 1000)  // 30 minutos después
                  ]
                }
              },
              transaction
            });

            // Log para las primeras 3 mediciones para verificar valores
            if (savedCount + updatedCount < 3) {
              console.log(`📝 Valores a guardar para ${zona.nombre} (${fechaHoraNormalizada.toISOString()}):`, {
                pm10: measurement.pm10,
                pm25: measurement.pm25,
                no2: measurement.no2,
                temperatura: measurement.temperatura
              });
            }

            if (existing) {
              // Preparar objeto de actualización
              const updateData = {
                temperatura: measurement.temperatura,
                humedad_relativa: measurement.humedad_relativa,
                precipitacion: measurement.precipitacion,
                presion_superficial: measurement.presion_superficial,
                velocidad_viento: measurement.velocidad_viento,
                direccion_viento: measurement.direccion_viento
              };

              // Solo actualizar valores de calidad del aire si no son null
              if (measurement.pm10 !== null && measurement.pm10 !== undefined) {
                updateData.pm10 = measurement.pm10;
              }
              if (measurement.pm25 !== null && measurement.pm25 !== undefined) {
                updateData.pm25 = measurement.pm25;
              }
              if (measurement.no2 !== null && measurement.no2 !== undefined) {
                updateData.no2 = measurement.no2;
              }

              // Actualizar medición existente
              await existing.update(updateData, { transaction });
              updatedCount++;
              
              // Log para verificar valores guardados en actualización
              if (updatedCount <= 3) {
                await existing.reload({ transaction });
                console.log(`✅ Actualizada medición ID: ${existing.medicion_id} para ${zona.nombre} - Valores guardados:`, {
                  pm10: existing.pm10,
                  pm25: existing.pm25,
                  no2: existing.no2
                });
              }
            } else {
              // Crear nueva medición
              const nuevaMedicion = await MedicionAire.create({
                zona_id: zona.zona_id,
                fecha_hora: fechaHoraNormalizada,
                pm10: measurement.pm10,
                pm25: measurement.pm25,
                no2: measurement.no2,
                temperatura: measurement.temperatura,
                humedad_relativa: measurement.humedad_relativa,
                precipitacion: measurement.precipitacion,
                presion_superficial: measurement.presion_superficial,
                velocidad_viento: measurement.velocidad_viento,
                direccion_viento: measurement.direccion_viento
              }, { transaction });
              savedCount++;
              
              // Log para verificar valores guardados
              if (savedCount <= 3) {
                console.log(`✅ Guardada nueva medición ID: ${nuevaMedicion.medicion_id} para ${zona.nombre} - ${fechaHoraNormalizada.toISOString()} - Valores guardados:`, {
                  pm10: nuevaMedicion.pm10,
                  pm25: nuevaMedicion.pm25,
                  no2: nuevaMedicion.no2
                });
              }
            }
          } catch (measurementError) {
            errorCount++;
            console.error(`❌ Error al guardar medición para ${zona.nombre} (${measurement.fecha_hora}):`, measurementError.message);
          }
        }

        console.log(`✅ Zona ${zona.nombre}: ${savedCount} nuevas, ${updatedCount} actualizadas, ${errorCount} errores`);

        results.push({
          zona_id: zona.zona_id,
          nombre: zona.nombre,
          mediciones_procesadas: measurements.length,
          mediciones_nuevas: savedCount,
          mediciones_actualizadas: updatedCount,
          mediciones_con_error: errorCount,
          success: true
        });

      } catch (error) {
        console.error(`Error al procesar zona ${zona.nombre}:`, error);
        errors.push({
          zona_id: zona.zona_id,
          nombre: zona.nombre,
          error: error.message
        });
      }
    }

    await transaction.commit();
    console.log(`✅ Transacción completada. ${results.length} zonas exitosas, ${errors.length} con errores`);

    res.json({
      message: 'Sincronización completada',
      total_zonas: zonas.length,
      exitosas: results.length,
      errores: errors.length,
      resultados: results,
      errores_detalle: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error en syncAllZonas:', error);
    res.status(500).json({
      message: 'Error al sincronizar datos',
      error: error.message
    });
  }
};

/**
 * POST /api/open-meteo/sync/:zona_id
 * Obtiene datos de Open-Meteo para una zona específica y los guarda
 */
export const syncZonaById = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { zona_id } = req.params;
    
    const zona = await Zona.findByPk(zona_id, { transaction });

    if (!zona) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Zona no encontrada' });
    }

    if (!zona.activa) {
      await transaction.rollback();
      return res.status(400).json({ message: 'La zona no está activa' });
    }

    if (!zona.latitud || !zona.longitud) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Zona sin coordenadas (latitud/longitud)' });
    }

    // Validar y convertir coordenadas
    let lat = zona.latitud;
    let lon = zona.longitud;
    
    // Si viene como objeto Decimal de Sequelize, convertir a string primero
    if (lat && typeof lat === 'object' && lat.toString) {
      lat = lat.toString();
    }
    if (lon && typeof lon === 'object' && lon.toString) {
      lon = lon.toString();
    }
    
    // Convertir a número
    lat = parseFloat(lat);
    lon = parseFloat(lon);
    
    console.log(`📍 Coordenadas originales para ${zona.nombre}: lat=${zona.latitud} (tipo: ${typeof zona.latitud}), lon=${zona.longitud} (tipo: ${typeof zona.longitud})`);
    console.log(`📍 Coordenadas convertidas para ${zona.nombre}: lat=${lat}, lon=${lon}`);
    
    if (isNaN(lat) || isNaN(lon)) {
      await transaction.rollback();
      const errorMsg = `Coordenadas inválidas: lat=${zona.latitud} (convertido: ${lat}), lon=${zona.longitud} (convertido: ${lon})`;
      console.error(`❌ ${errorMsg} para zona ${zona.nombre}`);
      return res.status(400).json({
        message: 'Coordenadas inválidas',
        error: errorMsg
      });
    }
    console.log(`🔄 Obteniendo datos de Open-Meteo para zona: ${zona.nombre} (${lat}, ${lon})`);

    // Obtener datos de Open-Meteo
    const combinedData = await getCombinedData(lat, lon);

    if (!combinedData.success) {
      await transaction.rollback();
      const airQualityError = combinedData.airQuality?.error || 'Error desconocido en calidad del aire';
      const forecastError = combinedData.forecast?.error || 'Error desconocido en pronóstico';
      const errorMsg = `Calidad del aire: ${airQualityError} | Pronóstico: ${forecastError}`;
      console.error(`❌ ${errorMsg} para zona ${zona.nombre}`);
      return res.status(500).json({
        message: 'Error al obtener datos de Open-Meteo',
        error: errorMsg,
        detalle: {
          airQuality: combinedData.airQuality?.error,
          forecast: combinedData.forecast?.error
        }
      });
    }

    console.log(`✅ Datos obtenidos de Open-Meteo para ${zona.nombre}`);

    // Procesar y formatear datos
    const measurements = processOpenMeteoData(
      combinedData.airQuality.data,
      combinedData.forecast.data
    );

    if (measurements.length === 0) {
      await transaction.rollback();
      console.warn(`⚠️ No se obtuvieron datos válidos para ${zona.nombre}`);
      return res.status(404).json({ message: 'No se obtuvieron datos válidos' });
    }

    console.log(`📦 ${measurements.length} mediciones procesadas para ${zona.nombre}`);

    // Guardar mediciones
    let savedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    console.log(`📊 Procesando ${measurements.length} mediciones para zona ${zona.nombre} (ID: ${zona.zona_id})`);

    for (const measurement of measurements) {
      try {
        // Normalizar fecha_hora para comparación (sin milisegundos)
        const fechaHoraNormalizada = new Date(measurement.fecha_hora);
        fechaHoraNormalizada.setSeconds(0, 0);

        // Verificar si ya existe una medición para esta zona y fecha/hora
        const existing = await MedicionAire.findOne({
          where: {
            zona_id: zona.zona_id,
            fecha_hora: {
              [Op.between]: [
                new Date(fechaHoraNormalizada.getTime() - 30 * 60 * 1000), // 30 minutos antes
                new Date(fechaHoraNormalizada.getTime() + 30 * 60 * 1000)  // 30 minutos después
              ]
            }
          },
          transaction
        });

        if (existing) {
          // Preparar objeto de actualización
          const updateData = {
            temperatura: measurement.temperatura,
            humedad_relativa: measurement.humedad_relativa,
            precipitacion: measurement.precipitacion,
            presion_superficial: measurement.presion_superficial,
            velocidad_viento: measurement.velocidad_viento,
            direccion_viento: measurement.direccion_viento
          };

          // Solo actualizar valores de calidad del aire si no son null
          if (measurement.pm10 !== null && measurement.pm10 !== undefined) {
            updateData.pm10 = measurement.pm10;
          }
          if (measurement.pm25 !== null && measurement.pm25 !== undefined) {
            updateData.pm25 = measurement.pm25;
          }
          if (measurement.no2 !== null && measurement.no2 !== undefined) {
            updateData.no2 = measurement.no2;
          }

          await existing.update(updateData, { transaction });
          updatedCount++;
        } else {
          const nuevaMedicion = await MedicionAire.create({
            zona_id: zona.zona_id,
            fecha_hora: fechaHoraNormalizada,
            pm10: measurement.pm10,
            pm25: measurement.pm25,
            no2: measurement.no2,
            temperatura: measurement.temperatura,
            humedad_relativa: measurement.humedad_relativa,
            precipitacion: measurement.precipitacion,
            presion_superficial: measurement.presion_superficial,
            velocidad_viento: measurement.velocidad_viento,
            direccion_viento: measurement.direccion_viento
          }, { transaction });
          savedCount++;
          console.log(`✅ Guardada nueva medición ID: ${nuevaMedicion.medicion_id} para ${zona.nombre} - ${fechaHoraNormalizada.toISOString()}`);
        }
      } catch (measurementError) {
        errorCount++;
        console.error(`❌ Error al guardar medición para ${zona.nombre} (${measurement.fecha_hora}):`, measurementError.message);
      }
    }

    console.log(`✅ Zona ${zona.nombre}: ${savedCount} nuevas, ${updatedCount} actualizadas, ${errorCount} errores`);

    await transaction.commit();
    console.log(`✅ Transacción completada para ${zona.nombre}: ${savedCount} nuevas, ${updatedCount} actualizadas`);

    res.json({
      message: 'Datos sincronizados correctamente',
      zona: {
        zona_id: zona.zona_id,
        nombre: zona.nombre
      },
      mediciones_procesadas: measurements.length,
      mediciones_nuevas: savedCount,
      mediciones_actualizadas: updatedCount,
      mediciones_con_error: errorCount
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Error en syncZonaById:', error);
    res.status(500).json({
      message: 'Error al sincronizar datos de la zona',
      error: error.message
    });
  }
};

/**
 * GET /api/open-meteo/realtime
 * Obtiene los últimos datos guardados en tiempo real de todas las zonas
 */
export const getRealtimeData = async (req, res) => {
  try {
    const { limit = 1 } = req.query; // Por defecto, última medición de cada zona

    console.log('🔍 Consultando datos en tiempo real...');

    // Obtener todas las zonas activas
    const zonas = await Zona.findAll({
      where: { activa: true }
    });

    console.log(`📋 Encontradas ${zonas.length} zonas activas`);

    if (zonas.length === 0) {
      return res.status(404).json({ message: 'No hay zonas activas configuradas' });
    }

    const realtimeData = [];
    let totalMediciones = 0;

    // Para cada zona, obtener las últimas mediciones
    for (const zona of zonas) {
      console.log(`🔍 Buscando mediciones para zona ${zona.nombre} (ID: ${zona.zona_id})`);
      
      // Primero intentar obtener mediciones con datos de calidad del aire (igual que /sync)
      let mediciones = await MedicionAire.findAll({
        where: {
          zona_id: zona.zona_id,
          [Op.or]: [
            { pm10: { [Op.ne]: null } },
            { pm25: { [Op.ne]: null } },
            { no2: { [Op.ne]: null } }
          ]
        },
        order: [['fecha_hora', 'DESC']],
        limit: parseInt(limit)
      });

      // Si no hay mediciones con datos de calidad del aire, obtener las últimas en general
      if (mediciones.length === 0) {
        mediciones = await MedicionAire.findAll({
          where: { zona_id: zona.zona_id },
          order: [['fecha_hora', 'DESC']],
          limit: parseInt(limit)
        });
      }

      console.log(`📦 Mediciones encontradas para ${zona.nombre}: ${mediciones.length}`);

      if (mediciones.length > 0) {
        totalMediciones += mediciones.length;
        // Formatear mediciones para convertir DECIMAL a números (igual que /sync)
        const medicionesFormateadas = mediciones.map(m => formatMedicion(m));
        realtimeData.push({
          zona: {
            zona_id: zona.zona_id,
            nombre: zona.nombre,
            codigo: zona.codigo,
            latitud: zona.latitud,
            longitud: zona.longitud
          },
          mediciones: medicionesFormateadas.map(m => ({
            medicion_id: m.medicion_id,
            fecha_hora: m.fecha_hora,
            pm25: m.pm25,
            pm10: m.pm10,
            no2: m.no2,
            temperatura: m.temperatura,
            humedad_relativa: m.humedad_relativa,
            precipitacion: m.precipitacion,
            presion_superficial: m.presion_superficial,
            velocidad_viento: m.velocidad_viento,
            direccion_viento: m.direccion_viento,
            fecha_creacion: m.fecha_creacion
          }))
        });
      } else {
        // Verificar cuántas mediciones hay en total para esta zona
        const countTotal = await MedicionAire.count({
          where: { zona_id: zona.zona_id }
        });
        
        realtimeData.push({
          zona: {
            zona_id: zona.zona_id,
            nombre: zona.nombre,
            codigo: zona.codigo,
            latitud: zona.latitud,
            longitud: zona.longitud
          },
          mediciones: [],
          mensaje: 'No hay datos disponibles para esta zona',
          total_en_bd: countTotal,
          sugerencia: countTotal === 0 ? 'Ejecuta GET /api/open-meteo/sync para obtener y guardar datos' : 'Verifica los filtros de búsqueda'
        });
      }
    }

    console.log(`✅ Consulta completada. ${totalMediciones} mediciones retornadas de ${realtimeData.length} zonas`);

    res.json({
      timestamp: new Date().toISOString(),
      total_zonas: zonas.length,
      zonas_con_datos: realtimeData.filter(z => z.mediciones.length > 0).length,
      datos: realtimeData
    });

  } catch (error) {
    console.error('Error al obtener datos en tiempo real:', error);
    res.status(500).json({
      message: 'Error al obtener datos en tiempo real',
      error: error.message
    });
  }
};

/**
 * GET /api/open-meteo/realtime/:zona_id
 * Obtiene los últimos datos guardados en tiempo real de una zona específica
 */
export const getRealtimeDataByZona = async (req, res) => {
  try {
    const { zona_id } = req.params;
    const { limit = 24 } = req.query; // Por defecto, últimas 24 horas

    console.log(`🔍 Consultando datos en tiempo real para zona ID: ${zona_id}`);

    const zona = await Zona.findByPk(zona_id);

    if (!zona) {
      return res.status(404).json({ message: 'Zona no encontrada' });
    }

    // Primero intentar obtener mediciones con datos de calidad del aire (igual que /sync)
    let mediciones = await MedicionAire.findAll({
      where: {
        zona_id: parseInt(zona_id),
        [Op.or]: [
          { pm10: { [Op.ne]: null } },
          { pm25: { [Op.ne]: null } },
          { no2: { [Op.ne]: null } }
        ]
      },
      order: [['fecha_hora', 'DESC']],
      limit: parseInt(limit)
    });

    // Si no hay mediciones con datos de calidad del aire, obtener las últimas en general
    if (mediciones.length === 0) {
      mediciones = await MedicionAire.findAll({
        where: { zona_id: parseInt(zona_id) },
        order: [['fecha_hora', 'DESC']],
        limit: parseInt(limit)
      });
    }

    // Verificar cuántas mediciones hay en total
    const countTotal = await MedicionAire.count({
      where: { zona_id: parseInt(zona_id) }
    });

    console.log(`📦 Mediciones encontradas: ${mediciones.length} (total en BD: ${countTotal})`);

    if (mediciones.length === 0) {
      return res.json({
        timestamp: new Date().toISOString(),
        zona: {
          zona_id: zona.zona_id,
          nombre: zona.nombre,
          codigo: zona.codigo,
          latitud: zona.latitud,
          longitud: zona.longitud
        },
        mediciones: [],
        total_en_bd: countTotal,
        mensaje: 'No hay datos disponibles para esta zona',
        sugerencia: countTotal === 0 ? 'Ejecuta POST /api/open-meteo/sync/' + zona_id + ' para obtener y guardar datos' : 'Verifica los filtros de búsqueda'
      });
    }

    // Obtener la última medición (más reciente) y formatear
    const ultimaMedicion = formatMedicion(mediciones[0]);
    const historialFormateado = mediciones.map(m => formatMedicion(m));

    res.json({
      timestamp: new Date().toISOString(),
      zona: {
        zona_id: zona.zona_id,
        nombre: zona.nombre,
        codigo: zona.codigo,
        latitud: zona.latitud,
        longitud: zona.longitud
      },
      ultima_medicion: {
        medicion_id: ultimaMedicion.medicion_id,
        fecha_hora: ultimaMedicion.fecha_hora,
        pm25: ultimaMedicion.pm25,
        pm10: ultimaMedicion.pm10,
        no2: ultimaMedicion.no2,
        temperatura: ultimaMedicion.temperatura,
        humedad_relativa: ultimaMedicion.humedad_relativa,
        precipitacion: ultimaMedicion.precipitacion,
        presion_superficial: ultimaMedicion.presion_superficial,
        velocidad_viento: ultimaMedicion.velocidad_viento,
        direccion_viento: ultimaMedicion.direccion_viento,
        fecha_creacion: ultimaMedicion.fecha_creacion
      },
      historial: historialFormateado.map(m => ({
        medicion_id: m.medicion_id,
        fecha_hora: m.fecha_hora,
        pm25: m.pm25,
        pm10: m.pm10,
        no2: m.no2,
        temperatura: m.temperatura,
        humedad_relativa: m.humedad_relativa,
        precipitacion: m.precipitacion,
        presion_superficial: m.presion_superficial,
        velocidad_viento: m.velocidad_viento,
        direccion_viento: m.direccion_viento
      })),
      total_mediciones: mediciones.length
    });

  } catch (error) {
    console.error('Error al obtener datos en tiempo real de la zona:', error);
    res.status(500).json({
      message: 'Error al obtener datos en tiempo real',
      error: error.message
    });
  }
};
