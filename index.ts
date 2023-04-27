import type { IDatabase } from "./structures/interfaces/database";
import { EmbeddedDB } from "./engines/IndexedDB/indexedDB";
import { TSource } from "./structures/types/source";
import { TSchemas } from "./structures/types/schemas";
// import { schemas as SchemasFile } from "../database-viewer/schemas.json";
import { schemas as SchemasFile } from "../../../schemas.json";

export class Databases {
    databases: Array<IDatabase>;

    constructor() {
        this.databases = Array<IDatabase>();
    }

    async loadSchemas() {
        console.log(`schemas file: ${SchemasFile}`);
        for (var schema of SchemasFile) {
            switch (true) {
                case /IndexedDB/.test(schema.type): {
                    console.log("indexeddb found");
                    const newIDB = new EmbeddedDB(schema);
                    await newIDB.openDB();
                    this.databases.push(newIDB);
                }
            }
        }
    }

    getSchemas(source: TSource): Promise<IDBDatabase[]> {
        return new Promise(() => {
            indexedDB.databases;
        });
    }
}
