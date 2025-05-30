"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Document } from "@/lib/api/client";

interface DocumentState {
  documents: Document[];
  isLoading: boolean;
  
  // Actions
  setDocuments: (documents: Document[]) => void;
  addDocuments: (documents: Document[]) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  removeDocument: (id: string) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useDocumentStore = create<DocumentState>()(
  persist(
    (set) => ({
      documents: [],
      isLoading: false,
      
      setDocuments: (documents) => 
        set({ documents }),
      
      addDocuments: (newDocuments) =>
        set((state) => ({
          documents: [...state.documents, ...newDocuments],
        })),
      
      updateDocument: (id, updates) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id ? { ...doc, ...updates } : doc
          ),
        })),
      
      removeDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== id),
        })),
      
      setIsLoading: (isLoading) =>
        set({ isLoading }),
    }),
    {
      name: "domain-llm-document-store",
    }
  )
);
