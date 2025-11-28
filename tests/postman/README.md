# 🧪 Pruebas con Postman

## 📋 Descripción

Colección completa de pruebas automatizadas para los endpoints de autenticación (registro y login) y WebSocket de la API.

## 📦 Archivos

- `API_Proyecto_Urbano.postman_collection.json` - Colección de pruebas
- `local.postman_environment.json` - Environment para desarrollo local
- `production.postman_environment.json` - Environment para producción (Render)

## 🚀 Instrucciones de Uso

### 1. Importar en Postman

#### Opción A: Importar desde archivo
1. Abre Postman
2. Click en **Import** (esquina superior izquierda)
3. Arrastra los archivos o selecciónalos:
   - `API_Proyecto_Urbano.postman_collection.json`
   - `local.postman_environment.json`
   - `production.postman_environment.json`
4. Click en **Import**

#### Opción B: Importar desde URL (si está en GitHub)
1. Click en **Import** → **Link**
2. Pega la URL del archivo raw de GitHub
3. Click en **Continue** → **Import**

### 2. Configurar Environment

1. En la esquina superior derecha de Postman, selecciona el environment:
   - **Local Environment** para pruebas locales (http://localhost:3001)
   - **Production Environment** para pruebas en Render

2. Verifica que la variable `baseUrl` esté correcta

### 3. Ejecutar Pruebas

#### Opción A: Ejecutar toda la colección
1. Click derecho en la colección "API Proyecto Urbano - Tests Auth"
2. Selecciona **Run collection**
3. Configura opciones:
   - **Iterations**: 1 (o más para pruebas repetidas)
   - **Delay**: 500ms (tiempo entre requests)
4. Click en **Run API Proyecto Urbano**
5. Observa los resultados de cada test

#### Opción B: Ejecutar request individual
1. Expande la colección
2. Click en el request que quieres ejecutar
3. Click en **Send**
4. Revisa:
   - **Status code** en la respuesta
   - **Test Results** (tab abajo)
   - **Response body**

### 4. Orden Recomendado de Ejecución

Para probar el flujo completo de autenticación, ejecuta en este orden:

1. **Health Check** - Verifica que el servidor esté funcionando
2. **Registro Exitoso** - Crea un nuevo usuario (genera email único automáticamente)
3. **Registro Email Duplicado** - Valida que no se pueden duplicar emails
4. **Registro Datos Incompletos** - Valida validación de datos
5. **Login Exitoso** - Obtiene JWT token (se guarda automáticamente)
6. **Login Password Incorrecta** - Valida autenticación
7. **Login Usuario No Existe** - Valida que usuario debe existir
8. **Enviar Mensaje WebSocket** - Envía mensaje a clientes conectados
9. **Obtener Valor Aleatorio** - Obtiene valor 0-100

## 🧪 Tests Automatizados

Cada request incluye tests automatizados que validan:

### ✅ Health Check
- Status code 200
- Respuesta JSON válida
- Contiene información de WebSocket

### ✅ Registro Exitoso
- Status code 201 Created
- Retorna objeto user con id, name, email
- NO retorna password ni passwordHash
- Genera email único automáticamente

### ✅ Registro Email Duplicado
- Status code 409 Conflict
- Mensaje indica email duplicado

### ✅ Registro Datos Incompletos
- Status code 400 Bad Request
- Mensaje indica datos incompletos

### ✅ Login Exitoso
- Status code 200 OK
- Retorna token JWT y user
- Token tiene formato JWT válido (3 partes separadas por puntos)
- NO retorna password
- **Token se guarda automáticamente** en variables

### ✅ Login con Errores
- Status code 401 Unauthorized
- Mensaje de credenciales inválidas
- NO retorna token

### ✅ WebSocket Endpoints
- Status code 200
- Retornan formato correcto
- Valores dentro de rangos esperados

## 📊 Visualización de Resultados

Después de ejecutar la colección completa, verás:

```
┌─────────────────────────────────────┐
│ API Proyecto Urbano - Tests Auth    │
│                                     │
│ ✅ 9/9 requests passed              │
│ ✅ 35/35 tests passed               │
│ ⏱️  Total time: 2.5s                │
└─────────────────────────────────────┘

Tests:
✅ Status 200
✅ Tiene websocket
✅ Status 201
✅ Retorna user
✅ NO retorna password
... (más tests)
```

## 🔧 Variables de Colección

La colección genera y usa estas variables automáticamente:

| Variable | Descripción | Generación |
|----------|-------------|------------|
| `testEmail` | Email único para pruebas | Automática (timestamp + random) |
| `testName` | Nombre de usuario de prueba | Automática |
| `testPassword` | Password para pruebas | Fija: `Test123456!` |
| `authToken` | JWT token de autenticación | Automática al hacer login |

## 🌐 Environments

### Local Environment
```json
{
  "baseUrl": "http://localhost:3001",
  "authToken": ""
}
```

### Production Environment
```json
{
  "baseUrl": "https://proyect-meos.onrender.com",
  "authToken": ""
}
```

## 📝 Notas Importantes

### Generación Automática de Datos
- Cada ejecución de "Registro Exitoso" genera un email único
- Formato: `test_{timestamp}_{random}@example.com`
- No necesitas cambiar datos manualmente

### Token JWT
- Se guarda automáticamente al hacer login exitoso
- Se almacena en:
  - Variables de colección
  - Variables de environment
- Se puede usar en requests protegidos (cuando se implementen)

### Base de Datos
- Las pruebas crean usuarios reales en la base de datos
- Si ejecutas múltiples veces, se crearán múltiples usuarios
- Recomendado: limpiar base de datos periódicamente en desarrollo

## 🐛 Troubleshooting

### Error: "Could not get response"
**Causa**: Servidor no está corriendo
**Solución**: 
```bash
cd api_proyecto_urbano_integrador
npm run dev
```

### Error: "Status code is 500"
**Causa**: Error en el servidor (revisar logs)
**Solución**: Verifica consola del servidor para detalles del error

### Error: "Status code is 409" en primer registro
**Causa**: Email ya existe en base de datos
**Solución**: Email se genera automáticamente, debería ser único. Si persiste, limpia la BD.

### Tests fallan en "Login Exitoso"
**Causa**: Usuario no fue creado en paso anterior
**Solución**: Ejecuta primero "Registro Exitoso"

### Token no se guarda
**Causa**: Test de login falló
**Solución**: Verifica que credenciales sean correctas y servidor funcione

## 🚀 CI/CD - Ejecutar con Newman

Newman es el CLI de Postman para ejecutar colecciones desde terminal.

### Instalación
```bash
npm install -g newman
```

### Ejecutar colección
```bash
# Con environment local
newman run API_Proyecto_Urbano.postman_collection.json \
  -e local.postman_environment.json

# Con environment de producción
newman run API_Proyecto_Urbano.postman_collection.json \
  -e production.postman_environment.json

# Con reporters (HTML, JSON)
newman run API_Proyecto_Urbano.postman_collection.json \
  -e local.postman_environment.json \
  --reporters cli,html \
  --reporter-html-export report.html
```

### Integración con CI/CD

**GitHub Actions**:
```yaml
- name: Run API Tests
  run: |
    npm install -g newman
    newman run tests/postman/API_Proyecto_Urbano.postman_collection.json \
      -e tests/postman/production.postman_environment.json
```

## 📚 Recursos

- [Postman Learning Center](https://learning.postman.com/)
- [Writing Tests in Postman](https://learning.postman.com/docs/writing-scripts/test-scripts/)
- [Newman Documentation](https://github.com/postmanlabs/newman)

---

**Versión**: 1.0.0  
**Última actualización**: Noviembre 2024  
**Tests totales**: 9 requests, ~35 assertions
