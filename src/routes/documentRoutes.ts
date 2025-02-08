import { Router } from "express";
import fs from "fs";
import path from "path";
import logger from "../services/loggerService";
import { chunkRawText } from "../utils/chunker";
import { vectorDB, openAIService, answerAgent } from "../config/toolsConfig";

const router = Router();

router.post("/index-document", async (req:any, res:any)=> {
    try {
        const dataDir = path.join(process.cwd(), "data");
        const files = fs.readdirSync(dataDir);
        if (files.length === 0) {
            const errorMessage = "No files found in data directory.";
            logger.error(errorMessage);
            return res.status(404).json({ error: errorMessage });
        }
        const filePath = path.join(dataDir, files[0]);

        if (!fs.existsSync(filePath)) {
            const errorMessage = `File not found: ${filePath}`;
            logger.error(errorMessage);
            return res.status(404).json({ error: errorMessage });
        }

        const content = fs.readFileSync(filePath, "utf8");
        const fileName = filePath.split("/").pop() as string;

        if (!content.trim()) {
            const errorMessage = "No content in file.";
            logger.error(errorMessage);
            return res.status(400).json({ error: errorMessage });
        }

        const chunks = await chunkRawText(content, openAIService, fileName);
        await vectorDB.indexFile(chunks);

        logger.info(`Document indexed successfully: ${fileName}`);
        return res.json({ message: "Document indexed successfully!" });
    } catch (error) {
        const errorMessage = `Ingestion error: ${(error as any).message}`;
        console.error(errorMessage);
        logger.error(errorMessage);
        return res.status(500).json({ error: "Failed to index document." });
    }
});

router.post("/query",  async (req:any, res:any)=> {
    try {
        const { query } = req.body;
        if (!query || typeof query !== "string") {
            return res.status(400).json({ error: "Query must be a non-empty string." });
        }

        logger.info(`Received query: ${query}`);

        const response = await answerAgent.processQuery(query) 

        logger.info(`Query processed successfully.`);
        return res.json({ message: response });
    } catch (error) {
        const errorMessage = `Query processing error: ${(error as any).message}`;
        console.error(errorMessage);
        logger.error(errorMessage);
        return res.status(500).json({ error: "Failed to process query." });
    }
});

export default router;
