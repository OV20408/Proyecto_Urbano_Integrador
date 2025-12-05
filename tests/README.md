# Suite de Pruebas de la API

Este directorio contiene las pruebas automatizadas para todos los endpoints de la API.

## 📋 Contenido

- `api-test-suite.js`: Script principal de pruebas que prueba todos los endpoints
- `test-report.json`: Reporte generado después de ejecutar las pruebas (se genera automáticamente)

## 🚀 Uso

### Prerrequisitos

1. Asegúrate de que el servidor de la API esté corriendo:
```bash
cd api_proyecto_urbano_integrador
npm start
```

2. El servidor debe estar disponible en `http://localhost:3001` (o la URL configurada en `API_URL`)

### Ejecutar las Pruebas

```bash
npm test
```

O directamente:
```bash
node tests/api-test-suite.js
```

### Configuración

Puedes configurar la URL base de la API usando la variable de entorno:
```bash
API_URL=http://localhost:3001 npm test
```

## 📊 Endpoints Probados

La suite de pruebas cubre los siguientes endpoints:

### Autenticación
- ✅ POST /api/auth/register
- ✅ POST /api/auth/login
- ✅ GET /api/auth/health

### Zonas
- ✅ GET /api/zonas
- ✅ GET /api/zonas/:id
- ✅ POST /api/zonas
- ✅ PUT /api/zonas/:id
- ✅ DELETE /api/zonas/:id

### Mediciones
- ✅ GET /api/mediciones
- ✅ GET /api/mediciones/:id
- ✅ POST /api/mediciones
- ✅ PUT /api/mediciones/:id
- ✅ DELETE /api/mediciones/:id

### Workflows
- ✅ GET /api/workflows
- ✅ GET /api/workflows/:id
- ✅ GET /api/workflows/pm2/users
- ✅ GET /api/workflows/:id/logs
- ✅ POST /api/workflows
- ✅ PUT /api/workflows/:id
- ✅ DELETE /api/workflows/:id

### Open-Meteo
- ✅ GET /api/open-meteo/status
- ✅ GET /api/open-meteo/realtime
- ✅ GET /api/open-meteo/realtime/:zona_id
- ⏭️ GET /api/open-meteo/sync (omitido por tiempo de ejecución)

### Reglas de Alertas
- ✅ GET /api/reglas-alertas
- ✅ POST /api/reglas-alertas

### Alertas
- ✅ GET /api/alertas
- ✅ POST /api/alertas

### Usuario-Workflows
- ✅ GET /api/usuario-workflows

### Logs de Workflows
- ✅ GET /api/logs-workflows

### Reportes
- ✅ GET /api/reportes

## 📈 Reporte de Pruebas

Después de ejecutar las pruebas, se genera un archivo `test-report.json` con:

- Resumen de pruebas (total, exitosas, fallidas, omitidas)
- Tasa de éxito
- Detalles de cada prueba
- Errores encontrados

### Ejemplo de Reporte

```json
{
  "timestamp": "2024-01-15T10:00:00.000Z",
  "summary": {
    "total": 50,
    "passed": 45,
    "failed": 3,
    "skipped": 2,
    "successRate": "90.00%"
  },
  "details": [...],
  "errors": [...]
}
```

## 🔍 Interpretación de Resultados

- ✅ **PASS**: La prueba pasó exitosamente
- ❌ **FAIL**: La prueba falló (revisa los detalles en el reporte)
- ⏭️ **SKIPPED**: La prueba fue omitida (generalmente por dependencias faltantes)

## 🐛 Solución de Problemas

### Error: "ECONNREFUSED"
- Asegúrate de que el servidor esté corriendo
- Verifica que el puerto sea el correcto (3001 por defecto)

### Error: "401 Unauthorized"
- Las pruebas crean un usuario de prueba automáticamente
- Si falla el registro, verifica que la base de datos esté configurada correctamente

### Error: "404 Not Found"
- Algunos endpoints pueden fallar si no hay datos en la base de datos
- Esto es normal para endpoints que requieren recursos existentes

## 📝 Notas

- Las pruebas crean recursos de prueba que se limpian automáticamente cuando es posible
- Algunos recursos pueden quedar en la base de datos después de las pruebas (esto es normal)
- El endpoint `/api/open-meteo/sync` está omitido porque puede tardar varios minutos en ejecutarse

## 🔄 Próximos Pasos

- Agregar más casos de prueba (validaciones, casos límite)
- Integrar con CI/CD
- Agregar pruebas de rendimiento
- Agregar pruebas de carga

