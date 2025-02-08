
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
   PORT = 8000
   PINECONE_API_KEY =
   PINECONE_INDEX =
   PINECONE_HOST =
   OPENAI_API_KEY =
   SERPER_API_KEY =
   SERPER_URL =
   ```

4. Start the server:  
   ```sh
   npm run dev  # For development (using nodemon)
   ```

---

## API Endpoints  

### **1⃣ Document Ingestion**  
- **Endpoint:** `POST /api/index-document`  
- **Description:** Uploads a text document in the `/data` folder to the vector database.   
- **Response:**  
  ```json
  {
    "message": "Document indexed successfully"
  }
  ```

---

### **2⃣ Query Processing**  
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
    "message": "Retrieval-Augmented Generation (RAG) is an AI technique that..."
  }
  ```

---

## Steps   

- **Document Ingestion**:  
  - Add a `.txt` document under the `data` folder. Currently, it holds `knowledge_base.txt` file.
  - Hit the `POST /api/index-document` endpoint after updating the `.txt` file under the `data` folder.  
  - The **chunkRawText** function is responsible for chunking the content read from the document and creating chunks with types in accordance with the **TextChunk** interface.

- **Query Processing**:  
  - Hit the `POST /api/query` endpoint with the following body:
   ```json
  {
    "query": "What is retrieval-augmented generation?"
  }
  ```
  - The query resolution follows these steps:
      - The system starts with a **vector search** using a **similarity filter of 0.75** when fetching documents from Pinecone.
      - If relevant documents are found, they are sent to the **FinalAnswerTool** to generate a response.
      - If no relevant documents are found, the system calls **OpenAI's Function API** to decide:
        - Whether to generate a standalone answer using **FinalAnswerTool**.
        - Or to invoke **WebSearchTool** for external information retrieval.
      - If **WebSearchTool** is used, the retrieved web search results are passed to **FinalAnswerTool** for final response generation.
      - If none of these approaches yield a valid response, the AI explicitly states that it **does not have enough knowledge** to answer the query.

- **Logging & Error Handling**:  
  - The system maintains logs in `logs/server.log` for monitoring and debugging.  
  - Logging includes:
    - When an answer is retrieved from the knowledge base (including metadata about retrieved chunks).
    - When a standalone response is generated.
    - When external search is used (including metadata such as URLs, titles, etc.).
  - Error handling middleware ensures API stability.  

---

## 🏷 Folder Structure  

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

## 🛠 Technologies Used  

- **Node.js & TypeScript** - Backend framework  
- **Express.js** - API routing  
- **OpenAI API** - Embeddings and response generation  
- **Vector Database (Pinecone)** - Document storage and retrieval  
- **Serper API** - Web search integration  
- **Winston & Morgan** - Logging  

---

