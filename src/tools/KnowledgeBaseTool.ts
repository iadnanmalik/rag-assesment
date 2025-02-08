import { Tool } from "./Tool";
import { FunctionDescription } from "../types";
import { VectorDatabase } from "../database/VectorDatabase";
import { OpenAIService } from "../services/OpenAiService";
import config from "../config/default";

export class KnowledgeBaseTool extends Tool {
    private vectorDB: VectorDatabase;
    private openAiService: OpenAIService;

    constructor(vectorDB: VectorDatabase, openAiService: OpenAIService) {
        super("knowledge_base_search");
        this.vectorDB = vectorDB;
        this.openAiService = openAiService
    }

    async execute(query: string): Promise<any> {
        const queryEmbedding = await this.openAiService.generateEmbeddings(query);
        const result = await this.vectorDB.search(queryEmbedding, config.TOP_K);
        const filteredResult = result.filter((doc: any) => doc.score > config.RELEVANCE_THRESHOLD);
        return filteredResult;
    }

    formatResponse(response: any): string {

      let formattedResponse = "";
      for (const doc of response) {
        formattedResponse += doc.content + "\n";
      }
        return `Relevant documents: ${formattedResponse}`;
    }

    getFunctionDescription(): FunctionDescription {
        return {
            name: this.name,
            description:
              "Use this function to perform a semantic search on the knowledge base. It retrieves relevant documents based on the query.",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description:
                    "The query string to be searched semantically within the knowledge base.",
                },
              },
              required: ["query"],
            },
          };
    }
}
