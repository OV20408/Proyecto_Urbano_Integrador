import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const BASE_URL = process.env.API_URL || 'http://localhost:3001';
const API_BASE = `${BASE_URL}/api`;

// Resultados de pruebas
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0,
  errors: [],
  details: []
};

// Token de autenticación (se obtendrá después del login)
let authToken = null;
let testUser = {
  nombre: 'Test User API',
  email: `test_${Date.now()}@example.com`,
  password: 'TestPassword123!'
};

let createdResources = {
  usuario_id: null,
  zona_id: null,
  medicion_id: null,
  workflow_id: null,
  regla_alerta_id: null,
  alerta_id: null,
  usuario_workflow_id: null,
  log_workflow_id: null,
  reporte_id: null
};

// Utilidades
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    test: '🧪'
  }[type] || 'ℹ️';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function recordTest(name, passed, error = null, details = {}) {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    log(`PASS: ${name}`, 'success');
  } else {
    testResults.failed++;
    log(`FAIL: ${name}`, 'error');
    if (error) {
      testResults.errors.push({ test: name, error: error.message || error });
      log(`   Error: ${error.message || JSON.stringify(error)}`, 'error');
    }
  }
  testResults.details.push({
    name,
    passed,
    error: error?.message || null,
    ...details
  });
}

