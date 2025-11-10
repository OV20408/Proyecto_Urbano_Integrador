import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import authRoutes from './auth.routes.js';


// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - CORS configurado para permitir todas las conexiones
app.use(cors({
  origin: '*', // Permite cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false
}));
app.use(express.json());


app.use('/api', authRoutes);


// Crear servidor HTTP
const server = http.createServer(app);

// Crear servidor WebSocket
const wss = new WebSocketServer({ 
  server,
  // Configurar WebSocket para aceptar conexiones de cualquier origen
  verifyClient: (info) => {
    // Permitir todas las conexiones
    return true;
  }
});

// Almacenar conexiones activas
const clients = new Set();

// Manejar conexiones WebSocket
wss.on('connection', (ws) => {
  console.log('✅ Nuevo cliente conectado');
  clients.add(ws);

  ws.on('message', (message) => {
    console.log('📩 Mensaje recibido:', message.toString());
  });

  ws.on('close', () => {
    console.log('❌ Cliente desconectado');
    clients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('⚠️ Error en WebSocket:', error);
  });

  // Enviar mensaje de bienvenida
  ws.send(JSON.stringify({
    type: 'connection',
    message: 'Conectado al servidor WebSocket',
    timestamp: new Date().toISOString()
  }));
});

// Función para enviar mensaje a todos los clientes conectados
const broadcast = (data) => {
  let connectedClients = 0;
  clients.forEach((client) => {
    if (client.readyState === 1) { // 1 = OPEN
      client.send(JSON.stringify(data));
      connectedClients++;
    }
  });
  console.log(`📤 Mensaje enviado por WebSocket a ${connectedClients} cliente(s):`, data);
};

// ENDPOINTS

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API Proyecto Urbano Integrador',
    websocket: `ws://localhost:${PORT}`,
    clients: clients.size
  });
});

// POST - Enviar mensaje por WebSocket
app.post('/mensaje', (req, res) => {
  try {
    const { mensaje } = req.body;

    if (!mensaje) {
      return res.status(400).json({
        error: 'El campo "mensaje" es requerido'
      });
    }

    console.log(`📨 POST /mensaje recibido: "${mensaje}"`);

    // Enviar mensaje a todos los clientes conectados
    const data = {
      type: 'mensaje',
      content: mensaje,
      timestamp: new Date().toISOString()
    };

    broadcast(data);

    res.json({ mensaje });

  } catch (error) {
    console.error('Error en /mensaje:', error);
    res.status(500).json({
      error: 'Error al enviar mensaje'
    });
  }
});

// GET - Obtener valor aleatorio entre 0-100
app.get('/valor', (req, res) => {
  try {
    const valor = Math.floor(Math.random() * 101); // 0-100

    console.log(`🎲 GET /valor generado: ${valor}`);

    const data = {
      type: 'valor',
      value: valor,
      timestamp: new Date().toISOString()
    };

    // Opcionalmente, también enviarlo por WebSocket
    broadcast(data);

    res.json({ valor });

  } catch (error) {
    console.error('Error en /valor:', error);
    res.status(500).json({
      error: 'Error al obtener valor'
    });
  }
});

// Iniciar servidor
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🌍 Accesible desde cualquier IP en el puerto ${PORT}`);
  console.log(`🔌 WebSocket disponible en ws://localhost:${PORT}`);
});
