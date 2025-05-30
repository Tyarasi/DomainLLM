const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  status: 'processing' | 'ready' | 'error';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  id: string;
  content: string;
}

// Generic fetch function with error handling
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }
  
  return response.json();
}

// Document API
export const documentApi = {
  // Get all documents
  getAll: async (): Promise<Document[]> => {
    return fetchAPI<Document[]>('/documents');
  },
  
  // Upload documents
  upload: async (files: File[]): Promise<Document[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload documents');
    }
    
    return response.json();
  },
  
  // Delete a document
  delete: async (id: string): Promise<{ success: boolean }> => {
    return fetchAPI<{ success: boolean }>(`/documents/${id}`, {
      method: 'DELETE',
    });
  },
};

// Chat API
export const chatApi = {
  // Send a message
  sendMessage: async (
    message: string,
    documentIds: string[]
  ): Promise<ChatResponse> => {
    return fetchAPI<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, documentIds }),
    });
  },
};
