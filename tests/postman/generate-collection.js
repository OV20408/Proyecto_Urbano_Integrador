import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para crear una request
function createRequest(name, method, path, body = null, auth = false, tests = [], prerequest = null) {
  const request = {
    name,
    request: {
      method,
      header: [
        {
          key: "Content-Type",
          value: "application/json"
        }
      ],
      url: {
        raw: `{{baseUrl}}/api${path}`,
        host: ["{{baseUrl}}"],
        path: ["api", ...path.split('/').filter(p => p)]
      }
    },
    event: []
  };

  if (auth) {
    request.request.header.push({
      key: "Authorization",
      value: "Bearer {{authToken}}"
    });
  }

  if (body) {
    request.request.body = {
      mode: "raw",
      raw: JSON.stringify(body, null, 2)
    };
  }

  if (prerequest && prerequest.length > 0) {
    request.event.push({
      listen: "prerequest",
      script: {
        exec: prerequest,
        type: "text/javascript"
      }
    });
  }

  if (tests.length > 0) {
    request.event.push({
      listen: "test",
      script: {
        exec: tests,
        type: "text/javascript"
      }
    });
  }

  return request;
}

// Función para crear una carpeta con requests
function createFolder(name, items) {
  return {
    name,
    item: items
  };
}

// Generar colección completa
const collection = {
  info: {
    _postman_id: "api-proyecto-urbano-complete-2024-12-04",
    name: "API Proyecto Urbano - Colección Completa",
    description: "Colección completa de pruebas para todos los endpoints de la API",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  item: [
    // ============================================
    // AUTENTICACIÓN
    // ============================================
    createFolder("1. Autenticación", [
      createRequest(
        "Health Check",
        "GET",
        "/auth/health",
        null,
        false,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));",
          "pm.test('Service OK', () => pm.response.json().ok === true);"
        ]
      ),
      createRequest(
        "Registro Exitoso",
        "POST",
        "/auth/register",
        {
          nombre: "{{testName}}",
          email: "{{testEmail}}",
          password: "{{testPassword}}"
        },
        false,
        [
          "pm.test('Status 201', () => pm.response.to.have.status(201));",
          "pm.test('Retorna user', () => {",
          "    const json = pm.response.json();",
          "    pm.expect(json.user).to.have.property('usuario_id');",
          "    pm.expect(json.user).to.have.property('email');",
          "    pm.collectionVariables.set('testUserId', json.user.usuario_id);",
          "});"
        ],
        [
          "const ts = Date.now();",
          "const rand = Math.floor(Math.random() * 10000);",
          "pm.collectionVariables.set('testEmail', `test_${ts}_${rand}@example.com`);",
          "pm.collectionVariables.set('testName', `Test User ${rand}`);",
          "pm.collectionVariables.set('testPassword', 'Test123456!');"
        ]
      ),
      createRequest(
        "Registro Email Duplicado",
        "POST",
        "/auth/register",
        {
          nombre: "{{testName}}",
          email: "{{testEmail}}",
          password: "{{testPassword}}"
        },
        false,
        [
          "pm.test('Status 409', () => pm.response.to.have.status(409));",
          "pm.test('Mensaje de error', () => {",
          "    const json = pm.response.json();",
          "    pm.expect(json.message).to.include('registrado');",
          "});"
        ]
      ),
      createRequest(
        "Registro Datos Incompletos",
        "POST",
        "/auth/register",
        {
          nombre: "Test",
          email: "test@example.com"
        },
        false,
        [
          "pm.test('Status 400', () => pm.response.to.have.status(400));",
          "pm.test('Mensaje incompleto', () => {",
          "    const json = pm.response.json();",
          "    pm.expect(json.message.toLowerCase()).to.include('incompleto');",
          "});"
        ]
      ),
      createRequest(
        "Login Exitoso",
        "POST",
        "/auth/login",
        {
          email: "{{testEmail}}",
          password: "{{testPassword}}"
        },
        false,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));",
          "pm.test('Retorna token', () => {",
          "    const json = pm.response.json();",
          "    pm.expect(json).to.have.property('token');",
          "    pm.expect(json).to.have.property('user');",
          "});",
          "pm.test('Token es JWT', () => {",
          "    const json = pm.response.json();",
          "    pm.expect(json.token).to.match(/^[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+\\.[A-Za-z0-9-_]+$/);",
          "});",
          "const json = pm.response.json();",
          "pm.collectionVariables.set('authToken', json.token);",
          "pm.environment.set('authToken', json.token);"
        ]
      ),
      createRequest(
        "Login Password Incorrecta",
        "POST",
        "/auth/login",
        {
          email: "{{testEmail}}",
          password: "PasswordIncorrecta123!"
        },
        false,
        [
          "pm.test('Status 401', () => pm.response.to.have.status(401));",
          "pm.test('Mensaje credenciales inválidas', () => {",
          "    const json = pm.response.json();",
          "    pm.expect(json.message).to.include('Credenciales inválidas');",
          "});"
        ]
      )
    ]),

    // ============================================
    // ZONAS
    // ============================================
    createFolder("2. Zonas", [
      createRequest(
        "Obtener Todas las Zonas",
        "GET",
        "/zonas",
        null,
        false,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));",
          "pm.test('Retorna array', () => pm.expect(pm.response.json()).to.be.an('array'));",
          "if (pm.response.json().length > 0) {",
          "    pm.collectionVariables.set('testZonaId', pm.response.json()[0].zona_id);",
          "}"
        ]
      ),
      createRequest(
        "Obtener Zona por ID",
        "GET",
        "/zonas/1",
        null,
        false,
        [
          "pm.test('Status 200 o 404', () => {",
          "    pm.expect([200, 404]).to.include(pm.response.code);",
          "});"
        ]
      ),
      createRequest(
        "Crear Zona",
        "POST",
        "/zonas",
        {
          nombre: `Zona Test ${Date.now()}`,
          codigo: `TEST_${Date.now()}`,
          latitud: -17.8146,
          longitud: -63.1561,
          descripcion: "Zona de prueba",
          activa: true
        },
        true,
        [
          "pm.test('Status 201', () => pm.response.to.have.status(201));",
          "pm.test('Retorna zona_id', () => {",
          "    const json = pm.response.json();",
          "    if (json.zona_id) {",
          "        pm.collectionVariables.set('createdZonaId', json.zona_id);",
          "    }",
          "});"
        ]
      ),
      createRequest(
        "Actualizar Zona",
        "PUT",
        "/zonas/{{createdZonaId}}",
        {
          descripcion: "Descripción actualizada"
        },
        true,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));"
        ]
      ),
      createRequest(
        "Eliminar Zona",
        "DELETE",
        "/zonas/{{createdZonaId}}",
        null,
        true,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));"
        ]
      )
    ]),

    // ============================================
    // MEDICIONES
    // ============================================
    createFolder("3. Mediciones", [
      createRequest(
        "Obtener Todas las Mediciones",
        "GET",
        "/mediciones",
        null,
        false,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));",
          "pm.test('Retorna array', () => pm.expect(pm.response.json()).to.be.an('array'));"
        ]
      ),
      createRequest(
        "Obtener Mediciones con Filtros",
        "GET",
        "/mediciones?zona_id=1&limit=10",
        null,
        false,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));"
        ]
      ),
      createRequest(
        "Obtener Medición por ID",
        "GET",
        "/mediciones/1",
        null,
        false,
        [
          "pm.test('Status 200 o 404', () => {",
          "    pm.expect([200, 404]).to.include(pm.response.code);",
          "});"
        ]
      ),
      createRequest(
        "Crear Medición",
        "POST",
        "/mediciones",
        {
          zona_id: "{{testZonaId}}",
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
        },
        true,
        [
          "pm.test('Status 201', () => pm.response.to.have.status(201));",
          "pm.test('Retorna medicion_id', () => {",
          "    const json = pm.response.json();",
          "    if (json.medicion_id) {",
          "        pm.collectionVariables.set('createdMedicionId', json.medicion_id);",
          "    }",
          "});"
        ]
      ),
      createRequest(
        "Actualizar Medición",
        "PUT",
        "/mediciones/{{createdMedicionId}}",
        {
          pm25: 30.0
        },
        true,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));"
        ]
      ),
      createRequest(
        "Eliminar Medición",
        "DELETE",
        "/mediciones/{{createdMedicionId}}",
        null,
        true,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));"
        ]
      )
    ]),

    // ============================================
    // WORKFLOWS
    // ============================================
    createFolder("4. Workflows", [
      createRequest(
        "Obtener Todos los Workflows",
        "GET",
        "/workflows",
        null,
        false,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));",
          "pm.test('Retorna array', () => pm.expect(pm.response.json()).to.be.an('array'));"
        ]
      ),
      createRequest(
        "Obtener Workflow por ID",
        "GET",
        "/workflows/1",
        null,
        false,
        [
          "pm.test('Status 200 o 404', () => {",
          "    pm.expect([200, 404]).to.include(pm.response.code);",
          "});"
        ]
      ),
      createRequest(
        "Obtener Usuarios con PM2.5 Workflows",
        "GET",
        "/workflows/pm2/users",
        null,
        false,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));",
          "pm.test('Retorna total y usuarios', () => {",
          "    const json = pm.response.json();",
          "    pm.expect(json).to.have.property('total');",
          "    pm.expect(json).to.have.property('usuarios');",
          "});"
        ]
      ),
      createRequest(
        "Obtener Logs de Workflow",
        "GET",
        "/workflows/1/logs",
        null,
        false,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));",
          "pm.test('Retorna array', () => pm.expect(pm.response.json()).to.be.an('array'));"
        ]
      ),
      createRequest(
        "Crear Workflow",
        "POST",
        "/workflows",
        {
          codigo: `WF-TEST-${Date.now()}`,
          nombre: "Workflow de Prueba",
          tipo: "Alerta",
          estado: "Habilitado",
          disparador: "Medición PM2.5 > 40",
          condicion: "pm25 > 40",
          acciones: ["Enviar email", "Notificar usuario"],
          etiquetas: ["aire", "pm25"],
          activo: true
        },
        true,
        [
          "pm.test('Status 201', () => pm.response.to.have.status(201));",
          "pm.test('Retorna workflow_id', () => {",
          "    const json = pm.response.json();",
          "    if (json.workflow_id) {",
          "        pm.collectionVariables.set('createdWorkflowId', json.workflow_id);",
          "    }",
          "});"
        ]
      ),
      createRequest(
        "Actualizar Workflow",
        "PUT",
        "/workflows/{{createdWorkflowId}}",
        {
          nombre: "Workflow Actualizado"
        },
        true,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));"
        ]
      ),
      createRequest(
        "Eliminar Workflow",
        "DELETE",
        "/workflows/{{createdWorkflowId}}",
        null,
        true,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));"
        ]
      )
    ]),

    // ============================================
    // OPEN-METEO
    // ============================================
    createFolder("5. Open-Meteo", [
      createRequest(
        "Status Open-Meteo",
        "GET",
        "/open-meteo/status",
        null,
        false,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));"
        ]
      ),
      createRequest(
        "Sincronizar Open-Meteo (GET)",
        "GET",
        "/open-meteo/sync",
        null,
        false,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));",
          "pm.test('Retorna resultados', () => {",
          "    const json = pm.response.json();",
          "    pm.expect(json).to.have.property('total_zonas');",
          "});"
        ]
      ),
      createRequest(
        "Sincronizar Open-Meteo (POST)",
        "POST",
        "/open-meteo/sync",
        null,
        false,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));"
        ]
      ),
      createRequest(
        "Sincronizar Zona Específica",
        "POST",
        "/open-meteo/sync/1",
        null,
        false,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));"
        ]
      ),
      createRequest(
        "Obtener Datos Realtime",
        "GET",
        "/open-meteo/realtime",
        null,
        false,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));",
          "pm.test('Retorna array', () => pm.expect(pm.response.json()).to.be.an('array'));"
        ]
      ),
      createRequest(
        "Obtener Datos Realtime por Zona",
        "GET",
        "/open-meteo/realtime/1",
        null,
        false,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));"
        ]
      )
    ]),

    // ============================================
    // REGLAS DE ALERTAS
    // ============================================
    createFolder("6. Reglas de Alertas", [
      createRequest(
        "Obtener Todas las Reglas",
        "GET",
        "/reglas-alertas",
        null,
        true,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));",
          "pm.test('Retorna array', () => pm.expect(pm.response.json()).to.be.an('array'));"
        ]
      ),
      createRequest(
        "Obtener Regla por ID",
        "GET",
        "/reglas-alertas/1",
        null,
        true,
        [
          "pm.test('Status 200 o 404', () => {",
          "    pm.expect([200, 404]).to.include(pm.response.code);",
          "});"
        ]
      ),
      createRequest(
        "Crear Regla de Alerta",
        "POST",
        "/reglas-alertas",
        {
          usuario_id: "{{testUserId}}",
          nombre: "PM2.5 Crítico",
          metrica: "PM2.5",
          umbral: 40.0,
          operador: ">=",
          severidad: "critical",
          activa: true,
          zonas_aplicables: [1],
          descripcion: "Alerta cuando PM2.5 supera 40 μg/m³"
        },
        true,
        [
          "pm.test('Status 201', () => pm.response.to.have.status(201));",
          "pm.test('Retorna regla_id', () => {",
          "    const json = pm.response.json();",
          "    if (json.regla_id) {",
          "        pm.collectionVariables.set('createdReglaId', json.regla_id);",
          "    }",
          "});"
        ]
      ),
      createRequest(
        "Actualizar Regla de Alerta",
        "PUT",
        "/reglas-alertas/{{createdReglaId}}",
        {
          umbral: 45.0
        },
        true,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));"
        ]
      ),
      createRequest(
        "Eliminar Regla de Alerta",
        "DELETE",
        "/reglas-alertas/{{createdReglaId}}",
        null,
        true,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));"
        ]
      )
    ]),

    // ============================================
    // ALERTAS
    // ============================================
    createFolder("7. Alertas", [
      createRequest(
        "Obtener Todas las Alertas",
        "GET",
        "/alertas",
        null,
        true,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));",
          "pm.test('Retorna array', () => pm.expect(pm.response.json()).to.be.an('array'));"
        ]
      ),
      createRequest(
        "Obtener Alerta por ID",
        "GET",
        "/alertas/1",
        null,
        true,
        [
          "pm.test('Status 200 o 404', () => {",
          "    pm.expect([200, 404]).to.include(pm.response.code);",
          "});"
        ]
      ),
      createRequest(
        "Crear Alerta",
        "POST",
        "/alertas",
        {
          usuario_id: "{{testUserId}}",
          zona_id: "{{testZonaId}}",
          titulo: "Alerta de Prueba",
          mensaje: "Esta es una alerta de prueba",
          severidad: "critical",
          estado: "open",
          fuente: "api",
          metrica: "PM2.5",
          valor_medido: 45.5,
          umbral: 40.0
        },
        true,
        [
          "pm.test('Status 201', () => pm.response.to.have.status(201));",
          "pm.test('Retorna alerta_id', () => {",
          "    const json = pm.response.json();",
          "    if (json.alerta_id) {",
          "        pm.collectionVariables.set('createdAlertaId', json.alerta_id);",
          "    }",
          "});"
        ]
      ),
      createRequest(
        "Actualizar Alerta",
        "PUT",
        "/alertas/{{createdAlertaId}}",
        {
          estado: "ack",
          observaciones: "Alerta reconocida"
        },
        true,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));"
        ]
      ),
      createRequest(
        "Eliminar Alerta",
        "DELETE",
        "/alertas/{{createdAlertaId}}",
        null,
        true,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));"
        ]
      )
    ]),

    // ============================================
    // USUARIO-WORKFLOWS
    // ============================================
    createFolder("8. Usuario-Workflows", [
      createRequest(
        "Obtener Todas las Relaciones",
        "GET",
        "/usuario-workflows",
        null,
        true,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));",
          "pm.test('Retorna array', () => pm.expect(pm.response.json()).to.be.an('array'));"
        ]
      ),
      createRequest(
        "Obtener Relación por ID",
        "GET",
        "/usuario-workflows/1",
        null,
        true,
        [
          "pm.test('Status 200 o 404', () => {",
          "    pm.expect([200, 404]).to.include(pm.response.code);",
          "});"
        ]
      ),
      createRequest(
        "Crear Relación Usuario-Workflow",
        "POST",
        "/usuario-workflows",
        {
          usuario_id: "{{testUserId}}",
          workflow_id: 1,
          activo: true
        },
        true,
        [
          "pm.test('Status 201', () => pm.response.to.have.status(201));",
          "pm.test('Retorna usuario_workflow_id', () => {",
          "    const json = pm.response.json();",
          "    if (json.usuario_workflow_id) {",
          "        pm.collectionVariables.set('createdUsuarioWorkflowId', json.usuario_workflow_id);",
          "    }",
          "});"
        ]
      ),
      createRequest(
        "Actualizar Relación",
        "PUT",
        "/usuario-workflows/{{createdUsuarioWorkflowId}}",
        {
          activo: false
        },
        true,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));"
        ]
      ),
      createRequest(
        "Eliminar Relación",
        "DELETE",
        "/usuario-workflows/{{createdUsuarioWorkflowId}}",
        null,
        true,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));"
        ]
      )
    ]),

    // ============================================
    // LOGS WORKFLOWS
    // ============================================
    createFolder("9. Logs de Workflows", [
      createRequest(
        "Obtener Todos los Logs",
        "GET",
        "/logs-workflows",
        null,
        false,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));",
          "pm.test('Retorna array', () => pm.expect(pm.response.json()).to.be.an('array'));"
        ]
      ),
      createRequest(
        "Obtener Log por ID",
        "GET",
        "/logs-workflows/1",
        null,
        false,
        [
          "pm.test('Status 200 o 404', () => {",
          "    pm.expect([200, 404]).to.include(pm.response.code);",
          "});"
        ]
      ),
      createRequest(
        "Crear Log de Workflow",
        "POST",
        "/logs-workflows",
        {
          workflow_id: 1,
          nivel: "INFO",
          mensaje: "Workflow ejecutado correctamente",
          duracion_ms: 150,
          exito: true
        },
        true,
        [
          "pm.test('Status 201', () => pm.response.to.have.status(201));",
          "pm.test('Retorna log_id', () => {",
          "    const json = pm.response.json();",
          "    if (json.log_id) {",
          "        pm.collectionVariables.set('createdLogId', json.log_id);",
          "    }",
          "});"
        ]
      ),
      createRequest(
        "Eliminar Log",
        "DELETE",
        "/logs-workflows/{{createdLogId}}",
        null,
        true,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));"
        ]
      )
    ]),

    // ============================================
    // REPORTES
    // ============================================
    createFolder("10. Reportes", [
      createRequest(
        "Obtener Todos los Reportes",
        "GET",
        "/reportes",
        null,
        true,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));",
          "pm.test('Retorna array', () => pm.expect(pm.response.json()).to.be.an('array'));"
        ]
      ),
      createRequest(
        "Obtener Reporte por ID",
        "GET",
        "/reportes/1",
        null,
        true,
        [
          "pm.test('Status 200 o 404', () => {",
          "    pm.expect([200, 404]).to.include(pm.response.code);",
          "});"
        ]
      ),
      createRequest(
        "Crear Reporte",
        "POST",
        "/reportes",
        {
          zona_id: "{{testZonaId}}",
          usuario_creo: "{{testUserId}}",
          fecha_inicio: "2024-01-01",
          fecha_fin: "2024-01-31",
          riesgo: "Medio",
          estado: "Pendiente",
          destinatario: "admin@example.com",
          resumen: "Reporte mensual de calidad del aire"
        },
        true,
        [
          "pm.test('Status 201', () => pm.response.to.have.status(201));",
          "pm.test('Retorna reporte_id', () => {",
          "    const json = pm.response.json();",
          "    if (json.reporte_id) {",
          "        pm.collectionVariables.set('createdReporteId', json.reporte_id);",
          "    }",
          "});"
        ]
      ),
      createRequest(
        "Actualizar Reporte",
        "PUT",
        "/reportes/{{createdReporteId}}",
        {
          estado: "Enviado",
          resumen: "Resumen actualizado"
        },
        true,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));"
        ]
      ),
      createRequest(
        "Eliminar Reporte",
        "DELETE",
        "/reportes/{{createdReporteId}}",
        null,
        true,
        [
          "pm.test('Status 200', () => pm.response.to.have.status(200));"
        ]
      )
    ])
  ],
  variable: [
    {
      key: "testEmail",
      value: ""
    },
    {
      key: "testName",
      value: ""
    },
    {
      key: "testPassword",
      value: ""
    },
    {
      key: "authToken",
      value: ""
    },
    {
      key: "testUserId",
      value: ""
    },
    {
      key: "testZonaId",
      value: "1"
    },
    {
      key: "createdZonaId",
      value: ""
    },
    {
      key: "createdMedicionId",
      value: ""
    },
    {
      key: "createdWorkflowId",
      value: ""
    },
    {
      key: "createdReglaId",
      value: ""
    },
    {
      key: "createdAlertaId",
      value: ""
    },
    {
      key: "createdUsuarioWorkflowId",
      value: ""
    },
    {
      key: "createdLogId",
      value: ""
    },
    {
      key: "createdReporteId",
      value: ""
    }
  ]
};

// Guardar colección
const outputPath = path.join(__dirname, 'API_Proyecto_Urbano_Complete.postman_collection.json');
fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2));
console.log(`✅ Colección generada: ${outputPath}`);
console.log(`📊 Total de endpoints: ${countEndpoints(collection)}`);

function countEndpoints(collection) {
  let count = 0;
  function countItems(items) {
    items.forEach(item => {
      if (item.item) {
        countItems(item.item);
      } else {
        count++;
      }
    });
  }
  countItems(collection.item);
  return count;
}

