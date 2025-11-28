# Documentación de Endpoints - API Proyecto Urbano Integrador

## Autenticación

### POST /api/auth/register
Registrar un nuevo usuario
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

### POST /api/auth/login
Iniciar sesión
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```
**Respuesta:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "usuario_id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

---

## Zonas

### GET /api/zonas
Obtener todas las zonas
- **Query params:** `activa` (true/false)
- **Auth:** Opcional

### GET /api/zonas/:id
Obtener una zona por ID
- **Auth:** Opcional

### POST /api/zonas
Crear una nueva zona
- **Auth:** Requerido
```json
{
  "nombre": "Centro",
  "codigo": "CENTRO",
  "latitud": -17.8146,
  "longitud": -63.1561,
  "descripcion": "Zona céntrica",
  "activa": true
}
```

### PUT /api/zonas/:id
Actualizar una zona
- **Auth:** Requerido

### DELETE /api/zonas/:id
Eliminar una zona
- **Auth:** Requerido

---

## Mediciones de Aire

### GET /api/mediciones
Obtener todas las mediciones
- **Query params:** 
  - `zona_id` (int)
  - `fecha_inicio` (ISO date)
  - `fecha_fin` (ISO date)
  - `limit` (int, default: 100)
- **Auth:** Opcional

### GET /api/mediciones/:id
Obtener una medición por ID
- **Auth:** Opcional

### POST /api/mediciones
Crear una nueva medición
- **Auth:** Requerido
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

### PUT /api/mediciones/:id
Actualizar una medición
- **Auth:** Requerido

### DELETE /api/mediciones/:id
Eliminar una medición
- **Auth:** Requerido

---

## Reglas de Alertas

### GET /api/reglas-alertas
Obtener todas las reglas de alertas
- **Query params:** 
  - `usuario_id` (int)
  - `activa` (true/false)
- **Auth:** Requerido

### GET /api/reglas-alertas/:id
Obtener una regla por ID
- **Auth:** Requerido

### POST /api/reglas-alertas
Crear una nueva regla de alerta
- **Auth:** Requerido
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

### PUT /api/reglas-alertas/:id
Actualizar una regla de alerta
- **Auth:** Requerido

### DELETE /api/reglas-alertas/:id
Eliminar una regla de alerta
- **Auth:** Requerido

---

## Alertas

### GET /api/alertas
Obtener todas las alertas
- **Query params:** 
  - `usuario_id` (int)
  - `zona_id` (int)
  - `estado` (string: open, ack, resolved, muted)
  - `severidad` (string)
  - `fuente` (string)
  - `limit` (int, default: 100)
- **Auth:** Requerido

### GET /api/alertas/:id
Obtener una alerta por ID
- **Auth:** Requerido

### POST /api/alertas
Crear una nueva alerta
- **Auth:** Requerido
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

### PUT /api/alertas/:id
Actualizar una alerta (principalmente estado)
- **Auth:** Requerido
```json
{
  "estado": "ack",
  "observaciones": "Alerta reconocida"
}
```

### DELETE /api/alertas/:id
Eliminar una alerta
- **Auth:** Requerido

---

## Workflows

### GET /api/workflows
Obtener todos los workflows
- **Query params:** 
  - `tipo` (string)
  - `estado` (string)
  - `activo` (true/false)
- **Auth:** Opcional

### GET /api/workflows/:id
Obtener un workflow por ID
- **Auth:** Opcional

### GET /api/workflows/:id/logs
Obtener logs de un workflow
- **Query params:** 
  - `nivel` (string)
  - `limit` (int, default: 100)
- **Auth:** Opcional

### POST /api/workflows
Crear un nuevo workflow
- **Auth:** Requerido
```json
{
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

### PUT /api/workflows/:id
Actualizar un workflow
- **Auth:** Requerido

### DELETE /api/workflows/:id
Eliminar un workflow
- **Auth:** Requerido

---

## Usuario-Workflows

### GET /api/usuario-workflows
Obtener todas las relaciones usuario-workflow
- **Query params:** 
  - `usuario_id` (int)
  - `workflow_id` (int)
  - `activo` (true/false)
- **Auth:** Requerido

### GET /api/usuario-workflows/:id
Obtener una relación por ID
- **Auth:** Requerido

### POST /api/usuario-workflows
Crear una nueva relación usuario-workflow
- **Auth:** Requerido
```json
{
  "usuario_id": 1,
  "workflow_id": 1,
  "activo": true
}
```

### PUT /api/usuario-workflows/:id
Actualizar una relación usuario-workflow
- **Auth:** Requerido

### DELETE /api/usuario-workflows/:id
Eliminar una relación usuario-workflow
- **Auth:** Requerido

---

## Logs de Workflows

### GET /api/logs-workflows
Obtener todos los logs
- **Query params:** 
  - `workflow_id` (int)
  - `nivel` (string)
  - `exito` (true/false)
  - `limit` (int, default: 100)
- **Auth:** Opcional

### GET /api/logs-workflows/:id
Obtener un log por ID
- **Auth:** Opcional

### POST /api/logs-workflows
Crear un nuevo log
- **Auth:** Requerido
```json
{
  "workflow_id": 1,
  "nivel": "INFO",
  "mensaje": "Workflow ejecutado correctamente",
  "duracion_ms": 150,
  "exito": true
}
```

### DELETE /api/logs-workflows/:id
Eliminar un log
- **Auth:** Requerido

---

## Reportes

### GET /api/reportes
Obtener todos los reportes
- **Query params:** 
  - `zona_id` (int)
  - `usuario_creo` (int)
  - `estado` (string)
  - `fecha_inicio` (ISO date)
  - `fecha_fin` (ISO date)
  - `limit` (int, default: 100)
- **Auth:** Requerido

### GET /api/reportes/:id
Obtener un reporte por ID
- **Auth:** Requerido

### POST /api/reportes
Crear un nuevo reporte
- **Auth:** Requerido
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
**Nota:** Si no se proporcionan los promedios, se calcularán automáticamente a partir de las mediciones del período.

### PUT /api/reportes/:id
Actualizar un reporte
- **Auth:** Requerido
```json
{
  "estado": "Enviado",
  "fecha_envio": "2024-02-01T10:00:00Z",
  "resumen": "Resumen actualizado"
}
```

### DELETE /api/reportes/:id
Eliminar un reporte
- **Auth:** Requerido

---

## Uso de Autenticación

Para endpoints que requieren autenticación, incluir el token en el header:
```
Authorization: Bearer <token>
```

Ejemplo con curl:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/zonas
```

---

---

## Open-Meteo Integration

### POST /api/open-meteo/sync
Sincroniza datos de Open-Meteo para todas las zonas activas
- **Auth:** Requerido
- **Descripción:** Obtiene datos de calidad del aire y pronóstico del tiempo de Open-Meteo para todas las zonas activas y los guarda en la base de datos
- Ver documentación completa en `OPEN_METEO_ENDPOINTS.md`

### POST /api/open-meteo/sync/:zona_id
Sincroniza datos de Open-Meteo para una zona específica
- **Auth:** Requerido
- **Descripción:** Obtiene y guarda datos de Open-Meteo para una zona específica

### GET /api/open-meteo/realtime
Obtiene los últimos datos guardados de todas las zonas (tiempo real)
- **Auth:** Opcional
- **Query params:** `limit` (int, default: 1)
- **Descripción:** Muestra los últimos datos guardados. Si Open-Meteo está caída, muestra los datos guardados previamente.

### GET /api/open-meteo/realtime/:zona_id
Obtiene los últimos datos guardados de una zona específica (tiempo real)
- **Auth:** Opcional
- **Query params:** `limit` (int, default: 24)
- **Descripción:** Muestra los últimos datos guardados de una zona específica

**Nota:** Para documentación detallada de estos endpoints, ver `OPEN_METEO_ENDPOINTS.md`

---

## Notas Importantes

1. **Transacciones:** Todas las operaciones de escritura (POST, PUT, DELETE) utilizan transacciones de base de datos para garantizar la integridad de los datos.

2. **Validaciones:** Los controladores validan los campos requeridos antes de procesar las peticiones.

3. **Relaciones:** Los endpoints GET incluyen automáticamente las relaciones (joins) cuando es relevante (ej: zona en mediciones, usuario en alertas).

4. **Filtros:** La mayoría de los endpoints GET soportan filtros mediante query parameters.

5. **Límites:** Los endpoints que pueden devolver muchos registros tienen un límite por defecto (generalmente 100) que puede ajustarse con el parámetro `limit`.

6. **Open-Meteo:** Los endpoints de Open-Meteo permiten obtener datos de APIs externas y guardarlos en la base de datos. Los endpoints de tiempo real funcionan incluso si la API externa está caída, mostrando los últimos datos guardados.

