"use client";

import { io, Socket } from "socket.io-client";
import { useEffect, useRef } from "react";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function useSocketIO() {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    if (!socketRef.current) {
      socketRef.current = io(SOCKET_URL);
      
      // Set up connection event handlers
      socketRef.current.on("connect", () => {
        console.log("Socket connected:", socketRef.current?.id);
      });
      
      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
      });
      
      socketRef.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });
    }
    
    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const sendChatMessage = (message: string, documentIds: string[]) => {
    if (socketRef.current) {
      socketRef.current.emit("chat:message", { message, documentIds });
    }
  };

  const onChatResponse = (callback: (response: ChatMessage) => void) => {
    if (socketRef.current) {
      socketRef.current.on("chat:response", callback);
    }
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off("chat:response", callback);
      }
    };
  };

  const onChatError = (callback: (error: { error: string }) => void) => {
    if (socketRef.current) {
      socketRef.current.on("chat:error", callback);
    }
    
    return () => {
      if (socketRef.current) {
        socketRef.current.off("chat:error", callback);
      }
    };
  };

  return {
    sendChatMessage,
    onChatResponse,
    onChatError,
    isConnected: !!socketRef.current?.connected,
  };
}
