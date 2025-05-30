"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Document {
  id: string;
  name: string;
}

interface DocumentSelectorProps {
  selectedDocuments: string[];
  setSelectedDocuments: (documents: string[]) => void;
}

export function DocumentSelector({ 
  selectedDocuments, 
  setSelectedDocuments 
}: DocumentSelectorProps) {
  // Fetch documents from the API
  const { data: documents, isLoading, error } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      // In a real implementation, this would call the backend API
      // For now, we'll return mock data
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [
        { id: "1", name: "Legal Contract.pdf" },
        { id: "2", name: "Medical Report.docx" },
        { id: "3", name: "Research Paper.pdf" },
        { id: "4", name: "Technical Documentation.txt" },
      ] as Document[];
    },
  });

  const toggleDocument = (documentId: string) => {
    setSelectedDocuments(
      selectedDocuments.includes(documentId)
        ? selectedDocuments.filter((id) => id !== documentId)
        : [...selectedDocuments, documentId]
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-destructive">
        Failed to load documents
      </div>
    );
  }

  if (!documents?.length) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No documents available. Please upload documents first.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map((document) => (
        <div key={document.id} className="flex items-center">
          <Button
            variant={selectedDocuments.includes(document.id) ? "default" : "outline"}
            size="sm"
            className="w-full justify-start text-left font-normal"
            onClick={() => toggleDocument(document.id)}
          >
            {document.name}
          </Button>
        </div>
      ))}
    </div>
  );
}
