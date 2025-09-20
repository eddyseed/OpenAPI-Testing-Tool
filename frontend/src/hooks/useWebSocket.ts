import { useRef, useEffect, useState, useCallback } from "react";

export function useWebSocket(url: string = "ws://localhost:3001") {
  const socketRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Send message through the socket
  const sendMessage = useCallback((msg: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(msg);
    } else {
      console.warn("WebSocket is not connected.");
    }
  }, []);

  useEffect(() => {
    // Create WebSocket connection
    socketRef.current = new WebSocket(url);

    // Connection opened
    socketRef.current.onopen = () => {
      console.log("✅ WebSocket connected");
      setIsConnected(true);
    };

    // Listen for messages
    socketRef.current.onmessage = (event: MessageEvent) => {
      setMessages((prev) => [...prev, event.data]);
    };

    // Handle errors
    socketRef.current.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    // Handle close
    socketRef.current.onclose = () => {
      console.log("🔌 WebSocket disconnected");
      setIsConnected(false);
    };

    // Cleanup on unmount
    return () => {
      socketRef.current?.close();
    };
  }, [url]);

  return { messages, sendMessage, isConnected };
}
