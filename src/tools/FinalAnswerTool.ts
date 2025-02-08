import { OpenAIService } from "../services/OpenAiService";
import { FunctionDescription } from "../types";
import { Tool } from "./Tool";
import logger from "../services/loggerService";

export class FinalAnswerTool extends Tool {
  private openAiService: OpenAIService;

  constructor(openAiService: OpenAIService) {
    super("final_answer");
    this.openAiService = openAiService;
  }

  async execute(query: string, toolsResult: string): Promise<any> {
    try {
      const response = await this.openAiService.generateResponse(query, toolsResult);
      logger.info(`Final answer: ${response}`);
      return response;
    } catch (error) {
      logger.error(`Error generating final answer for query: ${query}`, error);
      return this.fallbackResponse(query);
    }
  }

  private fallbackResponse(query: string): string {
    logger.info(`Returning fallback response for query: ${query}`);
    return `Unable to generate a final answer for query: ${query}. Please try again later.`;
  }

  formatResponse(response: any): string {
    return `Final answer: ${response}`;
  }

  getFunctionDescription(): FunctionDescription {
    return {
      name: this.name,
      description:
        "Use this function to generate a final answer using your own knowledge.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "The query to generate the final answer.",
          },
        },
        required: ["prompt"],
      },
    };
  }
}
