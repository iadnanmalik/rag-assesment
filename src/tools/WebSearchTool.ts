import { FunctionDescription } from "../types";
import { Tool } from "./Tool";
import axios from "axios";
import logger from "../services/loggerService";

export class WebSearchTool extends Tool {
  private apiUrl = process.env.SERPER_URL!;

  constructor() {
    super("web_search");
  }

  async execute(query: string): Promise<any> {
    try {
      logger.info(`Executing web search with query: ${query}`);
      const data = { q: query, num: 5 };
      const response = await axios.post(this.apiUrl, data, {
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY,
          "Content-Type": "application/json"
        },
        maxBodyLength: Infinity,
      });

      logger.info(`Received response from web search for query: ${query}`);
      return (response.data.organic || []).map((result: any) => ({
        title: result.title,
        url: result.link,
        content: result.snippet,
      }));
    } catch (error) {
      logger.error(`Error fetching search results for query: ${query}`, error);
      return this.fallbackResponse(query);
    }
  }

  private fallbackResponse(query: string): any[] {
    logger.info(`Returning fallback response for query: ${query}`);
    return [
      {
        title: "Fallback Result",
        url: this.apiUrl,
        content: `No results found for query: ${query}. Please try again later.`,
      },
    ];
  }

  formatResponse(response: any): string {
    return `Search results: ${JSON.stringify(response, null, 2)}`;
  }

  getFunctionDescription(): FunctionDescription {
    return {
      name: this.name,
      description:
        "Fetches information from external web sources using the Google Serper API.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "The query string to fetch external information from the web.",
          },
        },
        required: ["query"],
      },
    };
  }
}
