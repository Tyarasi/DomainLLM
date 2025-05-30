import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { OllamaEmbeddings } from "langchain/embeddings/ollama";
import { Document } from "langchain/document";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Choose embeddings based on environment variables
function getEmbeddings() {
  const embeddingsType = process.env.EMBEDDINGS_TYPE || "local";
  
  if (embeddingsType === "openai" && process.env.OPENAI_API_KEY) {
    return new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }
  
  // Default to Ollama embeddings
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const embeddingModel = process.env.EMBEDDING_MODEL || process.env.DEFAULT_MODEL || "llama3";
  
  return new OllamaEmbeddings({
    baseUrl: ollamaBaseUrl,
    model: embeddingModel,
  });
}

/**
 * Creates a vector store from documents
 */
export async function createVectorStore(documents: Document[]): Promise<MemoryVectorStore> {
  try {
    // Split documents into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    const splitDocs = await textSplitter.splitDocuments(documents);
    
    // Create vector store
    const embeddings = getEmbeddings();
    const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
    
    return vectorStore;
  } catch (error) {
    console.error("Error creating vector store:", error);
    throw error;
  }
}
