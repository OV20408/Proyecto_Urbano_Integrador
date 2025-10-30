import { useEffect, useRef, useState } from 'react';

interface WebSocketMessage {
  type: 'mensaje' | 'valor' | 'connection';
  content?: string;
  value?: number;
  message?: string;
  timestamp: string;
}

export const useWebSocket = (url: string) => {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastValue, setLastValue] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const connect = () => {
      try {
        console.log('🔄 Intentando conectar a:', url);
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
          if (isMounted) {
            console.log('✅ Conectado al WebSocket');
            setIsConnected(true);
          }
        };

        ws.onmessage = (event) => {
          try {
            const data: WebSocketMessage = JSON.parse(event.data);
            console.log('📩 Mensaje recibido:', data);
            
            if (isMounted) {
              setMessages((prev) => [...prev, data]);
              
              // Si es un valor, actualizar el último valor
              if (data.type === 'valor' && data.value !== undefined) {
                setLastValue(data.value);
              }
            }
          } catch (error) {
            console.error('Error al parsear mensaje:', error);
          }
        };

        ws.onerror = (error) => {
          console.error('⚠️ Error en WebSocket:', error);
        };

        ws.onclose = () => {
          console.log('❌ Desconectado del WebSocket');
          if (isMounted) {
            setIsConnected(false);
            // Intentar reconectar después de 3 segundos
            reconnectTimeoutRef.current = setTimeout(() => {
              if (isMounted) {
                console.log('🔄 Intentando reconectar...');
                connect();
              }
            }, 3000);
          }
        };
      } catch (error) {
        console.error('❌ Error al crear WebSocket:', error);
        if (isMounted) {
          setIsConnected(false);
        }
      }
    };

    connect();

    // Cleanup
    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [url]);

  const sendMessage = (message: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ message }));
    }
  };

  return {
    messages,
    isConnected,
    lastValue,
    sendMessage,
  };
};
