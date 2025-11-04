import { createContext, useContext, type ReactNode } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

interface WebSocketContextType {
  lastValue: number | null;
  isConnected: boolean;
  messages: any[];
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const { lastValue, isConnected, messages } = useWebSocket(WS_URL);

  return (
    <WebSocketContext.Provider value={{ lastValue, isConnected, messages }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext debe usarse dentro de WebSocketProvider');
  }
  return context;
};