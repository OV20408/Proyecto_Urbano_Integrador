# 🚀 Instrucciones de Uso

## 1. Iniciar la API

Abre una terminal en la carpeta `api_proyecto_urbano_integrador` y ejecuta:

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3001`

## 2. Usar el WebSocket en tu proyecto React

### Opción A: Usar el componente de demostración

Importa el componente `WebSocketDemo` en cualquier página:

```tsx
import { WebSocketDemo } from '../components/WebSocketDemo';

// En tu componente
<WebSocketDemo />
```

### Opción B: Usar el hook personalizado

```tsx
import { useWebSocket } from '../hooks/useWebSocket';

function MiComponente() {
  const { messages, isConnected, lastValue } = useWebSocket('ws://localhost:3001');
  
  // Tu lógica aquí
}
```

## 3. Probar los endpoints

### Enviar mensaje (POST)
```bash
curl -X POST http://localhost:3001/mensaje -H "Content-Type: application/json" -d "{\"mensaje\": \"Hola mundo\"}"
```

### Obtener valor aleatorio (GET)
```bash
curl http://localhost:3001/valor
```

## 4. Ver estado del servidor
```bash
curl http://localhost:3001/
```

## ✅ Todo listo!

- ✅ API Express.js con WebSockets creada
- ✅ Endpoint POST `/mensaje` para enviar mensajes
- ✅ Endpoint GET `/valor` para obtener valores 0-100
- ✅ Hook personalizado `useWebSocket` para React
- ✅ Componente de demostración `WebSocketDemo`
