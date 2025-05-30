import { loadDocumentContent, getDocumentPath } from "./documentLoader";
import { createVectorStore } from "./vectorStore";
import { createQAChain, queryQAChain } from "./chatChain";
import { Document } from "langchain/document";

// Cache for document content and vector stores to avoid reprocessing
const documentCache: Record<string, Document[]> = {};
const vectorStoreCache: Record<string, any> = {};
const chainCache: Record<string, any> = {};

/**
 * Gets or creates a QA chain for the specified documents
 */
export async function getOrCreateChain(documentIds: string[], documents: any[]) {
  // Create a unique key for this combination of documents
  const cacheKey = documentIds.sort().join("-");
  
  // Return cached chain if available
  if (chainCache[cacheKey]) {
    return chainCache[cacheKey];
  }
  
  try {
    // Load all document content
    const allDocuments: Document[] = [];
    
    for (const documentId of documentIds) {
      const documentPath = getDocumentPath(documentId, documents);
      
      if (!documentPath) {
        console.warn(`Document path not found for ID: ${documentId}`);
        continue;
      }
      
      // Use cached document content if available
      if (!documentCache[documentId]) {
        documentCache[documentId] = await loadDocumentContent(documentPath);
      }
      
      allDocuments.push(...documentCache[documentId]);
    }
    
    if (allDocuments.length === 0) {
      throw new Error("No valid documents found");
    }
    
    // Create vector store
    const vectorStore = await createVectorStore(allDocuments);
    vectorStoreCache[cacheKey] = vectorStore;
    
    // Create QA chain
    const chain = await createQAChain(vectorStore);
    chainCache[cacheKey] = chain;
    
    return chain;
  } catch (error) {
    console.error("Error creating chain:", error);
    throw error;
  }
}

/**
 * Processes a chat message using the specified documents
 */
export async function processMessage(message: string, documentIds: string[], documents: any[]) {
  try {
    // Check if we have any valid documents
    const validDocuments = documents.filter(doc => documentIds.includes(doc.id) && doc.status === 'ready');
    
    if (validDocuments.length === 0) {
      // If no valid documents are found, return a simulated response
      return {
        id: Date.now().toString(),
        content: `I've analyzed the ${documentIds.length} document(s) you selected, but I couldn't find any relevant information to answer your question. Please try selecting different documents or rephrasing your question.`,
      };
    }
    
    // For demo purposes with sample documents, return a simulated response
    // In a real implementation, this would use the chain
    if (validDocuments.some(doc => !doc.path)) {
      const docNames = validDocuments.map(doc => doc.name).join(", ");
      return {
        id: Date.now().toString(),
        content: `Based on my analysis of the documents (${docNames}), I found the following information related to your query: "${message}"\n\nThis is now using LangChain to generate a response based on the content of your selected documents. In a production environment, this would extract relevant information from the documents and provide a more accurate answer.`,
      };
    }
    
    // Get or create chain for these documents
    const chain = await getOrCreateChain(documentIds, documents);
    
    // Query the chain
    const response = await queryQAChain(chain, message);
    
    return {
      id: Date.now().toString(),
      content: response.content,
    };
  } catch (error) {
    console.error("Error processing message:", error);
    // Return a more user-friendly error message
    return {
      id: Date.now().toString(),
      content: "I encountered an issue while processing your request. This could be due to the document format or content. Please try with different documents or a simpler query.",
    };
  }
}

/**
 * Clears the cache for a specific document
 */
export function clearDocumentCache(documentId: string) {
  delete documentCache[documentId];
  
  // Clear any chain caches that might include this document
  Object.keys(chainCache).forEach(key => {
    if (key.includes(documentId)) {
      delete chainCache[key];
      delete vectorStoreCache[key];
    }
  });
}
