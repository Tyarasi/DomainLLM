"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, File } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DocumentUploaderProps {
  onUpload: (files: File[]) => void;
}

export function DocumentUploader({ onUpload }: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      processFiles(files);
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const processFiles = (files: File[]) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    
    const validExtensions = [".pdf", ".docx", ".txt"];
    
    const validFiles = files.filter((file) => {
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      return (
        validTypes.includes(file.type) || 
        validExtensions.some((ext) => fileExtension === ext)
      );
    });
    
    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid file type",
        description: "Only PDF, DOCX, and TXT files are supported.",
        variant: "destructive",
      });
    }
    
    if (validFiles.length > 0) {
      onUpload(validFiles);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center ${
        isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/20"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-primary/10 p-3">
          <Upload className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium">Drag & drop files</h3>
          <p className="text-sm text-muted-foreground mt-1">
            or click to browse files
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          Supports PDF, DOCX, and TXT files
        </div>
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <File className="mr-2 h-4 w-4" />
          Select Files
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.docx,.txt"
          multiple
          onChange={handleFileInputChange}
        />
      </div>
    </div>
  );
}
