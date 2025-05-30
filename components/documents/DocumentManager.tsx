"use client";

import { useState } from "react";
import { DocumentUploader } from "./DocumentUploader";
import { DocumentList } from "./DocumentList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  status: "processing" | "ready" | "error";
}

export function DocumentManager() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "1",
      name: "Legal Contract.pdf",
      type: "pdf",
      size: 1024 * 1024 * 2.5, // 2.5 MB
      uploadedAt: "2025-05-29T10:30:00Z",
      status: "ready",
    },
    {
      id: "2",
      name: "Medical Report.docx",
      type: "docx",
      size: 1024 * 512, // 512 KB
      uploadedAt: "2025-05-28T14:45:00Z",
      status: "ready",
    },
    {
      id: "3",
      name: "Research Paper.pdf",
      type: "pdf",
      size: 1024 * 1024 * 3.2, // 3.2 MB
      uploadedAt: "2025-05-27T09:15:00Z",
      status: "ready",
    },
  ]);
  const { toast } = useToast();

  const handleUpload = async (files: File[]) => {
    // In a real implementation, this would upload files to the backend
    // For now, we'll simulate adding them to our local state
    
    const newDocuments = files.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      name: file.name,
      type: file.name.split('.').pop() || "unknown",
      size: file.size,
      uploadedAt: new Date().toISOString(),
      status: "processing" as const,
    }));
    
    setDocuments((prev) => [...prev, ...newDocuments]);
    
    // Simulate processing delay
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((doc) =>
          newDocuments.some((newDoc) => newDoc.id === doc.id)
            ? { ...doc, status: "ready" as const }
            : doc
        )
      );
      
      toast({
        title: "Documents processed",
        description: `${files.length} document(s) have been processed and are ready for chat.`,
      });
    }, 2000);
  };

  const handleDelete = (documentId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    
    toast({
      title: "Document deleted",
      description: "The document has been removed from your library.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Upload PDF, DOCX, or TXT files to chat with. All processing happens locally on your device.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentUploader onUpload={handleUpload} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
          <CardDescription>
            Manage your uploaded documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentList documents={documents} onDelete={handleDelete} />
        </CardContent>
      </Card>
    </div>
  );
}
