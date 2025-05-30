import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { processMessage, clearDocumentCache } from './langchain';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// In-memory storage for documents (in a real app, this would be a database)
const documents = [
  {
    id: '1',
    name: 'Legal Contract.pdf',
    type: 'pdf',
    size: 1024 * 1024 * 2.5, // 2.5 MB
    uploadedAt: '2025-05-29T10:30:00Z',
    status: 'ready',
  },
  {
    id: '2',
    name: 'Medical Report.docx',
    type: 'docx',
    size: 1024 * 512, // 512 KB
    uploadedAt: '2025-05-28T14:45:00Z',
    status: 'ready',
  },
  {
    id: '3',
    name: 'Research Paper.pdf',
    type: 'pdf',
    size: 1024 * 1024 * 3.2, // 3.2 MB
    uploadedAt: '2025-05-27T09:15:00Z',
    status: 'ready',
  },
];

// Middleware
app.use(cors());
app.use(express.json());

// Set up storage for uploaded files
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Routes
app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Document API routes
app.get('/api/documents', (_req, res) => {
  try {
    res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

app.post('/api/documents/upload', upload.array('files'), (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    // Create document objects from the uploaded files
    const newDocuments = files.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      name: file.originalname,
      type: file.originalname.split('.').pop() || 'unknown',
      size: file.size,
      path: file.path,
      uploadedAt: new Date().toISOString(),
      status: 'processing',
    }));
    
    // Add the new documents to our in-memory storage
    documents.push(...newDocuments);
    
    // Simulate document processing by updating status to 'ready' after 2 seconds
    setTimeout(() => {
      newDocuments.forEach(doc => {
        const index = documents.findIndex(d => d.id === doc.id);
        if (index !== -1) {
          documents[index].status = 'ready';
        }
      });
    }, 2000);
    
    // Return the newly created documents
    res.status(200).json(newDocuments);
  } catch (error) {
    console.error('Error uploading documents:', error);
    res.status(500).json({ error: 'Failed to upload documents' });
  }
});

app.delete('/api/documents/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the document index in our in-memory array
    const documentIndex = documents.findIndex(doc => doc.id === id);
    
    if (documentIndex === -1) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Get the document before removing it
    const documentToDelete = documents[documentIndex];
    
    // Remove the document from the array
    documents.splice(documentIndex, 1);
    
    // Clear the document from the LangChain cache
    clearDocumentCache(documentToDelete.id);
    
    // Return success response
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// Chat API routes
app.post('/api/chat', async (req, res) => {
  try {
    const { message, documentIds } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'No message provided' });
    }
    
    if (!documentIds || documentIds.length === 0) {
      return res.status(400).json({ error: 'No documents selected' });
    }
    
    // Use LangChain to process the message with document context
    const response = await processMessage(message, documentIds, documents);
    
    res.status(200).json(response);
  } catch (error) {
    console.error('Error processing chat message:', error);
    // Return a more user-friendly error response
    res.status(200).json({
      id: Date.now().toString(),
      content: "I encountered an issue while processing your request. This could be due to the document format or content. Please try with different documents or a simpler query."
    });
  }
});

// Socket.IO for real-time communication
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('chat:message', async (data) => {
    const { message, documentIds } = data;
    
    if (!message || !documentIds || documentIds.length === 0) {
      socket.emit('chat:error', { error: 'Invalid message or no documents selected' });
      return;
    }
    
    try {
      // Use LangChain to process the message with document context
      const response = await processMessage(message, documentIds, documents);
      socket.emit('chat:response', response);
    } catch (error) {
      console.error('Error processing chat message:', error);
      // Return a more user-friendly error response
      socket.emit('chat:response', {
        id: Date.now().toString(),
        content: "I encountered an issue while processing your request. This could be due to the document format or content. Please try with different documents or a simpler query."
      });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
