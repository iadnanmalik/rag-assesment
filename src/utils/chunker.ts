import config from "../config/default";
import { OpenAIService } from "../services/OpenAiService";
import { TextChunk } from "../types";


export async function chunkRawText(
    documentText: string,
    openAiService: OpenAIService,
    fileName: string,
): Promise<TextChunk[]> {
    const chunks: TextChunk[] = [];
    const sentences = documentText.match(/[^\.!\?]+[\.!\?]+/g) || [];
    let chunk = "";
    let sentenceStart = 0;
    let sentenceEnd = 0;

    for (let i = 0; i < sentences.length; i++) {
        if ((chunk + sentences[i]).length > config.MAX_CHUNK_SIZE) {
            // Generate embedding for the chunk
            const embedding = await openAiService.generateEmbeddings(chunk);

            chunks.push({
                id: `${sentenceStart}#${sentenceEnd}`,
                values: embedding,
                metadata: { start: sentenceStart, end: sentenceEnd, file_name: fileName },
            });

            // Reset chunk
            chunk = sentences[i] + " ";
            sentenceStart = i + 1;
        } else {
            chunk += sentences[i] + " ";
            sentenceEnd = i + 1;
        }
    }

    // Add the last chunk if not empty
    if (chunk.trim()) {
        const embedding = await openAiService.generateEmbeddings(chunk);
        chunks.push({
            id: `${sentenceStart}#${sentenceEnd}`,
            values: embedding,
            metadata: { start: sentenceStart, end: sentenceEnd, file_name: fileName },
        });
    }

    return chunks;
}
