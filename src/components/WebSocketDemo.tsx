import { useState } from 'react';
import { useWebSocketContext } from './WebSocketContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const WebSocketDemo = () => {
  const { messages, isConnected, lastValue } = useWebSocketContext();
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Enviar mensaje via POST
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/mensaje`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mensaje: inputMessage }),
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      setInputMessage('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener valor via GET
  const handleGetValue = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/valor`);
      const data = await response.json();
      console.log('Valor recibido:', data);
    } catch (error) {
      console.error('Error al obtener valor:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">WebSocket Demo</h1>

        {/* Estado de conexión */}
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="font-medium">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>

        {/* Último valor */}
        {lastValue !== null && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Último valor recibido:</p>
            <p className="text-4xl font-bold text-blue-600">{lastValue}</p>
          </div>
        )}

        {/* Controles */}
        <div className="space-y-4 mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Escribe un mensaje..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isConnected || loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!isConnected || loading || !inputMessage.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Enviar
            </button>
          </div>

          <button
            onClick={handleGetValue}
            disabled={!isConnected || loading}
            className="w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Obtener Valor Aleatorio (0-100)
          </button>
        </div>

        {/* Mensajes recibidos */}
        <div className="border-t pt-4">
          <h2 className="text-xl font-semibold mb-3">Mensajes Recibidos</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No hay mensajes todavía...
              </p>
            ) : (
              messages.slice().reverse().map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    msg.type === 'mensaje'
                      ? 'bg-blue-50 border-l-4 border-blue-500'
                      : msg.type === 'valor'
                      ? 'bg-green-50 border-l-4 border-green-500'
                      : 'bg-gray-50 border-l-4 border-gray-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-gray-600 uppercase">
                        {msg.type}
                      </span>
                      <p className="text-sm mt-1">
                        {msg.content || msg.message || `Valor: ${msg.value}`}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};