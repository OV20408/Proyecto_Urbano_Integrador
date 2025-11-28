import axios from 'axios';

const AIR_QUALITY_API = 'https://air-quality-api.open-meteo.com/v1/air-quality';
const FORECAST_API = 'https://api.open-meteo.com/v1/forecast';

/**
 * Obtiene datos de calidad del aire de Open-Meteo
 * @param {number} latitude - Latitud
 * @param {number} longitude - Longitud
 * @returns {Promise<Object>} Datos de calidad del aire
 */
export const getAirQualityData = async (latitude, longitude, retryCount = 0) => {
  const MAX_RETRIES = 3; // Aumentar reintentos
  
  try {
    // Asegurar que son números
    const lat = Number(latitude);
    const lon = Number(longitude);
    
    if (isNaN(lat) || isNaN(lon)) {
      throw new Error(`Coordenadas inválidas: lat=${latitude}, lon=${longitude}`);
    }
    
    // Construir URL exacta como la que funciona en el navegador
    const url = `${AIR_QUALITY_API}?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5,nitrogen_dioxide&timezone=America/La_Paz`;
    console.log(`🌐 Llamando a API de calidad del aire (intento ${retryCount + 1}/${MAX_RETRIES + 1}):`);
    console.log(`   URL completa: ${url}`);
    console.log(`   Parámetros: lat=${lat} (tipo: ${typeof lat}), lon=${lon} (tipo: ${typeof lon})`);
    
    const startTime = Date.now();
    
    // Configurar headers como un navegador real
    const browserHeaders = {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'cross-site',
      'Referer': 'https://open-meteo.com/',
      'Origin': 'https://open-meteo.com'
    };

    // Intentar primero con la URL completa directamente (como lo hace el navegador)
    let response;
    try {
      console.log(`🌐 Intentando con URL directa (método del navegador)...`);
      response = await axios.get(url, {
        timeout: 180000, // 3 minutos de timeout
        headers: browserHeaders,
        validateStatus: function (status) {
          return status < 500;
        },
        maxRedirects: 5,
        decompress: true // Descomprimir respuesta gzip
      });
    } catch (directError) {
      // Si falla con URL directa, intentar con params
      console.log(`⚠️ Intento con URL directa falló (${directError.message}), intentando con params...`);
      response = await axios.get(AIR_QUALITY_API, {
        params: {
          latitude: lat,
          longitude: lon,
          hourly: 'pm10,pm2_5,nitrogen_dioxide',
          timezone: 'America/La_Paz'
        },
        timeout: 180000,
        headers: browserHeaders,
        validateStatus: function (status) {
          return status < 500;
        },
        maxRedirects: 5,
        decompress: true
      });
    }

    const duration = Date.now() - startTime;
    console.log(`✅ Respuesta recibida de API de calidad del aire. Status: ${response.status}, Duración: ${duration}ms`);
    
    if (!response.data) {
      console.warn(`⚠️ Respuesta sin data:`, {
        status: response.status,
        headers: response.headers,
        statusText: response.statusText
      });
      return {
        success: false,
        error: 'La API no retornó data',
        data: null
      };
    }

    if (!response.data.hourly) {
      console.warn(`⚠️ Respuesta sin datos hourly:`, {
        tiene_data: !!response.data,
        keys: response.data ? Object.keys(response.data) : [],
        sample: JSON.stringify(response.data).substring(0, 200)
      });
      return {
        success: false,
        error: 'La API no retornó datos hourly',
        data: null
      };
    }

    // Verificar que los datos esperados estén presentes
    const hourly = response.data.hourly;
    const tienePM10 = !!hourly.pm10 && Array.isArray(hourly.pm10);
    const tienePM25 = !!hourly.pm2_5 && Array.isArray(hourly.pm2_5);
    const tieneNO2 = !!hourly.nitrogen_dioxide && Array.isArray(hourly.nitrogen_dioxide);

    console.log(`📊 Datos de calidad del aire recibidos:`, {
      tiene_pm10: tienePM10,
      tiene_pm2_5: tienePM25,
      tiene_nitrogen_dioxide: tieneNO2,
      cantidad_pm10: tienePM10 ? hourly.pm10.length : 0,
      cantidad_pm2_5: tienePM25 ? hourly.pm2_5.length : 0,
      cantidad_no2: tieneNO2 ? hourly.nitrogen_dioxide.length : 0,
      primer_valor_pm10: tienePM10 && hourly.pm10.length > 0 ? hourly.pm10[0] : null,
      primer_valor_pm25: tienePM25 && hourly.pm2_5.length > 0 ? hourly.pm2_5[0] : null,
      primer_valor_no2: tieneNO2 && hourly.nitrogen_dioxide.length > 0 ? hourly.nitrogen_dioxide[0] : null
    });

    if (!tienePM10 && !tienePM25 && !tieneNO2) {
      console.warn(`⚠️ La API no retornó ninguno de los datos esperados (pm10, pm2_5, nitrogen_dioxide)`);
    } else {
      console.log(`✅ Datos de calidad del aire válidos recibidos`);
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    // Si es timeout y aún tenemos reintentos, intentar de nuevo con más tiempo de espera
    if ((error.code === 'ETIMEDOUT' || error.message.includes('timeout') || error.code === 'ECONNRESET') && retryCount < MAX_RETRIES) {
      const waitTime = (retryCount + 1) * 3000; // Esperar más tiempo en cada reintento: 3s, 6s, 9s
      console.warn(`⏳ Timeout en intento ${retryCount + 1}/${MAX_RETRIES + 1}, esperando ${waitTime/1000}s antes de reintentar...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return getAirQualityData(latitude, longitude, retryCount + 1);
    }
    const errorMessage = error.response 
      ? `HTTP ${error.response.status}: ${error.response.statusText} - ${error.message}`
      : error.code 
        ? `${error.code}: ${error.message}`
        : error.message || 'Error desconocido';
    
    console.error(`❌ Error al obtener datos de calidad del aire (${latitude}, ${longitude}):`, {
      message: errorMessage,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data
    });
    
    return {
      success: false,
      error: errorMessage,
      data: null
    };
  }
};

/**
 * Obtiene datos de pronóstico del tiempo de Open-Meteo
 * @param {number} latitude - Latitud
 * @param {number} longitude - Longitud
 * @returns {Promise<Object>} Datos de pronóstico del tiempo
 */
export const getForecastData = async (latitude, longitude, retryCount = 0) => {
  const MAX_RETRIES = 2;
  
  try {
    // Asegurar que son números
    const lat = Number(latitude);
    const lon = Number(longitude);
    
    if (isNaN(lat) || isNaN(lon)) {
      throw new Error(`Coordenadas inválidas: lat=${latitude}, lon=${longitude}`);
    }
    
    const url = `${FORECAST_API}?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m,precipitation,surface_pressure,windspeed_10m,winddirection_10m&timezone=America/La_Paz`;
    console.log(`🌐 Llamando a API de pronóstico (intento ${retryCount + 1}/${MAX_RETRIES + 1}):`);
    console.log(`   URL: ${url}`);
    console.log(`   Parámetros: lat=${lat} (tipo: ${typeof lat}), lon=${lon} (tipo: ${typeof lon})`);
    
    const startTime = Date.now();
    const response = await axios.get(FORECAST_API, {
      params: {
        latitude: lat,
        longitude: lon,
        hourly: 'temperature_2m,relativehumidity_2m,precipitation,surface_pressure,windspeed_10m,winddirection_10m',
        timezone: 'America/La_Paz' // Zona horaria de Bolivia (Santa Cruz usa la misma que La Paz)
      },
      timeout: 60000, // 60 segundos de timeout
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Connection': 'keep-alive',
        'Referer': 'https://open-meteo.com/',
        'Origin': 'https://open-meteo.com'
      },
      decompress: true,
      validateStatus: function (status) {
        return status < 500; // Resolver solo si el código de estado es menor que 500
      }
    });

    const duration = Date.now() - startTime;
    console.log(`✅ Respuesta recibida de API de pronóstico. Status: ${response.status}, Duración: ${duration}ms`);
    
    if (!response.data || !response.data.hourly) {
      console.warn(`⚠️ Respuesta sin datos hourly:`, response.data);
      return {
        success: false,
        error: 'La API no retornó datos hourly',
        data: null
      };
    }

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    // Si es timeout y aún tenemos reintentos, intentar de nuevo
    if ((error.code === 'ETIMEDOUT' || error.message.includes('timeout')) && retryCount < MAX_RETRIES) {
      console.warn(`⏳ Timeout en intento ${retryCount + 1}, reintentando...`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Esperar 2 segundos antes de reintentar
      return getForecastData(latitude, longitude, retryCount + 1);
    }
    const errorMessage = error.response 
      ? `HTTP ${error.response.status}: ${error.response.statusText} - ${error.message}`
      : error.code 
        ? `${error.code}: ${error.message}`
        : error.message || 'Error desconocido';
    
    console.error(`❌ Error al obtener datos de pronóstico (${latitude}, ${longitude}):`, {
      message: errorMessage,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data
    });
    
    return {
      success: false,
      error: errorMessage,
      data: null
    };
  }
};

/**
 * Combina datos de calidad del aire y pronóstico del tiempo
 * @param {number} latitude - Latitud
 * @param {number} longitude - Longitud
 * @returns {Promise<Object>} Datos combinados
 */
export const getCombinedData = async (latitude, longitude) => {
  console.log(`🔄 Obteniendo datos combinados para coordenadas: lat=${latitude}, lon=${longitude}`);
  
  try {
    // Hacer las llamadas en paralelo para ser más rápido
    // Ambas APIs son independientes
    console.log(`📡 Obteniendo datos de pronóstico y calidad del aire en paralelo...`);
    
    const [forecastResult, airQualityResult] = await Promise.allSettled([
      getForecastData(latitude, longitude),
      getAirQualityData(latitude, longitude)
    ]);

    // Procesar resultado del pronóstico
    const forecast = forecastResult.status === 'fulfilled' 
      ? forecastResult.value 
      : { success: false, error: forecastResult.reason?.message || 'Error desconocido', data: null };

    // Procesar resultado de calidad del aire
    const airQuality = airQualityResult.status === 'fulfilled'
      ? airQualityResult.value
      : { success: false, error: airQualityResult.reason?.message || 'Error desconocido', data: null };

    // Al menos el pronóstico debe funcionar para continuar
    const success = forecast.success;
    
    if (!success) {
      console.error(`❌ Error al obtener datos combinados:`, {
        airQuality: airQuality.error,
        forecast: forecast.error
      });
    } else {
      if (forecast.success) {
        console.log(`✅ Pronóstico obtenido exitosamente`);
      }
      if (airQuality.success) {
        console.log(`✅ Calidad del aire obtenida exitosamente`);
      } else {
        console.warn(`⚠️ Calidad del aire falló: ${airQuality.error}`);
        console.warn(`⚠️ Se guardarán solo los datos de pronóstico disponibles`);
      }
    }

    return {
      airQuality: airQuality,
      forecast: forecast,
      success: success
    };
  } catch (error) {
    console.error(`❌ Error inesperado en getCombinedData:`, error);
    return {
      airQuality: { success: false, error: error.message, data: null },
      forecast: { success: false, error: error.message, data: null },
      success: false
    };
  }
};

/**
 * Procesa y formatea los datos de Open-Meteo para guardarlos en la base de datos
 * @param {Object} airQualityData - Datos de calidad del aire
 * @param {Object} forecastData - Datos de pronóstico
 * @returns {Array} Array de mediciones formateadas
 */
export const processOpenMeteoData = (airQualityData, forecastData) => {
  // Permitir procesar aunque falte uno de los datos
  // Si falta calidad del aire, usaremos null para esos campos
  // Si falta pronóstico, no podemos procesar nada
  if (!forecastData) {
    console.warn('⚠️ No hay datos de pronóstico, no se pueden procesar mediciones');
    return [];
  }
  
  // Si falta calidad del aire, continuar con nulls
  if (!airQualityData) {
    console.warn('⚠️ No hay datos de calidad del aire, se guardarán solo datos de pronóstico');
  }

  const measurements = [];
  
  // Obtener arrays de datos horarios
  // Usar forecast como base (siempre debe existir)
  const forecastHourly = forecastData.hourly || {};
  const forecastTimeArray = forecastHourly.time || [];
  
  // Calidad del aire puede ser null
  const airQualityHourly = airQualityData?.hourly || {};
  const airQualityTimeArray = airQualityHourly.time || [];

  if (forecastTimeArray.length === 0) {
    return [];
  }

  // Log para debug
  console.log(`📊 Comparando arrays de tiempo:`, {
    forecast_times: forecastTimeArray.length,
    airQuality_times: airQualityTimeArray.length,
    tiene_pm10: !!airQualityHourly.pm10,
    tiene_pm2_5: !!airQualityHourly.pm2_5,
    tiene_nitrogen_dioxide: !!airQualityHourly.nitrogen_dioxide,
    longitud_pm10: airQualityHourly.pm10?.length || 0,
    longitud_pm2_5: airQualityHourly.pm2_5?.length || 0,
    longitud_no2: airQualityHourly.nitrogen_dioxide?.length || 0
  });

  // Crear un mapa de tiempo -> índice para calidad del aire para búsqueda rápida
  const airQualityTimeMap = new Map();
  if (airQualityTimeArray.length > 0) {
    airQualityTimeArray.forEach((timeStr, index) => {
      const timeKey = new Date(timeStr).toISOString();
      airQualityTimeMap.set(timeKey, index);
    });
  }

  // Procesar cada hora del forecast
  for (let i = 0; i < forecastTimeArray.length; i++) {
    const fechaHora = new Date(forecastTimeArray[i]);
    const timeKey = fechaHora.toISOString();
    
    // Buscar el índice correspondiente en calidad del aire usando el mapa de tiempo
    const airQualityIndex = airQualityTimeMap.get(timeKey);
    
    // Datos de calidad del aire (del endpoint air-quality-api.open-meteo.com)
    // Solo usar si encontramos el índice correspondiente por fecha/hora
    let pm10 = null;
    let pm25 = null;
    let no2 = null;
    
    if (airQualityIndex !== undefined && airQualityHourly) {
      pm10 = (airQualityHourly.pm10 && Array.isArray(airQualityHourly.pm10) && airQualityIndex < airQualityHourly.pm10.length) 
        ? airQualityHourly.pm10[airQualityIndex] 
        : null;
      pm25 = (airQualityHourly.pm2_5 && Array.isArray(airQualityHourly.pm2_5) && airQualityIndex < airQualityHourly.pm2_5.length)
        ? airQualityHourly.pm2_5[airQualityIndex]
        : null;
      no2 = (airQualityHourly.nitrogen_dioxide && Array.isArray(airQualityHourly.nitrogen_dioxide) && airQualityIndex < airQualityHourly.nitrogen_dioxide.length)
        ? airQualityHourly.nitrogen_dioxide[airQualityIndex]
        : null;
    }
    
    // Log para las primeras 3 mediciones para debug
    if (i < 3) {
      console.log(`🔍 Medición ${i}: fecha=${timeKey}, airQualityIndex=${airQualityIndex}, pm10=${pm10}, pm25=${pm25}, no2=${no2}`);
    }

    // Datos de pronóstico del tiempo
    const temperatura = forecastHourly.temperature_2m?.[i] ?? null;
    const humedadRelativa = forecastHourly.relativehumidity_2m?.[i] ?? null;
    const precipitacion = forecastHourly.precipitation?.[i] ?? null;
    const presionSuperficial = forecastHourly.surface_pressure?.[i] ?? null;
    const velocidadViento = forecastHourly.windspeed_10m?.[i] ?? null;
    const direccionViento = forecastHourly.winddirection_10m?.[i] ?? null;

    measurements.push({
      fecha_hora: fechaHora,
      pm10: pm10 !== null && !isNaN(pm10) ? parseFloat(pm10) : null,
      pm25: pm25 !== null && !isNaN(pm25) ? parseFloat(pm25) : null,
      no2: no2 !== null && !isNaN(no2) ? parseFloat(no2) : null,
      temperatura: temperatura !== null && !isNaN(temperatura) ? parseFloat(temperatura) : null,
      humedad_relativa: humedadRelativa !== null && !isNaN(humedadRelativa) ? parseFloat(humedadRelativa) : null,
      precipitacion: precipitacion !== null && !isNaN(precipitacion) ? parseFloat(precipitacion) : null,
      presion_superficial: presionSuperficial !== null && !isNaN(presionSuperficial) ? parseFloat(presionSuperficial) : null,
      velocidad_viento: velocidadViento !== null && !isNaN(velocidadViento) ? parseFloat(velocidadViento) : null,
      direccion_viento: direccionViento !== null && !isNaN(direccionViento) ? parseInt(direccionViento) : null
    });
  }

  return measurements;
};

