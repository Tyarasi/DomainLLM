"use client";

import { useState, useEffect } from "react";
import { DocumentUploader } from "./DocumentUploader";
import { DocumentList } from "./DocumentList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { documentApi, Document as ApiDocument } from "@/lib/api/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  status: "processing" | "ready" | "error";
}

export function DocumentManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch documents from the API
  const { data: documents = [], isLoading, error } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      try {
        return await documentApi.getAll();
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast({
          title: "Error",
          description: "Failed to fetch documents. Please try again.",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      try {
        return await documentApi.upload(files);
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate the documents query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        return await documentApi.delete(id);
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate the documents query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });

  const handleUpload = async (files: File[]) => {
    try {
      // Show loading toast
      toast({
        title: "Uploading documents",
        description: `Uploading ${files.length} document(s)...`,
      });
      
      // Upload files to the backend
      await uploadMutation.mutateAsync(files);
      
      // Show success toast
      toast({
        title: "Documents uploaded",
        description: `${files.length} document(s) have been uploaded and are being processed.`,
      });
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload documents. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      // Delete document from the backend
      await deleteMutation.mutateAsync(documentId);
      
      toast({
        title: "Document deleted",
        description: "The document has been removed from your library.",
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Delete failed",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Upload PDF, DOCX, or TXT files to chat with. Files are processed locally on your device.
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
          {isLoading ? (
            <div className="text-center p-6 text-muted-foreground">
              Loading documents...
            </div>
          ) : error ? (
            <div className="text-center p-6 text-destructive">
              Failed to load documents. Please try again.
            </div>
          ) : (
            <DocumentList documents={documents} onDelete={handleDelete} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