async function makeRequest(method, endpoint, data = null, requireAuth = false) {
  try {
    const config = {
      method,
      url: `${API_BASE}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      },
      validateStatus: () => true // No lanzar error en códigos de estado HTTP
    };

    if (requireAuth && authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return {
      success: response.status >= 200 && response.status < 300,
      status: response.status,
      data: response.data,
      headers: response.headers
    };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 500,
      data: error.response?.data || { message: error.message },
      error: error.message
    };
  }
}

// ============================================
// TESTS DE AUTENTICACIÓN
// ============================================

async function testAuthRegister() {
  log('Testing POST /api/auth/register', 'test');
  const response = await makeRequest('POST', '/auth/register', {
    nombre: testUser.nombre,
    email: testUser.email,
    password: testUser.password
  });

  const passed = response.success && response.status === 201 && response.data.user;
  if (passed && response.data.user) {
    createdResources.usuario_id = response.data.user.usuario_id;
  }
  recordTest('POST /api/auth/register', passed, passed ? null : response.data, {
    status: response.status,
    response: response.data
  });
}

async function testAuthRegisterDuplicate() {
  log('Testing POST /api/auth/register (duplicate email)', 'test');
  const response = await makeRequest('POST', '/auth/register', {
    nombre: testUser.nombre,
    email: testUser.email,
    password: testUser.password
  });

  const passed = !response.success && response.status === 409;
  recordTest('POST /api/auth/register (duplicate)', passed, passed ? null : response.data, {
    status: response.status,
    expected: 409
  });
}

async function testAuthRegisterInvalid() {
  log('Testing POST /api/auth/register (invalid data)', 'test');
  const response = await makeRequest('POST', '/auth/register', {
    nombre: '',
    email: 'invalid-email'
  });

  const passed = !response.success && response.status === 400;
  recordTest('POST /api/auth/register (invalid)', passed, passed ? null : response.data, {
    status: response.status,
    expected: 400
  });
}

async function testAuthLogin() {
  log('Testing POST /api/auth/login', 'test');
  const response = await makeRequest('POST', '/auth/login', {
    email: testUser.email,
    password: testUser.password
  });

  const passed = response.success && response.status === 200 && response.data.token;
  if (passed) {
    authToken = response.data.token;
    log(`Token obtenido: ${authToken.substring(0, 20)}...`, 'success');
  }
  recordTest('POST /api/auth/login', passed, passed ? null : response.data, {
    status: response.status,
    hasToken: !!response.data.token
  });
}

async function testAuthLoginInvalid() {
  log('Testing POST /api/auth/login (invalid credentials)', 'test');
  const response = await makeRequest('POST', '/auth/login', {
    email: testUser.email,
    password: 'WrongPassword'
  });

  const passed = !response.success && response.status === 401;
  recordTest('POST /api/auth/login (invalid)', passed, passed ? null : response.data, {
    status: response.status,
    expected: 401
  });
}

async function testAuthHealth() {
  log('Testing GET /api/auth/health', 'test');
  const response = await makeRequest('GET', '/auth/health');

  const passed = response.success && response.data.ok === true;
  recordTest('GET /api/auth/health', passed, passed ? null : response.data, {
    status: response.status
  });
}

// ============================================
// TESTS DE ZONAS
// ============================================

async function testGetAllZonas() {
  log('Testing GET /api/zonas', 'test');
  const response = await makeRequest('GET', '/zonas');

  const passed = response.success && Array.isArray(response.data);
  recordTest('GET /api/zonas', passed, passed ? null : response.data, {
    status: response.status,
    count: Array.isArray(response.data) ? response.data.length : 0
  });
}

async function testGetZonaById() {
  log('Testing GET /api/zonas/:id', 'test');
  const response = await makeRequest('GET', '/zonas/1');

  const passed = response.success && response.data.zona_id;
  recordTest('GET /api/zonas/:id', passed, passed ? null : response.data, {
    status: response.status
  });
}

async function testCreateZona() {
  log('Testing POST /api/zonas', 'test');
  const zonaData = {
    nombre: `Zona Test ${Date.now()}`,
    codigo: `TEST_${Date.now()}`,
    latitud: -17.8146,
    longitud: -63.1561,
    descripcion: 'Zona de prueba',
    activa: true
  };

  const response = await makeRequest('POST', '/zonas', zonaData, true);

  const passed = response.success && response.data.zona_id;
  if (passed) {
    createdResources.zona_id = response.data.zona_id;
  }
  recordTest('POST /api/zonas', passed, passed ? null : response.data, {
    status: response.status
  });
}

async function testUpdateZona() {
  if (!createdResources.zona_id) {
    recordTest('PUT /api/zonas/:id', false, new Error('No zona created'), { skipped: true });
    return;
  }

  log('Testing PUT /api/zonas/:id', 'test');
  const response = await makeRequest('PUT', `/zonas/${createdResources.zona_id}`, {
    descripcion: 'Descripción actualizada'
  }, true);

  const passed = response.success;
  recordTest('PUT /api/zonas/:id', passed, passed ? null : response.data, {
    status: response.status
  });
}

async function testDeleteZona() {
  if (!createdResources.zona_id) {
    recordTest('DELETE /api/zonas/:id', false, new Error('No zona created'), { skipped: true });
    return;
  }

  log('Testing DELETE /api/zonas/:id', 'test');
  const response = await makeRequest('DELETE', `/zonas/${createdResources.zona_id}`, null, true);

  const passed = response.success;
  recordTest('DELETE /api/zonas/:id', passed, passed ? null : response.data, {
    status: response.status
  });
  createdResources.zona_id = null;
}

// ============================================
// TESTS DE MEDICIONES
// ============================================

async function testGetAllMediciones() {
  log('Testing GET /api/mediciones', 'test');
  const response = await makeRequest('GET', '/mediciones');

  const passed = response.success && Array.isArray(response.data);
  recordTest('GET /api/mediciones', passed, passed ? null : response.data, {
    status: response.status,
    count: Array.isArray(response.data) ? response.data.length : 0
  });
}

async function testGetMedicionById() {
  log('Testing GET /api/mediciones/:id', 'test');
  const response = await makeRequest('GET', '/mediciones/1');

  const passed = response.success && (response.data.medicion_id || response.data.message);
  recordTest('GET /api/mediciones/:id', passed, passed ? null : response.data, {
    status: response.status
  });
}

async function testCreateMedicion() {
  // Necesitamos una zona existente
  const zonasResponse = await makeRequest('GET', '/zonas');
  let zonaId = 1;
  if (zonasResponse.success && zonasResponse.data.length > 0) {
    zonaId = zonasResponse.data[0].zona_id;
  }

  log('Testing POST /api/mediciones', 'test');
  const medicionData = {
    zona_id: zonaId,
    fecha_hora: new Date().toISOString(),
    pm25: 25.5,
    pm10: 45.2,
    no2: 30.1,
    temperatura: 28.5,
    humedad_relativa: 65.0,
    precipitacion: 0.0,
    presion_superficial: 1013.25,
    velocidad_viento: 5.2,
    direccion_viento: 180
  };

  const response = await makeRequest('POST', '/mediciones', medicionData, true);

  const passed = response.success && response.data.medicion_id;
  if (passed) {
    createdResources.medicion_id = response.data.medicion_id;
  }
  recordTest('POST /api/mediciones', passed, passed ? null : response.data, {
    status: response.status
  });
}

async function testUpdateMedicion() {
  if (!createdResources.medicion_id) {
    recordTest('PUT /api/mediciones/:id', false, new Error('No medicion created'), { skipped: true });
    return;
  }

  log('Testing PUT /api/mediciones/:id', 'test');
  const response = await makeRequest('PUT', `/mediciones/${createdResources.medicion_id}`, {
    pm25: 30.0
  }, true);

  const passed = response.success;
  recordTest('PUT /api/mediciones/:id', passed, passed ? null : response.data, {
    status: response.status
  });
}

async function testDeleteMedicion() {
  if (!createdResources.medicion_id) {
    recordTest('DELETE /api/mediciones/:id', false, new Error('No medicion created'), { skipped: true });
    return;
  }

  log('Testing DELETE /api/mediciones/:id', 'test');
  const response = await makeRequest('DELETE', `/mediciones/${createdResources.medicion_id}`, null, true);

  const passed = response.success;
  recordTest('DELETE /api/mediciones/:id', passed, passed ? null : response.data, {
    status: response.status
  });
  createdResources.medicion_id = null;
}

// ============================================
// TESTS DE WORKFLOWS
// ============================================

async function testGetAllWorkflows() {
  log('Testing GET /api/workflows', 'test');
  const response = await makeRequest('GET', '/workflows');

  const passed = response.success && Array.isArray(response.data);
  recordTest('GET /api/workflows', passed, passed ? null : response.data, {
    status: response.status,
    count: Array.isArray(response.data) ? response.data.length : 0
  });
}

async function testGetWorkflowById() {
  log('Testing GET /api/workflows/:id', 'test');
  const response = await makeRequest('GET', '/workflows/1');

  const passed = response.success && (response.data.workflow_id || response.data.message);
  recordTest('GET /api/workflows/:id', passed, passed ? null : response.data, {
    status: response.status
  });
}

async function testGetPM2Users() {
  log('Testing GET /api/workflows/pm2/users', 'test');
  const response = await makeRequest('GET', '/workflows/pm2/users');

  const passed = response.success && response.data.total !== undefined;
  recordTest('GET /api/workflows/pm2/users', passed, passed ? null : response.data, {
    status: response.status,
    total: response.data.total
  });
}

async function testCreateWorkflow() {
  log('Testing POST /api/workflows', 'test');
  const workflowData = {
    codigo: `WF-TEST-${Date.now()}`,
    nombre: 'Workflow de Prueba',
    tipo: 'Alerta',
    estado: 'Habilitado',
    disparador: 'Medición PM2.5 > 40',
    condicion: 'pm25 > 40',
    acciones: ['Enviar email', 'Notificar usuario'],
    etiquetas: ['aire', 'pm25'],
    activo: true
  };

  const response = await makeRequest('POST', '/workflows', workflowData, true);

  const passed = response.success && response.data.workflow_id;
  if (passed) {
    createdResources.workflow_id = response.data.workflow_id;
  }
  recordTest('POST /api/workflows', passed, passed ? null : response.data, {
    status: response.status
  });
}

async function testUpdateWorkflow() {
  if (!createdResources.workflow_id) {
    recordTest('PUT /api/workflows/:id', false, new Error('No workflow created'), { skipped: true });
    return;
  }

  log('Testing PUT /api/workflows/:id', 'test');
  const response = await makeRequest('PUT', `/workflows/${createdResources.workflow_id}`, {
    nombre: 'Workflow Actualizado'
  }, true);

  const passed = response.success;
  recordTest('PUT /api/workflows/:id', passed, passed ? null : response.data, {
    status: response.status
  });
}

async function testGetWorkflowLogs() {
  if (!createdResources.workflow_id) {
    recordTest('GET /api/workflows/:id/logs', false, new Error('No workflow created'), { skipped: true });
    return;
  }

  log('Testing GET /api/workflows/:id/logs', 'test');
  const response = await makeRequest('GET', `/workflows/${createdResources.workflow_id}/logs`);

  const passed = response.success && Array.isArray(response.data);
  recordTest('GET /api/workflows/:id/logs', passed, passed ? null : response.data, {
    status: response.status
  });
}

async function testDeleteWorkflow() {
  if (!createdResources.workflow_id) {
    recordTest('DELETE /api/workflows/:id', false, new Error('No workflow created'), { skipped: true });
    return;
  }

  log('Testing DELETE /api/workflows/:id', 'test');
  const response = await makeRequest('DELETE', `/workflows/${createdResources.workflow_id}`, null, true);

  const passed = response.success;
  recordTest('DELETE /api/workflows/:id', passed, passed ? null : response.data, {
    status: response.status
  });
  createdResources.workflow_id = null;
}

// ============================================
// TESTS DE OPEN-METEO
// ============================================

async function testGetOpenMeteoStatus() {
  log('Testing GET /api/open-meteo/status', 'test');
  const response = await makeRequest('GET', '/open-meteo/status');

  const passed = response.success;
  recordTest('GET /api/open-meteo/status', passed, passed ? null : response.data, {
    status: response.status
  });
}

async function testGetOpenMeteoSync() {
  log('Testing GET /api/open-meteo/sync', 'test');
  // Este endpoint puede tardar mucho, así que lo probamos con timeout
  const response = await makeRequest('GET', '/open-meteo/sync');

  const passed = response.success || response.status === 200;
  recordTest('GET /api/open-meteo/sync', passed, passed ? null : response.data, {
    status: response.status,
    note: 'Este endpoint puede tardar varios minutos'
  });
}

async function testGetOpenMeteoRealtime() {
  log('Testing GET /api/open-meteo/realtime', 'test');
  const response = await makeRequest('GET', '/open-meteo/realtime');

  const passed = response.success && Array.isArray(response.data);
  recordTest('GET /api/open-meteo/realtime', passed, passed ? null : response.data, {
    status: response.status
  });
}

async function testGetOpenMeteoRealtimeByZona() {
  log('Testing GET /api/open-meteo/realtime/:zona_id', 'test');
  const response = await makeRequest('GET', '/open-meteo/realtime/1');

  const passed = response.success;
  recordTest('GET /api/open-meteo/realtime/:zona_id', passed, passed ? null : response.data, {
    status: response.status
  });
}

// ============================================
// TESTS DE REGLAS DE ALERTAS
// ============================================

async function testGetAllReglasAlertas() {
  log('Testing GET /api/reglas-alertas', 'test');
  const response = await makeRequest('GET', '/reglas-alertas', null, true);

  const passed = response.success && Array.isArray(response.data);
  recordTest('GET /api/reglas-alertas', passed, passed ? null : response.data, {
    status: response.status
  });
}

async function testCreateReglaAlerta() {
  log('Testing POST /api/reglas-alertas', 'test');
  const reglaData = {
    usuario_id: createdResources.usuario_id || 1,
    nombre: 'Regla Test PM2.5',
    metrica: 'PM2.5',
    umbral: 40.0,
    operador: '>=',
    severidad: 'critical',
    activa: true,
    zonas_aplicables: [1],
    descripcion: 'Alerta de prueba'
  };

  const response = await makeRequest('POST', '/reglas-alertas', reglaData, true);

  const passed = response.success && response.data.regla_id;
  if (passed) {
    createdResources.regla_alerta_id = response.data.regla_id;
  }
  recordTest('POST /api/reglas-alertas', passed, passed ? null : response.data, {
    status: response.status
  });
}

// ============================================
// TESTS DE ALERTAS
// ============================================

async function testGetAllAlertas() {
  log('Testing GET /api/alertas', 'test');
  const response = await makeRequest('GET', '/alertas', null, true);

  const passed = response.success && Array.isArray(response.data);
  recordTest('GET /api/alertas', passed, passed ? null : response.data, {
    status: response.status
  });
}

async function testCreateAlerta() {
  log('Testing POST /api/alertas', 'test');
  const alertaData = {
    usuario_id: createdResources.usuario_id || 1,
    zona_id: 1,
    regla_id: createdResources.regla_alerta_id || null,
    medicion_id: createdResources.medicion_id || null,
    titulo: 'Alerta de Prueba',
    mensaje: 'Esta es una alerta de prueba',
    severidad: 'critical',
    estado: 'open',
    fuente: 'api',
    metrica: 'PM2.5',
    valor_medido: 45.5,
    umbral: 40.0
  };

  const response = await makeRequest('POST', '/alertas', alertaData, true);

  const passed = response.success && response.data.alerta_id;
  if (passed) {
    createdResources.alerta_id = response.data.alerta_id;
  }
  recordTest('POST /api/alertas', passed, passed ? null : response.data, {
    status: response.status
  });
}

// ============================================
// TESTS DE USUARIO-WORKFLOWS
// ============================================

async function testGetAllUsuarioWorkflows() {
  log('Testing GET /api/usuario-workflows', 'test');
  const response = await makeRequest('GET', '/usuario-workflows', null, true);

  const passed = response.success && Array.isArray(response.data);
  recordTest('GET /api/usuario-workflows', passed, passed ? null : response.data, {
    status: response.status
  });
}

// ============================================
// TESTS DE LOGS WORKFLOWS
// ============================================

async function testGetAllLogsWorkflows() {
  log('Testing GET /api/logs-workflows', 'test');
  const response = await makeRequest('GET', '/logs-workflows');

  const passed = response.success && Array.isArray(response.data);
  recordTest('GET /api/logs-workflows', passed, passed ? null : response.data, {
    status: response.status
  });
}

// ============================================
// TESTS DE REPORTES
// ============================================

async function testGetAllReportes() {
  log('Testing GET /api/reportes', 'test');
  const response = await makeRequest('GET', '/reportes', null, true);

  const passed = response.success && Array.isArray(response.data);
  recordTest('GET /api/reportes', passed, passed ? null : response.data, {
    status: response.status
  });
}

// ============================================
// EJECUTAR TODAS LAS PRUEBAS
// ============================================

async function runAllTests() {
  log('🚀 Iniciando suite de pruebas de la API', 'info');
  log(`Base URL: ${BASE_URL}`, 'info');
  log('', 'info');

  try {
    // Autenticación
    await testAuthHealth();
    await testAuthRegister();
    await testAuthRegisterDuplicate();
    await testAuthRegisterInvalid();
    await testAuthLogin();
    await testAuthLoginInvalid();

    // Zonas
    await testGetAllZonas();
    await testGetZonaById();
    await testCreateZona();
    await testUpdateZona();
    await testDeleteZona();

    // Mediciones
    await testGetAllMediciones();
    await testGetMedicionById();
    await testCreateMedicion();
    await testUpdateMedicion();
    await testDeleteMedicion();

    // Workflows
    await testGetAllWorkflows();
    await testGetWorkflowById();
    await testGetPM2Users();
    await testCreateWorkflow();
    await testUpdateWorkflow();
    await testGetWorkflowLogs();
    await testDeleteWorkflow();

    // Open-Meteo
    await testGetOpenMeteoStatus();
    await testGetOpenMeteoRealtime();
    await testGetOpenMeteoRealtimeByZona();
    // testGetOpenMeteoSync() - Comentado porque puede tardar mucho

    // Reglas de Alertas
    await testGetAllReglasAlertas();
    await testCreateReglaAlerta();

    // Alertas
    await testGetAllAlertas();
    await testCreateAlerta();

    // Usuario-Workflows
    await testGetAllUsuarioWorkflows();

    // Logs Workflows
    await testGetAllLogsWorkflows();

    // Reportes
    await testGetAllReportes();

  } catch (error) {
    log(`Error crítico en las pruebas: ${error.message}`, 'error');
    console.error(error);
  }

  // Generar reporte
  generateReport();
}

function generateReport() {
  log('', 'info');
  log('='.repeat(60), 'info');
  log('📊 REPORTE DE PRUEBAS', 'info');
  log('='.repeat(60), 'info');
  log(`Total de pruebas: ${testResults.total}`, 'info');
  log(`✅ Exitosas: ${testResults.passed}`, 'success');
  log(`❌ Fallidas: ${testResults.failed}`, 'error');
  log(`⏭️  Omitidas: ${testResults.skipped}`, 'warning');
  log('', 'info');

  if (testResults.errors.length > 0) {
    log('Errores encontrados:', 'error');
    testResults.errors.forEach((err, index) => {
      log(`${index + 1}. ${err.test}: ${err.error}`, 'error');
    });
  }

  // Guardar reporte en archivo
  const reportPath = path.join(__dirname, 'test-report.json');
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: testResults.total,
      passed: testResults.passed,
      failed: testResults.failed,
      skipped: testResults.skipped,
      successRate: ((testResults.passed / testResults.total) * 100).toFixed(2) + '%'
    },
    details: testResults.details,
    errors: testResults.errors
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  log(`📄 Reporte guardado en: ${reportPath}`, 'success');
}

// Ejecutar
runAllTests().catch(console.error);

