Thanks for sharing the updated folder structure! Based on the new structure and the updates to your `WebSearchTool` and `AnswerAgent`, I'll generate a README file that accurately reflects your project.  

Here's a structured README for your project:  

---

### README for RAG-Assessment  

# RAG-Assessment: Retrieval-Augmented Generation with AI  

**RAG-Assessment** is a **Node.js and TypeScript** application that implements **Retrieval-Augmented Generation (RAG)** using OpenAI embeddings, a vector database for document retrieval, and an AI-driven query resolution system.  

---

## 🚀 Features  

- **Document Ingestion**:  
  - Upload plain-text documents to the knowledge base.  
  - Automatically splits text into smaller, retrievable chunks.  
  - Uses OpenAI’s `text-embedding-ada-002` model to generate embeddings.  
  - Stores embeddings and metadata in a **vector database**.  

- **Query Processing**:  
  - Accepts user queries via a REST API.  
  - Retrieves the most relevant document chunks using similarity search.  
  - Uses an **AnswerAgent** to determine if the query should be answered from the knowledge base or an external web search.  
  - Integrates a **Web Search Tool** for fetching external information when necessary.  
  - Uses OpenAI's API to generate final answers.  

- **Logging & Error Handling**:  
  - Comprehensive logging for debugging and monitoring.  
  - Error handling middleware for API stability.  

---

## 🏗 Folder Structure  

```
RAG-ASSESSMENT
│── data/                  # Stores knowledge base documents
│── dist/                  # Compiled TypeScript files
│── logs/                  # Logs for debugging
│── node_modules/          # Dependencies
│── src/                   # Main source code
│   ├── agents/            # AI Agents
│   │   ├── AnswerAgent.ts  # Main agent for processing queries
│   ├── config/            # Configuration files
│   │   ├── default.ts
│   │   ├── toolsConfig.ts
│   ├── database/          # Vector database integration
│   │   ├── VectorDatabase.ts
│   ├── routes/            # API routes
│   │   ├── documentRoutes.ts
│   ├── services/          # Core services
│   │   ├── loggerService.ts
│   │   ├── OpenAiService.ts
│   ├── tools/             # External tools used by AnswerAgent
│   │   ├── FinalAnswerTool.ts
│   │   ├── KnowledgeBaseTool.ts
│   │   ├── Tool.ts
│   │   ├── WebSearchTool.ts  # Web search integration
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   │   ├── chunker.ts
│   │   ├── prompts.ts
│   ├── server.ts          # Express server setup
│── .env                   # Environment variables
│── package.json           # Project dependencies
│── tsconfig.json          # TypeScript config
```

---

## ⚡ Installation  

1. Clone the repository:  
   ```sh
   git clone https://github.com/your-repo/rag-assessment.git
   cd rag-assessment
   ```  

2. Install dependencies:  
   ```sh
   npm install
   ```  

3. Set up environment variables:  
   Create a `.env` file in the project root and define:  
   ```env
   PORT=8000
   OPENAI_API_KEY=your_openai_key
   SERPER_URL=your_web_search_api_url
   SERPER_API_KEY=your_serper_api_key
   ```

4. Start the server:  
   ```sh
   npm run dev  # For development (using nodemon)
   npm start    # For production
   ```

---

## 🔥 API Endpoints  

### **1️⃣ Document Ingestion**  
- **Endpoint:** `POST /api/documents`  
- **Description:** Uploads a text document to the vector database.  
- **Request:**  
  ```json
  {
    "document": "Your text content here..."
  }
  ```  
- **Response:**  
  ```json
  {
    "message": "Document indexed successfully",
    "documentId": "12345"
  }
  ```

---

### **2️⃣ Query Processing**  
- **Endpoint:** `POST /api/query`  
- **Description:** Processes a user query by retrieving relevant document chunks or performing a web search.  
- **Request:**  
  ```json
  {
    "query": "What is retrieval-augmented generation?"
  }
  ```
- **Response:**  
  ```json
  {
    "answer": "Retrieval-Augmented Generation (RAG) is an AI technique that..."
  }
  ```

---

## 🛠 Technologies Used  

- **Node.js & TypeScript** - Backend framework  
- **Express.js** - API routing  
- **OpenAI API** - Embeddings and response generation  
- **Vector Database (Pinecone/Weaviate)** - Document storage and retrieval  
- **Serper API** - Web search integration  
- **Winston & Morgan** - Logging  

---

## 📝 TODO  

- [ ] Implement multi-file document ingestion.  
- [ ] Add user authentication.  
- [ ] Improve query classification.  

---

## 🏆 Contributing  

Feel free to submit issues or pull requests to improve the project! 🚀  

---

Would you like me to add more details or adjust anything? 🚀