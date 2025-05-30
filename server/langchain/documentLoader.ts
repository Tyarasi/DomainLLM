import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { Document } from "langchain/document";
import path from "path";
import fs from "fs";

/**
 * Loads document content based on file type
 */
export async function loadDocumentContent(filePath: string): Promise<Document[]> {
  try {
    const fileExtension = path.extname(filePath).toLowerCase();
    
    switch (fileExtension) {
      case ".pdf":
        const pdfLoader = new PDFLoader(filePath);
        return await pdfLoader.load();
        
      case ".docx":
        const docxLoader = new DocxLoader(filePath);
        return await docxLoader.load();
        
      case ".txt":
        const textLoader = new TextLoader(filePath);
        return await textLoader.load();
        
      default:
        throw new Error(`Unsupported file type: ${fileExtension}`);
    }
  } catch (error) {
    console.error(`Error loading document ${filePath}:`, error);
    throw error;
  }
}

/**
 * Gets the file path for a document by ID
 */
export function getDocumentPath(documentId: string, documents: any[]): string | null {
  const document = documents.find(doc => doc.id === documentId);
  return document?.path || null;
}
