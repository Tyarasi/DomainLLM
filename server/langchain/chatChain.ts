import { ChatOpenAI } from "langchain/chat_models/openai";
import { Ollama } from "langchain/llms/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RetrievalQAChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get LLM based on environment configuration
function getLLM() {
  const llmType = process.env.LLM_TYPE || "local";
  
  if (llmType === "openai" && process.env.OPENAI_API_KEY) {
    return new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: process.env.OPENAI_MODEL_NAME || "gpt-3.5-turbo",
      temperature: 0.7,
    });
  }
  
  // Default to Ollama
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const model = process.env.DEFAULT_MODEL || "llama3";
  
  return new Ollama({
    baseUrl: ollamaBaseUrl,
    model: model,
    temperature: 0.7,
  });
}

// Create a custom prompt template for the QA chain
const QA_PROMPT = PromptTemplate.fromTemplate(`
You are a helpful assistant that answers questions based on the provided documents.
Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.

Context:
{context}

Question: {question}

Answer:
`);

/**
 * Creates a retrieval QA chain from a vector store
 */
export async function createQAChain(vectorStore: MemoryVectorStore) {
  try {
    const llm = getLLM();
    
    // Create a retriever from the vector store
    const retriever = vectorStore.asRetriever(4); // Retrieve top 4 most relevant documents
    
    // Create a simple chain that directly uses the retriever and LLM
    const chain = async (query: string) => {
      // Retrieve relevant documents
      const docs = await retriever.getRelevantDocuments(query);
      
      // Format the context from the documents
      const context = docs.map(doc => doc.pageContent).join('\n\n');
      
      // Format the prompt with the context and query
      const promptValue = await QA_PROMPT.format({
        context,
        question: query
      });
      
      // Generate a response using the LLM
      const result = await llm.invoke(promptValue);
      
      return {
        text: typeof result === 'string' ? result : result.content,
        sourceDocuments: docs
      };
    };
    
    return chain;
  } catch (error) {
    console.error("Error creating QA chain:", error);
    throw error;
  }
}

/**
 * Query the QA chain with a question
 */
export async function queryQAChain(chain: any, question: string) {
  try {
    const response = await chain(question);
    
    return {
      content: response.text,
      sourceDocuments: response.sourceDocuments || [],
    };
  } catch (error) {
    console.error("Error querying QA chain:", error);
    throw error;
  }
}
