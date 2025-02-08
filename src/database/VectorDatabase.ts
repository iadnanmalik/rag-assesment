import { Pinecone } from "@pinecone-database/pinecone";
import { TextChunk } from "../types";
import logger from "../services/loggerService";

export class VectorDatabase {
  private client: Pinecone;
  private indexName = process.env.PINECONE_INDEX!;
  private pineconeIndex: ReturnType<Pinecone["Index"]>;

  constructor() {
    this.client = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
    this.pineconeIndex = this.client
      .Index(this.indexName)
      .namespace(this.indexName);
  }

  async indexFile(chunks: TextChunk[]): Promise<void> {
    try {
      logger.info(`Indexing file with ${chunks.length} chunks`);
      await this.pineconeIndex.upsert(chunks);
      logger.info(`File indexed successfully`);
    } catch (error) {
      logger.error(`Error indexing file`, error);
      this.fallbackIndexFile(chunks);
    }
  }

  private fallbackIndexFile(chunks: TextChunk[]): void {
    logger.info(`Fallback: Unable to index file with ${chunks.length} chunks`);
  }

  async search(queryEmbedding: number[], topK: number = 5): Promise<any[]> {
    try {
      logger.info(`Searching vector database with topK: ${topK}`);
      const result = await this.pineconeIndex.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true,
      });
      logger.info(`Search completed with ${result.matches.length} matches`);
      return result.matches || [];
    } catch (error) {
      logger.error(`Error searching vector database`, error);
      return this.fallbackSearch();
    }
  }

  private fallbackSearch(): any[] {
    logger.info(`Returning fallback search results`);
    return [];
  }
}
