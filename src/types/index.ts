export interface FunctionDescription {
    name: string;
    description: string;
    parameters: {
      type: "object";
      properties: {
        query: {
          type: "string";
          description: string;
        };
        filepath?: {
          type: "string";
          description: string;
        };
      };
      required: string[];
    };
  }
  
  export interface TextChunk {
    id: string;
    values: number[]; 
    metadata: {
        start: number;
        end: number;
        file_name: string;
        content? : string;
    };
}
