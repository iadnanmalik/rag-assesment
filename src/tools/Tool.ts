import { FunctionDescription } from "../types";

export abstract class Tool {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    abstract execute(query: string, toolsResult?:string): Promise<any>;

    abstract formatResponse(response: any): string;

    abstract getFunctionDescription() : FunctionDescription;

    
}