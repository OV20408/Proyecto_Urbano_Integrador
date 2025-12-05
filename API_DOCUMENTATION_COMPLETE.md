# Documentación Completa de la API - Proyecto Urbano Integrador

## 📋 Tabla de Contenidos

1. [Información General](#información-general)
2. [Autenticación](#autenticación)
3. [Zonas](#zonas)
4. [Mediciones de Aire](#mediciones-de-aire)
5. [Workflows](#workflows)
6. [Reglas de Alertas](#reglas-de-alertas)
7. [Alertas](#alertas)
8. [Usuario-Workflows](#usuario-workflows)
9. [Logs de Workflows](#logs-de-workflows)
10. [Reportes](#reportes)
11. [Open-Meteo Integration](#open-meteo-integration)
12. [Códigos de Estado HTTP](#códigos-de-estado-http)
13. [Manejo de Errores](#manejo-de-errores)

---

## Información General

### Base URL
```
http://localhost:3001/api
```

### Formato de Respuesta
Todas las respuestas están en formato JSON.

### Autenticación
La mayoría de los endpoints requieren autenticación mediante JWT. Incluir el token en el header:
```
Authorization: Bearer <token>
```

---

## Autenticación

### POST /api/auth/register
Registra un nuevo usuario en el sistema.

**Autenticación:** No requerida

**Request Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response 201 (Success):**
```json
{
  "message": "Usuario registrado correctamente",
  "user": {
    "usuario_id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

**Response 400 (Bad Request):**
```json
{
  "message": "Datos incompletos"
}
```

**Response 409 (Conflict):**
```json
{
  "message": "Email ya registrado"
}
```

---

### POST /api/auth/login
Inicia sesión y obtiene un token JWT.

**Autenticación:** No requerida

**Request Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response 200 (Success):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "usuario_id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

**Response 401 (Unauthorized):**
```json
{
  "message": "Credenciales inválidas"
}
```

---

### GET /api/auth/health
Verifica el estado del servicio de autenticación.

**Autenticación:** No requerida

**Response 200 (Success):**
```json
{
  "ok": true,
  "service": "auth",
  "ts": 1701234567890
}
```

---

## Zonas

### GET /api/zonas
Obtiene todas las zonas registradas.

**Autenticación:** Opcional

**Query Parameters:**
- `activa` (boolean): Filtrar por zonas activas/inactivas

**Response 200 (Success):**
```json
[
  {
    "zona_id": 1,
    "nombre": "Centro",
    "codigo": "CENTRO",
    "latitud": "-17.8146",
    "longitud": "-63.1561",
    "descripcion": "Zona céntrica",
    "activa": true,
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z"
  }
]
```

---

### GET /api/zonas/:id
Obtiene una zona específica por ID.

**Autenticación:** Opcional

**Response 200 (Success):**
```json
{
  "zona_id": 1,
  "nombre": "Centro",
  "codigo": "CENTRO",
  "latitud": "-17.8146",
  "longitud": "-63.1561",
  "descripcion": "Zona céntrica",
  "activa": true,
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:00:00.000Z"
}
```

**Response 404 (Not Found):**
```json
{
  "message": "Zona no encontrada"
}
```

---

### POST /api/zonas
Crea una nueva zona.

**Autenticación:** Requerida

**Request Body:**
```json
{
  "nombre": "Nueva Zona",
  "codigo": "NUEVA",
  "latitud": -17.8146,
  "longitud": -63.1561,
  "descripcion": "Descripción de la zona",
  "activa": true
}
```

**Response 201 (Success):**
```json
{
  "zona_id": 9,
  "nombre": "Nueva Zona",
  "codigo": "NUEVA",
  "latitud": "-17.8146",
  "longitud": "-63.1561",
  "descripcion": "Descripción de la zona",
  "activa": true,
  "created_at": "2024-01-15T10:00:00.000Z",
  "updated_at": "2024-01-15T10:00:00.000Z"
}
```

---

### PUT /api/zonas/:id
Actualiza una zona existente.

**Autenticación:** Requerida

**Request Body:**
```json
{
  "nombre": "Zona Actualizada",
  "descripcion": "Nueva descripción"
}
```

**Response 200 (Success):**
```json
{
  "message": "Zona actualizada correctamente",
  "zona": {
    "zona_id": 1,
    "nombre": "Zona Actualizada",
    "codigo": "CENTRO",
    "latitud": "-17.8146",
    "longitud": "-63.1561",
    "descripcion": "Nueva descripción",
    "activa": true
  }
}
```

---

### DELETE /api/zonas/:id
Elimina una zona.

**Autenticación:** Requerida

**Response 200 (Success):**
```json
{
  "message": "Zona eliminada correctamente"
}
```

---

## Mediciones de Aire

### GET /api/mediciones
Obtiene todas las mediciones de calidad del aire.

**Autenticación:** Opcional

**Query Parameters:**
- `zona_id` (integer): Filtrar por zona
- `fecha_inicio` (ISO date): Fecha de inicio
- `fecha_fin` (ISO date): Fecha de fin
- `limit` (integer, default: 100): Límite de resultados

**Response 200 (Success):**
```json
[
  {
    "medicion_id": 1,
    "zona_id": 1,
    "fecha_hora": "2024-01-15T10:00:00.000Z",
    "pm25": 25.5,
    "pm10": 45.2,
    "no2": 30.1,
    "temperatura": 28.5,
    "humedad_relativa": 65.0,
    "precipitacion": 0.0,
    "presion_superficial": 1013.25,
    "velocidad_viento": 5.2,
    "direccion_viento": 180,
    "zona": {
      "zona_id": 1,
      "nombre": "Centro",
      "codigo": "CENTRO"
    }
  }
]
```

---

### GET /api/mediciones/:id
Obtiene una medición específica por ID.

**Autenticación:** Opcional

**Response 200 (Success):**
```json
{
  "medicion_id": 1,
  "zona_id": 1,
  "fecha_hora": "2024-01-15T10:00:00.000Z",
  "pm25": 25.5,
  "pm10": 45.2,
  "no2": 30.1,
  "temperatura": 28.5,
  "humedad_relativa": 65.0,
  "precipitacion": 0.0,
  "presion_superficial": 1013.25,
  "velocidad_viento": 5.2,
  "direccion_viento": 180,
  "zona": {
    "zona_id": 1,
    "nombre": "Centro",
    "codigo": "CENTRO"
  }
}
```

---

### POST /api/mediciones
Crea una nueva medición.

**Autenticación:** Requerida

**Request Body:**
```json
{
  "zona_id": 1,
  "fecha_hora": "2024-01-15T10:00:00Z",
  "pm25": 25.5,
  "pm10": 45.2,
  "no2": 30.1,
  "temperatura": 28.5,
  "humedad_relativa": 65.0,
  "precipitacion": 0.0,
  "presion_superficial": 1013.25,
  "velocidad_viento": 5.2,
  "direccion_viento": 180
}
```

**Response 201 (Success):**
```json
{
  "medicion_id": 123,
  "zona_id": 1,
  "fecha_hora": "2024-01-15T10:00:00.000Z",
  "pm25": 25.5,
  "pm10": 45.2,
  "no2": 30.1,
  "temperatura": 28.5,
  "humedad_relativa": 65.0,
  "precipitacion": 0.0,
  "presion_superficial": 1013.25,
  "velocidad_viento": 5.2,
  "direccion_viento": 180
}
```

---

### PUT /api/mediciones/:id
Actualiza una medición existente.

**Autenticación:** Requerida

**Request Body:**
```json
{
  "pm25": 30.0,
  "pm10": 50.0
}
```

**Response 200 (Success):**
```json
{
  "message": "Medición actualizada correctamente",
  "medicion": {
    "medicion_id": 1,
    "pm25": 30.0,
    "pm10": 50.0
  }
}
```

---

### DELETE /api/mediciones/:id
Elimina una medición.

**Autenticación:** Requerida

**Response 200 (Success):**
```json
{
  "message": "Medición eliminada correctamente"
}
```

---

## Workflows

### GET /api/workflows
Obtiene todos los workflows.

**Autenticación:** Opcional

**Query Parameters:**
- `tipo` (string): Filtrar por tipo
- `estado` (string): Filtrar por estado
- `activo` (boolean): Filtrar por activo/inactivo

**Response 200 (Success):**
```json
[
  {
    "workflow_id": 1,
    "codigo": "WF-001",
    "nombre": "Alerta PM2.5",
    "tipo": "Alerta",
    "estado": "Habilitado",
    "disparador": "Medición PM2.5 > 40",
    "condicion": "pm25 > 40",
    "acciones": ["Enviar email", "Notificar usuario"],
    "etiquetas": ["aire", "pm25"],
    "activo": true,
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z"
  }
]
```

---

### GET /api/workflows/:id
Obtiene un workflow específico por ID.

**Autenticación:** Opcional

**Response 200 (Success):**
```json
{
  "workflow_id": 1,
  "codigo": "WF-001",
  "nombre": "Alerta PM2.5",
  "tipo": "Alerta",
  "estado": "Habilitado",
  "disparador": "Medición PM2.5 > 40",
  "condicion": "pm25 > 40",
  "acciones": ["Enviar email", "Notificar usuario"],
  "etiquetas": ["aire", "pm25"],
  "activo": true
}
```

---

### GET /api/workflows/pm2/users
Obtiene usuarios con workflows relacionados con PM2.5 y sus umbrales máximos.

**Autenticación:** Opcional

**Response 200 (Success):**
```json
{
  "total": 2,
  "usuarios": [
    {
      "usuario_id": 1,
      "umbral_maximo": 40.0
    },
    {
      "usuario_id": 3,
      "umbral_maximo": 35.0
    }
  ]
}
```

---

### GET /api/workflows/:id/logs
Obtiene los logs de un workflow específico.

**Autenticación:** Opcional

**Query Parameters:**
- `nivel` (string): Filtrar por nivel de log
- `limit` (integer, default: 100): Límite de resultados

**Response 200 (Success):**
```json
[
  {
    "log_id": 1,
    "workflow_id": 1,
    "nivel": "INFO",
    "mensaje": "Workflow ejecutado correctamente",
    "duracion_ms": 150,
    "exito": true,
    "created_at": "2024-01-15T10:00:00.000Z"
  }
]
```

---

### POST /api/workflows
Crea un nuevo workflow.

**Autenticación:** Requerida

**Request Body:**
```json
{
  "codigo": "WF-002",
  "nombre": "Alerta PM10",
  "tipo": "Alerta",
  "estado": "Habilitado",
  "disparador": "Medición PM10 > 50",
  "condicion": "pm10 > 50",
  "acciones": ["Enviar email"],
  "etiquetas": ["aire", "pm10"],
  "activo": true
}
```

**Response 201 (Success):**
```json
{
  "workflow_id": 2,
  "codigo": "WF-002",
  "nombre": "Alerta PM10",
  "tipo": "Alerta",
  "estado": "Habilitado",
  "disparador": "Medición PM10 > 50",
  "condicion": "pm10 > 50",
  "acciones": ["Enviar email"],
  "etiquetas": ["aire", "pm10"],
  "activo": true
}
```

---

### PUT /api/workflows/:id
Actualiza un workflow existente.

**Autenticación:** Requerida

**Request Body:**
```json
{
  "nombre": "Alerta PM10 Actualizada",
  "activo": false
}
```

**Response 200 (Success):**
```json
{
  "message": "Workflow actualizado correctamente",
  "workflow": {
    "workflow_id": 1,
    "nombre": "Alerta PM10 Actualizada",
    "activo": false
  }
}
```

---

### DELETE /api/workflows/:id
Elimina un workflow.

**Autenticación:** Requerida

**Response 200 (Success):**
```json
{
  "message": "Workflow eliminado correctamente"
}
```

---

## Reglas de Alertas

### GET /api/reglas-alertas
Obtiene todas las reglas de alertas.

**Autenticación:** Requerida

**Query Parameters:**
- `usuario_id` (integer): Filtrar por usuario
- `activa` (boolean): Filtrar por activa/inactiva

**Response 200 (Success):**
```json
[
  {
    "regla_id": 1,
    "usuario_id": 1,
    "nombre": "PM2.5 Crítico",
    "metrica": "PM2.5",
    "umbral": 40.0,
    "operador": ">=",
    "severidad": "critical",
    "activa": true,
    "zonas_aplicables": [1, 2, 3],
    "descripcion": "Alerta cuando PM2.5 supera 40 μg/m³"
  }
]
```

---

### GET /api/reglas-alertas/:id
Obtiene una regla de alerta específica por ID.

**Autenticación:** Requerida

**Response 200 (Success):**
```json
{
  "regla_id": 1,
  "usuario_id": 1,
  "nombre": "PM2.5 Crítico",
  "metrica": "PM2.5",
  "umbral": 40.0,
  "operador": ">=",
  "severidad": "critical",
  "activa": true,
  "zonas_aplicables": [1, 2, 3],
  "descripcion": "Alerta cuando PM2.5 supera 40 μg/m³"
}
```

---

### POST /api/reglas-alertas
Crea una nueva regla de alerta.

**Autenticación:** Requerida

**Request Body:**
```json
{
  "usuario_id": 1,
  "nombre": "PM2.5 Crítico",
  "metrica": "PM2.5",
  "umbral": 40.0,
  "operador": ">=",
  "severidad": "critical",
  "activa": true,
  "zonas_aplicables": [1, 2, 3],
  "descripcion": "Alerta cuando PM2.5 supera 40 μg/m³"
}
```

**Response 201 (Success):**
```json
{
  "regla_id": 2,
  "usuario_id": 1,
  "nombre": "PM2.5 Crítico",
  "metrica": "PM2.5",
  "umbral": 40.0,
  "operador": ">=",
  "severidad": "critical",
  "activa": true,
  "zonas_aplicables": [1, 2, 3],
  "descripcion": "Alerta cuando PM2.5 supera 40 μg/m³"
}
```

---

### PUT /api/reglas-alertas/:id
Actualiza una regla de alerta existente.

**Autenticación:** Requerida

**Request Body:**
```json
{
  "umbral": 45.0,
  "activa": false
}
```

**Response 200 (Success):**
```json
{
  "message": "Regla de alerta actualizada correctamente",
  "regla": {
    "regla_id": 1,
    "umbral": 45.0,
    "activa": false
  }
}
```

---

### DELETE /api/reglas-alertas/:id
Elimina una regla de alerta.

**Autenticación:** Requerida

**Response 200 (Success):**
```json
{
  "message": "Regla de alerta eliminada correctamente"
}
```

---

## Alertas

### GET /api/alertas/all
Obtiene TODAS las alertas sin filtros.

**Autenticación:** Requerida

**Query Parameters:**
- `limit` (integer, default: 1000): Límite de resultados

**Descripción:** Este endpoint devuelve todas las alertas del sistema sin aplicar ningún filtro. Útil para administradores o reportes generales.

**Response 200 (Success):**
```json
{
  "success": true,
  "total": 150,
  "data": [
    {
      "alerta_id": 1,
      "usuario_id": 1,
      "zona_id": 1,
      "regla_id": 1,
      "medicion_id": 1,
      "titulo": "Alerta PM2.5 Crítico",
      "mensaje": "El PM2.5 ha superado el umbral",
      "severidad": "critical",
      "estado": "open",
      "fuente": "api",
      "metrica": "PM2.5",
      "valor_medido": 45.5,
      "umbral": 40.0,
      "fecha_creacion": "2024-01-15T10:00:00.000Z",
      "usuario": {
        "usuario_id": 1,
        "nombre": "Juan Pérez",
        "email": "juan@example.com"
      },
      "zona": {
        "zona_id": 1,
        "nombre": "Centro",
        "codigo": "CENTRO"
      }
    }
  ]
}
```

---

### GET /api/alertas/mis-alertas
Obtiene las alertas del usuario autenticado.

**Autenticación:** Requerida

**Query Parameters:**
- `zona_id` (integer): Filtrar por zona
- `estado` (string): Filtrar por estado (open, ack, resolved, muted)
- `severidad` (string): Filtrar por severidad
- `fuente` (string): Filtrar por fuente
- `limit` (integer, default: 100): Límite de resultados

**Descripción:** Este endpoint filtra automáticamente las alertas por el usuario que está autenticado (obtenido del token JWT). No es necesario pasar `usuario_id` como parámetro.

**Response 200 (Success):**
```json
{
  "success": true,
  "usuario_id": 1,
  "total": 25,
  "data": [
    {
      "alerta_id": 1,
      "usuario_id": 1,
      "zona_id": 1,
      "regla_id": 1,
      "medicion_id": 1,
      "titulo": "Alerta PM2.5 Crítico",
      "mensaje": "El PM2.5 ha superado el umbral",
      "severidad": "critical",
      "estado": "open",
      "fuente": "api",
      "metrica": "PM2.5",
      "valor_medido": 45.5,
      "umbral": 40.0,
      "fecha_creacion": "2024-01-15T10:00:00.000Z",
      "usuario": {
        "usuario_id": 1,
        "nombre": "Juan Pérez",
        "email": "juan@example.com"
      },
      "zona": {
        "zona_id": 1,
        "nombre": "Centro",
        "codigo": "CENTRO"
      }
    }
  ]
}
```

**Response 401 (Unauthorized):**
```json
{
  "message": "Usuario no autenticado"
}
```

---

### GET /api/alertas
Obtiene todas las alertas (con filtros opcionales).

**Autenticación:** Requerida

**Query Parameters:**
- `usuario_id` (integer): Filtrar por usuario
- `zona_id` (integer): Filtrar por zona
- `estado` (string): Filtrar por estado (open, ack, resolved, muted)
- `severidad` (string): Filtrar por severidad
- `fuente` (string): Filtrar por fuente
- `limit` (integer, default: 100): Límite de resultados

**Response 200 (Success):**
```json
[
  {
    "alerta_id": 1,
    "usuario_id": 1,
    "zona_id": 1,
    "regla_id": 1,
    "medicion_id": 1,
    "titulo": "Alerta PM2.5 Crítico",
    "mensaje": "El PM2.5 ha superado el umbral",
    "severidad": "critical",
    "estado": "open",
    "fuente": "api",
    "metrica": "PM2.5",
    "valor_medido": 45.5,
    "umbral": 40.0,
    "created_at": "2024-01-15T10:00:00.000Z"
  }
]
```

---

### GET /api/alertas/:id
Obtiene una alerta específica por ID.

**Autenticación:** Requerida

**Response 200 (Success):**
```json
{
  "alerta_id": 1,
  "usuario_id": 1,
  "zona_id": 1,
  "regla_id": 1,
  "medicion_id": 1,
  "titulo": "Alerta PM2.5 Crítico",
  "mensaje": "El PM2.5 ha superado el umbral",
  "severidad": "critical",
  "estado": "open",
  "fuente": "api",
  "metrica": "PM2.5",
  "valor_medido": 45.5,
  "umbral": 40.0
}
```

---

### POST /api/alertas
Crea una nueva alerta.

**Autenticación:** Requerida

**Request Body:**
```json
{
  "usuario_id": 1,
  "zona_id": 1,
  "regla_id": 1,
  "medicion_id": 1,
  "titulo": "Alerta PM2.5 Crítico",
  "mensaje": "El PM2.5 ha superado el umbral",
  "severidad": "critical",
  "estado": "open",
  "fuente": "api",
  "metrica": "PM2.5",
  "valor_medido": 45.5,
  "umbral": 40.0
}
```

**Response 201 (Success):**
```json
{
  "alerta_id": 2,
  "usuario_id": 1,
  "zona_id": 1,
  "regla_id": 1,
  "medicion_id": 1,
  "titulo": "Alerta PM2.5 Crítico",
  "mensaje": "El PM2.5 ha superado el umbral",
  "severidad": "critical",
  "estado": "open",
  "fuente": "api",
  "metrica": "PM2.5",
  "valor_medido": 45.5,
  "umbral": 40.0
}
```

---

### PUT /api/alertas/:id
Actualiza una alerta (principalmente estado).

**Autenticación:** Requerida

**Request Body:**
```json
{
  "estado": "ack",
  "observaciones": "Alerta reconocida"
}
```

**Response 200 (Success):**
```json
{
  "message": "Alerta actualizada correctamente",
  "alerta": {
    "alerta_id": 1,
    "estado": "ack",
    "observaciones": "Alerta reconocida"
  }
}
```

---

### DELETE /api/alertas/:id
Elimina una alerta.

**Autenticación:** Requerida

**Response 200 (Success):**
```json
{
  "message": "Alerta eliminada correctamente"
}
```

---

## Usuario-Workflows

### GET /api/usuario-workflows
Obtiene todas las relaciones usuario-workflow.

**Autenticación:** Requerida

**Query Parameters:**
- `usuario_id` (integer): Filtrar por usuario
- `workflow_id` (integer): Filtrar por workflow
- `activo` (boolean): Filtrar por activo/inactivo

**Response 200 (Success):**
```json
[
  {
    "usuario_workflow_id": 1,
    "usuario_id": 1,
    "workflow_id": 1,
    "activo": true,
    "created_at": "2024-01-15T10:00:00.000Z"
  }
]
```

---

### GET /api/usuario-workflows/:id
Obtiene una relación usuario-workflow específica por ID.

**Autenticación:** Requerida

**Response 200 (Success):**
```json
{
  "usuario_workflow_id": 1,
  "usuario_id": 1,
  "workflow_id": 1,
  "activo": true
}
```

---

### POST /api/usuario-workflows
Crea una nueva relación usuario-workflow.

**Autenticación:** Requerida

**Request Body:**
```json
{
  "usuario_id": 1,
  "workflow_id": 1,
  "activo": true
}
```

**Response 201 (Success):**
```json
{
  "usuario_workflow_id": 2,
  "usuario_id": 1,
  "workflow_id": 1,
  "activo": true
}
```

---

### PUT /api/usuario-workflows/:id
Actualiza una relación usuario-workflow.

**Autenticación:** Requerida

**Request Body:**
```json
{
  "activo": false
}
```

**Response 200 (Success):**
```json
{
  "message": "Relación usuario-workflow actualizada correctamente",
  "usuario_workflow": {
    "usuario_workflow_id": 1,
    "activo": false
  }
}
```

---

### DELETE /api/usuario-workflows/:id
Elimina una relación usuario-workflow.

**Autenticación:** Requerida

**Response 200 (Success):**
```json
{
  "message": "Relación usuario-workflow eliminada correctamente"
}
```

---

## Logs de Workflows

### GET /api/logs-workflows
Obtiene todos los logs de workflows.

**Autenticación:** Opcional

**Query Parameters:**
- `workflow_id` (integer): Filtrar por workflow
- `nivel` (string): Filtrar por nivel (INFO, WARN, ERROR)
- `exito` (boolean): Filtrar por éxito/fallo
- `limit` (integer, default: 100): Límite de resultados

**Response 200 (Success):**
```json
[
  {
    "log_id": 1,
    "workflow_id": 1,
    "nivel": "INFO",
    "mensaje": "Workflow ejecutado correctamente",
    "duracion_ms": 150,
    "exito": true,
    "created_at": "2024-01-15T10:00:00.000Z"
  }
]
```

---

### GET /api/logs-workflows/:id
Obtiene un log específico por ID.

**Autenticación:** Opcional

**Response 200 (Success):**
```json
{
  "log_id": 1,
  "workflow_id": 1,
  "nivel": "INFO",
  "mensaje": "Workflow ejecutado correctamente",
  "duracion_ms": 150,
  "exito": true,
  "created_at": "2024-01-15T10:00:00.000Z"
}
```

---

### POST /api/logs-workflows
Crea un nuevo log de workflow.

**Autenticación:** Requerida

**Request Body:**
```json
{
  "workflow_id": 1,
  "nivel": "INFO",
  "mensaje": "Workflow ejecutado correctamente",
  "duracion_ms": 150,
  "exito": true
}
```

**Response 201 (Success):**
```json
{
  "log_id": 2,
  "workflow_id": 1,
  "nivel": "INFO",
  "mensaje": "Workflow ejecutado correctamente",
  "duracion_ms": 150,
  "exito": true
}
```

---

### DELETE /api/logs-workflows/:id
Elimina un log de workflow.

**Autenticación:** Requerida

**Response 200 (Success):**
```json
{
  "message": "Log eliminado correctamente"
}
```

---

## Reportes

### GET /api/reportes/all
Obtiene TODOS los reportes sin filtros.

**Autenticación:** Requerida

**Query Parameters:**
- `limit` (integer, default: 1000): Límite de resultados

**Descripción:** Este endpoint devuelve todos los reportes del sistema sin aplicar ningún filtro. Útil para administradores o reportes generales.

**Response 200 (Success):**
```json
{
  "success": true,
  "total": 50,
  "data": [
    {
      "reporte_id": 1,
      "codigo": "R-240115001",
      "zona_id": 1,
      "usuario_creo": 1,
      "fecha_reporte": "2024-01-15",
      "fecha_inicio": "2024-01-01",
      "fecha_fin": "2024-01-31",
      "riesgo": "Medio",
      "pm25_promedio": 30.5,
      "pm10_promedio": 50.2,
      "no2_promedio": 25.1,
      "estado": "Pendiente",
      "destinatario": "admin@example.com",
      "resumen": "Reporte mensual de calidad del aire",
      "fecha_creacion": "2024-01-15T10:00:00.000Z",
      "usuario": {
        "usuario_id": 1,
        "nombre": "Juan Pérez",
        "email": "juan@example.com"
      },
      "zona": {
        "zona_id": 1,
        "nombre": "Centro",
        "codigo": "CENTRO"
      }
    }
  ]
}
```

---

### GET /api/reportes/mis-reportes
Obtiene los reportes del usuario autenticado.

**Autenticación:** Requerida

**Query Parameters:**
- `zona_id` (integer): Filtrar por zona
- `estado` (string): Filtrar por estado
- `fecha_inicio` (ISO date): Fecha de inicio del reporte
- `fecha_fin` (ISO date): Fecha de fin del reporte
- `limit` (integer, default: 100): Límite de resultados

**Descripción:** Este endpoint filtra automáticamente los reportes por el usuario que está autenticado (obtenido del token JWT). Solo muestra los reportes creados por el usuario logueado.

**Response 200 (Success):**
```json
{
  "success": true,
  "usuario_id": 1,
  "total": 10,
  "data": [
    {
      "reporte_id": 1,
      "codigo": "R-240115001",
      "zona_id": 1,
      "usuario_creo": 1,
      "fecha_reporte": "2024-01-15",
      "fecha_inicio": "2024-01-01",
      "fecha_fin": "2024-01-31",
      "riesgo": "Medio",
      "pm25_promedio": 30.5,
      "pm10_promedio": 50.2,
      "no2_promedio": 25.1,
      "estado": "Pendiente",
      "destinatario": "admin@example.com",
      "resumen": "Reporte mensual de calidad del aire",
      "fecha_creacion": "2024-01-15T10:00:00.000Z",
      "usuario": {
        "usuario_id": 1,
        "nombre": "Juan Pérez",
        "email": "juan@example.com"
      },
      "zona": {
        "zona_id": 1,
        "nombre": "Centro",
        "codigo": "CENTRO"
      }
    }
  ]
}
```

**Response 401 (Unauthorized):**
```json
{
  "message": "Usuario no autenticado"
}
```

---

### GET /api/reportes
Obtiene todos los reportes (con filtros opcionales).

**Autenticación:** Requerida

**Query Parameters:**
- `zona_id` (integer): Filtrar por zona
- `usuario_creo` (integer): Filtrar por usuario creador
- `estado` (string): Filtrar por estado
- `fecha_inicio` (ISO date): Fecha de inicio
- `fecha_fin` (ISO date): Fecha de fin
- `limit` (integer, default: 100): Límite de resultados

**Response 200 (Success):**
```json
[
  {
    "reporte_id": 1,
    "zona_id": 1,
    "usuario_creo": 1,
    "fecha_inicio": "2024-01-01",
    "fecha_fin": "2024-01-31",
    "riesgo": "Medio",
    "pm25_promedio": 30.5,
    "pm10_promedio": 50.2,
    "no2_promedio": 25.1,
    "estado": "Pendiente",
    "destinatario": "admin@example.com",
    "resumen": "Reporte mensual de calidad del aire"
  }
]
```

---

### GET /api/reportes/:id
Obtiene un reporte específico por ID.

**Autenticación:** Requerida

**Response 200 (Success):**
```json
{
  "reporte_id": 1,
  "zona_id": 1,
  "usuario_creo": 1,
  "fecha_inicio": "2024-01-01",
  "fecha_fin": "2024-01-31",
  "riesgo": "Medio",
  "pm25_promedio": 30.5,
  "pm10_promedio": 50.2,
  "no2_promedio": 25.1,
  "estado": "Pendiente",
  "destinatario": "admin@example.com",
  "resumen": "Reporte mensual de calidad del aire"
}
```

---

### POST /api/reportes
Crea un nuevo reporte.

**Autenticación:** Requerida

**Request Body:**
```json
{
  "zona_id": 1,
  "usuario_creo": 1,
  "fecha_inicio": "2024-01-01",
  "fecha_fin": "2024-01-31",
  "riesgo": "Medio",
  "pm25_promedio": 30.5,
  "pm10_promedio": 50.2,
  "no2_promedio": 25.1,
  "estado": "Pendiente",
  "destinatario": "admin@example.com",
  "resumen": "Reporte mensual de calidad del aire"
}
```

**Nota:** Si no se proporcionan los promedios (pm25_promedio, pm10_promedio, no2_promedio), se calcularán automáticamente a partir de las mediciones del período.

**Response 201 (Success):**
```json
{
  "reporte_id": 2,
  "zona_id": 1,
  "usuario_creo": 1,
  "fecha_inicio": "2024-01-01",
  "fecha_fin": "2024-01-31",
  "riesgo": "Medio",
  "pm25_promedio": 30.5,
  "pm10_promedio": 50.2,
  "no2_promedio": 25.1,
  "estado": "Pendiente",
  "destinatario": "admin@example.com",
  "resumen": "Reporte mensual de calidad del aire"
}
```

---

### PUT /api/reportes/:id
Actualiza un reporte.

**Autenticación:** Requerida

**Request Body:**
```json
{
  "estado": "Enviado",
  "fecha_envio": "2024-02-01T10:00:00Z",
  "resumen": "Resumen actualizado"
}
```

**Response 200 (Success):**
```json
{
  "message": "Reporte actualizado correctamente",
  "reporte": {
    "reporte_id": 1,
    "estado": "Enviado",
    "fecha_envio": "2024-02-01T10:00:00.000Z",
    "resumen": "Resumen actualizado"
  }
}
```

---

### DELETE /api/reportes/:id
Elimina un reporte.

**Autenticación:** Requerida

**Response 200 (Success):**
```json
{
  "message": "Reporte eliminado correctamente"
}
```

---

## Open-Meteo Integration

### GET /api/open-meteo/status
Obtiene el estado de la sincronización con Open-Meteo.

**Autenticación:** Opcional

**Response 200 (Success):**
```json
{
  "status": "ok",
  "message": "Servicio de Open-Meteo disponible",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

---

### GET /api/open-meteo/sync
Obtiene datos de Open-Meteo para todas las zonas activas y los guarda automáticamente en la base de datos.

**Autenticación:** Opcional

**Nota:** Este endpoint puede tardar varios minutos ya que obtiene datos de múltiples zonas.

**Response 200 (Success):**
```json
{
  "message": "Datos obtenidos y guardados correctamente",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "total_zonas": 8,
  "exitosas": 8,
  "errores": 0,
  "resultados": [
    {
      "zona_id": 1,
      "nombre": "Centro",
      "mediciones_procesadas": 168,
      "mediciones_nuevas": 0,
      "mediciones_actualizadas": 168,
      "mediciones_con_error": 0,
      "calidad_aire_ok": true,
      "pronostico_ok": true,
      "success": true
    }
  ],
  "datos_guardados": [
    {
      "zona": {
        "zona_id": 1,
        "nombre": "Centro",
        "codigo": "CENTRO"
      },
      "ultima_medicion": {
        "fecha_hora": "2024-01-15T10:00:00.000Z",
        "pm25": 25.5,
        "pm10": 45.2,
        "no2": 30.1,
        "temperatura": 28.5,
        "humedad_relativa": 65.0,
        "precipitacion": 0.0,
        "presion_superficial": 1013.25,
        "velocidad_viento": 5.2,
        "direccion_viento": 180
      }
    }
  ]
}
```

---

### POST /api/open-meteo/sync
Sincroniza datos de Open-Meteo para todas las zonas activas (endpoint alternativo).

**Autenticación:** Opcional

**Response:** Similar a GET /api/open-meteo/sync

---

### POST /api/open-meteo/sync/:zona_id
Sincroniza datos de Open-Meteo para una zona específica.

**Autenticación:** Opcional

**Response 200 (Success):**
```json
{
  "message": "Datos obtenidos y guardados correctamente",
  "zona_id": 1,
  "nombre": "Centro",
  "mediciones_procesadas": 168,
  "mediciones_nuevas": 0,
  "mediciones_actualizadas": 168,
  "mediciones_con_error": 0,
  "calidad_aire_ok": true,
  "pronostico_ok": true,
  "success": true
}
```

---

### GET /api/open-meteo/realtime
Obtiene los últimos datos guardados de todas las zonas (tiempo real desde la base de datos).

**Autenticación:** Opcional

**Query Parameters:**
- `limit` (integer, default: 1): Número de mediciones más recientes por zona

**Response 200 (Success):**
```json
[
  {
    "zona": {
      "zona_id": 1,
      "nombre": "Centro",
      "codigo": "CENTRO"
    },
    "ultima_medicion": {
      "fecha_hora": "2024-01-15T10:00:00.000Z",
      "pm25": 25.5,
      "pm10": 45.2,
      "no2": 30.1,
      "temperatura": 28.5,
      "humedad_relativa": 65.0,
      "precipitacion": 0.0,
      "presion_superficial": 1013.25,
      "velocidad_viento": 5.2,
      "direccion_viento": 180
    }
  }
]
```

---

### GET /api/open-meteo/realtime/:zona_id
Obtiene los últimos datos guardados de una zona específica (tiempo real desde la base de datos).

**Autenticación:** Opcional

**Query Parameters:**
- `limit` (integer, default: 24): Número de mediciones más recientes

**Response 200 (Success):**
```json
{
  "zona": {
    "zona_id": 1,
    "nombre": "Centro",
    "codigo": "CENTRO"
  },
  "mediciones": [
    {
      "fecha_hora": "2024-01-15T10:00:00.000Z",
      "pm25": 25.5,
      "pm10": 45.2,
      "no2": 30.1,
      "temperatura": 28.5,
      "humedad_relativa": 65.0,
      "precipitacion": 0.0,
      "presion_superficial": 1013.25,
      "velocidad_viento": 5.2,
      "direccion_viento": 180
    }
  ]
}
```

---

## Códigos de Estado HTTP

| Código | Significado | Descripción |
|--------|-------------|-------------|
| 200 | OK | Solicitud exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Datos inválidos o incompletos |
| 401 | Unauthorized | No autenticado o token inválido |
| 403 | Forbidden | No tiene permisos para acceder |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Conflicto (ej: email duplicado) |
| 500 | Internal Server Error | Error interno del servidor |

---

## Manejo de Errores

Todas las respuestas de error siguen un formato estándar:

```json
{
  "message": "Descripción del error",
  "error": "Detalles técnicos del error (opcional)"
}
```

### Ejemplos de Errores Comunes

**Error de Validación (400):**
```json
{
  "message": "Datos incompletos",
  "error": "El campo 'nombre' es requerido"
}
```

**Error de Autenticación (401):**
```json
{
  "message": "Credenciales inválidas"
}
```

**Error de Recurso No Encontrado (404):**
```json
{
  "message": "Zona no encontrada"
}
```

**Error de Conflicto (409):**
```json
{
  "message": "Email ya registrado"
}
```

**Error del Servidor (500):**
```json
{
  "message": "Error al procesar la solicitud",
  "error": "Detalles técnicos del error"
}
```

---

## Notas Importantes

1. **Transacciones:** Todas las operaciones de escritura (POST, PUT, DELETE) utilizan transacciones de base de datos para garantizar la integridad de los datos.

2. **Validaciones:** Los controladores validan los campos requeridos antes de procesar las peticiones.

3. **Relaciones:** Los endpoints GET incluyen automáticamente las relaciones (joins) cuando es relevante (ej: zona en mediciones, usuario en alertas).

4. **Filtros:** La mayoría de los endpoints GET soportan filtros mediante query parameters.

5. **Límites:** Los endpoints que pueden devolver muchos registros tienen un límite por defecto (generalmente 100) que puede ajustarse con el parámetro `limit`.

6. **Open-Meteo:** Los endpoints de Open-Meteo permiten obtener datos de APIs externas y guardarlos en la base de datos. Los endpoints de tiempo real funcionan incluso si la API externa está caída, mostrando los últimos datos guardados.

7. **Formato de Fechas:** Todas las fechas se manejan en formato ISO 8601 (ej: "2024-01-15T10:00:00.000Z").

8. **Formato de Números:** Los valores numéricos (DECIMAL) de la base de datos se convierten automáticamente a números flotantes en las respuestas JSON.

---

## Ejemplos de Uso con cURL

### Registrar Usuario
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Iniciar Sesión
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Obtener Zonas (con autenticación)
```bash
curl -X GET http://localhost:3001/api/zonas \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Crear Medición
```bash
curl -X POST http://localhost:3001/api/mediciones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "zona_id": 1,
    "fecha_hora": "2024-01-15T10:00:00Z",
    "pm25": 25.5,
    "pm10": 45.2,
    "no2": 30.1,
    "temperatura": 28.5,
    "humedad_relativa": 65.0,
    "precipitacion": 0.0,
    "presion_superficial": 1013.25,
    "velocidad_viento": 5.2,
    "direccion_viento": 180
  }'
```

### Sincronizar Open-Meteo
```bash
curl -X GET http://localhost:3001/api/open-meteo/sync
```

---

**Última actualización:** 2024-01-15
**Versión de la API:** 1.0.0

