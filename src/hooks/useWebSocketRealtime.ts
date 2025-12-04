// src/hooks/useWebSocketRealtime.ts
import { useEffect, useRef, useState } from "react";
import type { RealtimeResponse } from "../types/api";

export function useWebSocketRealtime(url: string) {
  const wsRef = useRef<WebSocket | null>(null);

  const [realtime, setRealtime] = useState<RealtimeResponse | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    function connect() {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket conectado");
        setConnected(true);
      };

      ws.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          setRealtime(data);
        } catch (err) {
          console.error("Error WS message:", err);
        }
      };

      ws.onclose = () => {
        console.warn("WebSocket desconectado, reconectando...");
        setConnected(false);
        setTimeout(connect, 2000); // Reconnect automático
      };

      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
        ws.close();
      };
    }

    connect();

    return () => {
      wsRef.current?.close();
    };
  }, [url]);

  return { realtime, connected };
}



