"use client";

import { formatDistanceToNow } from "date-fns";
import { Trash2, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  status: "processing" | "ready" | "error";
}

interface DocumentListProps {
  documents: Document[];
  onDelete: (documentId: string) => void;
}

export function DocumentList({ documents, onDelete }: DocumentListProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (documents.length === 0) {
    return (
      <div className="text-center p-6 text-muted-foreground">
        No documents uploaded yet. Upload documents to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <div
          key={document.id}
          className="flex items-center justify-between p-4 rounded-lg border"
        >
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-md">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium">{document.name}</h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <span>{formatFileSize(document.size)}</span>
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(document.uploadedAt), {
                    addSuffix: true,
                  })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  {document.status === "processing" ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Processing
                    </>
                  ) : document.status === "ready" ? (
                    "Ready"
                  ) : (
                    "Error"
                  )}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(document.id)}
            disabled={document.status === "processing"}
          >
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </Button>
        </div>
      ))}
    </div>
  );
}
