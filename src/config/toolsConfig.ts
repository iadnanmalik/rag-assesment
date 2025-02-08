import { VectorDatabase } from "../database/VectorDatabase";
import { OpenAIService } from "../services/OpenAiService";
import { KnowledgeBaseTool } from "../tools/KnowledgeBaseTool";
import { WebSearchTool } from "../tools/WebSearchTool";
import { AnswerAgent } from "../agents/AnswerAgent";
import { FinalAnswerTool } from "../tools/FinalAnswerTool";

const vectorDB = new VectorDatabase();
const openAIService = new OpenAIService();
const knowledgeBaseTool = new KnowledgeBaseTool(vectorDB, openAIService);
const webSearchTool = new WebSearchTool();
const finalAnswerTool = new FinalAnswerTool(openAIService);

const tools = [knowledgeBaseTool, webSearchTool, finalAnswerTool];
const answerAgent = new AnswerAgent(tools, openAIService);

export { vectorDB, openAIService, knowledgeBaseTool, webSearchTool, answerAgent };
