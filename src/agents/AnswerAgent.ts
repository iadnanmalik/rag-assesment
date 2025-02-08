import { Tool } from "../tools/Tool";
import { OpenAIService } from "../services/OpenAiService";
import path from "path";
import fs from "fs";
import logger from "../services/loggerService";

export class AnswerAgent {
    private tools: Tool[];
    private openAIService: OpenAIService;
    private folderPath = path.join(process.cwd(), "data");


    constructor(tools: Tool[], openAIService: OpenAIService) {
        this.tools = tools;
        this.openAIService = openAIService;
    }

    getTool (toolName: string) {
        return this.tools.find(tool => tool.name === toolName);
    }

    async decideTool (query:string): Promise<[string,string]>   {
        logger.info(`Deciding tool for query: ${query}`);
        const message = await this.openAIService.generateFunctionResponse(query, this.tools.filter(tool => tool.name !== "knowledge_base_search"));
        if (message["function_call"]) {
            const args = JSON.parse(message["function_call"]["arguments"]);
            logger.info(`Tool decided: ${message["function_call"]["name"]}`);
            return [message["function_call"]["name"], args["query"]];
          } else {
            logger.info(`No function call for query: ${query}`);
            return ["", query];
          }
    }

    async processQuery(query: string): Promise<string> {

        const formattedChunks = await this.retreiveFormattedChunks(query);
        const finalAnswerTool = this.getTool('final_answer');
        let response: string;

        if (formattedChunks.length > 0) {
            
            response = await finalAnswerTool!.execute(query, formattedChunks);
        } else {
            // Determine whether the query can be answered directly by the model
           const [toolName, toolQuery] = await this.decideTool(query);
           
           const selectedTool = this.getTool(toolName);

              if (selectedTool!.name !== "final_answer") {
                const result = await selectedTool!.execute(toolQuery);
                const formattedWebSearch = selectedTool!.formatResponse(result);
                logger.info(`Received response from web search: ${formattedWebSearch}`);
                response = await finalAnswerTool!.execute(query, formattedWebSearch);
              }
              else {
                response = await selectedTool!.execute(toolQuery, '');
              }


            
        }

        return response;
    }

    private async retreiveFormattedChunks(query: string): Promise<string> {
        
        const knowledgeBaseTool= this.tools.find(tool => tool.name === "knowledge_base_search");

       
        const result = await knowledgeBaseTool!.execute(query);
        logger.info(`Retrieved ${result.length} chunks for query: ${query}`);

        if(result.length > 0) {
            const chunksWithContent = this.addContentToChunks(result);
            return knowledgeBaseTool!.formatResponse(chunksWithContent);
        }
        else {
            logger.info(`No chunks found for query: ${query}`);
            return "";
        }
        

    }

    private addContentToChunks(chunks: any[], ): any[] {
        const content = fs.readFileSync(this.folderPath + "/" + chunks[0].metadata.file_name, "utf8");
        const sentences = content.match(/[^\.!\?]+[\.!\?]+/g) || [];
        const formattedChunks =  chunks.map(chunk => {
            const start = chunk.metadata.start;
            const end = chunk.metadata.end;
            chunk.content = sentences.slice(start, end + 1).join(" ");
            return chunk;
        });
        return formattedChunks;
    }

}