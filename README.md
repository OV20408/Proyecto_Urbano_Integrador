# API Proyecto Urbano Integrador

API REST con WebSockets para comunicación en tiempo real con el proyecto Proyecto_Urbano_Integrador.

## 🚀 Instalación

```bash
npm install
```

## 📦 Uso

### Modo desarrollo (con nodemon)
```bash
npm run dev
```

### Modo producción
```bash
npm start
```

El servidor se iniciará en `http://localhost:3001`

## 📡 Endpoints

### GET /
Health check del servidor
```bash
curl http://localhost:3001/
```

### POST /mensaje
Envía un mensaje a todos los clientes conectados vía WebSocket

**Body:**
```json
{
  "mensaje": "Tu mensaje aquí"
}
```

**Ejemplo:**
```bash
curl -X POST http://localhost:3001/mensaje \
  -H "Content-Type: application/json" \
  -d "{\"mensaje\": \"Hola desde la API\"}"
```

### GET /valor
Obtiene un valor aleatorio entre 0-100 y lo envía por WebSocket

**Ejemplo:**
```bash
curl http://localhost:3001/valor
```

## 🔌 WebSocket

Conéctate al WebSocket en: `ws://localhost:3001`

### Ejemplo de cliente JavaScript:
```javascript
const ws = new WebSocket('ws://localhost:3001');

ws.onopen = () => {
  console.log('Conectado al WebSocket');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Mensaje recibido:', data);
};

ws.onerror = (error) => {
  console.error('Error:', error);
};

ws.onclose = () => {
  console.log('Desconectado del WebSocket');
};
```

## 📝 Estructura de mensajes WebSocket

Los mensajes tienen el siguiente formato:

```json
{
  "type": "mensaje" | "valor" | "connection",
  "content": "string",  // solo para type: "mensaje"
  "value": 0-100,       // solo para type: "valor"
  "timestamp": "ISO8601 date string"
}
```
