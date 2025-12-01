import { useState, useEffect } from 'react';
import { useWebSocketContext } from './WebSocketContext';
import { EmergencyModal } from './EmergencyModal';

export const WebSocketDemo = () => {
  const { messages, isConnected } = useWebSocketContext();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyMessage, setEmergencyMessage] = useState('');
  const [emergencyThreshold, setEmergencyThreshold] = useState<number | undefined>();

  // Detectar mensajes de PM2.5 y mostrar modal de emergencia
  useEffect(() => {
    if (messages.length === 0) return;

    // Obtener el último mensaje
    const lastMessage = messages[messages.length - 1];

    // Verificar si es un mensaje de tipo 'mensaje' que contenga PM2.5 o PM2
    if (
      lastMessage.type === 'mensaje' &&
      (lastMessage.content || lastMessage.message)
    ) {
      const messageText = (lastMessage.content || lastMessage.message || '').toLowerCase();
      
      // Verificar si contiene referencias a PM2.5, PM2, aire tóxico, alerta, etc.
      if (
        messageText.includes('pm2.5') ||
        messageText.includes('pm2') ||
        messageText.includes('aire tóxico') ||
        messageText.includes('alerta') ||
        messageText.includes('umbral')
      ) {
        // Extraer umbral si está en el mensaje
        const thresholdMatch = messageText.match(/(\d+\.?\d*)\s*µg\/m³/i) || 
                               messageText.match(/umbral[:\s]+(\d+\.?\d*)/i) ||
                               messageText.match(/(\d+\.?\d*)\s*µg/i);
        
        const threshold = thresholdMatch ? parseFloat(thresholdMatch[1]) : undefined;

        setEmergencyMessage(lastMessage.content || lastMessage.message || '');
        setEmergencyThreshold(threshold);
        setShowEmergencyModal(true);
      }
    }
  }, [messages]);

  return (
    <>
      {/* Indicador de conexión - solo un punto en la esquina superior izquierda */}
      <div className="fixed top-4 left-4 z-40">
        <div
          className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}
          title={isConnected ? 'Conectado' : 'Desconectado'}
        />
      </div>

      {/* Modal de Emergencia */}
      <EmergencyModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
        message={emergencyMessage}
        threshold={emergencyThreshold}
      />
    </>
  );
};