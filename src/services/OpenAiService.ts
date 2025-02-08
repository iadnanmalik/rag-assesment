import { OpenAI } from "openai";
import { Tool } from "../tools/Tool";
import logger from "./loggerService";
import { FINAL_ANSWER_PROMPT, FUNCTION_SEARCH_PROMPT } from "../utils/prompts";

export class OpenAIService {
  private openai: OpenAI;
  private model = "gpt-4-turbo-preview";
  private embeddingModel = "text-embedding-ada-002";

  constructor() {
    this.openai = new OpenAI();
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not defined");
    }
    this.openai.apiKey = process.env.OPENAI_API_KEY;
  }

  async generateFunctionResponse(query: string, tools: Tool[]): Promise<any> {
    const functions = tools.map((tool) => tool.getFunctionDescription());
    logger.info(`Generating function response for query: ${query}`);

    try {
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: FUNCTION_SEARCH_PROMPT,
          },
          { role: "user", content: `User Query: ${query}` },
        ],
        functions: functions,
        function_call: "auto",
      });

      logger.info(`Generated function response for query: ${query}`);
      return response.choices[0].message || "";
    } catch (error) {
      logger.error(`Error generating function response for query: ${query}`, error);
      return this.fallbackFunctionResponse(query);
    }
  }

  private fallbackFunctionResponse(query: string): any {
    logger.info(`Returning fallback function response for query: ${query}`);
    return {
      role: "assistant",
      content: `Unable to generate a function response for query: ${query}. Please try again later.`,
    };
  }

  async generateResponse(query: string, toolResult: any): Promise<string> {
    try {
      logger.info(`Generating response for query: ${query}`);
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: "system",
            content: FINAL_ANSWER_PROMPT,
          },
          { role: "user", content: `Query: ${query}` },
          { role: "assistant", content: `Context Search Output: ${toolResult}` },
        ],
      });
      logger.info(`Generated response for query: ${query}`);
      return (
        response.choices[0].message?.content?.trim() ||
        "Unable to generate response."
      );
    } catch (error) {
      logger.error(`Error generating response for query: ${query}`, error);
      return this.fallbackResponse(query);
    }
  }

  private fallbackResponse(query: string): string {
    logger.info(`Returning fallback response for query: ${query}`);
    return `Unable to generate a response for query: ${query}. Please try again later.`;
  }

  async generateEmbeddings(chunk: string) {
    try {
      logger.info(`Generating embeddings for chunk`);
      const embedding = await this.openai.embeddings.create({
        model: this.embeddingModel,
        input: chunk,
        encoding_format: "float",
      });
      logger.info(`Generated embeddings for chunk`);
      return embedding.data[0].embedding;
    } catch (error) {
      logger.error(`Error generating embeddings for chunk`, error);
      return this.fallbackEmbeddings();
    }
  }

  private fallbackEmbeddings(): number[] {
    logger.info(`Returning fallback embeddings`);
    return [];
  }
}
