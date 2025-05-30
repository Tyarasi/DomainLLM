# 🧠 DomainLLM – Offline AI Chatbot for Domain-Specific Consultation

An offline, private, and powerful chatbot that allows users to chat with domain-specific documents (legal, health, education, etc.). No internet or API keys required.

## 🚀 Features

- **100% Offline Operation**: All processing happens locally on your machine
- **Domain-Specific Consultation**: Chat with your documents in any domain
- **Document Management**: Upload, manage, and chat with PDF, DOCX, and TXT files
- **Local LLM Integration**: Uses Ollama to run models like Llama3, Mistral, and Phi3
- **Vector Search**: Semantic search powered by ChromaDB for accurate responses

## 🧰 Tech Stack

### 🖥️ Frontend
- **Next.js** with App Router
- **Tailwind CSS** for styling
- **Zustand** for state management
- **ShadCN UI** for components
- **TanStack Query** for data fetching
- **React Hook Form** with Zod for form validation

### ⚙️ Backend
- **Node.js + Express.js** for API server
- **LangChain** for LLM orchestration
- **Socket.IO** for real-time communication

### 🧠 Local AI
- **Ollama** for local LLM runtime
- **ChromaDB** for vector database
- **Local embedding models** for document processing

## 🛠️ Prerequisites

Before running DomainLLM, make sure you have the following installed:

1. **Node.js** (v18 or later)
2. **pnpm** (v8 or later)
3. **Ollama** - [Installation Guide](https://ollama.ai/download)

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/domain-llm.git
   cd domain-llm
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Pull required models with Ollama:
   ```bash
   ollama pull llama3
   # Optional additional models
   # ollama pull mistral
   # ollama pull phi3
   ```

## 🚀 Running the Application

1. Start the backend server:
   ```bash
   pnpm server
   ```

2. In a new terminal, start the frontend:
   ```bash
   pnpm dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## 📄 Usage

1. **Upload Documents**: Navigate to the Documents page and upload your PDF, DOCX, or TXT files
2. **Chat with Documents**: Go to the Chat page, select your documents, and start asking questions
3. **Get Domain-Specific Answers**: The AI will respond based on the content of your selected documents

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
