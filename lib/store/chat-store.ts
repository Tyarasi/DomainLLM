"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatState {
  messages: Record<string, ChatMessage[]>;
  selectedDocuments: string[];
  isLoading: boolean;
  
  // Actions
  addMessage: (sessionId: string, message: ChatMessage) => void;
  clearMessages: (sessionId: string) => void;
  setSelectedDocuments: (documentIds: string[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: {},
      selectedDocuments: [],
      isLoading: false,
      
      addMessage: (sessionId, message) => 
        set((state) => ({
          messages: {
            ...state.messages,
            [sessionId]: [...(state.messages[sessionId] || []), message],
          },
        })),
      
      clearMessages: (sessionId) =>
        set((state) => {
          const newMessages = { ...state.messages };
          delete newMessages[sessionId];
          return { messages: newMessages };
        }),
      
      setSelectedDocuments: (documentIds) =>
        set({ selectedDocuments: documentIds }),
      
      setIsLoading: (isLoading) =>
        set({ isLoading }),
    }),
    {
      name: "domain-llm-chat-store",
    }
  )
);
