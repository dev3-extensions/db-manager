import { TTable } from "./table";

export class TSchema {
    name: string;
    type: string;
    version: number;
    schema: Array<{
        [key: string]: Array<{ [key: string]: string }>;
    }>;
}
